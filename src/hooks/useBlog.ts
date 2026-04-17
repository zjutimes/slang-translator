"use client";

import { useState, useEffect, useCallback } from "react";

// 博客文章类型
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[]; // 存储用户ID列表
  views: number;
  tags: string[];
}

// 评论类型
export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// localStorage 键名
const POSTS_KEY = "user_blog_posts";
const COMMENTS_KEY = "user_blog_comments";

// 获取所有文章
function getPosts(): BlogPost[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存所有文章
function savePosts(posts: BlogPost[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// 获取所有评论
function getComments(): Comment[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(COMMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// 保存所有评论
function saveComments(comments: Comment[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    setPosts(getPosts());
    setComments(getComments());
    setIsLoading(false);
  }, []);

  // 创建文章
  const createPost = useCallback((
    title: string,
    content: string,
    author: string,
    authorId: string,
    tags: string[] = []
  ): BlogPost => {
    const excerpt = content.slice(0, 150) + (content.length > 150 ? "..." : "");
    const now = new Date().toISOString();
    
    const newPost: BlogPost = {
      id: generateId(),
      title,
      content,
      excerpt,
      author,
      authorId,
      createdAt: now,
      updatedAt: now,
      likes: 0,
      likedBy: [],
      views: 0,
      tags,
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
    
    return newPost;
  }, [posts]);

  // 更新文章
  const updatePost = useCallback((
    postId: string,
    title: string,
    content: string,
    tags: string[] = []
  ): void => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          title,
          content,
          excerpt: content.slice(0, 150) + (content.length > 150 ? "..." : ""),
          updatedAt: new Date().toISOString(),
          tags,
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  }, [posts]);

  // 删除文章
  const deletePost = useCallback((postId: string): void => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    const updatedComments = comments.filter(comment => comment.postId !== postId);
    
    setPosts(updatedPosts);
    setComments(updatedComments);
    savePosts(updatedPosts);
    saveComments(updatedComments);
  }, [posts, comments]);

  // 获取单篇文章
  const getPost = useCallback((postId: string): BlogPost | undefined => {
    return posts.find(post => post.id === postId);
  }, [posts]);

  // 增加浏览量
  const incrementViews = useCallback((postId: string): void => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, views: post.views + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  }, [posts]);

  // 点赞/取消点赞
  const toggleLike = useCallback((postId: string, userId: string): void => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likedBy = post.likedBy || [];
        const hasLiked = likedBy.includes(userId);
        
        if (hasLiked) {
          return {
            ...post,
            likes: post.likes - 1,
            likedBy: likedBy.filter(id => id !== userId),
          };
        } else {
          return {
            ...post,
            likes: post.likes + 1,
            likedBy: [...likedBy, userId],
          };
        }
      }
      return post;
    });
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  }, [posts]);

  // 添加评论
  const addComment = useCallback((
    postId: string,
    content: string,
    author: string,
    authorId: string
  ): Comment => {
    const newComment: Comment = {
      id: generateId(),
      postId,
      content,
      author,
      authorId,
      createdAt: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveComments(updatedComments);
    
    return newComment;
  }, [comments]);

  // 删除评论
  const deleteComment = useCallback((commentId: string): void => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    saveComments(updatedComments);
  }, [comments]);

  // 获取文章的评论
  const getPostComments = useCallback((postId: string): Comment[] => {
    return comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [comments]);

  // 获取用户的所有文章
  const getUserPosts = useCallback((authorId: string): BlogPost[] => {
    return posts
      .filter(post => post.authorId === authorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts]);

  return {
    posts: posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    isLoading,
    createPost,
    updatePost,
    deletePost,
    getPost,
    incrementViews,
    toggleLike,
    addComment,
    deleteComment,
    getPostComments,
    getUserPosts,
  };
}
