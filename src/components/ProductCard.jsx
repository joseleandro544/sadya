import { useState } from 'react';
import { ShoppingCart, Check, Clock } from 'lucide-react';

export default function ProductCard({ product, onAddToCart }) {
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

  return (
    <div className="group flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
      {/* 50% Top: Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Top-Left: White Category Badge */}
        <span className="absolute top-3 left-3 bg-white text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider border border-slate-100/50">
          {category}
        </span>
        {/* Bottom-Right: Blue Distance Badge */}
        <span className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
          📍 {distance} km
        </span>
      </div>

      {/* Info Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Shop Name */}
          <span className="text-[11px] font-extrabold text-blue-600 tracking-wider uppercase block">
            {store}
          </span>
          {/* Product Name */}
          <h3 className="text-base font-extrabold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          {/* Red Alert: Vence Hoy */}
          <div className="mt-1.5 flex items-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
              <Clock className="h-3 w-3 animate-pulse" />
              {expiryText}
            </span>
          </div>
        </div>

        <div>
          {/* Prices Row */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-blue-600">
                {formatCurrency(price)}
              </span>
              <span className="text-xs font-semibold text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            </div>
            {/* Discount Badge */}
            <span className="rounded-lg bg-orange-100 px-2 py-1 text-[10px] font-extrabold text-orange-700">
              -{discount}%
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-full mt-4 flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs font-black tracking-wider uppercase transition-all duration-300 ${
              isAdded
                ? 'bg-green-600 text-white shadow-md shadow-green-100 scale-95'
                : 'bg-blue-600 text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-blue-200 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4" />
                Añadido
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Añadir al Carrito
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
