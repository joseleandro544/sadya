import { useState } from 'react';
import { ShoppingCart, Check, Clock } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, compact = false }) {
  const {
    id,
    name,
    store,
    category,
    distance,
    image,
    price,
    originalPrice,
    discount,
    expiryText = "Vence Hoy",
  } = product;

  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  // Formatter for COP currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val).replace('COP', 'COP ');
  };

  const getExpiryStyle = () => {
    const text = (expiryText || '').toLowerCase();
    if (text.includes('hoy') || text.includes('vencido') || text.includes('1 día') || text.includes('2 días') || text.includes('1 dia') || text.includes('2 dias') || text.includes('ayer')) {
      return 'bg-red-50 text-red-600 border border-red-100';
    } else if (text.includes('3 días') || text.includes('4 días') || text.includes('3 o 4 días') || text.includes('3 dias') || text.includes('4 dias') || text.includes('3 o 4 dias') || text.includes('próximo')) {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    } else {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
  };

  return (
    <div className={`group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1 ${compact ? 'max-w-[210px]' : ''}`}>
      {/* 50% Top: Image container */}
      <div className={`relative w-full overflow-hidden bg-slate-100 ${compact ? 'h-32' : 'h-48'}`}>
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Top-Left: White Category Badge (Hidden in compact mode) */}
        {!compact && (
          <span className="absolute top-3 left-3 bg-white text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider border border-slate-100/50">
            {category}
          </span>
        )}
        {/* Bottom-Right: Blue Distance Badge */}
        <span className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
          📍 {distance} km
        </span>
      </div>

      {/* Info Content Area */}
      <div className={`flex-1 flex flex-col justify-between ${compact ? 'p-3.5' : 'p-5'}`}>
        <div>
          {/* Shop Name */}
          <span className={`font-extrabold tracking-wider uppercase block ${compact ? 'text-[9px] text-blue-500' : 'text-[11px] text-blue-600'}`}>
            {store}
          </span>
          {/* Product Name */}
          <h3 className={`font-extrabold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors ${compact ? 'text-xs' : 'text-base'}`}>
            {name}
          </h3>
          {/* Alert: Expiry Status with dynamic color indicator */}
          <div className={`flex items-center ${compact ? 'mt-1' : 'mt-1.5'}`}>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getExpiryStyle()}`}>
              <Clock className="h-3 w-3 animate-pulse" />
              {expiryText}
            </span>
          </div>
        </div>

        <div>
          {/* Prices Row */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className={`font-black text-blue-600 ${compact ? 'text-sm' : 'text-lg'}`}>
                {formatCurrency(price)}
              </span>
              <span className={`font-semibold text-slate-400 line-through ${compact ? 'text-[10px]' : 'text-xs'}`}>
                {formatCurrency(originalPrice)}
              </span>
            </div>
            {/* Discount Badge */}
            <span className={`rounded-lg bg-orange-100 font-extrabold text-orange-700 ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-1 text-[10px]'}`}>
              -{discount}%
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${compact ? 'mt-2.5 py-2 px-3 text-[10px]' : 'mt-4 py-3 px-4'} ${
              isAdded
                ? 'bg-green-600 text-white shadow-md shadow-green-100 scale-95'
                : 'bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                Añadir
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
