/**
 * 去除深度思考模型输出的 <think>...</think> 标签及其内容
 *
 * 1. stripThink(text)          — 用于非流式，直接去除完整文本中的 <think> 块
 * 2. createThinkStreamFilter() — 用于流式，返回有状态的过滤器，逐 chunk 过滤
 */

/**
 * 非流式：去除完整文本中的 <think>...</think>
 */
export function stripThink(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

/**
 * 流式：创建一个有状态的 chunk 过滤器
 *
 * 用法：
 * ```ts
 * const filter = createThinkStreamFilter();
 * for await (const chunk of textStream) {
 *   const filtered = filter.push(chunk);
 *   if (filtered) msg.send(filtered);
 * }
 * ```
 */
export function createThinkStreamFilter() {
  let insideThink = false;
  let buffer = "";

  return {
    /**
     * 输入一个 chunk，返回过滤后需要输出的文本（可能为空字符串）
     */
    push(chunk: string): string {
      let output = "";
      let i = 0;

      while (i < chunk.length) {
        if (insideThink) {
          // 正在 <think> 内部，寻找 </think>
          const closeIdx = chunk.indexOf("</think>", i);
          if (closeIdx !== -1) {
            // 找到闭合标签，跳过标签内容
            insideThink = false;
            i = closeIdx + "</think>".length;
          } else {
            // 整个剩余 chunk 都在 think 内，全部丢弃
            break;
          }
        } else {
          // 不在 <think> 内部
          const openIdx = chunk.indexOf("<think>", i);
          if (openIdx !== -1) {
            // 找到开启标签，输出标签之前的内容
            output += buffer + chunk.slice(i, openIdx);
            buffer = "";
            insideThink = true;
            i = openIdx + "<think>".length;
          } else {
            // 没有发现 <think>，但可能 chunk 末尾是不完整的 "<thi..."
            // 缓冲末尾可能是 "<" 开头的不完整标签片段
            const potentialStart = findPartialTag(chunk, i);
            if (potentialStart !== -1) {
              output += buffer + chunk.slice(i, potentialStart);
              buffer = chunk.slice(potentialStart);
            } else {
              output += buffer + chunk.slice(i);
              buffer = "";
            }
            break;
          }
        }
      }

      return output;
    },

    /**
     * 流结束时调用，刷出缓冲区中残留的内容
     */
    flush(): string {
      const remaining = buffer;
      buffer = "";
      return remaining;
    },
  };
}

/**
 * 检查 chunk[startIdx..] 的末尾是否包含 "<think>" 的不完整前缀
 * 如 "<", "<t", "<th", "<thi", "<thin", "<think"
 * 返回不完整前缀的起始位置，未找到则返回 -1
 */
function findPartialTag(chunk: string, startIdx: number): number {
  const tag = "<think>";
  // 只需检查末尾最多 tag.length - 1 个字符
  const searchStart = Math.max(startIdx, chunk.length - (tag.length - 1));
  for (let i = searchStart; i < chunk.length; i++) {
    const remaining = chunk.slice(i);
    if (tag.startsWith(remaining)) {
      return i;
    }
  }
  return -1;
}
