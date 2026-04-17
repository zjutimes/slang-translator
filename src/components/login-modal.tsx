"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCaptcha, verifyCaptcha } from "@/lib/captcha";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { nickname: string; loginTime: string }) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState<{ text: string; dataUrl: string }>({ text: "", dataUrl: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const captchaRef = useRef<HTMLImageElement>(null);

  // 刷新验证码
  const refreshCaptcha = useCallback(() => {
    const newCaptcha = generateCaptcha(120, 40);
    setCaptcha(newCaptcha);
    setCaptchaInput("");
  }, []);

  // 初始化验证码
  useEffect(() => {
    if (isOpen) {
      refreshCaptcha();
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen, refreshCaptcha]);

  // 表单验证
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nickname.trim()) {
      newErrors.nickname = "请输入用户名";
    } else if (nickname.length < 2) {
      newErrors.nickname = "用户名至少2个字符";
    } else if (nickname.length > 20) {
      newErrors.nickname = "用户名最多20个字符";
    }

    if (!password) {
      newErrors.password = "请输入密码";
    } else if (password.length < 6) {
      newErrors.password = "密码至少6个字符";
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "两次密码不一致";
      }
    }

    if (!captchaInput) {
      newErrors.captcha = "请输入验证码";
    } else if (!verifyCaptcha(captchaInput, captcha.text)) {
      newErrors.captcha = "验证码错误";
      refreshCaptcha();
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    // 模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 简单验证通过
    const user = {
      nickname: nickname.trim(),
      loginTime: new Date().toISOString(),
    };

    // 保存到 localStorage
    localStorage.setItem("user", JSON.stringify(user));

    setIsLoading(false);
    setIsSuccess(true);

    setTimeout(() => {
      onLoginSuccess(user);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">登录成功</h2>
            <p className="text-gray-600">欢迎回来，{nickname}！</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0078D4] to-[#106EBE] p-6 text-white">
              <h2 className="text-2xl font-bold">
                {mode === "login" ? "欢迎登录" : "注册账号"}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {mode === "login" 
                  ? "登录后享受更多功能" 
                  : "创建账号，开始使用"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={mode === "login" ? "请输入用户名" : "设置用户名"}
                    className={`pl-10 ${errors.nickname ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.nickname && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nickname}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "login" ? "请输入密码" : "设置密码"}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password (Register only) */}
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    确认密码
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="再次输入密码"
                      className={`pl-10 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Captcha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  验证码
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                      placeholder="请输入验证码"
                      maxLength={4}
                      className={`${errors.captcha ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="flex-shrink-0"
                    disabled={isLoading}
                  >
                    {captcha.dataUrl ? (
                      <img
                        ref={captchaRef}
                        src={captcha.dataUrl}
                        alt="验证码"
                        className="h-10 w-28 rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="h-10 w-28 bg-gray-200 rounded-md flex items-center justify-center">
                        加载中...
                      </div>
                    )}
                  </button>
                </div>
                {errors.captcha && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.captcha}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white h-11"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    处理中...
                  </span>
                ) : mode === "login" ? (
                  "登录"
                ) : (
                  "注册"
                )}
              </Button>

              {/* Toggle Mode */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === "login" ? "register" : "login");
                    setErrors({});
                    refreshCaptcha();
                  }}
                  className="text-sm text-[#0078D4] hover:text-[#106EBE] transition-colors"
                >
                  {mode === "login" ? "还没有账号？立即注册" : "已有账号？立即登录"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
