"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Sparkles, Copy, Check, RefreshCw, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Section {
  title: string;
  content: string;
  icon: string;
  color: string;
}

const SECTIONS: Section[] = [
  { title: "人话翻译", content: "", icon: "📝", color: "bg-blue-50 border-blue-200" },
  { title: "真实意图", content: "", icon: "🎯", color: "bg-rose-50 border-rose-200" },
  { title: "需要追问", content: "", icon: "❓", color: "bg-amber-50 border-amber-200" },
  { title: "回复模板", content: "", icon: "💬", color: "bg-purple-50 border-purple-200" },
  { title: "知识点", content: "", icon: "📚", color: "bg-emerald-50 border-emerald-200" },
];

const EXAMPLE_PHRASES = [
  "我们先把底层逻辑拉通，然后形成一套可复用的方法论",
  "这个需求需要赋能业务，要用闭环思维来思考",
  "我们要在新赛道上发力，形成完整的生态闭环",
  "先把颗粒度对齐，然后用组合拳来打法落地",
];

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>(SECTIONS.map(s => ({ ...s })));
  const [currentSection, setCurrentSection] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(true);
  const [hasResult, setHasResult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const fullResponse = useRef<string>("");

  const parseSections = useCallback((text: string) => {
    const newSections = SECTIONS.map(s => ({ ...s }));
    
    // 人话翻译
    const humanMatch = text.match(/人话翻译[：:]\s*([\s\S]*?)(?=真实意图|$)/i);
    if (humanMatch) {
      newSections[0].content = humanMatch[1].trim();
    }
    
    // 真实意图
    const intentMatch = text.match(/真实意图[：:]\s*([\s\S]*?)(?=需要追问|$)/i);
    if (intentMatch) {
      newSections[1].content = intentMatch[1].trim();
    }
    
    // 需要追问
    const questionMatch = text.match(/需要追问[：:]\s*([\s\S]*?)(?=回复模板|$)/i);
    if (questionMatch) {
      newSections[2].content = questionMatch[1].trim();
    }
    
    // 回复模板
    const templateMatch = text.match(/回复模板[：:]\s*([\s\S]*?)(?=知识点|$)/i);
    if (templateMatch) {
      newSections[3].content = templateMatch[1].trim();
    }
    
    // 知识点
    const knowledgeMatch = text.match(/知识点[：:]\s*([\s\S]*?)$/i);
    if (knowledgeMatch) {
      newSections[4].content = knowledgeMatch[1].trim();
    }
    
    return newSections;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setShowExamples(false);
    setHasResult(false);
    setSections(SECTIONS.map(s => ({ ...s })));
    setCurrentSection(0);
    fullResponse.current = "";

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error("翻译请求失败");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取响应");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        fullResponse.current += decoder.decode(value, { stream: false });
        
        // 找到当前正在填充的section
        const currentContent = buffer.substring(
          buffer.lastIndexOf("：") + 1
        );
        
        // 更新sections
        setSections(prev => {
          const updated = [...prev];
          if (currentSection < updated.length) {
            updated[currentSection] = {
              ...updated[currentSection],
              content: currentContent.trim()
            };
          }
          return updated;
        });

        // 检测section切换
        if (buffer.includes("真实意图") && currentSection < 1) {
          setCurrentSection(1);
        }
        if (buffer.includes("需要追问") && currentSection < 2) {
          setCurrentSection(2);
        }
        if (buffer.includes("回复模板") && currentSection < 3) {
          setCurrentSection(3);
        }
        if (buffer.includes("知识点") && currentSection < 4) {
          setCurrentSection(4);
        }
      }

      // 最终解析
      const finalSections = parseSections(fullResponse.current);
      setSections(finalSections);
      setHasResult(true);
      
      // 滚动到结果
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("翻译失败:", error);
      setSections(prev => prev.map(s => ({
        ...s,
        content: s.title === "人话翻译" ? "翻译失败，请重试" : s.content
      })));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, currentSection, parseSections]);

  const copyToClipboard = useCallback(async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    setInput(example);
    setShowExamples(false);
  }, []);

  const resetAndShowExamples = useCallback(() => {
    setInput("");
    setShowExamples(true);
    setHasResult(false);
    setSections(SECTIONS.map(s => ({ ...s })));
    setCurrentSection(0);
    fullResponse.current = "";
  }, []);

  // 打字机效果渲染回复模板
  const renderTemplateContent = (content: string) => {
    const politeMatch = content.match(/礼貌版[：:]\s*([\s\S]*?)(?=强硬版|$)/i);
    const firmMatch = content.match(/强硬版[：:]\s*([\s\S]*?)(?=阴阳怪气|$)/i);
    const sarcasticMatch = content.match(/阴阳怪气版[：:]\s*([\s\S]*?)$/i);

    if (!politeMatch && !firmMatch && !sarcasticMatch) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    return (
      <div className="space-y-4">
        {politeMatch && (
          <div className="bg-white/60 rounded-lg p-3 border border-green-100">
            <p className="text-xs font-medium text-green-600 mb-1">礼貌版</p>
            <p className="text-sm whitespace-pre-wrap">{politeMatch[1].trim()}</p>
          </div>
        )}
        {firmMatch && (
          <div className="bg-white/60 rounded-lg p-3 border border-red-100">
            <p className="text-xs font-medium text-red-600 mb-1">强硬版</p>
            <p className="text-sm whitespace-pre-wrap">{firmMatch[1].trim()}</p>
          </div>
        )}
        {sarcasticMatch && (
          <div className="bg-white/60 rounded-lg p-3 border border-purple-100">
            <p className="text-xs font-medium text-purple-600 mb-1">阴阳怪气版</p>
            <p className="text-sm whitespace-pre-wrap">{sarcasticMatch[1].trim()}</p>
          </div>
        )}
      </div>
    );
  };

  // 知识点格式化
  const renderKnowledgeContent = (content: string) => {
    const lines = content.split("\n").filter(line => line.trim());
    
    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          const [term, ...descParts] = line.split(/[：:]/);
          const description = descParts.join("：");
          
          if (!term || !description) {
            return <p key={index} className="text-sm whitespace-pre-wrap">{line}</p>;
          }

          return (
            <div key={index} className="bg-white/60 rounded-lg p-3 border border-emerald-100">
              <p className="text-sm font-medium text-emerald-700 mb-1">{term.trim()}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{description.trim()}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* 顶部装饰 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* 主要内容 */}
      <main className="relative max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            职场生存必备技能
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              互联网黑话翻译器
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            听不懂领导在说啥？把这个工具甩给他。输入黑话，还你人话。
          </p>
        </div>

        {/* 输入区域 */}
        <Card className="mb-8 border-2 border-blue-100 shadow-lg shadow-blue-100/50">
          <CardContent className="p-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴你想翻译的黑话...

例如：
我们先把底层逻辑拉通，然后形成一套可复用的方法论
这个需求需要赋能业务，要用闭环思维来思考"
              className="min-h-[160px] text-base border-0 resize-none focus-visible:ring-0 p-0 bg-transparent"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                按 <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl + Enter</kbd> 快速提交
              </p>
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    翻译中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    开始翻译
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 示例提示 */}
        {showExamples && (
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-3 text-center">试试这些常见黑话：</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_PHRASES.map((phrase, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(phrase)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                >
                  {phrase.length > 20 ? phrase.slice(0, 20) + "..." : phrase}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="mb-8" ref={resultRef}>
            <div className="flex items-center justify-center gap-3 py-8">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <p className="text-center text-gray-500 text-sm">
              正在翻译成大白话...
            </p>
          </div>
        )}

        {/* 结果展示 */}
        {(hasResult || sections.some(s => s.content)) && (
          <div ref={resultRef} className="space-y-4">
            {sections.map((section, index) => {
              if (!section.content) return null;
              
              return (
                <Card key={index} className={`${section.color} border-2 transition-all duration-500`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-2xl">{section.icon}</span>
                        {section.title}
                      </h2>
                      <button
                        onClick={() => copyToClipboard(
                          index === 3 ? section.content : 
                          index === 4 ? section.content :
                          `${section.title}：${section.content}`,
                          index
                        )}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        title="复制内容"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      {index === 3 ? renderTemplateContent(section.content) :
                       index === 4 ? renderKnowledgeContent(section.content) :
                       <p className="whitespace-pre-wrap">{section.content}</p>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* 重新开始按钮 */}
            {hasResult && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={resetAndShowExamples}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  继续翻译
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/50 rounded-xl">
              <p className="text-2xl mb-1">📝</p>
              <p className="text-sm text-gray-600">人话翻译</p>
            </div>
            <div className="p-4 bg-white/50 rounded-xl">
              <p className="text-2xl mb-1">🎯</p>
              <p className="text-sm text-gray-600">真实意图</p>
            </div>
            <div className="p-4 bg-white/50 rounded-xl">
              <p className="text-2xl mb-1">💬</p>
              <p className="text-sm text-gray-600">回复模板</p>
            </div>
            <div className="p-4 bg-white/50 rounded-xl">
              <p className="text-2xl mb-1">📚</p>
              <p className="text-sm text-gray-600">知识点</p>
            </div>
          </div>
        </div>
      </main>

      {/* 装饰元素 */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}
