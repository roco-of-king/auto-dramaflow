import { Socket } from "socket.io";
import { tool, jsonSchema } from "ai";
import { z } from "zod";
import u from "@/utils";
import Memory from "@/utils/agent/memory";
import useTools from "@/agents/scriptAgent/tools";
import ResTool from "@/socket/resTool";
import * as fs from "fs";
import path from "path";

export interface AgentContext {
  socket: Socket;
  isolationKey: string;
  text: string;
  userMessageTime?: number;
  abortSignal?: AbortSignal;
  resTool: ResTool;
  msg: ReturnType<ResTool["newMessage"]>;
  thinkConfig: {
    think: boolean;
    thinlLevel: 0 | 1 | 2 | 3;
  };
}

function buildMemPrompt(mem: Awaited<ReturnType<Memory["get"]>>): string {
  let memoryContext = "";
  if (mem.rag.length) {
    memoryContext += `[相关记忆]\n${mem.rag.map((r) => r.content).join("\n")}`;
  }
  if (mem.summaries.length) {
    if (memoryContext) memoryContext += "\n\n";
    memoryContext += `[历史摘要]\n${mem.summaries.map((s, i) => `${i + 1}. ${s.content}`).join("\n")}`;
  }
  if (mem.shortTerm.length) {
    if (memoryContext) memoryContext += "\n\n";
    memoryContext += `[近期对话]\n${mem.shortTerm.map((m) => `${m.role}: ${m.content}`).join("\n")}`;
  }
  return `## Memory\n以下是你对用户的记忆，可作为参考但不要主动提及：\n${memoryContext}`;
}

export async function runDecisionAI(ctx: AgentContext) {
  const { isolationKey, text, userMessageTime, abortSignal, resTool } = ctx;
  const memory = new Memory("scriptAgent", isolationKey);
  await memory.add("user", text, { createTime: userMessageTime });

  const skill = path.join(u.getPath("skills"), "script_agent_decision.md");
  const prompt = await fs.promises.readFile(skill, "utf-8");

  const mem = buildMemPrompt(await memory.get(text));

  const projectData = await u.db("o_project").where("id", resTool.data.projectId).first();

  const novelData = await u.db("o_novel").where("projectId", resTool.data.projectId).select("chapterIndex");

  const projectInfo = [
    "## 项目信息",
    `小说名称：${projectData?.name ?? "未知"}`,
    `小说类型：${projectData?.type ?? "未知"}`,
    `小说简介：${projectData?.intro ?? "无"}`,
    `目标改编影视视觉手册|画风：${projectData?.artStyle ?? "无"}`,
    `目标改编视频画幅：${projectData?.videoRatio ?? "16:9"}`,
    `章节数量：${novelData.length}章`,
  ].join("\n");

  const { fullStream } = await u.Ai.Text("scriptAgent:decisionAgent", ctx.thinkConfig.think, ctx.thinkConfig.thinlLevel).stream({
    messages: [
      { role: "system", content: prompt },
      { role: "assistant", content: projectInfo + "\n" + mem },
      { role: "user", content: text },
    ],
    abortSignal,
    tools: {
      ...memory.getTools(),
      ...useTools({ resTool: ctx.resTool, msg: ctx.msg }),
      ...createSubAgent(ctx),
    },
    onFinish: async (completion) => {
      await memory.add("assistant:decision", removeAllXmlTags(completion.text));
    },
  });

  let currentMsg = ctx.msg;
  await consumeFullStream(fullStream, currentMsg, () => {
    if (ctx.msg === currentMsg) return currentMsg;
    currentMsg.complete();
    currentMsg = ctx.msg;
    return currentMsg;
  });
}

