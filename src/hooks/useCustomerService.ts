"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface ChatMessage {
  id: string;
  type: "user" | "agent" | "system";
  content: string;
  timestamp: string;
}

export interface QuickReply {
  text: string;
  action: string;
}

// 自动回复逻辑
const AUTO_REPLIES: Record<string, string> = {
  "你好": "您好！欢迎来到言说博客平台。有什么可以帮助您的吗？",
  "hi": "Hello! Welcome to 言说 Blog. How can I help you?",
  "hello": "Hello! Welcome to 言说 Blog. How can I help you?",
  "帮助": "我可以帮您解答以下问题：\n1. 如何注册和登录\n2. 如何发布博客\n3. 如何使用打赏功能\n4. 其他功能咨询\n\n请告诉我您想了解的内容！",
  "注册": "注册非常简单！只需：\n1. 点击右上角的「开始写作」\n2. 在登录弹窗中填写用户名和密码\n3. 完成图形验证码验证\n\n无需邮箱或手机号，轻松开始创作！",
  "登录": "登录流程：\n1. 点击任意「登录」按钮\n2. 输入用户名和密码\n3. 填写图形验证码\n\n忘记密码？别担心，数据存储在本地，重新注册即可～",
  "打赏": "感谢您的支持！打赏功能：\n1. 点击「支持作者」按钮\n2. 选择金额或自定义\n3. 选择支付方式\n\n目前支持微信支付和支付宝（模拟环境）。您的支持是我们前进的动力！",
  "费用": "言说博客平台完全免费！\n- 写作免费\n- 发布免费\n- 打赏功能可选\n\n我们相信每个人都应该有机会自由表达。",
  "功能": "主要功能包括：\n1. 📝 博客写作 - 简洁的Markdown编辑器\n2. ❤️ 点赞评论 - 与读者互动\n3. 💰 打赏支持 - 读者可以支持作者\n4. 🔒 隐私保护 - 数据存储在本地\n\n还有什么想了解的吗？",
  "联系": "您可以通过以下方式联系我们：\n📧 邮箱：support@yanshuo.com\n💬 在线客服：就是我现在！\n\n我们通常在24小时内回复邮件。",
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getAutoReply(message: string): string {
  const lowerMsg = message.toLowerCase().trim();
  
  for (const [keyword, reply] of Object.entries(AUTO_REPLIES)) {
    if (lowerMsg.includes(keyword.toLowerCase())) {
      return reply;
    }
  }
  
  return "感谢您的留言！我已收到您的问题，正在处理中。\n\n如果您需要即时帮助，可以尝试：\n• 输入「帮助」查看常见问题\n• 输入「功能」了解平台特性\n• 输入「联系」获取联系方式\n\n我们的客服团队会尽快回复您！";
}

const MESSAGES_KEY = "customer_service_messages";

function getStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(MESSAGES_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function useCustomerService() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载历史消息
  useEffect(() => {
    const stored = getStoredMessages();
    if (stored.length > 0) {
      setMessages(stored);
    } else {
      // 初始化欢迎消息
      const welcomeMsg: ChatMessage = {
        id: generateId(),
        type: "agent",
        content: "👋 您好！欢迎来到言说客服中心。\n\n我是您的在线客服小言，很高兴为您服务！\n\n您可以输入您的问题，我会尽快为您解答。常用关键词：「帮助」「注册」「登录」「功能」「打赏」",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // 保存消息到本地
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentTyping]);

  // 发送消息
  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      type: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsAgentTyping(true);

    // 模拟客服回复延迟
    setTimeout(() => {
      const agentReply: ChatMessage = {
        id: generateId(),
        type: "agent",
        content: getAutoReply(content),
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, agentReply]);
      setIsAgentTyping(false);
    }, 1000 + Math.random() * 1000);
  }, []);

  // 切换窗口状态
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
    if (isMinimized) {
      setIsMinimized(false);
    }
  }, [isMinimized]);

  const minimize = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  return {
    isOpen,
    isMinimized,
    messages,
    isAgentTyping,
    messagesEndRef,
    sendMessage,
    toggleOpen,
    minimize,
    close,
  };
}

// 快捷回复选项
export const QUICK_REPLIES: QuickReply[] = [
  { text: "📖 如何注册", action: "注册" },
  { text: "✍️ 如何写博客", action: "功能" },
  { text: "💰 如何打赏", action: "打赏" },
  { text: "❓ 其他问题", action: "帮助" },
];
