import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Sparkles, SlidersHorizontal, Heart, ShieldCheck } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "FRESAS FRESCAS",
    store: "El Tigre",
    category: "VERDURAS", // As requested by prompt: category "VERDURAS" for FRESAS
    categoryKey: "verduras",
    distance: 1.7,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80",
    price: 15000,
    originalPrice: 20000,
    discount: 25,
    expiryText: "Vence Hoy"
  },
  {
    id: 2,
    name: "SOLOMITO DE RES MADURADO",
    store: "Carnes del Oriente",
    category: "CARNICERÍAS",
    categoryKey: "carnes",
    distance: 2.1,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
    price: 24000,
    originalPrice: 40000,
    discount: 40,
    expiryText: "Vence Hoy"
  },
  {
    id: 3,
    name: "LECHE ENTERA ULTRA CREMOSA x6L",
    store: "Colanta Express",
    category: "LÁCTEOS",
    categoryKey: "lacteos",
    distance: 0.8,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    price: 18000,
    originalPrice: 30000,
    discount: 40,
    expiryText: "Vence Hoy"
  },
  {
    id: 4,
    name: "PAN DE MASA MADRE MULTIGRANO",
    store: "Trigos y Semillas",
    category: "PANADERÍAS",
    categoryKey: "panaderia",
    distance: 1.2,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
    price: 6000,
    originalPrice: 12000,
    discount: 50,
    expiryText: "Vence Hoy"
  },
  {
    id: 5,
    name: "ENSALADA CÉSAR PREPARADA",
    store: "La Huerta Verde",
    category: "VERDURAS",
    categoryKey: "verduras",
    distance: 2.5,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&auto=format&fit=crop&q=80",
    price: 9000,
    originalPrice: 18000,
    discount: 50,
    expiryText: "Vence Hoy"
  },
  {
    id: 6,
    name: "DONAS SURTIDAS GOURMET x6",
    store: "Sweet Donuts",
    category: "POSTRES",
    categoryKey: "postres",
    distance: 1.9,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&auto=format&fit=crop&q=80",
    price: 12500,
    originalPrice: 25000,
    discount: 50,
    expiryText: "Vence Hoy"
  },
  {
    id: 7,
    name: "COMBO HAMBURGUESA DOBLE CON PAPAS",
    store: "Burger Station",
    category: "COMIDAS RÁPIDAS",
    categoryKey: "rapida",
    distance: 1.5,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    price: 15000,
    originalPrice: 25000,
    discount: 40,
    expiryText: "Vence Hoy"
  },
  {
    id: 8,
    name: "LENTEJAS SELECCIONADAS IMPORTADAS 1KG",
    store: "Granos del Campo",
    category: "GRANOS",
    categoryKey: "granos",
    distance: 3.2,
    image: "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?w=600&auto=format&fit=crop&q=80",
    price: 4500,
    originalPrice: 6000,
    discount: 25,
    expiryText: "Vence Hoy"
  },
  {
    id: 9,
    name: "MANZANAS ROJAS IMPORTADAS x4",
    store: "El Tigre",
    category: "VERDURAS", // Let's keep apples under vegetables if we map frutas to verduras or keep it simple
    categoryKey: "frutas",
    distance: 1.7,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    price: 7500,
    originalPrice: 10000,
    discount: 25,
    expiryText: "Vence Hoy"
  },
  {
    id: 10,
    name: "PECHO DE POLLO FRESCO 1KG",
    store: "Pollo del Campo",
    category: "CARNICERÍAS",
    categoryKey: "carnes",
    distance: 2.8,
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&auto=format&fit=crop&q=80",
    price: 13200,
    originalPrice: 22000,
    discount: 40,
    expiryText: "Vence Hoy"
  }
];

export default function ProductGrid({ 
  searchQuery, 
  selectedCategory, 
  setSelectedCategory,
  onAddToCart,
  userPreferences = [],
  setUserPreferences
}) {
  
  // Simulated interest triggers
  const interestOptions = [
    { id: 'none', label: 'Sin preferencia (Cercanía primero)' },
    { id: 'carnes', label: '🥩 Carnes Primero' },
    { id: 'verduras', label: '🥦 Verduras Primero' },
    { id: 'lacteos', label: '🥛 Lácteos Primero' },
    { id: 'panaderia', label: '🍞 Panadería Primero' }
  ];

  // Logic to filter and sort products
  const processedProducts = useMemo(() => {
    // 1. Filter by category click (if a specific category other than 'all' is selected)
    let list = [...MOCK_PRODUCTS];

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.categoryKey === selectedCategory);
    }

    // 2. Filter by search query in search bar
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.store.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // 3. Dynamic Sorting based on Simulated User Preferences (Multiple allowed)
    // Rule: If product's categoryKey matches any of the active userPreferences, we give it sorting weight.
    // Within that, or for others, we sort by distance (closest first).
    list.sort((a, b) => {
      const aIsPreferred = userPreferences.includes(a.categoryKey);
      const bIsPreferred = userPreferences.includes(b.categoryKey);

      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;

      // Default sorting: Distance (closest first)
      return a.distance - b.distance;
    });

    return list;
  }, [searchQuery, selectedCategory, userPreferences]);

  return (
    <section id="productos" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-slate-50/50 border-t border-b border-slate-100">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Alimentos cerca de ti, al mejor precio
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Ordenado de forma inteligente para evitar el desperdicio y ahorrar dinero.
          </p>
        </div>

        {/* Algorithm Status Indicator */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-2xl border border-blue-100 text-xs font-semibold self-start">
          <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
          <span>Algoritmo Inteligente Activo</span>
        </div>
      </div>

      {/* Simulator Control Panel: Gustos de Usuario */}
      <div className="mb-8 p-5 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Simulador de Preferencias del Consumidor
          </h3>
          <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Lógica de Negocio
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Para simular el ordenamiento personalizado requerido, selecciona una preferencia a continuación. El sistema moverá los productos de esa categoría al principio de la lista de forma dinámica:
        </p>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((opt) => {
            const isActive = opt.id === 'none' 
              ? userPreferences.length === 0 
              : userPreferences.includes(opt.id);

            const handleToggle = () => {
              if (opt.id === 'none') {
                setUserPreferences([]);
              } else {
                if (userPreferences.includes(opt.id)) {
                  setUserPreferences(userPreferences.filter(id => id !== opt.id));
                } else {
                  setUserPreferences([...userPreferences, opt.id]);
                }
              }
            };

            return (
              <button
                key={opt.id}
                onClick={handleToggle}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100 scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Layout */}
      {processedProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {processedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <Heart className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-pulse" />
          <h4 className="text-base font-bold text-slate-800">No se encontraron productos</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Prueba a cambiar tus filtros de búsqueda o restablecer la categoría para rescatar alimentos hoy.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setUserPreferences([]);
            }}
            className="mt-4 rounded-full bg-blue-600 text-white px-6 py-2 text-xs font-bold hover:bg-blue-700 shadow transition-colors"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </section>
  );
}
