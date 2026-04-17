"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Sparkles, Copy, Check, RefreshCw, Loader2, ArrowRight, CheckCircle2, Zap, Lightbulb, MessageSquare, BookOpen } from "lucide-react";
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
  { title: "真实意图", content: "", icon: "🎯", color: "bg-green-50 border-green-200" },
  { title: "需要追问", content: "", icon: "❓", color: "bg-amber-50 border-amber-200" },
  { title: "回复模板", content: "", icon: "💬", color: "bg-sky-50 border-sky-200" },
  { title: "知识点", content: "", icon: "📚", color: "bg-teal-50 border-teal-200" },
];

const EXAMPLE_PHRASES = [
  "我们先把底层逻辑拉通，然后形成一套可复用的方法论",
  "这个需求需要赋能业务，要用闭环思维来思考",
  "我们要在新赛道上发力，形成完整的生态闭环",
  "先把颗粒度对齐，然后用组合拳来打法落地",
];

const FEATURES = [
  {
    icon: Zap,
    title: "秒级翻译",
    description: "输入黑话，即刻获得大白话翻译",
  },
  {
    icon: Lightbulb,
    title: "深度解析",
    description: "揭示话语背后的真实意图",
  },
  {
    icon: MessageSquare,
    title: "回复模板",
    description: "提供多种语气的回复参考",
  },
  {
    icon: BookOpen,
    title: "知识卡片",
    description: "讲解黑话来源与典故",
  },
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
    
    const humanMatch = text.match(/人话翻译[：:]\s*([\s\S]*?)(?=真实意图|$)/i);
    if (humanMatch) newSections[0].content = humanMatch[1].trim();
    
    const intentMatch = text.match(/真实意图[：:]\s*([\s\S]*?)(?=需要追问|$)/i);
    if (intentMatch) newSections[1].content = intentMatch[1].trim();
    
    const questionMatch = text.match(/需要追问[：:]\s*([\s\S]*?)(?=回复模板|$)/i);
    if (questionMatch) newSections[2].content = questionMatch[1].trim();
    
    const templateMatch = text.match(/回复模板[：:]\s*([\s\S]*?)(?=知识点|$)/i);
    if (templateMatch) newSections[3].content = templateMatch[1].trim();
    
    const knowledgeMatch = text.match(/知识点[：:]\s*([\s\S]*?)$/i);
    if (knowledgeMatch) newSections[4].content = knowledgeMatch[1].trim();
    
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

      if (!response.ok) throw new Error("翻译请求失败");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("无法读取响应");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        fullResponse.current += decoder.decode(value, { stream: false });
        
        const currentContent = buffer.substring(buffer.lastIndexOf("：") + 1);
        
        setSections(prev => {
          const updated = [...prev];
          if (currentSection < updated.length) {
            updated[currentSection] = { ...updated[currentSection], content: currentContent.trim() };
          }
          return updated;
        });

        if (buffer.includes("真实意图") && currentSection < 1) setCurrentSection(1);
        if (buffer.includes("需要追问") && currentSection < 2) setCurrentSection(2);
        if (buffer.includes("回复模板") && currentSection < 3) setCurrentSection(3);
        if (buffer.includes("知识点") && currentSection < 4) setCurrentSection(4);
      }

      const finalSections = parseSections(fullResponse.current);
      setSections(finalSections);
      setHasResult(true);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (error) {
      console.error("翻译失败:", error);
      setSections(prev => prev.map(s => ({ ...s, content: s.title === "人话翻译" ? "翻译失败，请重试" : s.content })));
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
          <div className="bg-white/60 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">礼貌版</span>
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700">{politeMatch[1].trim()}</p>
          </div>
        )}
        {firmMatch && (
          <div className="bg-white/60 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">强硬版</span>
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700">{firmMatch[1].trim()}</p>
          </div>
        )}
        {sarcasticMatch && (
          <div className="bg-white/60 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">阴阳怪气版</span>
            </div>
            <p className="text-sm whitespace-pre-wrap text-gray-700">{sarcasticMatch[1].trim()}</p>
          </div>
        )}
      </div>
    );
  };

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
            <div key={index} className="bg-white/60 rounded-lg p-4 border border-teal-200">
              <p className="text-sm font-semibold text-teal-700 mb-1">{term.trim()}</p>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{description.trim()}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
            <span className="text-xl font-semibold text-[#323130]">黑话翻译器</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">功能介绍</a>
            <a href="#try" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">立即体验</a>
            <Button 
              size="sm"
              className="bg-[#0078D4] hover:bg-[#106EBE] text-white"
              onClick={() => document.getElementById('try')?.scrollIntoView({ behavior: 'smooth' })}
            >
              开始使用
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0078D4] via-[#106EBE] to-[#005A9E] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                职场生存必备工具
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                把黑话翻译成
                <br />
                <span className="text-[#FFB900]">人话</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-lg">
                输入听不懂的职场黑话，我们把它翻译成具体、可执行的大白话。让你立刻知道该做什么、该问什么、该怎么回复。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-[#0078D4] hover:bg-gray-100 font-semibold"
                  onClick={() => document.getElementById('try')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  立即试用
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/20"
                >
                  了解更多
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-[#F5F5F5] px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27CA40]" />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">翻译演示</span>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">输入黑话：</p>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700">
                      "我们先把底层逻辑拉通，然后形成一套可复用的方法论"
                    </div>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    <div className="w-8 h-8 bg-[#0078D4] rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">翻译结果：</p>
                    <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-800 space-y-2">
                      <p><strong>人话：</strong>大家先凑一起把这件事的基本规则说清楚，确保理解一致，然后再整理一套以后都能用的操作步骤。</p>
                      <p><strong>意图：</strong>统一意见+省得我以后重复解释。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#FFB900] text-[#323130] px-4 py-2 rounded-lg font-medium shadow-lg">
                AI 智能翻译
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">四大核心功能</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              从输入到回复，一站式解决你的职场黑话困惑
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <Card key={index} className="border border-gray-200 hover:border-[#0078D4] hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#0078D4]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0078D4] transition-colors">
                    <feature.icon className="w-6 h-6 text-[#0078D4] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#323130] mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Illustrations */}
          <div className="mt-20 grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img 
                src="/feature-translation.png" 
                alt="翻译功能示意" 
                className="w-full rounded-xl shadow-lg"
              />
            </div>
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="text-2xl font-bold text-[#323130]">精准翻译，告别困惑</h3>
              <p className="text-gray-600">
                不仅仅是字面翻译，更深入解析每句话的真实含义。让你在会议中不再迷茫，在邮件中不再尴尬。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-[#107C10]" />
                  <span>50-300字详细翻译</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-[#107C10]" />
                  <span>具体到人和时间</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-[#107C10]" />
                  <span>可执行的行动建议</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Screenshot Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">产品界面预览</h2>
            <p className="text-gray-600">简洁清晰的交互设计，轻松上手</p>
          </div>
          <img 
            src="/demo-screenshot.png" 
            alt="产品界面" 
            className="w-full rounded-xl shadow-2xl border border-gray-200"
          />
        </div>
      </section>

      {/* Try Section */}
      <section id="try" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">立即体验</h2>
            <p className="text-gray-600">粘贴你想翻译的黑话，开始探索真相</p>
          </div>

          <Card className="border-2 border-[#0078D4]/20 shadow-xl shadow-blue-100/50">
            <CardContent className="p-8">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="粘贴你想翻译的黑话...

例如：
我们先把底层逻辑拉通，然后形成一套可复用的方法论
这个需求需要赋能业务，要用闭环思维来思考"
                className="min-h-[140px] text-base border-0 resize-none focus-visible:ring-0 p-0 bg-transparent text-gray-800 placeholder:text-gray-400"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmit();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  按 <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-600">Ctrl + Enter</kbd> 快速提交
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isLoading}
                  className="bg-[#0078D4] hover:bg-[#106EBE] text-white px-8"
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

          {/* Example Buttons */}
          {showExamples && (
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4 text-center">试试这些常见黑话：</p>
              <div className="flex flex-wrap gap-3 justify-center">
                {EXAMPLE_PHRASES.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(phrase)}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#0078D4] hover:text-[#0078D4] transition-colors shadow-sm"
                  >
                    {phrase.length > 25 ? phrase.slice(0, 25) + "..." : phrase}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3 py-8">
                <div className="w-3 h-3 bg-[#0078D4] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-3 h-3 bg-[#0078D4] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-3 h-3 bg-[#0078D4] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-center text-gray-500 text-sm">
                正在翻译成大白话...
              </p>
            </div>
          )}

          {/* Results */}
          {(hasResult || sections.some(s => s.content)) && (
            <div ref={resultRef} className="mt-8 space-y-4">
              {sections.map((section, index) => {
                if (!section.content) return null;
                
                return (
                  <Card key={index} className={`${section.color} border-2`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-lg font-semibold text-[#323130] flex items-center gap-3">
                          <span className="text-2xl">{section.icon}</span>
                          {section.title}
                        </h2>
                        <button
                          onClick={() => copyToClipboard(
                            index === 3 ? section.content : index === 4 ? section.content : `${section.title}：${section.content}`,
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
              
              {hasResult && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="outline"
                    onClick={resetAndShowExamples}
                    className="gap-2 border-[#0078D4] text-[#0078D4] hover:bg-[#0078D4]/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                    继续翻译
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#323130] text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded" />
                <span className="font-semibold">黑话翻译器</span>
              </div>
              <p className="text-gray-400 text-sm">
                让职场沟通更简单，让黑话无处遁形。
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">功能</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>人话翻译</li>
                <li>真实意图解析</li>
                <li>回复模板</li>
                <li>知识卡片</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">关于</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>使用方法</li>
                <li>常见问题</li>
                <li>联系我们</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            &copy; 2024 黑话翻译器. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}
