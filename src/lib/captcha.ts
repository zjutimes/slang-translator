// 图形验证码工具
// 生成随机验证码并绘制到 Canvas 上

export interface CaptchaResult {
  text: string;      // 验证码文本
  dataUrl: string;    // 验证码图片的 Data URL
}

// 生成随机字符串
function generateText(length: number = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 生成随机颜色
function randomColor(min: number = 50, max: number = 150): string {
  const r = min + Math.floor(Math.random() * (max - min));
  const g = min + Math.floor(Math.random() * (max - min));
  const b = min + Math.floor(Math.random() * (max - min));
  return `rgb(${r},${g},${b})`;
}

// 绘制干扰线
function drawLines(ctx: CanvasRenderingContext2D, width: number, height: number, count: number = 4) {
  for (let i = 0; i < count; i++) {
    ctx.strokeStyle = randomColor(150, 220);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }
}

// 绘制干扰点
function drawDots(ctx: CanvasRenderingContext2D, width: number, height: number, count: number = 30) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = randomColor(100, 200);
    ctx.beginPath();
    ctx.arc(
      Math.random() * width,
      Math.random() * height,
      Math.random() * 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

// 生成验证码
export function generateCaptcha(width: number = 120, height: number = 40): CaptchaResult {
  const text = generateText(4);
  
  // 创建 Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('无法获取 Canvas 上下文');
  }
  
  // 绘制背景
  ctx.fillStyle = randomColor(220, 250);
  ctx.fillRect(0, 0, width, height);
  
  // 绘制干扰元素
  drawLines(ctx, width, height, 5);
  drawDots(ctx, width, height, 40);
  
  // 绘制文字
  ctx.font = 'bold 24px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const charWidth = width / (text.length + 1);
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = charWidth * (i + 0.8);
    const y = height / 2;
    
    // 随机旋转 (-30° 到 30°)
    const angle = (Math.random() - 0.5) * 0.6;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // 随机颜色
    ctx.fillStyle = randomColor(20, 80);
    ctx.fillText(char, 0, 0);
    
    ctx.restore();
  }
  
  return {
    text: text,
    dataUrl: canvas.toDataURL('image/png'),
  };
}

// 验证验证码
export function verifyCaptcha(input: string, target: string): boolean {
  if (!input || !target) return false;
  return input.toLowerCase() === target.toLowerCase();
}
