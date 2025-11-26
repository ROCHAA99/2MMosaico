import React, { useMemo } from 'react';
import { PhotoData } from '../types';

interface MosaicGridProps {
  photos: PhotoData[];
  highlightedId: number | null;
  onPhotoClick: (photo: PhotoData) => void;
  mosaicBg: string | null;
}

export const MosaicGrid: React.FC<MosaicGridProps> = ({ photos, highlightedId, onPhotoClick, mosaicBg }) => {
  
  /// Calculate Transform for the "Camera Zoom" - CORRIGIDO
const zoomStyle = useMemo(() => {
  if (!highlightedId) return { transform: 'scale(1)', transformOrigin: 'center center' };

  const COLS = 50;
  const ROWS = 24;
  const idx = highlightedId - 1;
  
  // Calculate row and column (0-based)
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);

  // Calculate the exact center point - COM LIMITES
  const originX = Math.max(10, Math.min(90, ((col + 0.5) / COLS) * 100));
  const originY = Math.max(10, Math.min(90, ((row + 0.5) / ROWS) * 100));

  return {
      transform: 'scale(28)',
      transformOrigin: `${originX}% ${originY}%`, 
  };
}, [highlightedId]);

  // Calculate position for highlighted photo overlay - CORREÇÃO ADICIONADA
  const highlightedPosition = useMemo(() => {
    if (!highlightedId) return null;
    
    const COLS = 50;
    const idx = highlightedId - 1;
    const col = (idx % COLS) + 1;
    const row = Math.floor(idx / COLS) + 1;
    
    return { col, row };
  }, [highlightedId]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 overflow-visible">
      
      {/* 
          Main Container that scales up.
          We use overflow-visible on parent so the zoomed billboard doesn't get clipped.
      */}
      <div 
        className="flex flex-col items-center relative transition-transform duration-[1500ms] cubic-bezier(0.25, 1, 0.5, 1) will-change-transform"
        style={zoomStyle}
      >
        
        {/* Billboard Frame */}
        <div className="
          relative bg-gray-900 rounded-sm shadow-2xl 
          border-8 border-gray-800 
          w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[1000px] xl:w-[1200px]
          aspect-[2/1] sm:aspect-[2.2/1]
          flex flex-col
          overflow-hidden
          ring-1 ring-white/20
        ">
          
          {/* Inner Screen Area */}
          <div className="relative w-full h-full bg-black overflow-hidden group">
            
            {/* BACKGROUND TEMPLATE LAYER */}
            {mosaicBg && (
                <div className="absolute inset-0 z-0">
                    <img 
                        src={mosaicBg} 
                        alt="Background Template" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* THE GRID (1200 cells) */}
            <div className={`
                relative z-10
                w-full h-full grid 
                grid-cols-[repeat(50,minmax(0,1fr))] 
                grid-rows-[repeat(24,minmax(0,1fr))]
                gap-[1px] 
                ${mosaicBg ? 'bg-transparent' : 'bg-black/50'}
            `}>
              {photos.map((photo) => {
                const isHighlighted = highlightedId === photo.id;
                // If we are zoomed in, dim everyone else (NO GRAYSCALE)
                const isDimmed = highlightedId !== null && !isHighlighted;

                return (
                  <div
                    key={photo.id}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPhotoClick(photo);
                    }}
                    className={`
                      w-full h-full relative cursor-pointer transition-all duration-1000
                      ${isDimmed ? 'opacity-10' : (mosaicBg ? 'opacity-60 hover:opacity-100' : 'opacity-100')}
                    `}
                  >
                    <img
                      src={photo.url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                );
              })}
            </div>

            {/* FOCUSED PHOTO OVERLAY - VERSÃO CORRIGIDA PARA TODAS AS FOTOS */}
{highlightedId && highlightedPosition && (
    <div 
        className="absolute inset-0 z-50 pointer-events-none overflow-visible"
        style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(50, 1fr)',
            gridTemplateRows: 'repeat(24, 1fr)',
            gap: '1px'
        }}
    >
        <div 
            style={{
                gridColumn: highlightedPosition.col,
                gridRow: highlightedPosition.row,
            }}
            className="relative w-full h-full flex items-center justify-center overflow-visible"
        >
            {/* ANIMATED BORDER EFFECT - GARANTINDO VISIBILIDADE */}
            <div className="absolute -inset-[0.1px] bg-transparent z-40 overflow-visible border-2 border-transparent">
                <div className="absolute -inset-[200%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,#FFCC00_90deg,transparent_180deg,#FFCC00_270deg,transparent_360deg)] opacity-100 rounded-lg"></div>
            </div>

            {/* The Image Itself */}
            <div className="absolute inset-0 z-50 bg-transparent border-2 border-yellow-400 rounded-lg shadow-2xl">
                 <img 
                    src={photos.find(p => p.id === highlightedId)?.url} 
                    className="w-full h-full object-cover rounded" 
                    alt=""
                 />
            </div>
        </div>
    </div>
)}

            {/* Screen Shine/Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-40 mix-blend-overlay"></div>
          </div>

          {/* Bottom Branding Bar */}
          <div className="h-8 md:h-10 bg-black flex items-center justify-center border-t border-gray-700 relative overflow-hidden">
             <div className="absolute inset-0 opacity-20 bg-[linear-gradient(90deg,transparent,rgba(255,0,0,0.5),transparent)] animate-scan"></div>
             
             <div className="flex items-center z-10 space-x-3">
                <span className="text-brand-red font-bold text-xs md:text-sm tracking-widest uppercase glow-text">2M</span>
                <span className="text-gray-500 text-[10px]">•</span>
                <span className="text-white font-bold text-xs md:text-sm tracking-[0.3em] uppercase glow-text">FEITA POR NÓS</span>
             </div>
          </div>

        </div>

        {/* Billboard Legs/Stand */}
        <div className="flex space-x-32 md:space-x-64 relative z-[-1] -mt-2">
           <div className="w-6 md:w-8 h-24 md:h-40 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 shadow-xl"></div>
           <div className="w-6 md:w-8 h-24 md:h-40 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 shadow-xl"></div>
        </div>

      </div>

      <style>{`
        @keyframes scan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        .animate-scan {
            animation: scan 3s linear infinite;
        }
        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
        }

        .glow-text {
            text-shadow: 0 0 10px rgba(212, 5, 17, 0.5);
        }
      `}</style>
    </div>
  );
};