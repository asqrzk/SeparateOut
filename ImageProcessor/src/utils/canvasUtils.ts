
import { CarouselSlide, UserProfile } from '../types';
import jsPDF from 'jspdf';

/**
 * Renders a single slide to a canvas data URL.
 * Refactored to separate rendering logic from downloading logic.
 */
const renderSlideToDataURL = async (slide: CarouselSlide, index: number, total: number, profile: UserProfile | null): Promise<string | null> => {
    if (!profile) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Load Image
    const img = new Image();
    img.src = slide.sourceImage;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    ctx.drawImage(img, 0, 0, 1080, 1080);

    const textColor = slide.theme === 'dark' ? '#FFFFFF' : '#000000';
    const subTextColor = slide.theme === 'dark' ? '#D1D5DB' : '#374151';

    // Fonts setup
    ctx.font = '500 40px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Calculate Text Height first to determine pillar height
    const maxWidth = (slide.positions.content.width! / 100) * 1080;
    const startX = (slide.positions.content.x / 100) * 1080;
    const startY = (slide.positions.content.y / 100) * 1080;
    const lineHeight = 52;

    const wrappedText = getWrappedTextLines(ctx, slide.content || "Placeholder content", maxWidth);
    const textBlockHeight = wrappedText.length * lineHeight;

    // Content Pillar
    ctx.fillStyle = '#32cd32';
    ctx.fillRect(
      (slide.positions.pillar.x / 100) * 1080,
      (slide.positions.pillar.y / 100) * 1080,
      12,
      textBlockHeight + 10
    );

    // Content Text
    ctx.fillStyle = textColor;
    let currentY = startY;
    wrappedText.forEach(line => {
        ctx.fillText(line, startX, currentY);
        currentY += lineHeight;
    });

    // Branding
    const profileImg = new Image();
    profileImg.src = profile.profilePic;
    await new Promise((resolve, reject) => {
      profileImg.onload = resolve;
      profileImg.onerror = reject;
    });
    
    const bx = (slide.positions.branding.x / 100) * 1080;
    const by = (slide.positions.branding.y / 100) * 1080;

    ctx.save();
    ctx.beginPath();
    ctx.arc(bx + 40, by + 40, 40, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(profileImg, bx, by, 80, 80);
    ctx.restore();

    ctx.fillStyle = textColor;
    ctx.font = '700 32px Inter, sans-serif';
    ctx.fillText(profile.username, bx + 100, by + 24);

    // Page Number
    ctx.fillStyle = subTextColor;
    ctx.font = '400 24px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${index + 1} of ${total}`, bx + 100, by + 60);

    // Nav Pill
    const nx = (slide.positions.navigation.x / 100) * 1080;
    const ny = (slide.positions.navigation.y / 100) * 1080;
    const isLast = index === total - 1;

    ctx.strokeStyle = '#32cd32';
    ctx.lineWidth = 6;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(nx, ny, 120, 80, 40);
    } else {
      ctx.rect(nx, ny, 120, 80);
    }
    ctx.stroke();
    
    ctx.fillStyle = '#32cd32';
    ctx.font = '700 42px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(isLast ? '✓' : '→', nx + 60, ny + 20);

    return canvas.toDataURL('image/png');
};

export const downloadSlide = async (slide: CarouselSlide, index: number, total: number, profile: UserProfile | null) => {
    const dataUrl = await renderSlideToDataURL(slide, index, total, profile);
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `slide-${index + 1}.png`;
    link.href = dataUrl;
    link.click();
};

export const downloadAllAsPdf = async (slides: CarouselSlide[], profile: UserProfile | null) => {
    if (!profile || slides.length === 0) return;

    // Create a PDF with standard square dimensions
    // Using 210mm as standard width (A4 width), since it's common for reading
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [210, 210] // Square PDF pages
    });

    for (let i = 0; i < slides.length; i++) {
        if (i > 0) doc.addPage();
        
        const dataUrl = await renderSlideToDataURL(slides[i], i, slides.length, profile);
        if (dataUrl) {
            // Add image to full page (0 margin)
            doc.addImage(dataUrl, 'PNG', 0, 0, 210, 210);
        }
    }

    doc.save('carousel.pdf');
};

const getWrappedTextLines = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let line = '';
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  };
