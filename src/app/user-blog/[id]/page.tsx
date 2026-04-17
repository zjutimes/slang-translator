"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Eye, User, Calendar, Trash2, Edit, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/hooks/useAuth";
import { useBlog, Comment } from "@/hooks/useBlog";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  
  const { user, isLoggedIn } = useAuth();
  const { getPost, toggleLike, incrementViews, getPostComments, addComment, deleteComment, deletePost } = useBlog();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState(getPost(postId));
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updatePost, setUpdatePost] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    setPost(getPost(postId));
    setComments(getPostComments(postId));
    incrementViews(postId);
  }, [postId]);

  // 监听 userBlog 更新
  useEffect(() => {
    const interval = setInterval(() => {
      const freshPost = getPost(postId);
      if (freshPost) {
        setPost(freshPost);
        setUpdatePost(() => freshPost);
      }
      setComments(getPostComments(postId));
    }, 500);
    return () => clearInterval(interval);
  }, [postId, getPost, getPostComments]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 计算相对时间
  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    return formatDate(dateStr);
  };

  // 处理点赞
  const handleLike = () => {
    if (!isLoggedIn || !user) {
      setIsLoginModalOpen(true);
      return;
    }
    toggleLike(postId, user.id);
  };

  // 提交评论
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) return;
    if (!isLoggedIn || !user) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      addComment(postId, commentContent.trim(), user.nickname, user.id);
      setCommentContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 删除评论
  const handleDeleteComment = (commentId: string) => {
    if (confirm("确定删除这条评论吗?")) {
      deleteComment(commentId);
    }
  };

  // 删除文章
  const handleDeletePost = () => {
    if (confirm("确定删除这篇文章吗? 此操作不可撤销!")) {
      deletePost(postId);
      router.push("/user-blog");
    }
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    const updatedPosts = post ? [{
      ...post,
      title: editTitle.trim(),
      content: editContent.trim(),
      excerpt: editContent.trim().slice(0, 150) + (editContent.trim().length > 150 ? "..." : ""),
      updatedAt: new Date().toISOString(),
    }] : [];
    
    // 保存到localStorage
    const allPosts = JSON.parse(localStorage.getItem("user_blog_posts") || "[]");
    const idx = allPosts.findIndex((p: any) => p.id === postId);
    if (idx !== -1) {
      allPosts[idx] = { ...allPosts[idx], title: editTitle.trim(), content: editContent.trim(), excerpt: editContent.trim().slice(0, 150) + (editContent.trim().length > 150 ? "..." : ""), updatedAt: new Date().toISOString() };
      localStorage.setItem("user_blog_posts", JSON.stringify(allPosts));
    }
    
    setPost(allPosts[idx]);
    setIsEditing(false);
  };

  // 开始编辑
  const startEdit = () => {
    if (post) {
      setEditTitle(post.title);
      setEditContent(post.content);
      setIsEditing(true);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">文章不存在</h1>
          <Link href="/user-blog">
            <Button className="bg-[#0078D4] hover:bg-[#106EBE] gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回博客列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = isLoggedIn && user && post.authorId === user.id;
  const hasLiked = user && post.likedBy?.includes(user.id);

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
          </div>
          <div className="flex items-center gap-2">
            {isAuthor && !isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEdit}
                  className="gap-2 text-[#0078D4]"
                >
                  <Edit className="w-4 h-4" />
                  编辑
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeletePost}
                  className="gap-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {isEditing ? (
          // 编辑模式
          <Card className="border border-gray-200">
            <CardContent className="p-6 space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-2xl font-bold"
                placeholder="标题"
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[400px]"
                placeholder="内容"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-[#0078D4] hover:bg-[#106EBE]"
                >
                  保存
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 阅读模式
          <article>
            {/* Article Header */}
            <header className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
              <h1 className="text-3xl font-bold text-[#323130] mb-4">{post.title}</h1>
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author}`} />
                    <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-[#323130]">{post.author}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getRelativeTime(post.createdAt)}
                      {post.updatedAt !== post.createdAt && (
                        <span className="text-gray-400">(已编辑)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views} 阅读
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {comments.length} 评论
                  </span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-[#0078D4] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                    {post.content}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Like Button */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  onClick={handleLike}
                  className={`gap-2 px-6 ${
                    hasLiked
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-[#0078D4] hover:bg-[#106EBE] text-white"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${hasLiked ? "fill-current" : ""}`} />
                  {post.likes} 点赞
                </Button>
                <p className="text-sm text-gray-500">
                  {hasLiked ? "你已点赞，感谢支持!" : "觉得有用就点个赞吧"}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-[#323130] mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  评论 ({comments.length})
                </h3>

                {/* Comment Input */}
                {isLoggedIn ? (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      评论 as <span className="font-medium">{user?.nickname}</span>
                    </p>
                    <Textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="写下你的评论..."
                      className="mb-2"
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSubmitComment}
                        disabled={!commentContent.trim() || isSubmitting}
                        className="bg-[#0078D4] hover:bg-[#106EBE] gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? "发送中..." : "发送"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-2">登录后参与评论</p>
                    <Button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="bg-[#0078D4] hover:bg-[#106EBE]"
                    >
                      登录
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                {comments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    暂无评论，来发表第一条评论吧
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`} />
                              <AvatarFallback>{comment.author.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#323130]">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {getRelativeTime(comment.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                          {isLoggedIn && user && (comment.authorId === user.id || post.authorId === user.id) && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </article>
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
