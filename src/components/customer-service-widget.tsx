"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X, Minimize2, Send, Bot, User, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCustomerService, ChatMessage, QUICK_REPLIES } from "@/hooks/useCustomerService";

export default function CustomerServiceWidget() {
  const {
    isOpen,
    isMinimized,
    messages,
    isAgentTyping,
    messagesEndRef,
    sendMessage,
    toggleOpen,
    minimize,
    close,
  } = useCustomerService();

  const [inputValue, setInputValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
      setShowQuickReplies(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (action: string) => {
    sendMessage(action);
    setShowQuickReplies(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    // 浮动按钮
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-[#0078D4] to-[#005A9E] rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="打开客服"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        {/* 在线状态指示 */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg p-3 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <MessageCircle className="w-6 h-6 text-[#0078D4]" />
        <span className="text-sm font-medium text-gray-700">展开客服</span>
        <ChevronDown className="w-4 h-4 text-gray-400 rotate-180" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0078D4] to-[#005A9E] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src="/logo.png" />
              <AvatarFallback className="bg-white text-[#0078D4] font-bold">言</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div>
            <h3 className="text-white font-bold">在线客服</h3>
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              在线 · 随时为您服务
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={minimize}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="最小化"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={close}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px] max-h-[400px]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {/* Typing Indicator */}
        {isAgentTyping && (
          <div className="flex items-start gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-[#0078D4] text-white text-xs">言</AvatarFallback>
            </Avatar>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {showQuickReplies && messages.length <= 2 && (
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">快捷问题</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply.action}
                onClick={() => handleQuickReply(reply.action)}
                className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            type="text"
            placeholder="输入您的问题..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-[#0078D4] hover:bg-[#106EBE] px-3"
            aria-label="发送"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          输入关键词如「帮助」「注册」「功能」获取快速回复
        </p>
      </div>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message }: { message: ChatMessage }) {
  const isAgent = message.type === "agent";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <div className="text-center py-2">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-2 ${isAgent ? "" : "flex-row-reverse"}`}>
      <Avatar className={`w-8 h-8 flex-shrink-0 ${isAgent ? "" : ""}`}>
        {isAgent ? (
          <AvatarFallback className="bg-[#0078D4] text-white text-xs">言</AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
            <User className="w-4 h-4" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className={`max-w-[75%] ${isAgent ? "" : "items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-2 shadow-sm whitespace-pre-wrap ${
            isAgent
              ? "bg-white rounded-tl-none"
              : "bg-[#0078D4] text-white rounded-tr-none"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className={`text-xs text-gray-400 mt-1 ${isAgent ? "" : "text-right"}`}>
          {new Date(message.timestamp).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
