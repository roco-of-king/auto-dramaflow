import express from "express";
import u from "@/utils";
import { success } from "@/lib/responseFormat";
import fs from "fs";
import path from "path";
const router = express.Router();

// 字段映射表
const DATA_MAP: { label: string; value: string; subDir?: string }[] = [
  { label: "README", value: "README" },
  { label: "前缀", value: "prefix" },
  { label: "角色", value: "art_character", subDir: "art_prompt" },
  { label: "角色衍生", value: "art_character_derivative", subDir: "art_prompt" },
  { label: "道具", value: "art_prop", subDir: "art_prompt" },
  { label: "道具衍生", value: "art_prop_derivative", subDir: "art_prompt" },
  { label: "场景", value: "art_scene", subDir: "art_prompt" },
  { label: "场景衍生", value: "art_scene_derivative", subDir: "art_prompt" },
  { label: "分镜", value: "director_storyboard", subDir: "driector_skills" },
  { label: "分镜视频", value: "art_storyboard_video", subDir: "art_prompt" },
  { label: "技法-导演规划", value: "director_planning_style", subDir: "driector_skills" },
  { label: "技法-分镜表设计", value: "director_storyboard_table_style", subDir: "driector_skills" },
];

// 读取 md 文件内容，文件不存在时返回空字符串
function readMd(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

// 获取 images 文件夹下所有图片文件路径列表
async function readAllImages(imagesDir: string) {
  try {
    const ossPath = u.getPath(path.join("skills", "art_skills", imagesDir, "images"));
    const files = fs.readdirSync(ossPath);
    const images = files.filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f)).map((f) => path.join("art_skills", imagesDir, "images", f));
    if (images.length) {
      return Promise.all(images.map(async (i) => await u.oss.getFileUrl(i, "skills")));
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

// 获取视觉手册
export default router.post("/", async (req, res) => {
  try {
    const artPromptsDir = u.getPath(["skills", "art_skills"]);

    // 读取所有风格文件夹
    const styleDirs = fs
      .readdirSync(artPromptsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    const result = await Promise.all(
      styleDirs.map(async (styleName) => {
        const styleDir = path.join(artPromptsDir, styleName);
        const images = await readAllImages(styleName);
        const readmePath = path.join(styleDir, "README.md");
        const readmeContent = fs.readFileSync(readmePath, "utf-8");
        const firstLine = readmeContent.split("\n")[0].replace(/--/g, "");
        const data = DATA_MAP.map(({ label, value, subDir }) => {
          let mdPath: string;
          if (subDir) {
            mdPath = path.join(styleDir, subDir, `${value}.md`);
          } else {
            mdPath = path.join(styleDir, `${value}.md`);
          }
          return {
            label,
            value,
            data: readMd(mdPath),
          };
        });

        return {
          name: firstLine,
          image: images,
          stylePath: styleName,
          data,
        };
      }),
    );
    res.status(200).send(success(result));
  } catch (err) {
    res.status(500).send({ error: String(err) });
  }
});
