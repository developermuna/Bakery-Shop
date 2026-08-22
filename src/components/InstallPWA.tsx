import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback for iOS or browsers that don't support programmatic install
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    await deferredPrompt.userChoice;
    
    // We no longer need the prompt. Clear it up.
    setDeferredPrompt(null);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleInstallClick}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white text-[#1A1110] rounded-xl text-[10px] font-bold hover:bg-white/90 transition-colors shadow-sm"
      >
        <Download className="w-3.5 h-3.5" />
        Install App
      </button>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-bento-text text-white text-[10px] rounded-lg shadow-xl text-center z-50 animate-in fade-in slide-in-from-bottom-2">
          To install, open your browser menu and select <strong className="text-strawberry">"Add to Home Screen"</strong>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-bento-text rotate-45"></div>
        </div>
      )}
    </div>
  );
};
