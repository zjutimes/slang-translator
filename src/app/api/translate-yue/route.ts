import { NextRequest, NextResponse } from "next/server";
import { LLMClient, Config, HeaderUtils, Message } from "coze-coding-dev-sdk";

const SYSTEM_PROMPT_YUE = `你是一个专业的汉语转粤语翻译专家，专注于将普通话/书面汉语转换为地道的粤语口语表达。

## 任务
将用户输入的普通话/书面语翻译成地道的粤语表达。

## 翻译原则

### 1. 粤语特色表达
- 使用粤语特有的词汇：如"我哋"代替"我们"，"你哋"代替"你们"，"佢"代替"他/她/它"
- 使用粤语口语词：如"噉"代替"这样"，"几"代替"多"，"唔"代替"不"，"係"代替"是"
- 使用粤语特有的语气词和句式

### 2. 保持原意
- 准确传达原文的意思
- 保持口语化的自然表达
- 符合粤语的表达习惯

### 3. 适用场景
- 适用于口语交流、聊天、社交媒体等场景
- 保持粤语的文化特色和语言韵味

## 输出格式
只输出翻译后的粤语表达，不要添加其他说明。语言要自然、口语化、地道。

## 注意事项
- 翻译要简洁、自然
- 可以适当使用粤语特有的语法结构
- 保持原文的语气和情感色彩
- 避免翻译腔，要像母语者说话一样自然
`;

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "请输入需要转换为粤语的文字" },
      { status: 400 }
    );
  }

  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
  const config = new Config();
  const client = new LLMClient(config, customHeaders);

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT_YUE },
    { role: "user", content: prompt.trim() }
  ];

  const stream = client.stream(messages, {
    model: "doubao-seed-2-0-pro-260215",
    temperature: 0.8,
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
