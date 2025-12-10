// src/components/ImageLightbox.jsx
import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ images, currentIndex, onClose, onNavigate }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onNavigate(currentIndex - 1);
    if (e.key === "ArrowRight") onNavigate(currentIndex + 1);
  }, [currentIndex, onClose, onNavigate]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const goToPrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Previous button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
          className="absolute left-2 sm:left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
        >
          <ChevronLeft className="h-8 w-8 sm:h-12 sm:w-12" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNext(); }}
          className="absolute right-2 sm:right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
        >
          <ChevronRight className="h-8 w-8 sm:h-12 sm:w-12" />
        </button>
      )}

      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1} of ${images.length}`}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] sm:max-w-[85vw] object-contain rounded-lg"
      />

      {/* Image counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
