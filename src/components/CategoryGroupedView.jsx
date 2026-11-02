import { apiFetch } from '../api';
import { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Heart, Loader2, ArrowLeft, Store } from 'lucide-react';

export default function CategoryGroupedView({
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
  onOpenProductModal,
  lat,
  lng,
  user,
  searchQuery = ''
}) {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const viewerRole = user?.rol || '';

  // Fetch products matching coords and user role
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/products/catalog?lat=${lat}&lng=${lng}&role=${viewerRole}`);
        const result = await res.json();
        if (res.ok && result.status === 'ok') {
          setDbProducts(result.data);
        }
      } catch (err) {
        console.error('Error fetching database products for category view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [lat, lng, viewerRole]);

  // Reset selected store when selected category changes
  useEffect(() => {
    setSelectedStore(null);
  }, [selectedCategory]);

  // Use database products only (all mocks removed)
  const allProducts = useMemo(() => {
    return dbProducts.map(p => ({
      ...p,
      id: `db-${p.id}`
    }));
  }, [dbProducts]);

  // Group by store and filter by category
  const groupedStores = useMemo(() => {
    // Filter by selected category
    let filtered = allProducts.filter(p => p.categoryKey === selectedCategory);

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.store.toLowerCase().includes(q)
      );
    }

    const groups = {};
    filtered.forEach(p => {
      if (!groups[p.store]) {
        groups[p.store] = {
          storeName: p.store,
          distance: p.distance,
          storeLogo: p.storeLogo || '',
          products: []
        };
      }
      groups[p.store].products.push(p);
    });

    Object.values(groups).forEach(g => {
      g.products.sort((a, b) => {
        const aDays = a.diasParaVencer !== undefined ? a.diasParaVencer : 999;
        const bDays = b.diasParaVencer !== undefined ? b.diasParaVencer : 999;
        if (aDays !== bDays) return aDays - bDays;
        return b.discount - a.discount;
      });
    });

    return Object.values(groups).sort((a, b) => a.distance - b.distance);
  }, [allProducts, selectedCategory, searchQuery]);

  // Detailed view products classification - showing ALL products from the selected store across all categories
  const storeDetailData = useMemo(() => {
    if (!selectedStore) return null;
    
    // Find all products for this store across all categories
    let storeProducts = allProducts.filter(p => p.store === selectedStore);

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      storeProducts = storeProducts.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.store.toLowerCase().includes(q)
      );
    }

    if (storeProducts.length === 0) return null;

    const firstProduct = storeProducts[0];
    const storeName = firstProduct.store;
    const distance = firstProduct.distance;
    const storeLogo = firstProduct.storeLogo || '';

    // Classification levels based on image requirements:
    // Level 1: Promociones (Los mayores descuentos Y fecha entre 3 a 5 días)
    const level1 = storeProducts.filter(p => p.diasParaVencer >= 3 && p.diasParaVencer <= 5 && p.discount > 0);
    level1.sort((a, b) => b.discount - a.discount);

    // Level 2: Los más vendidos (Descuentos Y fecha entre 6 a 15 días)
    const level2 = storeProducts.filter(p => p.diasParaVencer >= 6 && p.diasParaVencer <= 15 && p.discount > 0);
    level2.sort((a, b) => b.discount - a.discount);

    // Level 3: Combo (Descuentos Y fecha mas de 15 días)
    const level3 = storeProducts.filter(p => p.diasParaVencer > 15 && p.discount > 0);
    level3.sort((a, b) => b.discount - a.discount);

    // Other/Regular products of the store
    const others = storeProducts.filter(p => 
      !level1.some(l => l.id === p.id) && 
      !level2.some(l => l.id === p.id) && 
      !level3.some(l => l.id === p.id)
    );

    return {
      storeName,
      distance,
      storeLogo,
      level1,
      level2,
      level3,
      others
    };
  }, [selectedStore, allProducts, searchQuery]);

  // Render detailed view
  if (selectedStore && storeDetailData) {
    const maxDiscountLevel1 = storeDetailData.level1.length > 0
      ? Math.max(...storeDetailData.level1.map(p => p.discount))
      : 0;

    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-slate-50/20 border-b border-slate-100 transition-all duration-300">
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedStore(null)}
          className="mb-5 flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 text-xs font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a tiendas</span>
        </button>

        {/* Store Detail Header */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-6 flex flex-col sm:flex-row gap-5 items-center justify-between transition-all duration-300 hover:shadow-premium">
          <div className="flex items-center gap-4 text-left w-full sm:w-auto">
            {/* Circular Store Logo */}
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-100 shrink-0">
              {storeDetailData.storeLogo ? (
                <img src={storeDetailData.storeLogo} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <Store className="h-7 w-7 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 leading-tight flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition-colors">
                <span>{storeDetailData.storeName}</span>
                <span className="text-slate-400 font-normal">&rsaquo;</span>
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-full border border-blue-100 inline-block select-none">
                  📍 A {storeDetailData.distance} km de ti
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Categories (3 Levels) */}
        <div className="space-y-6">
          {/* Level 1: Promociones */}
          {storeDetailData.level1.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>Promociones</span>
                    {maxDiscountLevel1 > 0 && (
                      <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Hasta {maxDiscountLevel1}% menos
                      </span>
                    )}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Los mayores descuentos y vencimiento corto (3 a 5 días)</p>
                </div>
                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Ver más &rsaquo;</button>
              </div>
              <div className="overflow-x-auto pb-2 pt-0.5 snap-x no-scrollbar">
                <div className="flex gap-4">
                  {storeDetailData.level1.map(p => (
                    <div key={p.id} className="w-[210px] shrink-0 snap-start">
                      <ProductCard product={p} onAddToCart={onAddToCart} compact={true} onOpenModal={onOpenProductModal} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Level 2: Los más vendidos */}
          {storeDetailData.level2.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900">Los más vendidos</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Excelentes ofertas y vencimiento medio (6 a 15 días)</p>
                </div>
                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Ver más &rsaquo;</button>
              </div>
              <div className="overflow-x-auto pb-2 pt-0.5 snap-x no-scrollbar">
                <div className="flex gap-4">
                  {storeDetailData.level2.map(p => (
                    <div key={p.id} className="w-[210px] shrink-0 snap-start">
                      <ProductCard product={p} onAddToCart={onAddToCart} compact={true} onOpenModal={onOpenProductModal} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Level 3: Combo */}
          {storeDetailData.level3.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900">Combo</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Ahorra comprando a mediano plazo (más de 15 días)</p>
                </div>
                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Ver más &rsaquo;</button>
              </div>
              <div className="overflow-x-auto pb-2 pt-0.5 snap-x no-scrollbar">
                <div className="flex gap-4">
                  {storeDetailData.level3.map(p => (
                    <div key={p.id} className="w-[210px] shrink-0 snap-start">
                      <ProductCard product={p} onAddToCart={onAddToCart} compact={true} onOpenModal={onOpenProductModal} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Others row */}
          {storeDetailData.others.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-900">Otros Alimentos</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Más productos disponibles listos para rescatar hoy</p>
                </div>
                <button className="text-[10px] font-bold text-blue-600 hover:text-blue-700">Ver más &rsaquo;</button>
              </div>
              <div className="overflow-x-auto pb-2 pt-0.5 snap-x no-scrollbar">
                <div className="flex gap-4">
                  {storeDetailData.others.map(p => (
                    <div key={p.id} className="w-[210px] shrink-0 snap-start">
                      <ProductCard product={p} onAddToCart={onAddToCart} compact={true} onOpenModal={onOpenProductModal} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* If everything is empty in detail view */}
          {storeDetailData.level1.length === 0 &&
           storeDetailData.level2.length === 0 &&
           storeDetailData.level3.length === 0 &&
           storeDetailData.others.length === 0 && (
             <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
               <Heart className="h-12 w-12 text-slate-300 mx-auto mb-3 animate-pulse" />
               <h4 className="text-base font-bold text-slate-800">No hay productos en esta categoría</h4>
               <p className="text-xs text-slate-400 mt-1">Esta tienda no tiene alimentos activos de esta categoría actualmente.</p>
             </div>
           )}
        </div>
      </section>
    );
  }

  // Otherwise, render list of stores:
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 bg-slate-50/20 border-b border-slate-100 transition-all duration-300">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 capitalize">
            Tiendas en categoría "{selectedCategory}"
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualiza los establecimientos más cercanos que ofrecen alimentos rescatados de esta categoría.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && dbProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <p className="text-xs font-bold text-slate-400">Cargando productos de la categoría...</p>
        </div>
      ) : groupedStores.length > 0 ? (
        <div className="space-y-4 flex flex-col">
          {groupedStores.map((group) => (
            <div 
              key={group.storeName}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-stretch transition-all duration-300 hover:shadow-premium animate-fadeIn"
            >
              {/* Store Left Info Block */}
              <div className="flex md:flex-col justify-between md:justify-center items-start w-full md:w-36 md:border-r md:border-slate-100 md:pr-4 shrink-0 gap-2.5">
                <div 
                  onClick={() => setSelectedStore(group.storeName)}
                  className="text-left w-full cursor-pointer group/store"
                >
                  {/* Store Logo Circle */}
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xs font-black shadow-md mb-2 shrink-0 select-none transition-transform group-hover/store:scale-105">
                    {group.storeLogo ? (
                      <img src={group.storeLogo} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <Store className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight tracking-tight group-hover/store:text-blue-600 transition-colors flex items-center gap-1">
                    <span>{group.storeName}</span>
                    <span className="text-slate-400 font-normal">&rsaquo;</span>
                  </h3>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50/70 px-2 py-0.5 rounded-full border border-blue-100 md:bg-transparent md:border-0 md:px-0 md:py-0 md:mt-2 inline-block select-none shrink-0">
                    📍 {group.distance} km
                  </span>
                </div>
              </div>

              {/* Products horizontal lane */}
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
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <Heart className="h-10 w-10 text-slate-300 mx-auto mb-2 animate-pulse" />
          <h4 className="text-sm font-bold text-slate-800">No se encontraron productos</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No hay productos disponibles actualmente en esta categoría.
          </p>
        </div>
      )}
    </section>
  );
}
