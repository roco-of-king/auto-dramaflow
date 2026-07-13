/**
 * 批量给 ai_director_system 的导演档案加 Toonflow frontmatter，并输出到 data/skills/director_skills/
 */
import * as fs from "fs";
import * as path from "path";

const srcDir = path.resolve("D:/soft/py-workspace/write_passage/ai_director_system/directors");
const dstDir = path.resolve("data/skills/director_skills");

// 导演名 → description（基于 SKILL.md 中的定义）
const descriptionMap: Record<string, string> = {
  "张艺谋": "色彩与仪式感的极致运用——浓烈色彩、宏大场面、人文关怀、仪式化调度",
  "陈凯歌": "人文思辨与悲剧美学——诗意悲悯、历史与个体冲突的深刻叙事",
  "姜文": "荒诞天才的魔幻现实主义——黑色幽默、历史另类解读、语言狂欢",
  "贾樟柯": "社会变迁的纪实凝视——底层小人物、时代洪流、长镜头真实美学",
  "王家卫": "感官诗学与时间变奏——抽帧、迷离光影、霓虹美学、时间的流逝感",
  "徐克": "天马行空的魔幻江湖——武侠革新、视觉奇观、奇幻想象力",
  "杜琪峰": "冷峻宿命的黑色交响乐——静态张力、人性幽暗、宿命感枪战",
  "吴宇森": "暴力美学与侠义江湖——慢镜头、白鸽、双枪、兄弟情义",
  "周星驰": "荒唐喜剧中的人性悲悯——无厘头、小人物尊严、笑中带泪",
  "陈可辛": "精细平衡的优质商业叙事——情感精准、市场与艺术的平衡",
  "杨德昌": "精确解剖现代都市病——多线叙事、现代人疏离焦虑、理性冷峻",
  "侯孝贤": "东方美学的长镜诗篇——固定长镜头、时间流逝、东方神韵",
  "李安": "无界求索的文化桥梁——东西方融合、伦理欲望、细腻情感",
  "史蒂文·斯皮尔伯格": "童真与人文的造梦大师——类型全才、普世情感、造梦叙事",
  "克里斯托弗·诺兰": "高概念烧脑的时空游戏——非线性叙事、科学哲学、IMAX实拍",
  "昆汀·塔伦蒂诺": "话痨暴力与拼贴狂欢——非线性叙事、密集对白、暴力美学",
  "弗朗西斯·福特·科波拉": "现代启示录与家族史诗——权力疯癫、宏大格局、家族主题",
  "詹姆斯·卡梅隆": "技术先驱的感官革命——视觉奇观、技术创新、极致震撼",
  "大卫·芬奇": "形式的极致与黑色的坚韧——冷峻精准、心理畸形、暗黑色调",
  "伍迪·艾伦": "知识分子幽默与中产喜剧——高密度对白、存在主义焦虑、都市中产困境",
  "英格玛·伯格曼": "现代主义信仰叩问——内心独白、灵魂挣扎、存在追问",
  "费德里科·费里尼": "欢宴与梦境的奢靡奇想——主观现实、马戏团美学、梦境狂欢",
  "米开朗基罗·安东尼奥尼": "疏离美学的现代症候——空旷场景、反戏剧、现代人的精神荒漠",
  "黑泽明": "动态磅礴的东方史诗——场面调度、武士精神、人性光辉",
  "小津安二郎": "宁静低角的日常禅意——固定低角度、物哀美学、家庭日常",
  "宫崎骏": "手绘匠心的童真环保哲思——自然崇拜、飞翔意象、反战和平",
  "是枝裕和": "淡雅沉静的家族社会学——沉静镜头、血缘伦理、日常生活诗意",
  "奉俊昊": "类型外壳下的阶级匕首——类型嵌套、社会议题、空间隐喻",
  "朴赞郁": "巴洛克式的复仇美学——华丽暴力、哥特视觉、复仇主题",
  "路易斯·布努埃尔": "荒诞梦境的社会异化——超现实、资产阶级批判、梦境逻辑",
  "安德烈·塔可夫斯基": "神性静观的电影雕刻——雕刻时光、精神力量、诗意长镜头",
};

function getDirectorName(filename: string): string {
  const base = path.basename(filename, ".md");
  // 文件名就是中文导演名，直接返回
  return base;
}

function main() {
  fs.mkdirSync(dstDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith(".md"));
  console.log(`找到 ${files.length} 个导演文件\n`);

  for (const file of files) {
    const directorName = getDirectorName(file);
    const description = descriptionMap[directorName];

    if (!description) {
      console.warn(`⚠ 缺少 description: ${directorName}`);
      continue;
    }

    const srcPath = path.join(srcDir, file);
    let content = fs.readFileSync(srcPath, "utf-8");

    // 去掉已有的 H1 标题（# 🎬 世界著名导演深度风格分析：xxx），避免和 frontmatter 重复
    content = content.replace(/^# 🎬 世界著名导演深度风格分析：.*\n\n?/, "");

    const frontmatter = [
      "---",
      `name: ${directorName}风格`,
      `description: ${description}`,
      `type: director_skill`,
      "---",
      "",
    ].join("\n");

    const output = frontmatter + content;
    const dstPath = path.join(dstDir, file);
    fs.writeFileSync(dstPath, output, "utf-8");
    console.log(`✅ ${directorName} → ${dstPath}`);
  }

  console.log(`\n完成！共处理 ${files.length} 个文件，输出到 ${dstDir}`);
}

main();
