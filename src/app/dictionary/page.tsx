"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, X, Copy, Check, ChevronDown, ChevronUp, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JARGON_DICTIONARY, CATEGORIES, SEARCH_EXAMPLES, type JargonEntry } from "@/lib/jargon-dict";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function DictionaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const filteredEntries = useMemo(() => {
    return JARGON_DICTIONARY.filter((entry) => {
      const matchesSearch =
        searchQuery === "" ||
        entry.term.includes(searchQuery) ||
        entry.meaning.includes(searchQuery);
      const matchesCategory =
        selectedCategory === "全部" || entry.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearchExample = (term: string) => {
    setSearchQuery(term);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTerm(text);
      setTimeout(() => setCopiedTerm(null), 2000);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const toggleExpand = (term: string) => {
    const newSet = new Set(expandedEntries);
    if (newSet.has(term)) {
      newSet.delete(term);
    } else {
      newSet.add(term);
    }
    setExpandedEntries(newSet);
  };

  // 统计各类别数量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 全部: JARGON_DICTIONARY.length };
    JARGON_DICTIONARY.forEach((entry) => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });
    return counts;
  }, []);

  // 登录状态
  const { user, isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
            <a href="/blog" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">博客</a>
            <a href="/" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">翻译器</a>
            <a href="/dictionary" className="text-sm text-[#0078D4] font-medium">江湖词典</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078D4] via-[#106EBE] to-[#005A9E] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm mb-6 backdrop-blur-sm">
            <BookOpen className="w-4 h-4" />
            《江湖丛谈》连阔如 著
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            江湖黑话词典
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            收录《江湖丛谈》中的{ JARGON_DICTIONARY.length }条江湖春点，用大白话解释旧时江湖艺人的行话暗语
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索黑话术语..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-white rounded-xl border-0 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-[#0078D4] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="truncate">{cat.name}</span>
                <span className="text-xs opacity-70">({categoryCounts[cat.name] || 0})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search Examples */}
      {searchQuery === "" && (
        <section className="bg-white py-6 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-sm text-gray-500 mb-3">试试搜索：</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_EXAMPLES.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearchExample(term)}
                  className="px-3 py-1.5 bg-blue-50 text-[#0078D4] rounded-full text-sm hover:bg-blue-100 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            找到 <span className="font-semibold text-[#0078D4]">{filteredEntries.length}</span> 条结果
          </p>
        </div>

        {filteredEntries.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 mb-4">没有找到匹配的黑话</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("全部");
                }}
              >
                清除筛选
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEntries.map((entry) => (
              <Card
                key={entry.term}
                className="border border-gray-200 hover:border-[#0078D4] hover:shadow-md transition-all cursor-pointer group"
                onClick={() => toggleExpand(entry.term)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-[#0078D4] rounded text-sm font-medium mb-2">
                        {entry.term}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {entry.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(entry.term);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="复制术语"
                      >
                        {copiedTerm === entry.term ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      {expandedEntries.has(entry.term) ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">{entry.meaning}</p>
                  {expandedEntries.has(entry.term) && entry.example && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">示例</p>
                      <p className="text-sm text-gray-600 italic">{entry.example}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#323130] text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm mb-4">
            内容来源：《江湖丛谈》连阔如 著 | 贾建国、连丽如 整理
          </p>
          <p className="text-gray-500 text-xs">
            本词典旨在传承和记录传统文化，版权归原作者所有
          </p>
        </div>
      </footer>
    </div>
  );
}
