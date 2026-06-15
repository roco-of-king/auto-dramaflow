import { z } from "zod";
import { tool, jsonSchema } from "ai";
import path from "path";
import isPathInside from "is-path-inside";
import getPath from "@/utils/getPath";
import * as fs from "fs";
import fg from "fast-glob";

type SkillAttribution =
  //剧本Agent
  | "script_agent_decision" //决策
  | "script_execution_skeleton" //故事骨架
  | "script_execution_adaptation" //改变策略
  | "script_execution_script" //剧本生成
  | "script_agent_supervision" //审核
  //生产Agent
  | "production_agent_decision"
  | "production_agent_execution"
  | "production_agent_supervision";

interface SkillInput {
  mainSkill: SkillAttribution[];
  workspace?: string[];
  attachedSkills?: string[];
}

interface SkillPaths {
  mainSkill: { path: string; name: string; description: string }[];
  secondarySkills: string[];
  tertiarySkills: string[];
}

function toUnixPath(filePath: string): string {
  return filePath.replace(/\\/g, "/");
}

function ensureNonEmptyBody(body: string, fallback: string): string {
  const trimmed = body.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

// ==================== 解析 SKILL.md ====================

export function parseFrontmatter(content: string): { name: string; description: string } {
  const match = content.match(/^\uFEFF?---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
  if (!match?.[1]) {
    throw new Error(`技能文件缺少有效的 frontmatter，确保以 --- 包裹并包含 name 和 description 字段。${content}`);
  }

  const result: Record<string, string> = {};
  const lines = match[1].split(/\r?\n/);

  for (let i = 0; i < lines.length; ) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      i++;
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!keyMatch) {
      i++;
      continue;
    }

    const key = keyMatch[1].trim();
    const rawValue = (keyMatch[2] ?? "").trim();
    i++;

    if (!key) continue;

    if (/^[>|][+-]?[0-9]*$/.test(rawValue)) {
      const isFolded = rawValue.startsWith(">");
      const blockLines: string[] = [];
      let blockIndent: number | null = null;

      while (i < lines.length) {
        const current = lines[i];
        const currentTrimmed = current.trim();

        if (currentTrimmed === "") {
          if (blockIndent !== null) blockLines.push("");
          i++;
          continue;
        }

        const currentIndent = current.match(/^\s*/)?.[0].length ?? 0;
        if (blockIndent === null) {
          blockIndent = currentIndent;
        }

        if (currentIndent < blockIndent) break;

        blockLines.push(current.slice(blockIndent));
        i++;
      }

      result[key] = isFolded
        ? blockLines
            .join("\n")
            .replace(/\n{2,}/g, "\n\n")
            .replace(/([^\n])\n([^\n])/g, "$1 $2")
            .trim()
        : blockLines.join("\n").trim();
      continue;
    }

    const unquoted = rawValue.replace(/^(['"])([\s\S]*)\1$/, "$2");
    result[key] = unquoted;
  }

  if (!result.name || !result.description) {
    throw new Error(`技能文件缺少必要字段: name 或 description，确保 frontmatter 包含这两个字段。${content}`);
  }

  return { name: result.name, description: result.description };
}

export async function useSkill(input: SkillInput) {
  const { mainSkill, workspace = [], attachedSkills = [] } = input;
  const rootDir = getPath("skills");
  const normalizedRootDir = path.resolve(rootDir);

  const mainSkills: { path: string; name: string; description: string }[] = [];
  for (const skill of mainSkill) {
    const skillPath = path.join(rootDir, skill + ".md");
    if (!fs.existsSync(skillPath)) throw new Error(`主技能文件不存在: ${skillPath}`);
    if (!isPathInside(skillPath, normalizedRootDir)) throw new Error(`技能名称无效：检测到路径穿越。${skillPath}`);
    const content = await fs.promises.readFile(skillPath, "utf-8");
    const parsed = parseFrontmatter(content);
    mainSkills.push({ path: skillPath, ...parsed });
  }

  const resolveSafeSkillDir = (dir: string): string | null => {
    const resolvedDir = path.resolve(normalizedRootDir, dir);
    const isSafeDir = resolvedDir === normalizedRootDir || isPathInside(resolvedDir, normalizedRootDir);
    return isSafeDir ? resolvedDir : null;
  };

  const getMdFiles = (dir: string, recursive = false): string[] => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
      return entry.isDirectory() && recursive ? getMdFiles(fullPath, true) : [];
    });
  };
  const collectMdFiles = (dirs: string[], recursive: boolean) =>
    dirs.flatMap((dir) => {
      const safeDir = resolveSafeSkillDir(dir);
      if (!safeDir) return [];
      return getMdFiles(safeDir, recursive).map((file) => toUnixPath(path.relative(normalizedRootDir, file)));
    });

  const skillPaths: SkillPaths = {
    mainSkill: mainSkills,
    secondarySkills: collectMdFiles(workspace, false),
    tertiarySkills: collectMdFiles(attachedSkills, true),
  };

  return { prompt: buildSkillPrompt(mainSkills), tools: createSkillTools(mainSkills, skillPaths), skillPaths };
}

