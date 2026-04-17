"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PenTool, 
  Heart, 
  MessageCircle, 
  Eye, 
  Users, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  Check,
  Star,
  BookOpen,
  Quote,
  ChevronDown,
  Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoginModal from "@/components/login-modal";
import PaymentModal from "@/components/payment-modal";
import CustomerServiceWidget from "@/components/customer-service-widget";
import { useAuth } from "@/hooks/useAuth";
import { useDonation } from "@/hooks/useDonation";

export default function BlogLandingPage() {
  const { isLoggedIn } = useAuth();
  const { donations, totalAmount, addDonation } = useDonation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-[#323130]">黑话翻译器</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="/blog-landing#features" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">功能</a>
              <a href="/blog-landing#testimonials" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">用户评价</a>
              <a href="/blog-landing#faq" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">常见问题</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/user-blog" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">
              浏览博客
            </Link>
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Heart className="w-4 h-4" />
              支持作者
            </button>
            {isLoggedIn ? (
              <Link href="/user-blog/write">
                <Button className="bg-[#0078D4] hover:bg-[#106EBE] gap-2">
                  <PenTool className="w-4 h-4" />
                  开始写作
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#0078D4] hover:bg-[#106EBE] gap-2"
              >
                <PenTool className="w-4 h-4" />
                开始写作
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - 要素1: 独特的价值主张 */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-[#0078D4] text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              创作从未如此简单
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#323130] mb-6 leading-tight">
              记录你的故事
              <br />
              <span className="text-[#0078D4]">分享你的思想</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              言说是一个专注于内容创作的博客平台。在这里，你可以自由表达观点，
              与读者建立深度连接，让你的文字产生价值。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/user-blog/write">
                <Button size="lg" className="bg-[#0078D4] hover:bg-[#106EBE] text-lg px-10 gap-2 h-14 font-bold">
                  <Zap className="w-5 h-5" />
                  立即试用
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-lg px-10 h-14">
                  了解更多
                </Button>
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">无需注册，点击即可体验 · 完全免费</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "注册用户" },
              { number: "50,000+", label: "发布文章" },
              { number: "1,000,000+", label: "累计阅读" },
              { number: "98%", label: "用户满意度" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-[#0078D4] mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points - 要素2: 痛点 */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">创作路上的绊脚石</h2>
            <p className="text-gray-600 text-lg">你是否也曾被这些问题困扰？</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "😤",
                title: "表达受限",
                description: "在社交平台发布，总被算法和字数限制束缚，无法完整表达思想"
              },
              {
                icon: "😞",
                title: "缺乏反馈",
                description: "写完文章石沉大海，没有评论互动，不知道读者是否喜欢"
              },
              {
                icon: "😓",
                title: "门槛太高",
                description: "传统博客需要技术背景，搭建网站、买域名让很多人望而却步"
              },
            ].map((pain, i) => (
              <Card key={i} className="border-2 border-red-100 bg-red-50/50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{pain.icon}</div>
                  <h3 className="text-xl font-bold text-[#323130] mb-2">{pain.title}</h3>
                  <p className="text-gray-600">{pain.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution - 要素3: 解决方案 */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">言说，让创作回归本质</h2>
            <p className="text-gray-600 text-lg">我们解决了所有创作痛点</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/hero-bg.png" 
                alt="写作界面预览"
                className="rounded-2xl shadow-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="space-y-6">
              {[
                { title: "无限制创作", description: "没有字数限制，没有内容审核，让你的思想自由飞翔" },
                { title: "即时互动反馈", description: "每篇文章都能获得点赞和评论，与读者实时交流" },
                { title: "零门槛上手", description: "打开即写，无需任何配置，让创作变得前所未有的简单" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-[#0078D4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#323130] mb-1">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - 要素4: 功能特点 */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">为创作者精心打造</h2>
            <p className="text-gray-600 text-lg">每一个功能都服务于更好的创作体验</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: PenTool,
                title: "沉浸式写作",
                description: "简洁干净的编辑器，让你专注于内容本身，灵感不被干扰",
                color: "bg-blue-500"
              },
              {
                icon: Heart,
                title: "真诚互动",
                description: "点赞和评论让创作者获得即时反馈，知道读者在想什么",
                color: "bg-red-500"
              },
              {
                icon: Eye,
                title: "阅读统计",
                description: "了解文章的阅读量，数据告诉你哪些内容更受欢迎",
                color: "bg-purple-500"
              },
              {
                icon: Shield,
                title: "隐私保护",
                description: "本地存储确保你的数据安全，只有你掌控自己的内容",
                color: "bg-green-500"
              },
              {
                icon: Zap,
                title: "秒级响应",
                description: "极致的加载速度，阅读和写作都是流畅体验",
                color: "bg-amber-500"
              },
              {
                icon: Users,
                title: "温暖社区",
                description: "在这里遇见志同道合的读者和创作者，互相启发成长",
                color: "bg-cyan-500"
              },
            ].map((feature, i) => (
              <Card key={i} className="border border-gray-100 hover:border-[#0078D4] hover:shadow-lg transition-all group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#323130] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">三步开启创作之旅</h2>
            <p className="text-gray-600 text-lg">简单到难以置信</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "注册账号", description: "填写用户名和密码，30秒完成注册" },
              { step: "02", title: "开始写作", description: "点击写博客，用文字记录你的想法" },
              { step: "03", title: "发布分享", description: "一键发布，让更多人看到你的文章" },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 bg-[#0078D4] rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl font-bold text-white">
                  {item.step}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-[#0078D4]/20" />
                )}
                <h3 className="text-xl font-bold text-[#323130] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/user-blog/write">
              <Button size="lg" className="bg-[#0078D4] hover:bg-[#106EBE] text-lg px-8 gap-2 h-14">
                <PenTool className="w-5 h-5" />
                立即开始写作
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - 要素5: 社会证明 */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">创作者们怎么说</h2>
            <p className="text-gray-600 text-lg">来自真实用户的反馈</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "李明",
                role: "产品经理",
                avatar: "LM",
                content: "终于有一个可以自由表达观点的地方了！之前在公众号写文章，总是被各种限制，在这里我可以畅所欲言。",
                rating: 5
              },
              {
                name: "王芳",
                role: "独立撰稿人",
                avatar: "WF",
                content: "编辑器非常简洁，写作体验一流。读者反馈也很及时，让我知道哪些文章真正打动了人心。",
                rating: 5
              },
              {
                name: "张伟",
                role: "技术博主",
                avatar: "ZW",
                content: "零门槛是我最喜欢的点。不用折腾服务器和域名，专注于内容本身，这才是创作者应该有的状态。",
                rating: 5
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#0078D4]/20 mb-4" />
                  <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0078D4] to-[#005A9E] rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-[#323130]">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - 要素6: 行动召唤 */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#0078D4] via-[#106EBE] to-[#005A9E]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            准备好开始你的创作之旅了吗？
          </h2>
          <p className="text-xl text-white/80 mb-10">
            加入 thousands of 创作者，在这里找到你的读者
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/user-blog/write">
              <Button size="lg" className="bg-white text-[#0078D4] hover:bg-gray-100 text-lg px-10 gap-2 h-14">
                <PenTool className="w-5 h-5" />
                开始免费创作
              </Button>
            </Link>
            <Link href="/user-blog">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 text-lg px-10 h-14">
                <BookOpen className="w-5 h-5" />
                浏览文章
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setIsPaymentModalOpen(true)}
              className="text-white border-white hover:bg-white/10 text-lg px-10 h-14 bg-transparent"
            >
              <Heart className="w-5 h-5" />
              支持作者
            </Button>
          </div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 text-sm mb-4">
              <Coffee className="w-4 h-4" />
              请作者喝杯咖啡
            </div>
            <h2 className="text-3xl font-bold text-[#323130] mb-4">用户赞助</h2>
            <p className="text-gray-600">
              感谢 <span className="font-bold text-2xl text-amber-600">¥{totalAmount.toFixed(2)}</span> 元支持
            </p>
          </div>
          
          {/* Top Supporters */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {donations.slice(0, 3).map((donation, i) => (
              <Card key={donation.id} className={`border-amber-200 ${
                i === 0 ? "bg-gradient-to-br from-amber-50 to-yellow-50" : ""
              }`}>
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
                    i === 0 ? "bg-amber-400 text-white" : 
                    i === 1 ? "bg-gray-300 text-white" : 
                    i === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : ""}
                  </div>
                  <p className="font-bold text-[#323130]">{donation.donor}</p>
                  <span className="text-2xl font-bold text-amber-600">
                    ¥{donation.amount.toFixed(2)}
                  </span>
                  {donation.message && (
                    <p className="text-sm text-gray-500 mt-2 italic">"{donation.message}"</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support Button */}
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-12 gap-2 h-14 shadow-lg"
            >
              <Heart className="w-5 h-5" />
              请作者喝咖啡 ☕
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ - 要素7: 常见问题 */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#323130] mb-4">常见问题</h2>
            <p className="text-gray-600 text-lg">还有其他问题？联系我们</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "言说是免费的吗？",
                a: "是的，言说完全免费使用。我们相信每个人都应该有机会自由表达。"
              },
              {
                q: "我的文章和数据安全吗？",
                a: "文章存储在浏览器本地存储中，数据完全由你掌控。我们不会收集或存储你的内容。"
              },
              {
                q: "需要编写代码或搭建网站吗？",
                a: "完全不需要。言说提供完整的在线写作和发布体验，就像使用在线文档一样简单。"
              },
              {
                q: "可以删除我发布的文章吗？",
                a: "当然可以。作为作者，你可以随时编辑或删除自己发布的文章。"
              },
              {
                q: "支持什么样的内容创作？",
                a: "言说支持各种类型的内容创作，包括但不限于技术博客、生活感悟、读书笔记、旅行见闻等。"
              },
            ].map((faq, i) => (
              <Card key={i} className="border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <ChevronDown className="w-6 h-6 text-[#0078D4] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-[#323130] mb-2">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold text-[#323130]">黑话翻译器</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#0078D4]">翻译器</Link>
              <Link href="/dictionary" className="hover:text-[#0078D4]">江湖词典</Link>
              <Link href="/blog" className="hover:text-[#0078D4]">博客</Link>
              <Link href="/blog-landing" className="hover:text-[#0078D4]">用户博客</Link>
              <Link href="/user-blog" className="hover:text-[#0078D4]">我的博客</Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 黑话翻译器 · 让创作更简单
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          window.location.href = "/user-blog/write";
        }}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={(amount, message) => {
          addDonation(amount, message, "匿名用户");
        }}
      />

      {/* Customer Service Widget */}
      <CustomerServiceWidget />
    </div>
  );
}
