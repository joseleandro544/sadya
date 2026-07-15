import React, { useState } from 'react';
import { X, Clock, Check, ShoppingCart } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const {
    name,
    store,
    category,
    distance,
    image,
    price,
    originalPrice,
    discount,
    expiryText = "Vence Hoy",
    diasParaVencer,
    stock = 1,
    descripcion
  } = product;

  const isExpired = diasParaVencer < 0 || expiryText === 'Vencido';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val).replace('COP', 'COP ');
  };

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    if (qty < stock) setQty(qty + 1);
  };

  const handleAdd = () => {
    if (isExpired) return;
    onAddToCart(product, qty);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
  };

  const getExpiryStyle = () => {
    const text = (expiryText || '').toLowerCase();
    if (text.includes('hoy') || text.includes('vencido') || text.includes('1 día') || text.includes('2 días') || text.includes('ayer')) {
      return 'bg-red-50 text-red-600 border border-red-100';
    } else if (text.includes('3') || text.includes('4') || text.includes('próximo')) {
      return 'bg-amber-50 text-amber-700 border border-amber-100';
    } else {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row animate-slideUp max-h-[90vh] md:max-h-none z-10">
        
        {/* Left Side: Product Image */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[250px] bg-slate-150 shrink-0">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover" 
          />
          {/* Category Badge overlay */}
          <span className="absolute top-4 left-4 bg-white text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            {category}
          </span>
          {/* Distance Badge overlay */}
          <span className="absolute bottom-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            📍 {distance} km
          </span>
        </div>

        {/* Right Side: Product Details & Controls */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto relative">
          
          {/* Close button in top-right corner */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center z-10 cursor-pointer shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-4">
            <div>
              {/* Store details */}
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest block">
                {store}
              </span>
              {/* Product Title */}
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-1 uppercase tracking-tight">
                {name}
              </h2>
            </div>

            {/* Expiry Warning Row */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-bold border ${getExpiryStyle()}`}>
                <Clock className="h-3.5 w-3.5 animate-pulse" />
                {expiryText}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Stock: {stock} unidades
              </span>
            </div>

            {/* Description */}
            {descripcion ? (
              <p className="text-sm text-slate-500 leading-relaxed">
                {descripcion}
              </p>
            ) : (
              <p className="text-sm text-slate-400 italic">
                Sin descripción adicional para este producto excedente.
              </p>
            )}

            {/* Prices Row */}
            <div className="flex items-center gap-3 py-2 border-y border-slate-100">
              <span className="text-2xl font-black text-blue-600">
                {formatCurrency(price)}
              </span>
              <span className="text-sm font-semibold text-slate-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
              <span className="rounded-lg bg-orange-100 font-extrabold text-orange-700 px-2 py-0.5 text-[11px] block select-none">
                -{discount}% AHORRO
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {/* Quantity Selector Controls (Only if not expired) */}
            {!isExpired && (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider pl-1">
                  Cantidad a rescatar
                </span>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleDecrease}
                    disabled={qty <= 1}
                    className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-black cursor-pointer select-none"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-black text-slate-800 text-sm select-none">
                    {qty}
                  </span>
                  <button 
                    onClick={handleIncrease}
                    disabled={qty >= stock}
                    className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-black cursor-pointer select-none"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buy Action Button */}
            <button
              onClick={handleAdd}
              disabled={isAdded || isExpired}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-md ${
                isAdded
                  ? 'bg-green-600 text-white shadow-green-100 scale-[0.98]'
                  : isExpired
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white shadow-blue-150 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] cursor-pointer'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  ¡Añadido al Carrito!
                </>
              ) : isExpired ? (
                <>
                  <Clock className="h-4 w-4" />
                  Vencido (Compra Prohibida)
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Añadir al Carrito ({formatCurrency(price * qty)})
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
