import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShoppingBag, PlusCircle, CheckCircle, ShieldAlert, 
  Calendar, Layers, DollarSign, Tag, Archive, Image, Info, HeartHandshake
} from 'lucide-react';

export default function SellerProductsPage({ user, onBack }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form fields
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
    'Verduras', 'Frutas', 'Granos', 'Carnes', 
    'Comidas Rápidas', 'Tienda', 'Lácteos', 'Panadería', 'Restaurante'
  ];

  // Restrict access to farmer and store roles
  const isSeller = user && (
    user.rol === 'Campesino' || 
    user.rol === 'Productor' || 
    user.rol === 'Tienda' || 
    user.rol === 'Tendero'
  );

  useEffect(() => {
    if (isSeller) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/seller/${user.id}`);
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
    if (!nombreProducto.trim()) newErrors.nombreProducto = 'El nombre es obligatorio.';
    if (!costoOriginal || isNaN(costoOriginal) || Number(costoOriginal) <= 0) {
      newErrors.costoOriginal = 'El costo debe ser un número positivo.';
    }
    if (costoConDescuento && (isNaN(costoConDescuento) || Number(costoConDescuento) < 0)) {
      newErrors.costoConDescuento = 'El precio con descuento debe ser positivo.';
    }
    if (costoConDescuento && Number(costoConDescuento) > Number(costoOriginal)) {
      newErrors.costoConDescuento = 'El precio especial no puede ser mayor que el costo original.';
    }
    if (!cantidadDisponible || isNaN(cantidadDisponible) || Number(cantidadDisponible) <= 0) {
      newErrors.cantidadDisponible = 'El stock debe ser mayor a cero.';
    }
    if (!fechaVencimiento) {
      newErrors.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
    } else {
      const selectedDate = new Date(fechaVencimiento);
      const today = new Date();
      today.setHours(0,0,0,0);
      selectedDate.setHours(23,59,59,999); // Include entire expiration day
      if (selectedDate < today) {
        newErrors.fechaVencimiento = 'No puedes registrar un producto que ya venció.';
      }
    }

    setValidationErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: user.id,
          nombre_producto: nombreProducto.trim(),
          costo_original: Number(costoOriginal),
          costo_con_descuento: costoConDescuento ? Number(costoConDescuento) : null,
          cantidad_disponible: parseInt(cantidadDisponible, 10),
          fecha_vencimiento: fechaVencimiento,
          categoria,
          descripcion: descripcion.trim() || null,
          imagen_url: imagenUrl.trim() || null
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al publicar el producto.');
      } else {
        setSuccess('¡Producto publicado con éxito en el catálogo!');
        // Reset form
        setNombreProducto('');
        setDescripcion('');
        setCostoOriginal('');
        setCostoConDescuento('');
        setCantidadDisponible('');
        setFechaVencimiento('');
        setImagenUrl('');
        // Refresh list
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
      const res = await fetch('/api/products/donate', {
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
    }).format(val);
  };

  if (!isSeller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
          <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Acceso No Autorizado</h2>
          <p className="text-sm text-slate-500 mb-6">
            Esta sección solo está disponible para Campesinos/Productores y Tiendas registradas en la plataforma.
          </p>
          <button
            onClick={onBack}
            className="rounded-full bg-blue-600 text-white px-8 py-3 text-xs font-black tracking-wider uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 font-sans">
      
      {/* Navbar Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs shadow">S</div>
          <span className="font-extrabold text-slate-900 text-sm">SADYA · <span className="text-blue-600">Publicador de Alimentos</span></span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: Food Publication Form ================= */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl">
          <div className="mb-6">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 mb-2 uppercase tracking-wider">
              Catálogo Directo
            </span>
            <h2 className="text-2xl font-black text-slate-900">Formulario de productos</h2>
            <p className="text-xs text-slate-400 mt-1">
              Publica tus excedentes de alimentos a precios reducidos o indícalos para donaciones.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl p-3 text-xs font-semibold">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            
            {/* Food Category Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                Categoría del Alimento *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all cursor-pointer font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5 text-blue-600" />
                Nombre del Producto *
              </label>
              <input
                id="nombre"
                type="text"
                placeholder="Ej. Caja de Fresas Orgánicas"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
                className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                  validationErrors.nombreProducto ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                }`}
              />
              {validationErrors.nombreProducto && (
                <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.nombreProducto}</span>
              )}
            </div>

            {/* Madurez/Excedente Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="desc" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-blue-600" />
                Descripción del Estado del Alimento
              </label>
              <textarea
                id="desc"
                rows={2}
                placeholder="Indica el estado de madurez, frescura o el motivo del excedente comercial..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all resize-none"
              />
            </div>

            {/* Original Cost & Special Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="costoOrig" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5 text-blue-600" />
                  Costo Original *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    id="costoOrig"
                    type="number"
                    placeholder="Ej. 15000"
                    value={costoOriginal}
                    onChange={(e) => setCostoOriginal(e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-8 pr-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                      validationErrors.costoOriginal ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                    }`}
                  />
                </div>
                {validationErrors.costoOriginal && (
                  <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.costoOriginal}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="costoDesc" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-blue-600" />
                  Precio Especial
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                  <input
                    id="costoDesc"
                    type="number"
                    placeholder="Ej. 6000"
                    value={costoConDescuento}
                    onChange={(e) => setCostoConDescuento(e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-50/50 py-3 pl-8 pr-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                      validationErrors.costoConDescuento ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                    }`}
                  />
                </div>
                {validationErrors.costoConDescuento && (
                  <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.costoConDescuento}</span>
                )}
              </div>
            </div>

            {/* Stock & Expiration Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="stock" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Archive className="h-3.5 w-3.5 text-blue-600" />
                  Stock Disponible *
                </label>
                <input
                  id="stock"
                  type="number"
                  placeholder="Ej. 5"
                  value={cantidadDisponible}
                  onChange={(e) => setCantidadDisponible(e.target.value)}
                  className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                    validationErrors.cantidadDisponible ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                  }`}
                />
                {validationErrors.cantidadDisponible && (
                  <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.cantidadDisponible}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="vencimiento" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  Vencimiento *
                </label>
                <input
                  id="vencimiento"
                  type="date"
                  value={fechaVencimiento}
                  onChange={(e) => setFechaVencimiento(e.target.value)}
                  className={`w-full rounded-2xl border bg-slate-50/50 py-3 px-4 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 ${
                    validationErrors.fechaVencimiento ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/50'
                  }`}
                />
                {validationErrors.fechaVencimiento && (
                  <span className="text-[10px] font-bold text-red-500 mt-0.5">{validationErrors.fechaVencimiento}</span>
                )}
              </div>
            </div>

            {/* Illustrative Image URL (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="image" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Image className="h-3.5 w-3.5 text-blue-600" />
                URL de imagen ilustrativa (opcional)
              </label>
              <input
                id="image"
                type="url"
                placeholder="Ej. https://images.unsplash.com/... (Si se deja vacío se usará una por defecto)"
                value={imagenUrl}
                onChange={(e) => setImagenUrl(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all"
              />
            </div>

            {/* Publish Button */}
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full mt-2 rounded-2xl bg-blue-600 py-4 text-xs font-black text-white tracking-widest uppercase shadow-lg shadow-blue-150 hover:bg-blue-700 disabled:opacity-65 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitLoading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Guardando en catálogo...</>
              ) : (
                <><PlusCircle className="h-4 w-4" />+ PUBLICAR EN CATÁLOGO REAL</>
              )}
            </button>
          </form>
        </div>

        {/* ================= RIGHT COLUMN: Seller Inventory Grid ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
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

                        {/* Donation Trigger Button for Expired/Red products */}
                        {expiryInfo.color === 'red' && !isDonated && (
                          <button
                            type="button"
                            onClick={() => handleDonate(product.id_producto, product.cantidad_disponible)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-2.5 py-1.5 font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                          >
                            <HeartHandshake className="h-3 w-3" /> Donar
                          </button>
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

      </div>

    </div>
  );
}
