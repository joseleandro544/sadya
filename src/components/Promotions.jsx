import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';

export default function Promotions({ onSelectPromoCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: "¡Frutas y Verduras al Rescate!",
      subtitle: "Evita que se desperdicien alimentos de excelente calidad y ahorra en grande.",
      discount: "Hasta 60% de Dcto",
      badge: "Vence Hoy",
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      categoryTarget: "verduras",
      buttonText: "Salvar Verduras 🥦"
    },
    {
      id: 2,
      title: "Lácteos y Quesos Premium",
      subtitle: "Productos frescos de granjas locales listos para ser consumidos.",
      discount: "Hasta 40% de Dcto",
      badge: "Lote de Hoy",
      gradient: "from-blue-600 via-indigo-600 to-violet-700",
      categoryTarget: "lacteos",
      buttonText: "Rescatar Lácteos 🥛"
    },
    {
      id: 3,
      title: "Panadería y Repostería",
      subtitle: "El pan artesanal más crujiente y los postres más dulces del día.",
      discount: "50% de Descuento",
      badge: "Últimas Horas",
      gradient: "from-amber-500 via-orange-600 to-rose-600",
      categoryTarget: "panaderia",
      buttonText: "Ver Panaderías 🍞"
    }
  ];

  const startAutoPlay = () => {
    stopAutoPlay();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const handlePrev = () => {
    stopAutoPlay();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoPlay();
  };

  const handleNext = () => {
    stopAutoPlay();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startAutoPlay();
  };

  const handleSlideSelect = (index) => {
    stopAutoPlay();
    setCurrentSlide(index);
    startAutoPlay();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            Súper Promociones
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Descuentos especiales en productos de consumo rápido. ¡Aprovecha antes de que se agoten!
          </p>
        </div>
      </div>

      {/* Banner Container */}
      <div 
        className="relative overflow-hidden bg-transparent aspect-[21/9] min-h-[220px] sm:min-h-[320px] group"
        onMouseEnter={stopAutoPlay}
        onMouseLeave={startAutoPlay}
      >
        {/* Fade Out Overlays to blend with page background (#f8fafc) */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#f8fafc] via-[#f8fafc]/60 to-transparent z-10 pointer-events-none" />

        {/* Slides Track */}
        <div 
          className="flex h-full transition-transform duration-700 ease-out w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id}
              className={`w-full shrink-0 h-full flex flex-col justify-center px-12 sm:px-28 py-8 relative bg-gradient-to-r ${slide.gradient} select-none`}
            >
              {/* Floating Shape Elements for Premium Look */}
              <div className="absolute right-0 top-0 w-1/3 h-full bg-white/5 rounded-l-full blur-2xl transform translate-x-12 -translate-y-8" />
              <div className="absolute right-12 bottom-0 w-48 h-48 bg-black/10 rounded-full blur-xl" />

              {/* Tag/Badge */}
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-3 sm:mb-4">
                <AlertCircle className="h-3.5 w-3.5" />
                {slide.badge}
              </span>

              {/* Title & Subtitle */}
              <div className="max-w-xl">
                <h3 className="text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-none">
                  {slide.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm md:text-base text-white/90 font-medium line-clamp-2">
                  {slide.subtitle}
                </p>
              </div>

              {/* Discount Text */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-baseline gap-4">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-yellow-300 drop-shadow-sm">
                  {slide.discount}
                </span>
                
                {/* CTA Button */}
                <button
                  onClick={() => onSelectPromoCategory(slide.categoryTarget)}
                  className="rounded-full bg-white text-slate-900 px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md hover:bg-slate-100 active:scale-95 transition-all duration-200"
                >
                  {slide.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300 border border-white/10 z-20"
          title="Anterior"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300 border border-white/10 z-20"
          title="Siguiente"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Indicators Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideSelect(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
              title={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
