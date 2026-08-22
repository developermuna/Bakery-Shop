import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FrameSequence {
  path: string;
  count: number;
}

interface HeroSequenceProps {
  sequences?: FrameSequence[];
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  sequences = [
    { path: '/cakevideo1/frame_', count: 106 },
    { path: '/cakevideo2/frame_', count: 101 }
  ],
  title = <>Made for Your<br />Sweetest Moments</>,
  subtitle = "Handcrafted, premium cakes and pastries for pickup. Discover the taste of elegance.",
  primaryButtonText = "Order Cakes",
  primaryButtonLink = "/menu",
  secondaryButtonText = "Decoration Items",
  secondaryButtonLink = "/decorations"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const lastRenderedIndexRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  const totalFrames = sequences.reduce((sum, seq) => sum + seq.count, 0);

  // IntersectionObserver to only load heavy frame assets when entering or near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Optimized progressive frame loading: priority on initial frames, batched idle loading for the rest
  useEffect(() => {
    if (!inView) return;

    let isCancelled = false;
    const urls: string[] = [];

    sequences.forEach(seq => {
      for (let i = 1; i <= seq.count; i++) {
        const paddedIndex = i.toString().padStart(3, '0');
        urls.push(`${seq.path}${paddedIndex}.webp`);
      }
    });

    const loadedImages: HTMLImageElement[] = Array.from({ length: urls.length });
    let loadedCount = 0;

    // Load first 4 frames with high priority to render poster immediately
    const initialBatchSize = Math.min(4, urls.length);
    for (let i = 0; i < initialBatchSize; i++) {
      const img = new Image();
      img.src = urls[i];
      img.onload = () => {
        if (isCancelled) return;
        loadedCount++;
        loadedImages[i] = img;
        if (i === 0 || loadedCount === 1) {
          setIsLoaded(true);
          setImages([...loadedImages]);
        }
      };
      img.onerror = () => {
        if (isCancelled) return;
        loadedCount++;
        if (i === 0) setIsLoaded(true);
      };
      loadedImages[i] = img;
    }

    // Stream remaining frames in non-blocking batches
    let currentIdx = initialBatchSize;
    const BATCH_CHUNK = 8;

    const loadNextBatch = () => {
      if (isCancelled || currentIdx >= urls.length) {
        if (!isCancelled) {
          setImages([...loadedImages]);
        }
        return;
      }

      const end = Math.min(currentIdx + BATCH_CHUNK, urls.length);
      for (let i = currentIdx; i < end; i++) {
        const img = new Image();
        img.src = urls[i];
        img.onload = () => {
          if (!isCancelled) {
            loadedImages[i] = img;
          }
        };
        loadedImages[i] = img;
      }
      currentIdx = end;

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadNextBatch, { timeout: 100 });
      } else {
        setTimeout(loadNextBatch, 30);
      }
    };

    const timer = setTimeout(loadNextBatch, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [inView, JSON.stringify(sequences)]);

  // Framer Motion scroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0 to 1) to frame index
  const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames > 0 ? totalFrames - 1 : 0]);

  // Optimized Canvas Drawing with RAF and frame index deduplication
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !images.length) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const index = Math.round(currentFrameIndex.get());
    if (index === lastRenderedIndexRef.current && canvas.width > 0) return;

    const img = images[index] || images[0];
    if (img && img.complete && img.naturalWidth > 0) {
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawWidth = canvas.width;
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        drawHeight = canvas.height;
        offsetX = (canvas.width - drawWidth) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      lastRenderedIndexRef.current = index;
    }
  }, [currentFrameIndex, images]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;

    const scheduleRender = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(drawFrame);
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      lastRenderedIndexRef.current = -1;
      scheduleRender();
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    const unsubscribe = currentFrameIndex.on('change', scheduleRender);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [currentFrameIndex, isLoaded, drawFrame]);

  return (
    <div ref={containerRef} className="relative h-[300vh] hero-sequence-container">
      {/* Sticky container for the video/canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bento-bg">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />
        {/* Top gradient for navbar visibility */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-20" />

        {/* Loading overlay if images are not ready */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-bento-bg z-10">
            <div className="w-8 h-8 border-3 border-strawberry/30 border-t-strawberry rounded-full animate-spin"></div>
          </div>
        )}

        {/* Yellow gradient overlay at bottom 15% to transition into next section */}
        <div className="absolute bottom-0 w-full h-[15%] bg-gradient-to-t from-bento-bg to-transparent pointer-events-none z-20" />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none p-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tight text-strawberry mb-6 drop-shadow-2xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 drop-shadow-lg font-sans font-bold leading-relaxed"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pointer-events-auto items-center"
          >
            {primaryButtonText && primaryButtonLink && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link 
                  to={primaryButtonLink} 
                  className="px-8 py-3.5 sm:py-4 bg-bento-yellow text-bento-text-inverse rounded-full font-bold hover:bg-bento-yellow/90 transition-all shadow-lg hover:shadow-xl text-center min-w-[180px] inline-block"
                >
                  {primaryButtonText}
                </Link>
              </motion.div>
            )}
            {secondaryButtonText && secondaryButtonLink && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link 
                  to={secondaryButtonLink} 
                  className="px-8 py-3.5 sm:py-4 bg-white/90 backdrop-blur-md text-bento-text border border-white/60 rounded-full shadow-lg hover:shadow-xl font-bold hover:bg-white hover:text-strawberry transition-all text-center min-w-[180px] inline-block"
                >
                  {secondaryButtonText}
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

