const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'src', 'assets');
const LOGO_PATH = path.join(ASSETS_DIR, 'logo-icon.png');

const WIDTH = 800;
const HEIGHT = 800;
const LOGO_SIZE = 280;
const LOGO_Y_CENTER = 320;
const BORDER_RADIUS = 24;
const BORDER_WIDTH = 3;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawWideText(ctx, text, x, y, letterSpacing) {
  const chars = text.split('');
  let totalWidth = 0;
  const widths = chars.map(c => ctx.measureText(c).width);
  totalWidth = widths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);
  let startX = x - totalWidth / 2;
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i], startX, y);
    startX += widths[i] + letterSpacing;
  }
}

async function generateStarter(logo) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Diagonal gradient background
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grad.addColorStop(0, '#F8F9FA');
  grad.addColorStop(1, '#EEF2FF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle rounded rectangle border
  const inset = BORDER_WIDTH / 2 + 8;
  roundRect(ctx, inset, inset, WIDTH - inset * 2, HEIGHT - inset * 2, BORDER_RADIUS);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = BORDER_WIDTH;
  ctx.stroke();

  // Logo centered at y=320
  const logoX = (WIDTH - LOGO_SIZE) / 2;
  const logoY = LOGO_Y_CENTER - LOGO_SIZE / 2;
  ctx.drawImage(logo, logoX, logoY, LOGO_SIZE, LOGO_SIZE);

  // "STARTER" text
  ctx.fillStyle = '#4F46E5';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawWideText(ctx, 'STARTER', WIDTH / 2, 520, 12);



  const outPath = path.join(ASSETS_DIR, 'stripe-starter-plan.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  const stats = fs.statSync(outPath);
  console.log(`✅ Starter plan saved: ${outPath} (${stats.size} bytes)`);
}

async function generatePro(logo) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Diagonal gradient background
  const grad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  grad.addColorStop(0, '#F8F9FA');
  grad.addColorStop(1, '#EEF2FF');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle rounded rectangle border
  const inset = BORDER_WIDTH / 2 + 8;
  roundRect(ctx, inset, inset, WIDTH - inset * 2, HEIGHT - inset * 2, BORDER_RADIUS);
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = BORDER_WIDTH;
  ctx.stroke();

  // Logo centered at y=320
  const logoX = (WIDTH - LOGO_SIZE) / 2;
  const logoY = LOGO_Y_CENTER - LOGO_SIZE / 2;
  ctx.drawImage(logo, logoX, logoY, LOGO_SIZE, LOGO_SIZE);

  // "PRO" text
  ctx.fillStyle = '#4F46E5';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  drawWideText(ctx, 'PRO', WIDTH / 2, 520, 12);

  const outPath = path.join(ASSETS_DIR, 'stripe-pro-plan.png');
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buffer);
  const stats = fs.statSync(outPath);
  console.log(`✅ Pro plan saved: ${outPath} (${stats.size} bytes)`);
}

(async () => {
  const logo = await loadImage(LOGO_PATH);
  await generateStarter(logo);
  await generatePro(logo);
  console.log('\n🎉 Both images generated successfully!');
})();
