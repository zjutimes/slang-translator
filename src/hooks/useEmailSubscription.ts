"use client";

import { useState, useEffect, useCallback } from "react";

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  lastEmailAt: string | null;
  emailCount: number;
  isActive: boolean;
}

const SUBSCRIBERS_KEY = "email_subscribers";
const EMAIL_CAMPAIGNS_KEY = "email_campaigns";

export interface EmailCampaign {
  id: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientCount: number;
}

// 获取所有订阅者
function getSubscribers(): Subscriber[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(SUBSCRIBERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存订阅者
function saveSubscribers(subscribers: Subscriber[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
}

export function useEmailSubscription() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // 加载订阅者
  useEffect(() => {
    const data = getSubscribers();
    setSubscribers(data);
    setIsLoading(false);
  }, []);

  // 订阅邮箱
  const subscribe = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: "请输入有效的邮箱地址" };
    }

    // 检查是否已订阅
    const existing = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      if (existing.isActive) {
        return { success: false, message: "该邮箱已订阅" };
      } else {
        // 重新激活订阅
        const updated = subscribers.map(s => 
          s.email.toLowerCase() === email.toLowerCase() 
            ? { ...s, isActive: true, subscribedAt: new Date().toISOString() }
            : s
        );
        setSubscribers(updated);
        saveSubscribers(updated);
        return { success: true, message: "欢迎回来！已重新激活订阅" };
      }
    }

    setIsSubscribing(true);
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newSubscriber: Subscriber = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      lastEmailAt: null,
      emailCount: 0,
      isActive: true,
    };

    const updated = [...subscribers, newSubscriber];
    setSubscribers(updated);
    saveSubscribers(updated);
    setIsSubscribing(false);

    return { success: true, message: "订阅成功！我们会定期发送精彩内容到您的邮箱" };
  }, [subscribers]);

  // 取消订阅
  const unsubscribe = useCallback((email: string): boolean => {
    const updated = subscribers.map(s => 
      s.email.toLowerCase() === email.toLowerCase()
        ? { ...s, isActive: false }
        : s
    );
    setSubscribers(updated);
    saveSubscribers(updated);
    return true;
  }, [subscribers]);

  // 获取活跃订阅者
  const getActiveSubscribers = useCallback((): Subscriber[] => {
    return subscribers.filter(s => s.isActive);
  }, [subscribers]);

  // 获取订阅者数量
  const getSubscriberCount = useCallback((): number => {
    return subscribers.filter(s => s.isActive).length;
  }, [subscribers]);

  return {
    subscribers,
    isLoading,
    isSubscribing,
    subscribe,
    unsubscribe,
    getActiveSubscribers,
    getSubscriberCount,
  };
}

// 预设邮件模板
export const EMAIL_TEMPLATES = [
  {
    id: "welcome",
    subject: "欢迎订阅言说博客！",
    content: `亲爱的订阅者：

欢迎加入言说博客！

在这里，你可以：
📝 记录你的故事
💡 分享你的想法
❤️ 与读者互动

最新功能：
• 博客写作工具全新上线
• 打赏功能支持
• 在线客服随时为您服务

我们每周都会为你推送精选内容，敬请期待！

---
言说博客团队`,
  },
  {
    id: "weekly",
    subject: "本周精选 | 这些文章值得一读",
    content: `亲爱的读者：

本周我们为你精选了以下内容：

📖 热门文章推荐
• 如何写出高质量的技术博客
• 创作的十大黄金法则
• 从零开始搭建个人博客

💡 创作技巧
分享一些实用的写作技巧，帮助你提升内容质量。

🎁 限时活动
本周注册的用户将获得专属礼品，快来参与吧！

---
言说博客 · 让创作更简单`,
  },
  {
    id: "monthly",
    subject: "月度回顾 | 这一个月我们一起成长",
    content: `亲爱的言说用户：

感谢您一个月的陪伴！

📊 本月数据
• 新增文章：128篇
• 活跃用户：5,000+
• 总阅读量：100,000+

🌟 精选内容
本月最受欢迎的5篇文章，带你回顾精彩瞬间。

🔮 下月预告
• 新功能上线
• 创作者激励计划
• 更多精彩活动

感谢您的支持与信任！

---
言说博客团队`,
  },
];
