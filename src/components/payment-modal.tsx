"use client";

import { useState, useEffect } from "react";
import { X, Check, Heart, Loader2, QrCode, Copy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PRESET_AMOUNTS } from "@/hooks/useDonation";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number, message: string) => void;
}

type PaymentStep = "select" | "pay" | "success";
type PaymentMethod = "wechat" | "alipay" | "qq" | null;

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>("select");
  const [amount, setAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep("select");
      setAmount(0);
      setCustomAmount("");
      setMessage("");
      setPaymentMethod(null);
    }
  }, [isOpen]);

  const handleSelectPreset = (value: number) => {
    setAmount(value);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(val)) {
      setCustomAmount(val);
      setAmount(parseFloat(val) || 0);
    }
  };

  const handleNext = () => {
    if (amount > 0) {
      setStep("pay");
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;
    
    setIsProcessing(true);
    // 模拟支付过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("success");
  };

  const handleSuccess = () => {
    onSuccess(amount, message);
    onClose();
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0078D4] to-[#005A9E] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white" />
            支持创作者
          </h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "select" && (
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择金额
                </label>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {PRESET_AMOUNTS.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => handleSelectPreset(item.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        amount === item.value
                          ? "border-[#0078D4] bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-lg font-bold text-[#323130]">¥{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
                  <Input
                    type="text"
                    placeholder="自定义金额"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  留言鼓励 (可选)
                </label>
                <Input
                  type="text"
                  placeholder="说点什么鼓励创作者..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* Total */}
              {amount > 0 && (
                <div className="text-center py-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm">支持金额</p>
                  <p className="text-3xl font-bold text-[#0078D4]">¥{amount.toFixed(2)}</p>
                </div>
              )}

              {/* Next Button */}
              <Button
                onClick={handleNext}
                disabled={amount <= 0}
                className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE] text-lg font-bold"
              >
                下一步
              </Button>
            </div>
          )}

          {step === "pay" && (
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="text-center py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <p className="text-gray-500 text-sm">支付金额</p>
                <p className="text-4xl font-bold text-[#0078D4]">¥{amount.toFixed(2)}</p>
                {message && (
                  <p className="text-gray-600 text-sm mt-2">"{message}"</p>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择支付方式
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod("wechat")}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                      paymentMethod === "wechat"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.406-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                        </svg>
                      </div>
                      <span className="font-medium">微信支付</span>
                    </div>
                    {paymentMethod === "wechat" && <Check className="w-5 h-5 text-green-500" />}
                  </button>

                  <button
                    onClick={() => setPaymentMethod("alipay")}
                    className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${
                      paymentMethod === "alipay"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        支
                      </div>
                      <span className="font-medium">支付宝</span>
                    </div>
                    {paymentMethod === "alipay" && <Check className="w-5 h-5 text-blue-500" />}
                  </button>
                </div>
              </div>

              {/* QR Code Placeholder */}
              {paymentMethod && (
                <div className="flex justify-center py-4">
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="p-8 text-center">
                      <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 text-sm">
                        {paymentMethod === "wechat" && "打开微信扫一扫"}
                        {paymentMethod === "alipay" && "打开支付宝扫一扫"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        模拟支付环境，请点击确认完成
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("select")}
                  className="flex-1 h-12"
                >
                  返回
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!paymentMethod || isProcessing}
                  className="flex-1 h-12 bg-[#0078D4] hover:bg-[#106EBE]"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      支付中...
                    </>
                  ) : (
                    <>确认支付 ¥{amount.toFixed(2)}</>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#323130] mb-2">感谢您的支持！</h3>
              <p className="text-gray-600 mb-6">
                您成功赞助了 <span className="font-bold text-[#0078D4]">¥{amount.toFixed(2)}</span>
              </p>
              {message && (
                <p className="text-gray-500 italic mb-6">"{message}"</p>
              )}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <Sparkles className="w-4 h-4 inline mr-1 text-amber-500" />
                  感谢您对创作者的支持与鼓励！
                </p>
              </div>
              <Button
                onClick={handleSuccess}
                className="w-full h-12 bg-[#0078D4] hover:bg-[#106EBE]"
              >
                完成
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
