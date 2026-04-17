"use client";

import { useState, useEffect, useCallback } from "react";

export interface DonationRecord {
  id: string;
  amount: number;
  message: string;
  donor: string;
  createdAt: string;
}

const DONATIONS_KEY = "blog_donations";

// 获取所有捐赠记录
function getDonations(): DonationRecord[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(DONATIONS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存捐赠记录
function saveDonation(record: DonationRecord): void {
  const donations = getDonations();
  donations.unshift(record);
  localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
}

export function useDonation() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    const data = getDonations();
    setDonations(data.slice(0, 10)); // 只显示最近10条
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    setTotalAmount(total);
    setIsLoading(false);
  }, []);

  // 添加捐赠
  const addDonation = useCallback((
    amount: number,
    message: string,
    donor: string
  ): DonationRecord => {
    const record: DonationRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      amount,
      message: message || "感谢支持！",
      donor,
      createdAt: new Date().toISOString(),
    };

    saveDonation(record);
    setDonations(prev => [record, ...prev].slice(0, 10));
    setTotalAmount(prev => prev + amount);
    
    return record;
  }, []);

  return {
    donations,
    totalAmount,
    isLoading,
    addDonation,
  };
}

// 预设金额
export const PRESET_AMOUNTS = [
  { value: 6.6, label: "66", description: "六六大顺" },
  { value: 8.8, label: "88", description: "发财" },
  { value: 18.8, label: "188", description: "一路发" },
  { value: 66.6, label: "666", description: "顺顺利利" },
  { value: 88.8, label: "888", description: "发发发" },
];
