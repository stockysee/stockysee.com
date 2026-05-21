'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Image from 'next/image';
import editorPanelData from '@/public/editor-panel.json';


interface LottiePanelTriggerProps {
  onOpen: () => void;
  onOpenWidget: () => void;
  onOpenLayer: () => void;
}

interface BubbleButtonProps {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  label: string;
  isHovered: boolean;
  animClass: string;
}

function BubbleButton({ onClick, icon, label, isHovered, animClass }: BubbleButtonProps) {
  const [labelVisible, setLabelVisible] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ease-out ${animClass}`}>
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setLabelVisible(true)}
        onMouseLeave={() => setLabelVisible(false)}
        className="
          flex items-center justify-center
          w-14 h-14 rounded-r-xl
          bg-white/90 hover:bg-white
          shadow-md shadow-black/8 hover:shadow-lg hover:shadow-black/12
          border border-l-0 border-zinc-200/80
          backdrop-blur-sm
          transition-all duration-200 cursor-pointer
          group/bubble
        "
      >
        <div className="transition-transform duration-200 ease-out group-hover/bubble:scale-110">
          {icon}
        </div>
      </button>

      {/* Label absolute — tidak mempengaruhi layout/area hover */}
      <div
        className={`
          absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2
          px-2.5 py-1 rounded-lg
          bg-white/95 backdrop-blur-sm
          shadow-md shadow-black/10
          border border-zinc-200/80
          whitespace-nowrap pointer-events-none
          transition-all duration-200 ease-out
          ${labelVisible
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-1'
          }
        `}
      >
        <span className="text-[11px] font-semibold text-zinc-600 tracking-wide">{label}</span>
      </div>
    </div>
  );
}

export function LottiePanelTrigger({ onOpen, onOpenWidget, onOpenLayer }: LottiePanelTriggerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mainLabelVisible, setMainLabelVisible] = useState(false);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fps = useMemo(() => Number((editorPanelData as any)?.fr ?? 60), []);

  useEffect(() => {
    const anim = lottieRef.current;
    if (!anim) return;
    anim.goToAndStop(0, true);
    anim.play();
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    const anim = lottieRef.current;
    if (!anim) return;
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    anim.goToAndStop(0, true);
    anim.play();
    animTimerRef.current = setTimeout(() => {
      anim.pause();
      animTimerRef.current = null;
    }, 2000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMainLabelVisible(false);
    const anim = lottieRef.current;
    if (!anim) return;
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    anim.play();
  };

  return (
    <div
      className="flex flex-col items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Bubble Layer — di atas */}
      <div className="mb-1.5">
        <BubbleButton
          onClick={(e) => { e.stopPropagation(); onOpenLayer(); }}
          icon={<Image src="/layers.png" alt="Layers" width={28} height={28} className="object-contain" />}
          label="Layer"
          isHovered={isHovered}
          animClass={isHovered
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-2 scale-95 pointer-events-none'
          }
        />
      </div>

      {/* Main trigger button — di tengah */}
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          onMouseEnter={() => setMainLabelVisible(true)}
          onMouseLeave={() => setMainLabelVisible(false)}
          className="
            flex items-center justify-center
            w-14 h-14 rounded-r-xl
            bg-white/90 hover:bg-white
            shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15
            border border-l-0 border-zinc-200/80
            backdrop-blur-sm
            transition-all duration-300 cursor-pointer
          "
        >
          <div className={`transition-all duration-300 ease-out ${isHovered ? 'scale-[1.1]' : 'scale-100'}`}>
            <Lottie
              lottieRef={lottieRef}
              animationData={editorPanelData}
              loop={false}
              autoplay={false}
              style={{ width: 44, height: 44 }}
            />
          </div>
        </button>

        {/* Label absolute — tidak mempengaruhi layout/area hover */}
        <div
          className={`
            absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2
            px-2.5 py-1 rounded-lg
            bg-white/95 backdrop-blur-sm
            shadow-md shadow-black/10
            border border-zinc-200/80
            whitespace-nowrap pointer-events-none
            transition-all duration-200 ease-out
            ${mainLabelVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-1'
            }
          `}
        >
          <span className="text-[11px] font-semibold text-zinc-600 tracking-wide">Panel</span>
        </div>
      </div>

      {/* Bubble Widget — di bawah */}
      <div className="mt-1.5">
        <BubbleButton
          onClick={(e) => { e.stopPropagation(); onOpenWidget(); }}
          icon={<Image src="/widget.png" alt="Widget" width={28} height={28} className="object-contain" />}
          label="Widget"
          isHovered={isHovered}
          animClass={isHovered
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }
        />
      </div>
    </div>
  );
}
