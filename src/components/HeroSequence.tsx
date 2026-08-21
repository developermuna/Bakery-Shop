import React, { useEffect, useRef, useState } from 'react';
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
}

export const HeroSequence: React.FC<HeroSequenceProps> = ({
  sequences = [
    { path: '/cakevideo1/frame_', count: 106 },
    { path: '/cakevideo2/frame_', count: 101 }
  ],
  title = <>Made for Your<br />Sweetest Moments</>,
  subtitle = "Handcrafted, premium cakes and pastries for pickup. Discover the taste of elegance."
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const totalFrames = sequences.reduce((sum, seq) => sum + seq.count, 0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    const urls: string[] = [];

    sequences.forEach(seq => {
      for (let i = 1; i <= seq.count; i++) {
        const paddedIndex = i.toString().padStart(3, '0');
        urls.push(`${seq.path}${paddedIndex}.webp`);
      }
    });

    
    let loadedCount = 0;
    setIsLoaded(false);

    urls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      
      const onComplete = () => {
        loadedCount++;
        // Unblock instantly after the first frame loads to make it fast
        if (i === 0 || loadedCount === 1) {
          setIsLoaded(true);
        }
      };

      img.onload = onComplete;
      img.onerror = onComplete;
      
      loadedImages.push(img);
    });

    setImages(loadedImages);
  }, [JSON.stringify(sequences)]);

  // Framer Motion scroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0 to 1) to frame index
  const currentFrameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames > 0 ? totalFrames - 1 : 0]);

  // Draw frame on canvas whenever currentFrameIndex changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded || images.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Use Math.round to get integer index from animated float value
      const index = Math.round(currentFrameIndex.get());
      const img = images[index];

      // Only draw if image is valid and fully loaded
      if (img && img.complete && img.naturalWidth > 0) {
        // Draw image covering the entire canvas while maintaining aspect ratio (object-fit: cover equivalent)
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * imgRatio;
          drawHeight = canvas.height;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    const handleResize = () => {
      // Set canvas internal resolution to match its display size (viewport)
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(); // Force a re-render so it doesn't stay blank
    };

    // Initial setup
    handleResize();
    window.addEventListener('resize', handleResize);

    // Subscribe to currentFrameIndex changes
    const unsubscribe = currentFrameIndex.on('change', render);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [currentFrameIndex, isLoaded, images]);

  return (
    <div ref={containerRef} className="relative h-[300vh] hero-sequence-container">
      {/* Sticky container for the video/canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-bento-black">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Loading overlay if images are not ready */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-bento-black z-10">
            <p className="text-white text-lg font-sans">Loading experience...</p>
          </div>
        )}

        {/* Yellow gradient overlay at bottom 15% to transition into next section */}
        <div className="absolute bottom-0 w-full h-[15%] bg-gradient-to-t from-bento-yellow to-transparent pointer-events-none z-20" />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-30 pointer-events-none p-4 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-6 drop-shadow-xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 drop-shadow-md font-sans font-light"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 pointer-events-auto"
          >
            <Link to="/menu" className="px-8 py-4 bg-bento-yellow text-black rounded-full font-medium hover:bg-yellow-400 transition-colors shadow-lg">
              Order for Pickup
            </Link>
            <Link to="/#categories" className="px-8 py-4 bg-bento-black/50 backdrop-blur-md text-white rounded-full shadow-lg hover:shadow-xl font-medium hover:bg-black transition-colors shadow-lg">
              View Menu
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
