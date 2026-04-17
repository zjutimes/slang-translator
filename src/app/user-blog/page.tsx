"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Heart, MessageCircle, Eye, User, LogOut, BookOpen, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/hooks/useAuth";
import { useBlog } from "@/hooks/useBlog";

export default function UserBlogPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const { posts, isLoading } = useBlog();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 过滤文章
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-xl font-semibold text-[#323130]">黑话翻译器</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">翻译器</Link>
            <Link href="/dictionary" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">江湖词典</Link>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">博客</Link>
            <Link href="/blog-landing" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">用户博客</Link>
            <Link href="/user-blog" className="text-sm text-[#0078D4] font-medium">我的博客</Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {user?.nickname}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-1 text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                  退出
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-[#0078D4] hover:bg-[#106EBE] text-white"
                onClick={() => setIsLoginModalOpen(true)}
              >
                登录
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0078D4] via-[#106EBE] to-[#005A9E] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">用户博客</h1>
              <p className="text-white/80">分享你的想法，记录你的故事</p>
            </div>
            {isLoggedIn ? (
              <Link href="/user-blog/write">
                <Button className="bg-white text-[#0078D4] hover:bg-gray-100 gap-2">
                  <Plus className="w-4 h-4" />
                  写博客
                </Button>
              </Link>
            ) : (
              <Button 
                className="bg-white text-[#0078D4] hover:bg-gray-100"
                onClick={() => setIsLoginModalOpen(true)}
              >
                登录后写博客
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="搜索博客..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Blog List */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : filteredPosts.length === 0 ? (
          <Card className="border-2 border-gray-200">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                {searchQuery ? "没有找到相关博客" : "还没有博客，开始创作第一篇吧！"}
              </p>
              {isLoggedIn && !searchQuery && (
                <Link href="/user-blog/write">
                  <Button className="bg-[#0078D4] hover:bg-[#106EBE] gap-2">
                    <Plus className="w-4 h-4" />
                    写博客
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/user-blog/${post.id}`}>
                <Card className="border border-gray-200 hover:border-[#0078D4] hover:shadow-lg transition-all h-full cursor-pointer group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <h2 className="text-xl font-bold text-[#323130] mb-3 group-hover:text-[#0078D4] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-blue-50 text-[#0078D4] rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {post.tags?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
      <footer className="bg-[#323130] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            用户博客 - 记录生活，分享想法
          </p>
        </div>
      </footer>
    </div>
  );
}
