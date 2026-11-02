import { api } from '../api';
import { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { SlidersHorizontal, Heart, ShieldCheck, Loader2 } from 'lucide-react';

export default function ProductGrid({ 
  searchQuery, 
  selectedCategory, 
  setSelectedCategory,
  onAddToCart,
  onOpenProductModal,
  userPreferences = [],
  setUserPreferences,
  lat = 4.632,
  lng = -74.068,
  user = null
}) {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const viewerRole = user?.rol || '';

  // Simulated interest triggers
  const interestOptions = [
    { id: 'none', label: 'Sin preferencia (Cercanía primero)' },
    { id: 'carnes', label: '🥩 Carnes Primero' },
    { id: 'verduras', label: '🥦 Verduras Primero' },
    { id: 'lacteos', label: '🥛 Lácteos Primero' },
    { id: 'panaderia', label: '🍞 Panadería Primero' }
  ];

  // 1. Fetch products from database catalog when coordinates/user role changes
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch(api(`/api/products/catalog?lat=${lat}&lng=${lng}&role=${viewerRole}`));
        const result = await res.json();
        if (res.ok && result.status === 'ok') {
          setDbProducts(result.data);
        }
      } catch (err) {
        console.error('Error fetching database product catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [lat, lng, viewerRole]);

  // Use only database products (all mock products removed)
  const allProducts = useMemo(() => {
    return dbProducts.map(p => ({
      ...p,
      id: `db-${p.id}` // Unique identifier mapping
    }));
  }, [dbProducts]);

  // General Filter & Sort (For non-grouped layout)
  const processedProducts = useMemo(() => {
    let list = [...allProducts];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.categoryKey === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.store.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort: user preferences first, then proximity
    list.sort((a, b) => {
      const aIsPreferred = userPreferences.includes(a.categoryKey);
      const bIsPreferred = userPreferences.includes(b.categoryKey);

      if (aIsPreferred && !bIsPreferred) return -1;
      if (!aIsPreferred && bIsPreferred) return 1;

      return a.distance - b.distance;
    });

    return list;
  }, [allProducts, searchQuery, selectedCategory, userPreferences]);

  // Grouped by Store logic (When category is selected)
  const groupedStores = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'all') {
      return [];
    }

    // 1. Filter by category
    let filtered = allProducts.filter(p => p.categoryKey === selectedCategory);

    // 2. Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.store.toLowerCase().includes(q)
      );
    }

    // 3. Group by store
    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.store]) {
        groups[p.store] = {
          storeName: p.store,
          distance: p.distance,
          products: []
        };
      }
      groups[p.store].products.push(p);
    });

    // 4. Sort products inside store (expiry ascending [next to expire first], discount descending [promotion first])
    Object.values(groups).forEach(g => {
      g.products.sort((a, b) => {
        const aDays = a.diasParaVencer !== undefined ? a.diasParaVencer : 999;
        const bDays = b.diasParaVencer !== undefined ? b.diasParaVencer : 999;
        if (aDays !== bDays) return aDays - bDays;
        return b.discount - a.discount;
      });
    });

    // 5. Sort stores by proximity (closest first)
    return Object.values(groups).sort((a, b) => a.distance - b.distance);
  }, [allProducts, selectedCategory, searchQuery]);

  const isCategorySelected = selectedCategory && selectedCategory !== 'all';

  return (
    <section 
      id="productos" 
      className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-t border-b border-slate-100 transition-all duration-300 ${
        isCategorySelected ? 'py-6' : 'py-12'
      }`}
    >
      
      {/* Title */}
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${isCategorySelected ? 'mb-5' : 'mb-8'}`}>
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

      {/* Simulator Control Panel: Gustos de Usuario (Only show on default grid catalog) */}
      {!isCategorySelected && (
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
      )}

      {/* Loading state */}
      {loading && dbProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Actualizando productos por cercanía...</p>
        </div>
      ) : isCategorySelected ? (
        /* Grouped by Store Layout (Horizontal Carrusels) - Compacted Design */
        groupedStores.length > 0 ? (
          <div className="space-y-4 flex flex-col">
            {groupedStores.map((group) => (
              <div 
                key={group.storeName}
                className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-stretch transition-all duration-300 hover:shadow-premium"
              >
                {/* Store Left Info Block (Only name and distance in km, no images, no delivery details) */}
                <div className="flex md:flex-col justify-between md:justify-center items-start w-full md:w-36 md:border-r md:border-slate-100 md:pr-4 shrink-0 gap-1.5">
                  <div className="text-left w-full">
                    <h3 className="text-sm font-black text-slate-900 leading-tight tracking-tight hover:text-blue-600 transition-colors flex items-center gap-1 cursor-pointer">
                      <span>{group.storeName}</span>
                      <span className="text-slate-400 font-normal">&rsaquo;</span>
                    </h3>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-full border border-blue-100 md:bg-transparent md:border-0 md:px-0 md:py-0 md:mt-2 inline-block select-none shrink-0">
                      📍 {group.distance} km
                    </span>
                  </div>
                </div>

                {/* Products Right Horizontal scrollable list - w-[210px] for compact look */}
                <div className="w-full flex-grow overflow-hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2.5 pt-0.5 snap-x no-scrollbar">
                    {group.products.map((product) => (
                      <div key={product.id} className="w-[210px] shrink-0 snap-start">
                        <ProductCard 
                          product={product} 
                          onAddToCart={onAddToCart} 
                          compact={true}
                          onOpenModal={onOpenProductModal}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-pulse" />
            <h4 className="text-base font-bold text-slate-800">No se encontraron productos</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Prueba a cambiar tu búsqueda para esta categoría o restablece los filtros.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-4 rounded-full bg-blue-600 text-white px-6 py-2 text-xs font-bold hover:bg-blue-700 shadow transition-colors"
            >
              Ver todos los productos
            </button>
          </div>
        )
      ) : (
        /* Default Grid Layout for 'all' or outside category view */
        processedProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {processedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart} 
                onOpenModal={onOpenProductModal}
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
        )
      )}
    </section>
  );
}
