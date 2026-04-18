"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Check,
  Star,
  Quote,
  ChevronDown,
  Heart,
  MessageCircle,
  BookOpen,
  Play,
  Pause,
  Wand2,
  Image as ImageIcon,
  Layers,
  Timer,
  Award,
  Coffee,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CanvasAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#showcase" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Showcase</a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">Sign In</Button>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white gap-2 shadow-lg shadow-gray-900/20">
              <Wand2 className="w-4 h-4" />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Element 1: Unique Value Proposition */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-red-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8 border border-gray-100">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600">Now with AI-powered features</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create stunning
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                visuals instantly
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Transform your ideas into captivating visuals with the power of AI. 
              No design skills required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white text-lg px-8 h-14 gap-3 shadow-xl shadow-gray-900/20 w-full sm:w-auto">
                <Wand2 className="w-5 h-5" />
                Start Creating Free
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 w-full sm:w-auto border-2">
                Watch Demo
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Social proof mini */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["U", "S", "J", "M", "K"].map((initial, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <span>Join 50,000+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-1">4.9/5 from 2,000+ reviews</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden border border-gray-100">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gray-50 border-b border-gray-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="pt-12 p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: ImageIcon, label: "Image Generation" },
                    { icon: Layers, label: "Background Removal" },
                    { icon: Wand2, label: "AI Editing" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-amber-300 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <item.icon className="w-10 h-10 text-gray-400 group-hover:text-amber-500 transition-colors" />
                      <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Image Ready!</p>
                  <p className="text-xs text-gray-500">Generated in 3s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-12 px-6 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm text-gray-400 mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50">
            {["Shopify", "Notion", "Figma", "Linear", "Vercel", "Stripe"].map((brand) => (
              <span key={brand} className="text-xl font-bold text-gray-400">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Element 2: Pain Points */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-amber-600 mb-4 block">THE PROBLEM</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Design shouldn't be this hard
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Creating professional visuals takes hours. We're here to change that.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "😫",
                title: "Too time-consuming",
                desc: "Hours spent on Canva, Photoshop, or hiring designers for simple tasks"
              },
              {
                emoji: "💸",
                title: "Expensive tools",
                desc: "Adobe subscriptions, stock photos, and freelancer costs add up quickly"
              },
              {
                emoji: "😤",
                title: "Frustrating results",
                desc: "Generic templates and stock images make your brand look unoriginal"
              }
            ].map((pain, i) => (
              <Card key={i} className="bg-white border-red-100 border-2">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{pain.emoji}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pain.title}</h3>
                  <p className="text-gray-600">{pain.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Element 3: Solution */}
      <section className="py-24 px-6 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-medium text-amber-600 mb-4 block">THE SOLUTION</span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                AI-powered design,<br />at your fingertips
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Describe what you want, and our AI creates it in seconds. 
                No design skills needed. No expensive tools required.
              </p>
              
              <div className="space-y-4">
                {[
                  "Describe your vision in plain English",
                  "AI generates multiple variations instantly",
                  "Edit and refine with intuitive tools"
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <Button className="mt-8 bg-gray-900 hover:bg-gray-800 text-white gap-2">
                Try It Free <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl shadow-gray-900/10 overflow-hidden border border-gray-100">
                <div className="p-6">
                  {/* AI Prompt Input */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Describe your image</label>
                    <Textarea
                      placeholder="A cozy coffee shop with warm lighting, wooden furniture, and people chatting..."
                      className="bg-white border-none resize-none"
                      rows={3}
                    />
                  </div>
                  
                  {/* Generated Preview */}
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Sparkles className="w-8 h-8 text-amber-500" />
                      </div>
                      <p className="text-sm text-gray-600">AI is generating...</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Regenerate</Button>
                    <Button size="sm" className="flex-1 bg-gray-900 hover:bg-gray-800">Download</Button>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <Timer className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-900">3 seconds</p>
                    <p className="text-xs text-gray-500">Average generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Element 4: Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-amber-600 mb-4 block">FEATURES</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Powerful features designed to make your creative workflow seamless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Wand2, title: "AI Image Generation", desc: "Create stunning images from text descriptions" },
              { icon: ImageIcon, title: "Background Removal", desc: "One-click removal of any background" },
              { icon: Layers, title: "Smart Resize", desc: "Auto-adjust designs for any platform" },
              { icon: Users, title: "Team Collaboration", desc: "Work together in real-time" },
              { icon: Shield, title: "Commercial License", desc: "Use generated images freely" },
              { icon: Zap, title: "Lightning Fast", desc: "Generate images in seconds" },
            ].map((feature, i) => (
              <Card key={i} className="bg-white hover:shadow-lg transition-shadow border border-gray-100 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mb-4 group-hover:from-amber-500 group-hover:to-orange-500 transition-all">
                    <feature.icon className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Element 5: Social Proof */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-white to-amber-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-amber-600 mb-4 block">TESTIMONIALS</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by creators worldwide
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of happy creators
            </p>
          </div>

          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-900/5 p-8 md:p-12 border border-gray-100">
              <Quote className="w-12 h-12 text-amber-200 mb-6" />
              
              <div className="min-h-[120px]">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className={cn(
                      "transition-all duration-500",
                      i === activeTestimonial ? "opacity-100" : "opacity-0 absolute inset-0"
                    )}
                  >
                    <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-8">
                      "{t.content}"
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-amber-200">
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold">
                      {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === activeTestimonial ? "bg-amber-500 w-6" : "bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {[
              { number: "50K+", label: "Active Users" },
              { number: "1M+", label: "Images Created" },
              { number: "4.9", label: "Average Rating" },
              { number: "99%", label: "Satisfaction" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {stat.number}
                </p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Element 6: CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm mb-6">
                <Award className="w-4 h-4" />
                <span>No credit card required</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to create<br />something amazing?
              </h2>
              
              <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto">
                Start for free. Upgrade when you're ready. Cancel anytime.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-10 h-14 font-bold shadow-xl w-full sm:w-auto">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Start Creating Free
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Free 20 generations per month · No watermarks · Commercial use
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-16 px-6 bg-amber-50/50">
        <div className="max-w-2xl mx-auto text-center">
          <Coffee className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Get early access to new features
          </h3>
          <p className="text-gray-600 mb-6">
            Join our newsletter for exclusive updates and tips
          </p>
          <form className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button className="bg-gray-900 hover:bg-gray-800">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Element 7: FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-amber-600 mb-4 block">FAQ</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-gray-100">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CanvasAI</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>

            <p className="text-sm">
              © 2024 CanvasAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Data
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director at TechCorp",
    content: "CanvasAI has completely transformed our creative workflow. We used to spend hours on design tasks that now take minutes. It's genuinely magical."
  },
  {
    name: "Marcus Johnson",
    role: "Freelance Designer",
    content: "As a freelancer, this tool has helped me double my output without compromising quality. My clients are amazed at how fast I deliver."
  },
  {
    name: "Emily Rodriguez",
    role: "E-commerce Store Owner",
    content: "I create product images daily and CanvasAI has saved me hundreds of dollars on stock photos and designer fees. Highly recommended!"
  },
];

const faqs = [
  {
    q: "What can I create with CanvasAI?",
    a: "CanvasAI can generate images from text descriptions, remove backgrounds, resize designs for different platforms, and much more. Our AI is trained on millions of professional designs."
  },
  {
    q: "Can I use the images commercially?",
    a: "Yes! All images generated with CanvasAI come with a full commercial license. You can use them for your business, client work, or any commercial purpose."
  },
  {
    q: "Is there a free plan?",
    a: "Yes! We offer 20 free generations per month with no credit card required. You can upgrade anytime to access more generations and premium features."
  },
  {
    q: "How does the AI image generation work?",
    a: "Simply describe what you want in natural language, and our AI will generate multiple variations based on your description. You can then refine and edit the results."
  },
  {
    q: "What image formats are supported?",
    a: "We support all major formats including PNG, JPG, WebP, and SVG. Download in your preferred format and resolution."
  },
];