function createSubAgent(parentCtx: AgentContext) {
  const { resTool, abortSignal } = parentCtx;
  const memory = new Memory("scriptAgent", parentCtx.isolationKey);

  async function runAgent({
    key,
    prompt,
    system,
    name,
    memoryKey,
    tools: extraTools,
    messages,
  }: {
    key: `${string}:${string}`;
    prompt: string;
    system: string;
    name: string;
    memoryKey: string;
    tools?: Record<string, any>;
    messages?: { role: "user" | "assistant" | "system"; content: string }[];
  }) {
    parentCtx.msg.complete();
    const subMsg = resTool.newMessage("assistant", name);

    const { fullStream } = await u.Ai.Text(key, parentCtx.thinkConfig.think, parentCtx.thinkConfig.thinlLevel).stream({
      system,
      messages: messages ?? [{ role: "user", content: prompt }],
      abortSignal,
      tools: { ...extraTools, ...useTools({ resTool, msg: subMsg }) },
    });

    const fullResponse = await consumeFullStream(fullStream, subMsg);

    if (fullResponse.trim()) {
      await memory.add(memoryKey, removeAllXmlTags(fullResponse), {
        name,
        createTime: new Date(subMsg.datetime).getTime(),
      });
    }

    parentCtx.msg = resTool.newMessage("assistant", "视频策划");
    return fullResponse;
  }

  const promptInput = z
    .object({
      prompt: z.string().describe("交给子Agent的任务简约描述，100字以内"),
    })
    .toJSONSchema();

  const run_sub_agent_storySkeleton = tool({
    description: "运行执行subAgent来完成故事骨架相关任务",
    inputSchema: jsonSchema<{ prompt: string }>(promptInput),
    execute: async ({ prompt }) => {
      const skill = path.join(u.getPath("skills"), "script_execution_skeleton.md");
      const systemPrompt = await fs.promises.readFile(skill, "utf-8");

      const formatPrompt = "\n你必须使用如下XML格式写入工作区：\n<storySkeleton>故事骨架内容</storySkeleton>";

      return runAgent({
        key: "scriptAgent:storySkeletonAgent",
        prompt,
        system: systemPrompt + formatPrompt,
        name: "编剧",
        memoryKey: "assistant:execution:storySkeleton",
        messages: [{ role: "user", content: prompt + formatPrompt }],
      });
    },
  });

  const run_sub_agent_adaptationStrategy = tool({
    description: "运行执行subAgent来完成改编策略相关任务",
    inputSchema: jsonSchema<{ prompt: string }>(promptInput),
    execute: async ({ prompt }) => {
      const skill = path.join(u.getPath("skills"), "script_execution_adaptation.md");
      const systemPrompt = await fs.promises.readFile(skill, "utf-8");

      const formatPrompt = "\n你必须使用如下XML格式写入工作区：\n<adaptationStrategy>改编策略内容</adaptationStrategy>";

      return runAgent({
        key: "scriptAgent:adaptationStrategyAgent",
        prompt,
        system: systemPrompt + formatPrompt,
        name: "编剧",
        memoryKey: "assistant:execution:adaptationStrategy",
        messages: [{ role: "user", content: prompt + formatPrompt }],
      });
    },
  });

  const run_sub_agent_script = tool({
    description: "运行执行subAgent来完成剧本相关任务",
    inputSchema: jsonSchema<{ prompt: string }>(promptInput),
    execute: async ({ prompt }) => {
      const skill = path.join(u.getPath("skills"), "script_execution_script.md");
      const systemPrompt = await fs.promises.readFile(skill, "utf-8");

      const scriptList = await u.db("o_script").where("projectId", resTool.data.projectId).select("id", "name");
      const scriptPrompt = ["## 可用剧本(ID:名称)", scriptList.map((s: any) => `${s.id}:${(s.name || "").replace(/[,:]/g, "")}`).join(","), ""].join(
        "\n",
      );

      const novelData = await u.db("o_novel").where("projectId", resTool.data.projectId).select("chapterIndex");

      const formatPrompt = `\n你必须使用如下XML格式写入工作区：\nXML不得添加任何额外标签<scriptItem name="剧本名称">剧本内容</scriptItem><scriptItem name="剧本名称">剧本内容</scriptItem><scriptItem name="剧本名称">剧本内容</scriptItem>`;

      return runAgent({
        key: "scriptAgent:scriptAgent",
        prompt,
        system: systemPrompt + formatPrompt,
        messages: [
          { role: "assistant", content: scriptPrompt + `章节数量：${novelData.length}章` },
          { role: "user", content: prompt + formatPrompt },
        ],
        name: "编剧",
        memoryKey: "assistant:execution:script",
      });
    },
  });

  const run_supervision_agent = tool({
    description: "运行监督层subAgent执行独立任务，完成后返回结果",
    inputSchema: jsonSchema<{ prompt: string }>(promptInput),
    execute: async ({ prompt }) => {
      const skill = path.join(u.getPath("skills"), "script_agent_supervision.md");
      let systemPrompt = await fs.promises.readFile(skill, "utf-8");

      // 注入导演审阅能力：按项目类型匹配 2-3 位导演风格，嵌入 system prompt
      const projectData = await u.db("o_project").where("id", resTool.data.projectId).first();
      const projectType = (projectData?.type ?? "").trim();
      let matchedDirectors = DEFAULT_DIRECTORS;
      for (const [keyword, directors] of Object.entries(TYPE_DIRECTOR_MAP)) {
        if (projectType.includes(keyword)) { matchedDirectors = directors; break; }
      }
      const skillsDir = path.join(u.getPath("skills"), "director_skills");
      const directorSections: string[] = [];
      for (const d of matchedDirectors.slice(0, 3)) {
        const f = path.join(skillsDir, `${d}.md`);
        if (fs.existsSync(f)) {
          const content = await fs.promises.readFile(f, "utf-8");
          // 只注入导演风格摘要（前 2000 字），避免 prompt 过长
          directorSections.push(`### ${d}风格参考\n\n${content.slice(0, 2000)}`);
        }
      }
      if (directorSections.length > 0) {
        systemPrompt = systemPrompt.replace(
          "## Skills",
          `## 导演风格参考（已预加载）\n\n以下导演风格档案已自动加载，请在创意审阅时参考：\n\n${directorSections.join("\n\n---\n\n")}\n\n## Skills`,
        );
      }

      return runAgent({
        key: "scriptAgent:supervisionAgent",
        prompt,
        system: systemPrompt,
        name: "编辑",
        memoryKey: "assistant:supervision",
      });
    },
  });

  // 导演类型匹配映射
  const TYPE_DIRECTOR_MAP: Record<string, string[]> = {
    "悬疑": ["大卫·芬奇", "克里斯托弗·诺兰", "杜琪峰"],
    "惊悚": ["大卫·芬奇", "克里斯托弗·诺兰", "杜琪峰"],
    "爱情": ["王家卫", "新海诚", "侯孝贤"],
    "言情": ["王家卫", "新海诚", "是枝裕和"],
    "都市": ["王家卫", "杨德昌", "伍迪·艾伦"],
    "古装": ["张艺谋", "徐克", "黑泽明"],
    "武侠": ["张艺谋", "徐克", "黑泽明"],
    "仙侠": ["徐克", "张艺谋", "宫崎骏"],
    "科幻": ["丹尼斯·维伦纽瓦", "雷德利·斯科特", "克里斯托弗·诺兰"],
    "奇幻": ["宫崎骏", "徐克", "丹尼斯·维伦纽瓦"],
    "犯罪": ["杜琪峰", "奉俊昊", "昆汀·塔伦蒂诺"],
    "家庭": ["是枝裕和", "韦斯·安德森", "李安"],
    "伦理": ["是枝裕和", "李安", "小津安二郎"],
    "喜剧": ["周星驰", "韦斯·安德森", "伍迪·艾伦"],
    "动作": ["詹姆斯·卡梅隆", "吴宇森", "雷德利·斯科特"],
    "文艺": ["新海诚", "王家卫", "安德烈·塔可夫斯基"],
    "史诗": ["雷德利·斯科特", "丹尼斯·维伦纽瓦", "张艺谋"],
    "恐怖": ["大卫·芬奇", "朴赞郁", "奉俊昊"],
    "战争": ["斯皮尔伯格", "雷德利·斯科特", "黑泽明"],
    "历史": ["张艺谋", "黑泽明", "陈凯歌"],
    "废土": ["终末地科幻", "雷德利·斯科特", "丹尼斯·维伦纽瓦"],
    "赛博": ["终末地科幻", "雷德利·斯科特", "丹尼斯·维伦纽瓦"],
    "动画": ["宫崎骏", "新海诚", "韦斯·安德森"],
    "极简": ["平面版画风格", "韦斯·安德森", "杨德昌"],
  };
  const DEFAULT_DIRECTORS = ["李安", "王家卫", "斯皮尔伯格"];

  const run_director_review = tool({
    description: "启动导演智囊团审阅：根据项目类型自动匹配3位世界级导演，从各自风格视角对剧本创作各阶段（故事骨架/改编策略/剧本）进行创意审阅，输出整合的修改建议。适用于在骨架或策略生成后、剧本定稿前进行创意把关",
    inputSchema: jsonSchema<{ target: string; focusArea: string }>(
      z
        .object({
          target: z.enum(["storySkeleton", "adaptationStrategy", "script"]).describe("审阅目标：故事骨架/改编策略/剧本"),
          focusArea: z.string().describe("希望导演重点关注的方面，如'开场节奏''情感密度''视觉可拍性'等，一句话"),
        })
        .toJSONSchema(),
    ),
    execute: async ({ target, focusArea }) => {
      const thinking = parentCtx.msg.thinking("正在组建导演智囊团...");

      // 1. 获取项目类型，匹配导演
      const projectData = await u.db("o_project").where("id", resTool.data.projectId).first();
      const projectType = (projectData?.type ?? "").trim();
      let matchedDirectors = DEFAULT_DIRECTORS;
      for (const [keyword, directors] of Object.entries(TYPE_DIRECTOR_MAP)) {
        if (projectType.includes(keyword)) {
          matchedDirectors = directors;
          break;
        }
      }

      // 2. 读取审阅目标的当前内容
      const planRow = await u.db("o_agentWorkData").where({ projectId: resTool.data.projectId, key: "scriptAgent" }).first();
      const planData = JSON.parse(planRow?.data ?? "{}");
      const targetLabelMap: Record<string, string> = {
        storySkeleton: "故事骨架",
        adaptationStrategy: "改编策略",
        script: "剧本",
      };
      const targetContent = target === "script"
        ? JSON.stringify(await u.db("o_script").where("projectId", resTool.data.projectId).select("name", "content"))
        : (planData[target] ?? "");

      if (!targetContent || targetContent === "[]" || targetContent.trim() === "") {
        thinking.updateTitle("无审阅内容");
        thinking.complete();
        return `导演审阅中止：${targetLabelMap[target]}内容为空，请先生成${targetLabelMap[target]}。`;
      }

      thinking.updateTitle(`导演智囊团：${matchedDirectors.join("、")} 审阅${targetLabelMap[target]}`);

      // 3. 构建审阅提示
      const reviewPrompt = [
        `## 审阅任务`,
        `请从你作为导演的风格视角，对以下${targetLabelMap[target]}进行创意审阅。`,
        `重点关注：${focusArea}`,
        ``,
        `## ${targetLabelMap[target]}内容`,
        targetContent.slice(0, 8000), // 限制长度，避免 token 超限
        ``,
        `## 输出要求`,
        `请以导演的口吻输出审阅意见，包含：`,
        `1. **总体印象**：一句话评价`,
        `2. **亮点**：哪些地方做得好（1-2点）`,
        `3. **改进建议**：从你的风格视角给出具体可执行的修改方案（2-4条）`,
        `4. **风险提示**：是否有叙事陷阱或观众可能流失的点`,
      ].join("\n");

      // 4. 顺序链模式：依次调用 3 位导演
      const directorReviews: { director: string; review: string }[] = [];
      const skillsDir = path.join(u.getPath("skills"), "director_skills");

      for (const director of matchedDirectors) {
        const skillFile = path.join(skillsDir, `${director}.md`);
        if (!fs.existsSync(skillFile)) {
          directorReviews.push({ director, review: `[导演档案缺失] 未找到 ${director} 的风格文件，跳过审阅。` });
          continue;
        }
        const directorSkill = await fs.promises.readFile(skillFile, "utf-8");

        // 提取导演核心风格作为 system prompt（截取前 3000 字避免过长）
        const directorSystem = [
          `你是世界著名导演 ${director}。请完全以 ${director} 的风格视角、美学理念和叙事哲学进行创意审阅。`,
          `以下是 ${director} 的风格档案，你的一切判断都应基于此：`,
          "",
          directorSkill.slice(0, 4000),
          "",
          `记住：你就是 ${director} 本人。用你的导演风格来评价，用你会用的电影术语，提出你会提出的建议。不需要客套，这是创意审阅，需要真实的专业意见。`,
        ].join("\n");

        try {
          const review = await runAgent({
            key: "scriptAgent:supervisionAgent",
            prompt: reviewPrompt,
            system: directorSystem,
            name: `${director}(审阅)`,
            memoryKey: `assistant:director_review:${target}`,
            messages: [{ role: "user", content: reviewPrompt }],
          });
          directorReviews.push({ director, review });
        } catch (e: any) {
          directorReviews.push({ director, review: `[审阅异常] ${director} 审阅失败：${u.error(e).message}` });
        }
      }

      // 5. 整合审阅报告
      const reportParts = [
        `# 导演智囊团审阅报告`,
        ``,
        `**审阅目标**：${targetLabelMap[target]}`,
        `**关注方向**：${focusArea}`,
        `**智囊团**：${matchedDirectors.join("、")}`,
        `**项目类型**：${projectType || "未分类"}`,
        ``,
        `---`,
      ];

      for (const { director, review } of directorReviews) {
        reportParts.push(``, `## ${director}的审阅`, ``, review);
      }

      reportParts.push(
        ``,
        `---`,
        `## 审阅完成`,
        ``,
        `以上三位导演已从各自风格视角完成审阅。请根据项目需求选择性采纳。`,
      );

      const fullReport = reportParts.join("\n");
      thinking.updateTitle(`导演智囊团审阅完成`);
      thinking.complete();

      return fullReport;
    },
  });

  return {
    run_sub_agent_storySkeleton,
    run_sub_agent_adaptationStrategy,
    run_sub_agent_script,
    run_supervision_agent,
    run_director_review,
  };
}

