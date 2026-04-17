"use client";

import { useState, useEffect } from "react";
import { Mail, X, Check, Loader2, Bell, Gift, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface EmailSubscriptionProps {
  variant?: "inline" | "card" | "popup";
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export default function EmailSubscription({
  variant = "card",
  title = "订阅邮件推送",
  description = "订阅后每周我们会精选精彩内容发送到您的邮箱",
  onSuccess,
}: EmailSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 检查是否已经订阅过
    const subscribed = localStorage.getItem("email_subscribed");
    if (!subscribed) {
      // 延迟显示弹窗
      setTimeout(() => setIsVisible(true), 3000);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setIsSubscribing(true);
    
    // 模拟订阅API
    await new Promise(resolve => setTimeout(resolve, 1500));

    localStorage.setItem("email_subscribed", email);
    localStorage.setItem("email_subscribed_at", new Date().toISOString());
    
    setIsSubscribing(false);
    setIsSuccess(true);
    setIsVisible(false);
    onSuccess?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("email_popup_dismissed", "true");
  };

  if (!mounted) return null;

  // Inline variant
  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          type="email"
          placeholder="输入邮箱订阅"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-xs"
        />
        <Button 
          type="submit" 
          disabled={isSubscribing}
          className="bg-[#0078D4] hover:bg-[#106EBE]"
        >
          {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "订阅"}
        </Button>
      </form>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <Card className="border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#0078D4] rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#323130] mb-1">{title}</h3>
              <p className="text-gray-600 text-sm mb-4">{description}</p>
              {isSuccess ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span>订阅成功！</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={isSubscribing}
                    className="bg-[#0078D4] hover:bg-[#106EBE]"
                  >
                    {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "订阅"}
                  </Button>
                </form>
              )}
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Popup variant
  if (variant === "popup") {
    if (!isVisible) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#0078D4] to-[#005A9E] px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h4 className="text-xl font-bold text-[#323130] mb-2">订阅成功！</h4>
                <p className="text-gray-600">感谢您的订阅，我们会定期发送精彩内容</p>
              </div>
            ) : (
              <>
                {/* Benefits */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Bell, text: "每周精选内容推送" },
                    { icon: Gift, text: "第一时间获取新功能" },
                    { icon: Calendar, text: "专属活动邀请" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-[#0078D4]" />
                      </div>
                      <span className="text-gray-700">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="输入您的邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-base font-bold"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        订阅中...
                      </>
                    ) : (
                      "立即订阅"
                    )}
                  </Button>
                </form>

                <p className="text-xs text-gray-400 text-center mt-4">
                  我们尊重您的隐私，不会向第三方透露您的邮箱
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
