import { ImageGenerationClient, Config } from 'coze-coding-dev-sdk';
import fs from 'fs';
import path from 'path';

const config = new Config();
const client = new ImageGenerationClient(config);
const outputDir = '/workspace/projects/public';

async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filepath, Buffer.from(buffer));
}

async function generateAndSave(prompt: string, filename: string, size: string = '2K') {
  console.log(`Generating: ${filename}`);
  try {
    const response = await client.generate({
      prompt,
      size,
      watermark: false,
    });

    const helper = client.getResponseHelper(response);
    
    if (helper.success && helper.imageUrls.length > 0) {
      const imageUrl = helper.imageUrls[0];
      console.log(`  URL: ${imageUrl}`);
      
      const filePath = path.join(outputDir, filename);
      await downloadImage(imageUrl, filePath);
      console.log(`  Saved: ${filePath}`);
      return filePath;
    } else {
      console.error(`  Failed: ${helper.errorMessages.join(', ')}`);
    }
  } catch (error) {
    console.error(`  Error: ${error}`);
  }
  return null;
}

async function main() {
  console.log('Starting image generation...\n');

  // 1. Logo - 简洁现代的产品Logo
  await generateAndSave(
    'A modern minimalist app logo icon for a Chinese workplace slang translator app. Clean flat design, Microsoft Fluent Design style. Blue color scheme (#0078D4). A speech bubble with Chinese text inside, simple geometric shapes, no text, professional corporate look, white background, square format, app icon style',
    'logo.png',
    '1K'
  );

  // 2. 功能示意1 - 人话翻译效果
  await generateAndSave(
    'An illustration showing a translation concept: confusing corporate buzzwords on the left transforming into clear simple sentences on the right. Microsoft Fluent Design style, soft blue tones, clean geometric shapes representing text blocks, professional infographic style, white background',
    'feature-translation.png',
    '2K'
  );

  // 3. 功能示意2 - 回复模板功能
  await generateAndSave(
    'A mockup of a chat reply template interface showing three different response styles. Three speech bubbles in different colors (green for polite, blue for firm, orange for witty). Clean UI design, Microsoft style icons, subtle shadows, light background',
    'feature-templates.png',
    '2K'
  );

  // 4. 功能示意3 - 知识卡片
  await generateAndSave(
    'An illustration of knowledge cards or educational content cards floating elegantly. Each card contains a simple icon and text placeholder. Microsoft Design language, rounded corners, soft shadows, blue and teal color palette, clean minimalist style',
    'feature-knowledge.png',
    '2K'
  );

  // 5. 背景装饰图
  await generateAndSave(
    'Abstract geometric background pattern for a tech product website header. Subtle blue gradient with abstract wave shapes, soft blur effect, Microsoft Fluent Design inspiration, professional and clean, light blue tones',
    'hero-bg.png',
    '2K'
  );

  // 6. 功能特性图标1 - 快速翻译
  await generateAndSave(
    'A clean flat icon representing instant translation: a lightning bolt combined with a speech bubble. Simple geometric shapes, Microsoft Fluent icon style, single color blue (#0078D4), transparent background, modern minimal design',
    'icon-fast.png',
    '1K'
  );

  // 7. 功能特性图标2 - 智能解析
  await generateAndSave(
    'A clean flat icon representing smart analysis: a lightbulb with gears inside. Simple geometric shapes, Microsoft Fluent icon style, single color blue (#0078D4), transparent background, modern minimal design',
    'icon-smart.png',
    '1K'
  );

  // 8. 功能特性图标3 - 回复模板
  await generateAndSave(
    'A clean flat icon representing reply templates: three chat bubbles arranged in a fan pattern. Simple geometric shapes, Microsoft Fluent icon style, single color blue (#0078D4), transparent background, modern minimal design',
    'icon-reply.png',
    '1K'
  );

  // 9. 功能特性图标4 - 知识讲解
  await generateAndSave(
    'A clean flat icon representing learning: an open book with a lightbulb on top. Simple geometric shapes, Microsoft Fluent icon style, single color blue (#0078D4), transparent background, modern minimal design',
    'icon-learn.png',
    '1K'
  );

  // 10. 示例截图示意
  await generateAndSave(
    'A clean web application mockup screenshot showing a translator tool interface. Left panel has input text, right panel shows structured output with sections. Microsoft Office-style clean UI, light gray and white color scheme, professional business software look',
    'demo-screenshot.png',
    '2K'
  );

  console.log('\nImage generation complete!');
}

main().catch(console.error);
