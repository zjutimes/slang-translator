"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/hooks/useAuth";
import { useBlog } from "@/hooks/useBlog";

export default function WriteBlogPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { createPost } = useBlog();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 权限检查
  useEffect(() => {
    if (mounted && !isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, [mounted, isLoggedIn]);

  // 添加标签
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  // 移除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // 提交博客
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("请输入标题");
      return;
    }
    if (!content.trim()) {
      alert("请输入内容");
      return;
    }
    if (!isLoggedIn || !user) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const newPost = createPost(
        title.trim(),
        content.trim(),
        user.nickname,
        user.id,
        tags
      );
      router.push(`/user-blog/${newPost.id}`);
    } catch (error) {
      console.error("创建博客失败:", error);
      alert("创建失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/user-blog">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#323130]">写博客</h1>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="bg-[#0078D4] hover:bg-[#106EBE] text-white gap-2"
          >
            {isSubmitting ? (
              "发布中..."
            ) : (
              <>
                <Send className="w-4 h-4" />
                发布
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Editor */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <Card className="border border-gray-200">
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div>
              <Input
                type="text"
                placeholder="标题"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-gray-300"
              />
            </div>

            {/* Author info */}
            {isLoggedIn && user && (
              <div className="flex items-center gap-2 text-sm text-gray-500 pb-4 border-b border-gray-100">
                <span>作者: {user.nickname}</span>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">标签 (最多5个)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="输入标签后按回车添加"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={tags.length >= 5}
                  className="max-w-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={tags.length >= 5 || !tagInput.trim()}
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#0078D4]/10 text-[#0078D4] rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-[#005A9E]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <Textarea
                placeholder="写点什么..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] border-none shadow-none px-0 resize-none focus-visible:ring-0 text-base leading-relaxed placeholder:text-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <div className="mt-6 text-sm text-gray-500">
          <p>提示: 使用 Markdown 可以让你的文章更加美观</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>## 标题  创建二级标题</li>
            <li>**粗体**  创建粗体文字</li>
            <li>*斜体*  创建斜体文字</li>
            <li>- 列表项  创建无序列表</li>
          </ul>
        </div>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (!isLoggedIn) {
            router.push("/user-blog");
          }
        }}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