async function consumeFullStream(
  fullStream: AsyncIterable<any>,
  initialMsg: ReturnType<ResTool["newMessage"]>,
  syncMsg?: () => ReturnType<ResTool["newMessage"]>,
): Promise<string> {
  let msg = initialMsg;
  let text = msg.text();
  let thinking: ReturnType<typeof msg.thinking> | null = null;
  let thinkTime = 0;
  let fullResponse = "";

  try {
    for await (const chunk of fullStream) {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1));
      if (syncMsg) {
        const newMsg = syncMsg();
        if (newMsg !== msg) {
          msg = newMsg;
          text = msg.text();
        }
      }
      if (chunk.type === "reasoning-start") {
        thinkTime = Date.now();
        thinking = msg.thinking("思考中...");
      } else if (chunk.type === "reasoning-delta") {
        thinking?.append(chunk.text);
      } else if (chunk.type === "reasoning-end") {
        thinkTime = Date.now() - thinkTime;
        thinking?.updateTitle(`思考完毕（${(thinkTime / 1000).toFixed(1)} 秒）`);
        thinking?.complete();
        thinking = null;
      } else if (chunk.type === "text-delta") {
        text.append(chunk.text);
        fullResponse += chunk.text;
      } else if (chunk.type === "error") {
        throw chunk.error;
      }
    }
    text.complete();
    msg.complete();
  } catch (err: any) {
    thinking?.complete();
    const errMsg = err?.message ?? String(err);
    text.append(errMsg);
    text.error();
    msg.error();
    throw err;
  }

  return fullResponse;
}

function removeAllXmlTags(text: string): string {
  text = text.replace(/<([a-zA-Z][\w-]*)(\s+[^>]*)?>([\s\S]*?)<\/\1>/g, "");
  text = text.replace(/<([a-zA-Z][\w-]*)(\s+[^>]*)?\/>/g, "");
  text = text.replace(/<\/?[a-zA-Z][\w-]*(\s+[^>]*)?>/g, "");
  return text.trim();
}
