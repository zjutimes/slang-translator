import { NextRequest, NextResponse } from "next/server";

// 邮件发送配置
// 生产环境请替换为真实邮件服务（如 SendGrid、Mailgun、Resend 等）
const EMAIL_CONFIG = {
  // 示例：使用 Resend API
  // apiKey: process.env.RESEND_API_KEY,
  // from: '言说博客 <noreply@yanshuo.com>',
  
  // 示例：使用 SendGrid
  // apiKey: process.env.SENDGRID_API_KEY,
  
  // 当前为演示模式
  isDemo: true,
};

// 预设邮件模板
const EMAIL_TEMPLATES = {
  welcome: {
    subject: "欢迎订阅言说博客！",
    content: (name: string) => `亲爱的${name || "读者"}：

欢迎加入言说博客！

在这里，你可以：
📝 记录你的故事
💡 分享你的想法
❤️ 与读者互动

我们每周都会为你推送精选内容，敬请期待！

---
言说博客团队`,
  },
  weekly: {
    subject: "本周精选 | 这些文章值得一读",
    content: (_name?: string) => `亲爱的读者：

本周我们为你精选了以下内容：

📖 热门文章推荐
• 如何写出高质量的技术博客
• 创作的十大黄金法则
• 从零开始搭建个人博客

💡 创作技巧
分享一些实用的写作技巧，帮助你提升内容质量。

🎁 限时活动
本周注册的用户将获得专属礼品，快来参与吧！

---
言说博客 · 让创作更简单`,
  },
  monthly: {
    subject: "月度回顾 | 这一个月我们一起成长",
    content: (_name?: string) => `亲爱的言说用户：

感谢您一个月的陪伴！

📊 本月数据
• 新增文章：128篇
• 活跃用户：5,000+
• 总阅读量：100,000+

🌟 精选内容
本月最受欢迎的5篇文章，带你回顾精彩瞬间。

🔮 下月预告
• 新功能上线
• 创作者激励计划
• 更多精彩活动

感谢您的支持与信任！

---
言说博客团队`,
  },
};

// 模拟发送邮件
async function sendEmailDemo(to: string, subject: string, content: string) {
  console.log(`[Email Demo] 发送邮件到: ${to}`);
  console.log(`[Email Demo] 主题: ${subject}`);
  console.log(`[Email Demo] 内容预览: ${content.slice(0, 100)}...`);
  
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return { success: true, messageId: `demo_${Date.now()}` };
}

// 真实邮件发送函数（需要配置邮件服务）
async function sendEmail(to: string, subject: string, content: string) {
  if (EMAIL_CONFIG.isDemo) {
    return sendEmailDemo(to, subject, content);
  }

  // 使用 Resend 发送邮件
  // const resend = new Resend(EMAIL_CONFIG.apiKey);
  // const { data, error } = await resend.emails.send({
  //   from: EMAIL_CONFIG.from,
  //   to,
  //   subject,
  //   text: content,
  // });
  // if (error) throw error;
  // return { success: true, messageId: data?.id };

  // 使用 SendGrid 发送邮件
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(EMAIL_CONFIG.apiKey);
  // const msg = {
  //   to,
  //   from: EMAIL_CONFIG.from,
  //   subject,
  //   text: content,
  // };
  // await sgMail.send(msg);

  throw new Error("请配置邮件服务");
}

// POST: 订阅邮箱
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, action } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "请提供邮箱地址" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "邮箱格式无效" },
        { status: 400 }
      );
    }

    if (action === "subscribe") {
      // 发送欢迎邮件
      const template = EMAIL_TEMPLATES.welcome;
      await sendEmail(email, template.subject, template.content("订阅者"));

      return NextResponse.json({
        success: true,
        message: "订阅成功！欢迎邮件已发送到您的邮箱",
      });
    }

    if (action === "unsubscribe") {
      return NextResponse.json({
        success: true,
        message: "已取消订阅",
      });
    }

    return NextResponse.json(
      { success: false, message: "未知操作" },
      { status: 400 }
    );
  } catch (error) {
    console.error("邮件订阅错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}

// GET: 发送群发邮件（需要管理员密钥）
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const adminKey = process.env.ADMIN_SECRET_KEY || "demo_admin_key";
    
    // 简单的认证检查
    if (authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { success: false, message: "未授权" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const templateType = searchParams.get("template") || "weekly";

    const template = EMAIL_TEMPLATES[templateType as keyof typeof EMAIL_TEMPLATES];
    if (!template) {
      return NextResponse.json(
        { success: false, message: "未知的邮件模板" },
        { status: 400 }
      );
    }

    // 从 localStorage 获取订阅者（仅演示用）
    // 生产环境应从数据库读取
    const subscribers = JSON.parse(
      request.cookies.get("subscribers")?.value || "[]"
    );

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // 模拟发送
    for (const subscriber of subscribers) {
      try {
        if (subscriber.isActive) {
          await sendEmail(subscriber.email, template.subject, template.content(subscriber.email.split('@')[0]));
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(subscriber.email);
      }
    }

    return NextResponse.json({
      success: true,
      message: `邮件发送完成：成功 ${results.success} 封，失败 ${results.failed} 封`,
      results,
    });
  } catch (error) {
    console.error("群发邮件错误:", error);
    return NextResponse.json(
      { success: false, message: "服务器错误" },
      { status: 500 }
    );
  }
}
