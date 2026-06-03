import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Categories({ selectedCategory, setSelectedCategory }) {
  const scrollContainerRef = useRef(null);

  const categories = [
    { id: 'all', name: 'Todos', emoji: '🌟', bgColor: 'bg-slate-100 hover:bg-slate-200 text-slate-700' },
    { id: 'frutas', name: 'Frutas', emoji: '🍎', bgColor: 'bg-red-50 hover:bg-red-100 text-red-700' },
    { id: 'verduras', name: 'Verduras', emoji: '🥦', bgColor: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { id: 'granos', name: 'Granos', emoji: '🌾', bgColor: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
    { id: 'carnes', name: 'Carnicerías', emoji: '🥩', bgColor: 'bg-rose-50 hover:bg-rose-100 text-rose-700' },
    { id: 'lacteos', name: 'Lácteos', emoji: '🥛', bgColor: 'bg-sky-50 hover:bg-sky-100 text-sky-700' },
    { id: 'panaderia', name: 'Panaderías', emoji: '🍞', bgColor: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
    { id: 'postres', name: 'Postres', emoji: '🍰', bgColor: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    { id: 'rapida', name: 'Comidas Rápidas', emoji: '🍔', bgColor: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.5 
        : scrollLeft + clientWidth * 0.5;
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative group">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Ayúdanos a salvar hoy
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Explora por categorías y rescata alimentos en perfectas condiciones antes de que se desperdicien.
          </p>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Desplazar izquierda"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Desplazar derecha"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x snap-mandatory touch-pan-x"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-none snap-start flex flex-col items-center justify-center w-28 h-32 rounded-3xl border transition-all duration-300 ${
                isSelected 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md shadow-blue-50/50 scale-105' 
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-1 shadow-sm'
              }`}
            >
              {/* Emoji Circle */}
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl mb-3 shadow-inner ${
                isSelected ? 'bg-white shadow' : cat.bgColor
              } transition-transform duration-200 group-hover:scale-105`}>
                {cat.emoji}
              </div>

              {/* Text */}
              <span className={`text-xs font-bold tracking-tight text-center px-1 truncate w-full ${
                isSelected ? 'text-blue-700' : 'text-slate-700'
              }`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
