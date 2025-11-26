import React, { useEffect, useState } from 'react';
import { PhotoData } from '../types';
import { Button } from './Button';
import { generateCelebrationMessage } from '../services/geminiService';

interface PhotoModalProps {
  photo: PhotoData | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (photo) {
      setLoading(true);
      setMessage(""); // Clear previous
      generateCelebrationMessage(photo.id)
        .then(msg => setMessage(msg))
        .catch(() => setMessage("Parabéns por fazer parte desta conquista!"))
        .finally(() => setLoading(false));
    }
  }, [photo]);

  if (!photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-xl w-full max-w-5xl h-auto max-h-[90vh] overflow-hidden shadow-2xl transform transition-all animate-scaleIn flex flex-col md:flex-row">
        
        {/* Left Side: Large Image */}
        <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative overflow-hidden group">
          <img 
            src={photo.url} 
            alt={`Foto em destaque`} 
            className="w-full h-full object-contain max-h-[50vh] md:max-h-full transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Right Side: Content */}
        <div className="w-full md:w-1/3 flex flex-col bg-white h-auto md:h-full relative">
          {/* Header inside content area */}
          <div className="bg-brand-red p-4 flex justify-between items-center text-white flex-shrink-0">
            <h3 className="text-xl font-bold">Colaborador #{photo.id}</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 flex flex-col flex-1 overflow-y-auto justify-center space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm uppercase tracking-widest text-brand-red font-bold">Homenagem Especial</h4>
              <div className="w-12 h-1 bg-brand-yellow rounded-full"></div>
            </div>
            
            <div className="min-h-[100px] flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center space-y-3 text-brand-red">
                  <div className="flex space-x-2">
                    <div className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wide opacity-70">Escrevendo mensagem...</span>
                </div>
              ) : (
                <p className="text-xl md:text-2xl text-gray-800 font-serif italic leading-relaxed text-center">
                  "{message}"
                </p>
              )}
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 mt-auto bg-gray-50">
            <Button onClick={onClose} fullWidth>
              Voltar ao Mosaico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};