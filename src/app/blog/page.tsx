"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, BookOpen, Share2, Clock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoginModal from "@/components/login-modal";
import { useAuth } from "@/hooks/useAuth";

export default function BlogPage() {
  const [readTime] = useState("约 8 分钟");
  const { user, isLoggedIn, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const shareArticle = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "《江湖丛谈》：民国江湖的百科全书",
          text: "一本记录民国时期江湖行当、规矩、黑话的重要文献",
          url: window.location.href,
        });
      } catch (err) {
        console.log("分享取消");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-lg" />
              <span className="text-xl font-semibold text-[#323130]">黑话翻译器</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">翻译器</Link>
            <Link href="/dictionary" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">江湖词典</Link>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-[#0078D4] transition-colors">博客</Link>
            <Link href="/blog-landing" className="text-sm text-[#0078D4] font-medium">用户博客</Link>
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

      {/* Article */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link 
          href="/dictionary" 
          className="inline-flex items-center gap-2 text-[#0078D4] hover:text-[#106EBE] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回江湖词典
        </Link>

        {/* Article Header */}
        <article>
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                2024年12月
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                连丽如 整理
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-[#323130] mb-6 leading-tight">
              《江湖丛谈》：民国江湖的百科全书
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
                <BookOpen className="w-4 h-4 text-[#0078D4]" />
                <span className="text-sm font-medium text-[#0078D4]">书籍介绍</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={shareArticle}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="bg-gradient-to-br from-[#0078D4] to-[#106EBE] rounded-2xl p-12 mb-10 text-white text-center">
            <p className="text-2xl font-bold mb-2">《江湖丛谈》</p>
            <p className="text-lg opacity-80">云游客 / 著</p>
            <p className="text-sm opacity-60 mt-4">民国时期江湖文化的珍贵记录</p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* 书籍简介 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#323130] mb-4">一、书籍简介</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  《江湖丛谈》是我国现今仅存的一部客观而系统地记述晚清民国年间江湖行当、规矩、黑话及暗语的重要文献。作者<strong>连阔如</strong>以"云游客"为笔名，于1936年出版此书，后多次再版，是研究中国江湖文化不可或缺的珍贵资料。
                </p>
                <p>
                  此书原由北平时言报社出版，共三集。后经中国曲艺出版社重排汇为一册出版。全书内容丰富，涵盖了江湖八大门：金门（算卦）、皮门（卖药）、彩门（变戏法）、挂门（打把势卖艺）、平门（说评书）、团门（说相声）、调门（唱大鼓等曲艺）、柳门（唱戏）。
                </p>
              </div>
            </section>

            {/* 作者简介 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#323130] mb-4">二、作者其人</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  <strong>连阔如</strong>（1903-1971），原名华璧工，后改名连阔如，是我国著名的评书艺术家。他技艺精湛，说书时嗓音洪亮，善于描摹人物，在北京听众多有"千家万户听评书，净街净巷连阔如"的赞誉。
                </p>
                <p>
                  连阔如先生不仅是一位杰出的评书艺人，更是一位有心人。他利用自己走南闯北、接触各色人等的机会，系统地记录和整理了江湖行当的规矩、黑话和文化，为后人留下了宝贵的第一手资料。
                </p>
                <Card className="border-l-4 border-l-[#0078D4] bg-blue-50/50">
                  <CardContent className="p-6">
                    <p className="text-gray-700 italic">
                      "连阔如先生以一位评书艺人的身份，写出这样一本可读性极强、内容极其丰富的奇书，我们好好地读一读。"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">—— 整理者序</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 核心内容 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#323130] mb-4">三、核心内容</h2>
              
              <div className="space-y-6">
                {/* 春点 */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#0078D4] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0078D4] text-white rounded-full flex items-center justify-center text-sm">1</span>
                    江湖春点（黑话暗语）
                  </h3>
                  <p className="text-gray-700">
                    书中系统记录了江湖人使用的暗语"春点"，包括人物称谓（金扶柳=驴）、日常动作（安根=吃饭）、物品名称（塌笼=房子）、身体部位（柴=牙齿）等。这些暗语是江湖人用来交流、辨别身份、保护行内秘密的重要工具。
                  </p>
                </div>

                {/* 八大门 */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#0078D4] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0078D4] text-white rounded-full flex items-center justify-center text-sm">2</span>
                    江湖八大门
                  </h3>
                  <p className="text-gray-700 mb-3">
                    书中详细介绍了江湖八大门：
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: "金门", desc: "算卦" },
                      { name: "皮门", desc: "卖药" },
                      { name: "彩门", desc: "变戏法" },
                      { name: "挂门", desc: "打把势卖艺" },
                      { name: "平门", desc: "说评书" },
                      { name: "团门", desc: "说相声" },
                      { name: "调门", desc: "唱大鼓曲艺" },
                      { name: "柳门", desc: "唱戏" },
                    ].map((item) => (
                      <div key={item.name} className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="font-medium text-[#0078D4]">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 江湖规矩 */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#0078D4] mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#0078D4] text-white rounded-full flex items-center justify-center text-sm">3</span>
                    江湖规矩与内幕
                  </h3>
                  <p className="text-gray-700">
                    书中还揭露了许多江湖行当的内幕和规矩，如各门行的收徒制度、经营手法、师承关系等。这些内容对于了解民国时期底层社会的运作方式具有重要的史料价值。
                  </p>
                </div>
              </div>
            </section>

            {/* 书籍价值 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#323130] mb-4">四、历史价值</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  《江湖丛谈》的价值不仅在于记录了大量的江湖术语，更在于它以<strong>第一人称视角</strong>真实地展现了民国时期江湖艺人的生存状态和行业生态。
                </p>
                <Card className="border border-amber-200 bg-amber-50/50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-amber-800 mb-3">独特的视角</h4>
                    <p className="text-gray-700">
                      连阔如先生既是江湖中人，又是文人，他的记录既真实又深刻。他既记录了江湖行业的"门道"，也揭露了一些江湖骗术，是研究中国民间文化、社会史、民俗学的重要参考文献。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* 今日意义 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-[#323130] mb-4">五、今日意义</h2>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  虽然《江湖丛谈》写于近百年前，但其中的江湖智慧和处世哲学至今仍有借鉴意义：
                </p>
                <ul className="space-y-3">
                  {[
                    "理解传统曲艺文化的深厚底蕴",
                    "了解民间社会的运作规则",
                    "感受传统语言的生动与幽默",
                    "为现代文艺创作提供素材灵感",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-[#0078D4] text-white rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 结尾 */}
            <section className="mb-12">
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <p className="text-lg mb-4 opacity-90">
                    如果你对民国时期的江湖文化感兴趣，不妨读一读这本《江湖丛谈》，感受那个时代江湖艺人的智慧与风采。
                  </p>
                  <Link href="/dictionary">
                    <Button className="bg-white text-[#0078D4] hover:bg-gray-100 font-semibold">
                      探索江湖黑话词典
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </section>
          </div>
        </article>

        {/* Related Links */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-[#323130] mb-4">相关阅读</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/dictionary"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-[#0078D4] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-[#0078D4]" />
                <span className="font-medium text-[#323130] group-hover:text-[#0078D4]">江湖黑话词典</span>
              </div>
              <p className="text-sm text-gray-600">
                在线查询书中记录的130+条江湖春点
              </p>
            </Link>
            <Link 
              href="/"
              className="p-6 bg-white rounded-xl border border-gray-200 hover:border-[#0078D4] hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-[#0078D4]" />
                <span className="font-medium text-[#323130] group-hover:text-[#0078D4]">黑话翻译器</span>
              </div>
              <p className="text-sm text-gray-600">
                把现代职场黑话翻译成大白话
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => setIsLoginModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#323130] text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            内容整理自《江湖丛谈》连阔如著 | 贾建国、连丽如整理
          </p>
        </div>
      </footer>
    </div>
  );
}
