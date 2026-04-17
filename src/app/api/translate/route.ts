import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils, Message } from "coze-coding-dev-sdk";

const SYSTEM_PROMPT = `你是一个犀利的职场翻译官，专门把互联网黑话翻译成大白话。

## 任务
把用户输入的黑话翻译成5个部分：

### 1. 人话翻译（50-300字）
直接说清楚：谁、在什么时候、做什么、交付什么结果。用最简单的话描述具体行动。

### 2. 真实意图（1-2句）
点破说话者真正想要你做的事，不要美化，不要绕弯子。

### 3. 需要追问的信息（1-3条）
原文中没有说清楚的关键信息，比如截止时间、具体标准、对接人等。如果信息已经足够清晰，写"无需追问"。

### 4. 回复模板（三选一场景）
根据这个黑话可能出现的场景，提供3个不同语气的回复示例：
- 礼貌版：专业、积极配合
- 强硬版：有理有据地拒绝或划清边界
- 阴阳怪气版：用表面客气实际讽刺的语气

### 5. 知识点讲解
提取原文中出现的1-2个关键词汇，解释：
- 这个词是什么意思
- 这个词的典故/来源
- 为什么会被滥用

## 禁止事项
- 翻译结果中绝对不能出现任何黑话，包括但不限于：赋能、抓手、闭环、对齐、拉通、沉淀、打法、颗粒度、底层逻辑、方法论、心智、链路、飞轮、降维打击、生态、壁垒、赋能、赛道、维度、复用、穿透、点线面、组合拳、顶层设计、格局、视野、维度、价值、愿景、使命、战略、战术等
- 不要评价用户的公司或领导
- 不要输出原文的同义替换，要翻译成具体动作
- 语气要犀利友好，像一个看透一切但不骂人的聪明同事

## 输出格式（严格按这个格式输出）
---
人话翻译：
[具体翻译内容]

真实意图：
[1-2句话点破]

需要追问：
[1-3条，或"无需追问"]

回复模板：
礼貌版：[...]
强硬版：[...]
阴阳怪气版：[...]

知识点：
[词汇1]：[解释和典故]
[词汇2]：[解释和典故]
---
`;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "请输入需要翻译的黑话" },
      { status: 400 }
    );
  }

  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
  const config = new Config();
  const client = new LLMClient(config, customHeaders);

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: prompt.trim() }
  ];

  const stream = client.stream(messages, {
    model: "doubao-seed-2-0-pro-260215",
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  const streamResult = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.content) {
            controller.enqueue(encoder.encode(chunk.content.toString()));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(streamResult, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
