import { api } from '../api';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, PlusCircle, CheckCircle, ShieldAlert, 
  Calendar, Layers, DollarSign, Tag, Archive, Image as ImageIcon, Info, 
  HeartHandshake, Home, Clock, Sparkles, RefreshCw, Eye
} from 'lucide-react';

export default function SellerProductsPage({ user, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Navigation tabs: 'both' | 'form' | 'inventory'
  const [activeTab, setActiveTab] = useState('both');

  // Form fields matching t_productos DB table
  const [categoria, setCategoria] = useState('Verduras');
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [costoOriginal, setCostoOriginal] = useState('');
  const [costoConDescuento, setCostoConDescuento] = useState('');
  const [cantidadDisponible, setCantidadDisponible] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  // Validations states
  const [validationErrors, setValidationErrors] = useState({});

  const categories = [
    { name: 'Verduras', icon: '🥦' },
    { name: 'Frutas', icon: '🍎' },
    { name: 'Granos', icon: '🌾' },
    { name: 'Carnes', icon: '🥩' },
    { name: 'Lácteos', icon: '🥛' },
    { name: 'Panadería', icon: '🍞' },
    { name: 'Postres', icon: '🍰' },
    { name: 'Comidas Rápidas', icon: '🍔' },
    { name: 'Tienda', icon: '🏪' },
    { name: 'Restaurante', icon: '🍽️' }
  ];

  const PRESET_IMAGES = {
    Verduras: [
      { label: 'Papas Criollas', url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&fit=crop&q=80' },
      { label: 'Tomates Chonto', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&fit=crop&q=80' },
      { label: 'Zanahorias', url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5c717?w=500&fit=crop&q=80' },
      { label: 'Cebolla Cabezona', url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&fit=crop&q=80' }
    ],
    Frutas: [
      { label: 'Fresas Frescas', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&fit=crop&q=80' },
      { label: 'Plátanos / Bananos', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&fit=crop&q=80' },
      { label: 'Aguacate Hass', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&fit=crop&q=80' },
      { label: 'Naranjas / Cítricos', url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500&fit=crop&q=80' }
    ],
    Granos: [
      { label: 'Arroz', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&fit=crop&q=80' },
      { label: 'Fríjol Bola Roja', url: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=500&fit=crop&q=80' },
      { label: 'Maíz Tierno', url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&fit=crop&q=80' }
    ],
    Carnes: [
      { label: 'Cortes de Res', url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&fit=crop&q=80' },
      { label: 'Pechuga de Pollo', url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&fit=crop&q=80' }
    ],
    Lácteos: [
      { label: 'Leche Fresca', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&fit=crop&q=80' },
      { label: 'Queso Campesino', url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&fit=crop&q=80' },
      { label: 'Yogurt Artesanal', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&fit=crop&q=80' }
    ],
    Panadería: [
      { label: 'Pan Tradicional', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&fit=crop&q=80' },
      { label: 'Croissants', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&fit=crop&q=80' }
    ]
  };

  // Restrict access to farmer and store roles
  const isSeller = user && (
    user.rol === 'Campesino' || 
    user.rol === 'Productor' || 
    user.rol === 'Tienda' || 
    user.rol === 'Tendero'
  );

  const isFarmer = user && (user.rol === 'Campesino' || user.rol === 'Productor');

  useEffect(() => {
    if (isSeller) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(api(`/api/products/seller/${user.id}`));
      const data = await res.json();
      if (res.ok) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Error al cargar tu inventario.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    // Client-side validations
    const newErrors = {};
    if (!nombreProducto.trim()) newErrors.nombreProducto = 'El nombre del producto es obligatorio.';
    if (!costoOriginal || isNaN(costoOriginal) || Number(costoOriginal) <= 0) {
      newErrors.costoOriginal = 'El costo original debe ser un valor positivo en COP.';
    }
    if (costoConDescuento && (isNaN(costoConDescuento) || Number(costoConDescuento) < 0)) {
      newErrors.costoConDescuento = 'El precio con descuento debe ser positivo.';
    }
    if (costoConDescuento && Number(costoConDescuento) >= Number(costoOriginal)) {
      newErrors.costoConDescuento = 'El precio con descuento debe ser menor al costo original.';
    }
    if (!cantidadDisponible || isNaN(cantidadDisponible) || Number(cantidadDisponible) <= 0) {
      newErrors.cantidadDisponible = 'El stock disponible debe ser mayor a cero.';
    }
    if (!fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
    } else {
      const selectedDate = new Date(fechaVencimiento);
      const today = new Date();
      today.setHours(0,0,0,0);
      selectedDate.setHours(23,59,59,999);
      if (selectedDate < today) {
        newErrors.fechaVencimiento = 'No puedes registrar un producto que ya venció.';
      }
    }

    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Fecha fin de promoción: automática y oculta (misma fecha de vencimiento a las 00:00:00)
    const autoFinPromocion = fechaVencimiento ? `${fechaVencimiento} 00:00:00` : null;

    setSubmitLoading(true);
    try {
      const res = await fetch(api('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          nombre_producto: nombreProducto.trim(),
          costo_original: Number(costoOriginal),
          costo_con_descuento: costoConDescuento ? Number(costoConDescuento) : null,
          cantidad_disponible: parseInt(cantidadDisponible, 10),
          fecha_vencimiento: fechaVencimiento,
          fecha_fin_promocion: autoFinPromocion,
          categoria,
          descripcion: descripcion.trim() || null,
          imagen_url: imagenUrl.trim() || null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al publicar el producto.');
      } else {
        setSuccess('¡Producto registrado y publicado exitosamente en el catálogo de SADYA!');
        // Reset form fields
        setNombreProducto('');
        setDescripcion('');
        setCostoOriginal('');
        setCostoConDescuento('');
        setCantidadDisponible('');
        setFechaVencimiento('');
        setImagenUrl('');
        setValidationErrors({});
        // Refresh inventory
        fetchProducts();
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDonate = async (productId, quantity) => {
    if (!window.confirm('¿Confirmas que deseas donar el excedente completo de este producto vencido a las fundaciones asociadas de SADYA?')) return;
    
    setError('');
    setSuccess('');
    try {
      const res = await fetch(api('/api/products/donate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_producto: productId,
          id_usuario: user.id,
          cantidad: quantity
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al registrar la donación.');
      } else {
        setSuccess('¡El producto vencido ha sido donado con éxito! Recibirás tu certificado social pronto.');
        fetchProducts();
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor para la donación.');
    }
  };

  const handleDiscard = async (productId) => {
    if (!window.confirm('¿Confirmas que deseas descartar y dar de baja este producto vencido del inventario?')) return;
    
    setError('');
    setSuccess('');
    try {
      const res = await fetch(api('/api/products/discard'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_producto: productId,
          id_usuario: user.id
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al descartar el producto.');
      } else {
        setSuccess('¡El producto vencido ha sido retirado con éxito!');
        fetchProducts();
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor para descartar el producto.');
    }
  };

  const getExpirationStatus = (expiryDateStr) => {
    const expiryDate = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        color: 'red', 
        label: 'Producto Vencido', 
        badgeClass: 'text-red-600 bg-red-50 border-red-100', 
        borderClass: 'border-red-200 focus-within:ring-red-100'
      };
    } else if (diffDays <= 4) {
      return { 
        color: 'orange', 
        label: `Vence en ${diffDays} día(s)`, 
        badgeClass: 'text-amber-700 bg-amber-50 border-amber-100', 
        borderClass: 'border-amber-200 focus-within:ring-amber-100'
      };
    } else {
      return { 
        color: 'green', 
        label: `Vence en ${diffDays} días`, 
        badgeClass: 'text-green-700 bg-green-50 border-green-100', 
        borderClass: 'border-green-200 focus-within:ring-green-100'
      };
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Discount calculation helper
  const discountPercent = (costoOriginal && costoConDescuento && Number(costoOriginal) > Number(costoConDescuento))
    ? Math.round(((Number(costoOriginal) - Number(costoConDescuento)) / Number(costoOriginal)) * 100)
    : 0;

  const ahorro = (costoOriginal && costoConDescuento && Number(costoOriginal) > Number(costoConDescuento))
    ? Number(costoOriginal) - Number(costoConDescuento)
    : 0;

  // Gatekeeper: only Campesinos and Tenderos allowed
  if (!isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mx-auto mb-4 border border-red-100 shadow-sm">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <span className="inline-block rounded-full bg-red-100/70 text-red-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider mb-2">
            Acceso Exclusivo
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Sección Restringida</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Este formulario de registro de productos está configurado únicamente para los perfiles de <strong>Campesino / Productor</strong> y <strong>Tendero / Tienda</strong>.
          </p>
          <button
            onClick={onBack}
            className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-6 text-xs font-black tracking-wider uppercase shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Volver a la Pantalla de Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      
      {/* ── NAVEGADOR EN LA PARTE SUPERIOR (SUPERIOR NAVIGATION BAR) ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Left: Brand & Profile Badge */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-base shadow-md shadow-blue-200">
                S
              </div>
              <div className="leading-tight">
                <span className="font-black text-slate-900 text-base">SAD<span className="text-blue-600">YA</span></span>
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Módulo de Productos
                </span>
              </div>
            </div>

            {/* Profile Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold shadow-xs">
              <span>{isFarmer ? '🌾' : '🏪'}</span>
              <span>{isFarmer ? 'Perfil: Campesino' : 'Perfil: Tendero'}</span>
              <span className="hidden sm:inline text-[10px] opacity-75">({user?.nombres})</span>
            </div>
          </div>

          {/* Center: Navigation Controls (Inicio vs Registro de Productos vs Inventario) */}
          <nav className="flex items-center justify-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-center">
            
            {/* 1. Botón: Pantalla de Inicio */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-white transition-all shadow-none hover:shadow-xs cursor-pointer"
              title="Regresar a la pantalla de inicio (Marketplace)"
            >
              <Home className="h-4 w-4 text-slate-500" />
              <span>Pantalla de Inicio</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            {/* 2. Botón: Formulario de Registro */}
            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'form' || activeTab === 'both'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Registro de Productos</span>
            </button>

            {/* 3. Botón: Mi Inventario */}
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-white'
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>Mi Inventario</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeTab === 'inventory' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {products.length}
              </span>
            </button>

            {/* 4. Botón: Vista Dividida (Ambos en Desktop) */}
            <button
              onClick={() => setActiveTab('both')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'both'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Ver Formulario e Inventario en pantalla completa"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Ver Ambos</span>
            </button>
          </nav>

          {/* Right: Quick actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Salir al Inicio</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL SEGÚN PESTAÑA ACTIVA ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Notificaciones globales */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-xs font-semibold shadow-xs">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-700 font-bold">✕</button>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 text-xs font-semibold shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('inventory')} 
                className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-[11px] font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Ver en mi inventario →
              </button>
              <button onClick={() => setSuccess('')} className="text-emerald-500 hover:text-emerald-800 font-bold ml-1">✕</button>
            </div>
          </div>
        )}

        <div className={`grid gap-8 items-start ${
          activeTab === 'both' 
            ? 'lg:grid-cols-12' 
            : 'max-w-3xl mx-auto grid-cols-1'
        }`}>

          {/* ================= SECCIÓN: FORMULARIO DE REGISTRO DE PRODUCTOS ================= */}
          {(activeTab === 'form' || activeTab === 'both') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6 xl:col-span-5' : 'w-full'} bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg`}>
              
              {/* Encabezado del Formulario */}
              <div className="mb-6 pb-4 border-b border-slate-100 flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-[10px] font-black uppercase tracking-wider mb-2">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                    Publicación Oficial
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Registro de Productos
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Registra alimentos excedentes, cosechas o lotes para comercializarlos a precios de rescate o donarlos antes de vencerse.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePublish} className="space-y-5">
                
                {/* 1. Categoría del Alimento (t_productos.categoria) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-blue-600" />
                    Categoría del Alimento *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const isSelected = categoria === cat.name;
                      return (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setCategoria(cat.name)}
                          className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100 shadow-xs'
                              : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Nombre del Producto (t_productos.nombre_producto) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nombre" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
                    Nombre del Alimento o Producto *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    placeholder="Ej. Bulto de Papa Criolla 50kg, Caja de Tomate Chonto..."
                    value={nombreProducto}
                    onChange={(e) => setNombreProducto(e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:bg-white focus:ring-4 ${
                      validationErrors.nombreProducto ? 'border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                    }`}
                  />
                  {validationErrors.nombreProducto && (
                    <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.nombreProducto}</span>
                  )}
                </div>

                {/* 3. Costos: Costo Original y Precio de Rescate con Descuento (t_productos.costo_original y costo_con_descuento) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Costo Original */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="costoOrig" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-blue-600" />
                      Costo Original (COP) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                      <input
                        id="costoOrig"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Ej. 25000"
                        value={costoOriginal}
                        onChange={(e) => setCostoOriginal(e.target.value)}
                        className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-8 pr-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                          validationErrors.costoOriginal ? 'border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                        }`}
                      />
                    </div>
                    {validationErrors.costoOriginal && (
                      <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.costoOriginal}</span>
                    )}
                  </div>

                  {/* Precio con Descuento */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="costoDesc" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5 text-blue-600" />
                      Precio con Descuento (COP)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                      <input
                        id="costoDesc"
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Ej. 12000"
                        value={costoConDescuento}
                        onChange={(e) => setCostoConDescuento(e.target.value)}
                        className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-8 pr-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                          validationErrors.costoConDescuento ? 'border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                        }`}
                      />
                    </div>
                    {validationErrors.costoConDescuento && (
                      <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.costoConDescuento}</span>
                    )}
                  </div>
                </div>

                {/* Badge de Descuento en Vivo */}
                {discountPercent > 0 && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800 font-bold animate-fade-in">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏷️</span>
                      <span>¡Oferta de Rescate calculada!</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-[11px] font-black">
                        -{discountPercent}% OFF
                      </span>
                      <span className="text-emerald-700 text-[11px]">
                        Ahorro: {formatCurrency(ahorro)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Stock Disponible y Fecha de Vencimiento (t_productos.cantidad_disponible y fecha_vencimiento) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Stock */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="stock" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Archive className="h-3.5 w-3.5 text-blue-600" />
                      Cantidad / Stock Disponible *
                    </label>
                    <input
                      id="stock"
                      type="number"
                      min="1"
                      placeholder="Ej. 10 (unidades o kg)"
                      value={cantidadDisponible}
                      onChange={(e) => setCantidadDisponible(e.target.value)}
                      className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                        validationErrors.cantidadDisponible ? 'border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                      }`}
                    />
                    {validationErrors.cantidadDisponible && (
                      <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.cantidadDisponible}</span>
                    )}
                  </div>

                  {/* Fecha de Vencimiento */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="vencimiento" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      Fecha de Vencimiento *
                    </label>
                    <input
                      id="vencimiento"
                      type="date"
                      value={fechaVencimiento}
                      onChange={(e) => setFechaVencimiento(e.target.value)}
                      className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                        validationErrors.fechaVencimiento ? 'border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                      }`}
                    />
                    {validationErrors.fechaVencimiento && (
                      <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.fechaVencimiento}</span>
                    )}
                  </div>
                </div>

                {/* 5. Descripción del Producto (t_productos.descripcion) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="desc" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-blue-600" />
                    Descripción y Estado del Alimento
                  </label>
                  <textarea
                    id="desc"
                    rows={3}
                    placeholder="Describe el estado de frescura, madurez, empaque, condiciones de almacenamiento o recomendaciones de uso..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all resize-none"
                  />
                </div>

                {/* 7. Imagen del Producto (t_productos.imagen_url) con Selector de Fotos Rápidas */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="image" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                    Foto o Imagen del Producto
                  </label>
                  
                  <input
                    id="image"
                    type="url"
                    placeholder="Pega un enlace de foto o selecciona una sugerencia abajo..."
                    value={imagenUrl}
                    onChange={(e) => setImagenUrl(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all"
                  />

                  {/* Sugerencias Rápidas de Fotos según Categoría */}
                  {PRESET_IMAGES[categoria] && PRESET_IMAGES[categoria].length > 0 && (
                    <div className="mt-1">
                      <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                        ⚡ Fotos sugeridas para {categoria} (clic para seleccionar):
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_IMAGES[categoria].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImagenUrl(preset.url)}
                            className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all p-1 cursor-pointer ${
                              imagenUrl === preset.url
                                ? 'border-blue-600 ring-2 ring-blue-100 bg-blue-50'
                                : 'border-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover rounded-lg" />
                            <span className="block text-[10px] font-extrabold text-slate-700 truncate mt-1">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Previsualización en vivo */}
                  {imagenUrl && (
                    <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <img 
                        src={imagenUrl} 
                        alt="Previsualización" 
                        className="h-16 w-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&fit=crop&q=80'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Foto vinculada correctamente
                        </span>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{imagenUrl}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImagenUrl('')}
                        className="text-slate-400 hover:text-red-500 p-1 font-bold text-xs"
                        title="Quitar foto"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Botón de Publicar */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full mt-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 px-6 text-xs font-black text-white tracking-widest uppercase shadow-lg shadow-blue-200 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-65 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Registrando en base de datos...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      PUBLICAR EN EL CATÁLOGO DE SADYA
                    </>
                  )}
                </button>

              </form>
            </div>
          )}

          {/* ================= SECCIÓN: MI INVENTARIO DE PRODUCTOS ================= */}
          {(activeTab === 'inventory' || activeTab === 'both') && (
            <div className={`${activeTab === 'both' ? 'lg:col-span-6 xl:col-span-7' : 'w-full'} flex flex-col gap-6`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">Mis Productos Publicados</h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualiza el estado de tus excedentes y dónalos a fundaciones en caso de vencimiento.
              </p>
            </div>
            
            <button
              onClick={fetchProducts}
              className="rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 px-4 py-2 text-xs font-bold transition-colors cursor-pointer self-start"
            >
              🔄 Actualizar
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {products.map((product) => {
                const expiryInfo = getExpirationStatus(product.fecha_vencimiento);
                const isDonated = product.id_estado === 3 || product.nombre_estado === 'Donado';
                const formattedDate = new Date(product.fecha_vencimiento).toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
                
                // Fallback default image depending on category
                const defaultImages = {
                  Verduras: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&fit=crop&q=80',
                  Frutas: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&fit=crop&q=80',
                  Granos: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&fit=crop&q=80',
                  Carnes: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&fit=crop&q=80',
                  Lácteos: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&fit=crop&q=80',
                  Panadería: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&fit=crop&q=80'
                };
                const displayImage = product.imagen_url || defaultImages[product.categoria] || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&fit=crop&q=80';

                return (
                  <div
                    key={product.id_producto}
                    className={`rounded-2xl border-2 bg-white shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all ${
                      isDonated ? 'opacity-85 border-slate-100 bg-slate-50/50' : expiryInfo.borderClass
                    }`}
                  >
                    
                    {/* Visual header image and badge */}
                    <div className="h-32 w-full relative bg-slate-100">
                      <img 
                        src={displayImage} 
                        alt={product.nombre_producto}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
                        <span className="bg-slate-900/70 backdrop-blur-sm text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                          {product.categoria}
                        </span>
                        
                        {isDonated ? (
                          <span className="bg-green-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                            <CheckCircle className="h-2.5 w-2.5" /> Donado
                          </span>
                        ) : (
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border shadow-sm ${expiryInfo.badgeClass}`}>
                            {expiryInfo.label}
                          </span>
                        )}
                      </div>

                      {/* Stock overlay badge */}
                      <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-xs font-bold">
                        Stock: {product.cantidad_disponible} und
                      </div>
                    </div>

                    {/* Card Content info */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                          {product.nombre_producto}
                        </h4>
                        
                        {product.descripcion && (
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                            {product.descripcion}
                          </p>
                        )}
                        
                        <div className="mt-3 flex items-baseline gap-2">
                          {product.costo_con_descuento ? (
                            <>
                              <span className="text-sm font-black text-blue-600">
                                {formatCurrency(product.costo_con_descuento)}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 line-through">
                                {formatCurrency(product.costo_original)}
                              </span>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                -{Math.round(((product.costo_original - product.costo_con_descuento) / product.costo_original) * 100)}%
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-black text-slate-800">
                              {formatCurrency(product.costo_original)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold gap-2">
                        <span>Vence: <strong className="text-slate-700">{formattedDate}</strong></span>

                        {/* Expiry Action Buttons (Donate / Discard) */}
                        {expiryInfo.color === 'red' && !isDonated && product.cantidad_disponible > 0 && (
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDonate(product.id_producto, product.cantidad_disponible)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2 py-1 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-0.5 cursor-pointer text-[10px]"
                              title="Donar este excedente a fundaciones"
                            >
                              <HeartHandshake className="h-3 w-3" /> Donar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDiscard(product.id_producto)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg px-2 py-1 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-0.5 cursor-pointer text-[10px]"
                              title="Descartar y dar de baja del catálogo"
                            >
                              <Archive className="h-3 w-3" /> Descartar
                            </button>
                          </div>
                        )}

                        {isDonated && (
                          <span className="text-green-600 font-bold flex items-center gap-1 select-none">
                            <CheckCircle className="h-3 w-3 shrink-0" /> Alimento Rescatado
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <ShoppingBag className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">Tu catálogo está vacío</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No has publicado ningún excedente alimenticio todavía. Usa el formulario de la izquierda para comenzar a publicar en el catálogo real.
              </p>
            </div>
          )}

        </div>
      )}

        </div>

      </main>

    </div>
  );
}