export function buildSkillPrompt(skills: { name: string; description: string }[]): string {
  const skillEntries = skills
    .map((s) => `  <skill>\n    <name>${s.name}</name>\n    <description>${s.description}</description>\n  </skill>`)
    .join("\n");
  return `## Skills
以下技能提供了专业任务的专用指令。
当任务与某个技能的描述匹配时，调用 activate_skill 工具并传入技能名称来加载完整指令。
加载后遵循技能指令执行任务，需要时调用 read_skill_file 读取资源文件内容。

<available_skills>
${skillEntries}
</available_skills>`;
}

export function createSkillTools(skills: { name: string; description: string }[], skillPaths: SkillPaths, rootDir: string = getPath("skills")) {
  const activated = new Set<string>(); // 已激活技能集合，防止重复加载
  const skillsRootDir = path.resolve(rootDir);
  const skillNames = skills.map((s) => s.name);
  const skillMap = new Map(skillPaths.mainSkill.map((s) => [s.name, s]));
  return {
    activate_skill: tool({
      description: `激活一个技能，加载其完整指令和捆绑资源列表到上下文。可用技能：${skillNames.join(", ")}`,
      inputSchema: jsonSchema<{ name: string }>(
        z
          .object({
            name: z.enum(skillNames as [string, ...string[]]).describe("要激活的技能名称"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ name }) => {
        if (activated.has(name)) {
          console.log(`⚡[主技能] ℹ️ 技能 "${name}" 已激活，跳过重复注入`);
          return { alreadyActive: true, message: `技能 "${name}" 已激活，无需重复加载` };
        }
        const matched = skillMap.get(name);
        if (!matched) return { error: `未找到技能 "${name}"` };
        let raw = "";
        try {
          raw = await fs.promises.readFile(matched.path, "utf-8");
          console.log(`⚡[主技能] ✓ 已读取主技能文件： ${matched.path}（${raw.length} 字符）`);
        } catch (error) {
          console.log(`⚡[主技能] ✗ 读取失败：未找到文件 "${matched.path}"`);
        }
        activated.add(name);
        console.log(`⚡[主技能] ✓ 技能 "${name}" 已激活`);
        const body = ensureNonEmptyBody(raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ""), "该技能文件无正文内容。");
        let content = "";
        content = `<skill_content name="${name}">\n`;
        content += body + "\n\n";
        content += "使用 read_skill_file 工具读取资源文件。\n";
        if (skillPaths.secondarySkills.length > 0) {
          content += "\n<skill_resources>\n";
          for (const path of skillPaths.secondarySkills) {
            content += `  <file>${path}</file>\n`;
          }
          content += "</skill_resources>\n";
        }
        content += "</skill_content>";
        return { content };
      },
    }),
    read_skill_file: tool({
      description: "读取已激活技能目录下的资源文件。传入 activate_skill 返回的 skill_resources 中的文件路径。",
      inputSchema: jsonSchema<{ filePath: string }>(
        z
          .object({
            filePath: z.string().describe("资源文件的相对路径，来自 activate_skill 返回的 skill_resources"),
          })
          .toJSONSchema(),
      ),
      execute: async ({ filePath }) => {
        const normalizedInputPath = toUnixPath(filePath).trim();
        if (!normalizedInputPath) {
          console.log(`📖[技法文件] ✗ filePath 不能为空`);
          return { error: "filePath 不能为空" };
        }

        const fullPath = path.resolve(path.join(skillsRootDir, normalizedInputPath));
        if (!(fullPath === skillsRootDir || isPathInside(fullPath, skillsRootDir))) {
          console.log(`📖[技法文件] ✗ 路径越界已拦截："${filePath}" 超出技能目录范围`);
          return { error: "Access denied: path is outside skill directory" };
        }
        let body = "";
        try {
          body = await fs.promises.readFile(fullPath, "utf-8");
          console.log(`📖[技法文件] ✓ 已读取文件： ${filePath}（${body.length} 字符）`);
        } catch {
          console.log(`📖[技法文件] ✗ 读取失败：未找到文件 "${filePath}"`);
          return { error: `File not found: ${filePath}` };
        }
        const safeBody = ensureNonEmptyBody(body, "该资源文件为空。");
        let content = "";
        content = `<skill_content>\n`;
        content += safeBody + "\n\n";
        content += "可以使用 read_skill_file 工具读取资源文件。\n";
        if (skillPaths.tertiarySkills.length > 0) {
          content += "\n<skill_resources>\n";
          for (const path of skillPaths.tertiarySkills) {
            content += `  <file>${path}</file>\n`;
          }
          content += "</skill_resources>\n";
        }
        content += "</skill_content>";
        return { content };
      },
    }),
  };
}

export async function scanSkills(folderPath: string) {
  const unixPath = toUnixPath(folderPath);
  const entries = await fg(unixPath, {
    onlyFiles: true,
    absolute: true,
  });
  return entries;
}
