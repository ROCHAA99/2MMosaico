import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PhotoData } from './types';
import { MosaicGrid } from './components/MosaicGrid';
import { Button } from './components/Button';

// Constants
const TOTAL_PHOTOS = 1200;

function App() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [searchId, setSearchId] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  
  // Mosaic Background State
  const [mosaicBg, setMosaicBg] = useState<string | null>("https://i.ibb.co/7xD8sKsL/Screenshot-2025-11-24-at-16-29-49.png");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize photos
  useEffect(() => {
    const generatedPhotos: PhotoData[] = Array.from({ length: TOTAL_PHOTOS }, (_, i) => ({
      id: i + 1,
      // Using picsum with specific sizing
      url: `https://picsum.photos/seed/${i + 1}/600/600`
    }));
    setPhotos(generatedPhotos);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId);
    
    if (isNaN(id) || id < 1 || id > TOTAL_PHOTOS) {
      alert(`Por favor, digite um número entre 1 e ${TOTAL_PHOTOS}`);
      return;
    }

    setHighlightedId(id);
  }, [searchId]);

  const handleReset = () => {
    setSearchId('');
    setHighlightedId(null);
  };

  const handlePhotoClick = (photo: PhotoData) => {
    if (highlightedId === photo.id) {
        setHighlightedId(null); // Toggle off
    } else {
        setHighlightedId(photo.id);
    }
  };

  // Image Upload Handlers
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setMosaicBg(e.target.result as string);
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    };
    reader.onerror = () => {
        setUploadStatus('error');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#D40511] via-[#a8040d] to-[#600207] overflow-hidden relative">
      
      {/* Background Texture/Pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      </div>

      {/* 
         Green Triangle Background Decoration 
         Bottom Left, 45deg rotation, looks like a corner triangle.
      */}
      <div className="fixed -bottom-20 -left-20 w-80 h-80 bg-[#009B48] transform rotate-45 z-0 pointer-events-none shadow-2xl opacity-90"></div>

      {/* Upload Control: Minimal + Button at Bottom Right - OCULTADO */}
      {/*
      <div className="absolute bottom-6 right-6 z-[70] flex flex-col items-end space-y-2 group">
        
        {/* Status Tooltip (Only visible on upload/success) * /}
        {(uploadStatus === 'success' || uploadStatus === 'uploading') && (
            <div className="bg-black/80 backdrop-blur text-white text-xs py-1 px-3 rounded-lg mb-1 animate-fade-in-up">
                {uploadStatus === 'uploading' ? 'Carregando...' : 'Template Atualizado'}
            </div>
        )}

        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
        />
        
        <button 
            onClick={triggerFileInput} 
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 group-hover:border-white/50"
            title="Escolher imagem de fundo"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </button>
      </div>
      */}

      {/* FIXED HEADER WITH BASE64 LOGO - ALWAYS VISIBLE */}
      <header className="fixed top-0 left-0 w-full bg-transparent py-4 text-center z-[1000]">
        <div className="inline-block">
            <div 
                className="w-[240px] h-[100px] bg-contain bg-no-repeat bg-center"
                style={{ 
                    backgroundImage: `url(https://i.ibb.co/Cp2x8cbP/2-M-Header-Logo.png)`
                }}
            ></div>
        </div>
      </header>

      {/* Main Content: Billboard */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 mt-32">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center text-white">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-yellow mb-4"></div>
             <p className="font-medium opacity-80">Construindo Outdoor...</p>
          </div>
        ) : (
          <MosaicGrid 
            photos={photos} 
            highlightedId={highlightedId} 
            onPhotoClick={handlePhotoClick} 
            mosaicBg={mosaicBg}
          />
        )}
      </main>

      {/* Footer Controls - Centered below Billboard */}
      <footer className="flex-shrink-0 pb-8 pt-4 z-[60] flex justify-center">
        <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col items-center gap-2 max-w-md w-full mx-4 transform transition-all hover:scale-[1.02]">
            
            {/* 
                CONDITIONAL FOOTER CONTENT:
                If zoomed in (highlightedId), show Back Button.
                If overview, show Search Form.
            */}
            {!highlightedId ? (
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="number"
                      placeholder={`Digite seu número (1-${TOTAL_PHOTOS})`}
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      min="1"
                      max={TOTAL_PHOTOS}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand-red focus:ring-1 focus:ring-brand-red text-gray-900 placeholder-gray-400 outline-none transition-all font-medium text-center"
                    />
                  </div>
                  <Button type="submit" variant="primary" className="h-full py-3 px-6 rounded-xl">
                    Encontrar
                  </Button>
                </form>
            ) : (
                <div className="w-full flex flex-col gap-2">
                    {/* Share Section - Now inside Footer */}
                    <div className="flex flex-col items-center justify-center py-2 animate-fade-in-up">
    <span className="text-gray-800 text-[10px] font-black tracking-widest uppercase mb-2">
                            PARTILHA COM TEUS BRADAS
                        </span>
                        <div className="flex gap-4">
                            {/* WhatsApp */}
                            </span>
    <div className="flex gap-4">
        {/* WhatsApp */}
        <button 
            onClick={() => {
                const text = encodeURIComponent("Eixxx... olha só onde fui parar! 😂\nA 2M meteu a minha foto num outdoor gigante, tipo celebridade mas #ÀNossaManeira");
                const url = encodeURIComponent(window.location.href);
                window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
            }}
            className="w-10 h-10 rounded-full bg-gray-900 hover:bg-black flex items-center justify-center transition-all hover:scale-110 group"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-yellow group-hover:text-white transition-colors">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </button>

                            {/* Facebook */}
                            <button 
            onClick={() => {
                const url = encodeURIComponent(window.location.href);
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
            }}
            className="w-10 h-10 rounded-full bg-gray-900 hover:bg-black flex items-center justify-center transition-all hover:scale-110 group"
        >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-yellow group-hover:text-white transition-colors">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </button>

                            {/* Instagram */}
                            <button 
            onClick={() => {
                const text = encodeURIComponent("Eixxx... olha só onde fui parar! 😂\nA 2M meteu a minha foto num outdoor gigante, tipo celebridade mas #ÀNossaManeira");
                // Instagram não tem API direta de sharing, então usamos uma abordagem alternativa
                const instagramUrl = `https://www.instagram.com/create/story/`;
                window.open(instagramUrl, '_blank');
                
                // Mostrar instrução para o usuário
                setTimeout(() => {
                    if(confirm('Para compartilhar no Instagram:\n1. Tire um print da tela\n2. Abra o Instagram Stories\n3. Cole a imagem e adicione a descrição!')) {
                        // Copiar texto para área de transferência
                        navigator.clipboard.writeText("Eixxx... olha só onde fui parar! 😂\nA 2M meteu a minha foto num outdoor gigante, tipo celebridade mas #ÀNossaManeira");
                        alert('Texto copiado! Agora é só colar no Instagram!');
                    }
                }, 1000);
            }}
            className="w-10 h-10 rounded-full bg-gray-900 hover:bg-black flex items-center justify-center transition-all hover:scale-110 group"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-yellow group-hover:text-white transition-colors">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button 
                        type="button"
                        onClick={handleReset}
                        className="w-full py-3 text-sm font-bold text-white bg-brand-red hover:bg-[#b0040e] rounded-xl transition-all uppercase tracking-widest shadow-md active:scale-95 flex items-center justify-center gap-2 border-t border-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Voltar para a Visão Geral
                    </button>
                </div>
            )}
        </div>
      </footer>

      {/* Age Warning Image - PARTE ADICIONADA */}
      <div className="fixed bottom-4 right-4 z-[1000] pointer-events-none">
  <img 
    src="https://i.ibb.co/LzrMJbQ4/Age-warning.png" 
    alt="Age Warning" 
    className="w-[85px] h-[140px] object-contain"
        />
      </div>


      {/* Footer Copyright */}
      <div className="absolute bottom-1 right-1/2 transform translate-x-1/2 text-[10px] text-white/30 z-50">
        2M • Feita Por Nós • À Nossa Maneira
      </div>
    </div>
  );
}

export default App;