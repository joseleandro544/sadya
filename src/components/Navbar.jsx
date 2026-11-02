import { useState } from 'react';
import { 
  Menu, MapPin, Search, Bell, User, ShoppingCart, X, Check,
  Home, Grid, ShoppingBag, Leaf, Handshake, HelpCircle, LogOut, ChevronDown, ChevronUp,
  LogIn, UserPlus, Settings
} from 'lucide-react';
import glowingStar from '../assets/categorias/Glowing star.svg';
import redApple from '../assets/categorias/Red apple.svg';
import broccoli from '../assets/categorias/Broccoli.svg';
import sheafOfRice from '../assets/categorias/Sheaf of rice.svg';
import cutOfMeat from '../assets/categorias/Cut of meat.svg';
import glassOfMilk from '../assets/categorias/Glass of milk.svg';
import bread from '../assets/categorias/Bread.svg';
import shortcake from '../assets/categorias/Shortcake.svg';
import hamburger from '../assets/categorias/Hamburger.svg';

export default function Navbar({ 
  user,
  searchQuery, 
  setSearchQuery, 
  cartCount, 
  currentLocation, 
  setCurrentLocation,
  onOpenCart,
  onOpenAuthModal,
  onOpenLogin,
  onOpenFarmerRegister,
  onOpenStoreRegister,
  onOpenDelivererRegister,
  onOpenFoundationRegister,
  onGoToHome,
  onSelectCategory,
  onLogout,
  onOpenSellerProducts,
  onOpenProfile
}) {
  const [isCategoriesAccordionOpen, setIsCategoriesAccordionOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Persistent notifications with tab system & unread badge logic
  const [activeNotificationTab, setActiveNotificationTab] = useState('generales');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('sadya_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 1,
        title: '¡Bienvenido a SADYA!',
        message: 'Rescata alimentos frescos en tu zona con precios especiales.',
        time: 'Hace 5 min',
        tab: 'generales',
        read: false
      },
      {
        id: 2,
        title: 'Ofertas cerca de ti',
        message: 'Nuevos excedentes publicados por tiendas asociadas.',
        time: 'Hace 1 hora',
        tab: 'generales',
        read: false
      },
      {
        id: 3,
        title: 'Tienda Campesina',
        message: 'Publicó bultos de verduras frescas listas para rescate.',
        time: 'Hace 2 horas',
        tab: 'tiendas',
        read: false
      }
    ];
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleNotifications = () => {
    const next = !isNotificationsOpen;
    setIsNotificationsOpen(next);
    if (next && unreadCount > 0) {
      const updated = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem('sadya_notifications', JSON.stringify(updated));
    }
  };

  const filteredNotifications = notifications.filter(n => n.tab === activeNotificationTab);

  const categoryItems = [
    { id: 'all', name: 'Todos', icon: glowingStar, bgColor: 'bg-slate-100 hover:bg-slate-200 text-slate-700' },
    { id: 'frutas', name: 'Frutas', icon: redApple, bgColor: 'bg-red-50 hover:bg-red-100 text-red-700' },
    { id: 'verduras', name: 'Verduras', icon: broccoli, bgColor: 'bg-green-50 hover:bg-green-100 text-green-700' },
    { id: 'granos', name: 'Granos', icon: sheafOfRice, bgColor: 'bg-amber-50 hover:bg-amber-100 text-amber-700' },
    { id: 'carnes', name: 'Carnicerías', icon: cutOfMeat, bgColor: 'bg-rose-50 hover:bg-rose-100 text-rose-700' },
    { id: 'lacteos', name: 'Lácteos', icon: glassOfMilk, bgColor: 'bg-sky-50 hover:bg-sky-100 text-sky-700' },
    { id: 'panaderia', name: 'Panaderías', icon: bread, bgColor: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700' },
    { id: 'postres', name: 'Postres', icon: shortcake, bgColor: 'bg-pink-50 hover:bg-pink-100 text-pink-700' },
    { id: 'rapida', name: 'Comidas Rápidas', icon: hamburger, bgColor: 'bg-orange-50 hover:bg-orange-100 text-orange-700' },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);

  const isSeller = user && (
    user.rol === 'Campesino' || 
    user.rol === 'Productor' || 
    user.rol === 'Tienda' || 
    user.rol === 'Tendero'
  );

  const handleSaveLocation = (loc) => {
    if (!loc) return;
    const formatted = loc.startsWith('📍') ? loc : `📍 ${loc}`;
    setCurrentLocation(formatted);
    localStorage.setItem('sadya_location', formatted);
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Navbar Row */}
          <div className="flex h-20 items-center justify-between gap-4">
            
            {/* Left: Logo & Hamburger & Location */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Hamburguer Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-1 cursor-pointer">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-lg shadow-md shadow-blue-200">
                  S
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-950 hidden xs:block">
                  SAD<span className="text-blue-600 font-black">YA</span>
                </span>
              </div>

              {/* Location Selector (Desktop) */}
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-200 transition-all duration-200"
              >
                <MapPin className="h-4 w-4 text-blue-600 animate-bounce" />
                <span className="truncate max-w-[150px]">{currentLocation}</span>
              </button>
            </div>

            {/* Center: Wide Rounded Search Bar (Desktop) */}
            <div className="hidden sm:flex flex-1 max-w-xl relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Busca comida, frutas, carnes cerca de ti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Center-Right: Top Navigation for Campesinos & Tenderos */}
            {isSeller && (
              <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80">
                <button
                  onClick={onGoToHome}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-white transition-all cursor-pointer shadow-none hover:shadow-xs"
                  title="Ir a la pantalla de inicio"
                >
                  <Home className="h-3.5 w-3.5 text-slate-500" />
                  <span>Inicio</span>
                </button>
                <button
                  onClick={onOpenSellerProducts}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
                  title="Ir al formulario de registro de productos"
                >
                  <ShoppingBag className="h-3.5 w-3.5 text-white" />
                  <span>Registro de Productos</span>
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[9px] font-black uppercase">
                    {user?.rol === 'Campesino' || user?.rol === 'Productor' ? '🌾 Campesino' : '🏪 Tendero'}
                  </span>
                </button>
              </div>
            )}

            {/* Right: Icons with labels below */}
            <div className="flex items-center gap-4 md:gap-6">
              
              {/* Location Selector (Mobile Only) */}
              <button 
                onClick={() => setIsLocationModalOpen(true)}
                className="flex md:hidden items-center justify-center p-2 text-slate-600 hover:text-blue-600"
                title="Cambiar dirección"
              >
                <MapPin className="h-5 w-5" />
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button 
                  onClick={handleToggleNotifications}
                  className="group flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer focus:outline-none"
                >
                  <div className="relative p-1">
                    <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium mt-0.5 tracking-tight hidden md:block text-slate-500 group-hover:text-blue-600">
                    Notificaciones
                  </span>
                </button>

                {/* Notification Popover Panel */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white p-4 shadow-2xl border border-slate-100 z-50 animate-slide-in">
                    
                    {/* Top Triangle Arrow */}
                    <div className="absolute -top-1.5 right-4 w-3.5 h-3.5 bg-white border-t border-l border-slate-100 rotate-45" />

                    {/* Popover Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 px-1">
                      <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                        Notificaciones
                      </h3>
                      <button 
                        onClick={() => alert("Configuración de notificaciones.")}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
                        title="Configuración"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-100 mt-2">
                      <button
                        onClick={() => setActiveNotificationTab('generales')}
                        className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeNotificationTab === 'generales'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <span>Generales</span>
                        <span className="text-sm">💬</span>
                      </button>

                      <button
                        onClick={() => setActiveNotificationTab('tiendas')}
                        className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          activeNotificationTab === 'tiendas'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <span>Tiendas que sigo</span>
                        <span className="text-sm">📣</span>
                      </button>
                    </div>

                    {/* Notification List Content */}
                    <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                          <div 
                            key={n.id} 
                            className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-100/80 text-left"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-extrabold text-slate-900">{n.title}</h4>
                              <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 px-4 text-slate-400">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300 animate-pulse" />
                          <p className="text-xs font-bold text-slate-700">Sin notificaciones</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">No hay mensajes en esta sección.</p>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* My Account / Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={user ? () => setIsUserDropdownOpen(!isUserDropdownOpen) : onOpenLogin}
                  className="group flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer focus:outline-none"
                >
                  <div className="p-1">
                    {user ? (
                      <div className="h-6 w-6 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-xs font-bold transition-transform group-hover:scale-110 overflow-hidden">
                        {user.foto_perfil ? (
                          <img src={user.foto_perfil} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                          user.nombres[0].toUpperCase()
                        )}
                      </div>
                    ) : (
                      <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium mt-0.5 tracking-tight hidden md:block text-slate-500 group-hover:text-blue-600">
                    {user ? user.nombres : 'Mi Cuenta'}
                  </span>
                </button>

                {user && isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-3 shadow-xl border border-slate-100 z-50 flex flex-col gap-1.5 animate-slide-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-black text-slate-900 leading-tight">
                        {user.nombres} {user.apellidos || ''}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                        Rol: {user.rol || 'Cliente'}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      Mi Perfil
                    </button>
                    {isSeller && (
                      <button 
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          if (onOpenSellerProducts) onOpenSellerProducts();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-blue-600 bg-blue-50/60 hover:bg-blue-100/80 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        📦 Mis Productos
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        alert("Historial de mis pedidos de rescate.");
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      Mis Pedidos
                    </button>
                    <button 
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-all duration-200 flex items-center gap-2 cursor-pointer mt-1"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>

              {/* Registrar Dropdown */}
              {!user && (
                <div className="relative">
                  <button 
                    onClick={() => setIsRegisterDropdownOpen(!isRegisterDropdownOpen)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-md shadow-emerald-100/50 transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    Registrar
                  </button>
                  
                  {isRegisterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white p-2 shadow-xl border border-slate-100 z-50 flex flex-col gap-1">
                      <button 
                        onClick={() => {
                          setIsRegisterDropdownOpen(false);
                          onOpenFarmerRegister();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 transform origin-left cursor-pointer"
                      >
                        Productor / Campesino
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterDropdownOpen(false);
                          onOpenStoreRegister();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 transform origin-left cursor-pointer"
                      >
                        Tienda
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterDropdownOpen(false);
                          onOpenDelivererRegister();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 transform origin-left cursor-pointer"
                      >
                        Domiciliario / Transportador
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterDropdownOpen(false);
                          onOpenFoundationRegister();
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 transform origin-left cursor-pointer"
                      >
                        Fundación
                      </button>
                      <button 
                        onClick={() => {
                          setIsRegisterDropdownOpen(false);
                          onOpenAuthModal('cliente');
                        }}
                        className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-blue-600 hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 transform origin-left cursor-pointer"
                      >
                        Cliente
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Shopping Cart */}
              <button 
                onClick={onOpenCart}
                className="group flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 transition-colors duration-200 relative"
              >
                <div className="relative p-1">
                  <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium mt-0.5 tracking-tight hidden md:block text-slate-500 group-hover:text-blue-600">
                  Carrito
                </span>
              </button>

            </div>
          </div>

          {/* Search bar below (Mobile Only) */}
          <div className="pb-4 sm:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Busca comida, frutas, carnes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Side Menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          />
          {/* Menu Panel */}
          <div className="relative mr-auto flex h-full w-full max-w-[290px] flex-col bg-white shadow-2xl transition-transform duration-300">
            
            {/* 1. Cabecera de Usuario (Fijada arriba) */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 text-sm font-extrabold shadow-sm overflow-hidden">
                    {user.foto_perfil ? (
                      <img src={user.foto_perfil} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      user.nombres[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {user.nombres} {user.apellidos || ''}
                    </h4>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        if (onOpenProfile) onOpenProfile();
                      }}
                      className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors block text-left"
                    >
                      Ver perfil · {user.rol || 'Cliente'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">Bienvenido</h4>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline transition-colors block text-left"
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              )}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
              
              {/* 2. Sección: Navegación Principal */}
              <nav className="space-y-1">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onGoToHome) onGoToHome();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                >
                  <Home className="h-5 w-5 text-slate-400" />
                  <span>Inicio</span>
                </button>

                {isSeller && (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onOpenSellerProducts) onOpenSellerProducts();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-black text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                      <span>Registro de Productos</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-800 text-[10px] font-black uppercase">
                      {user?.rol === 'Campesino' || user?.rol === 'Productor' ? 'Campesino' : 'Tendero'}
                    </span>
                  </button>
                )}

                {/* Acordeón: Explorar Categorías */}
                <div>
                  <button 
                    onClick={() => setIsCategoriesAccordionOpen(!isCategoriesAccordionOpen)}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Grid className="h-5 w-5 text-slate-400" />
                      <span>Explorar Categorías</span>
                    </div>
                    {isCategoriesAccordionOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isCategoriesAccordionOpen && (
                    <div className="pl-6 pr-2 py-1.5 space-y-1.5 border-l-2 border-slate-100 ml-5 mt-1 animate-slide-down">
                      {categoryItems.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            if (onSelectCategory) {
                              onSelectCategory(cat.id);
                            }
                          }}
                          className="w-full text-left py-2 px-3 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-colors flex items-center gap-2.5 cursor-pointer"
                        >
                          <img src={cat.icon} alt={cat.name} className="h-5 w-5 object-contain shrink-0" />
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {user ? (
                  <>
                    {isSeller && (
                      <button 
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          if (onOpenSellerProducts) onOpenSellerProducts();
                        }}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                      >
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <span>📦 Mis Productos</span>
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        alert("Sección de Mis Pedidos simulada.");
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingBag className="h-5 w-5 text-slate-400" />
                      <span>Mis Pedidos</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        alert("Mi Impacto Ecológico en SADYA.");
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      <Leaf className="h-5 w-5 text-green-500" />
                      <span>Mi Impacto</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenLogin();
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      <LogIn className="h-5 w-5 text-slate-400" />
                      <span>Iniciar Sesión</span>
                    </button>

                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onOpenAuthModal();
                      }}
                      className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                    >
                      <UserPlus className="h-5 w-5 text-slate-400" />
                      <span>Crear Cuenta</span>
                    </button>
                  </>
                )}
              </nav>

              {/* 3. Sección: Expansión */}
              {(!user || user.rol === 'Cliente') && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                    TRABAJA CON NOSOTROS
                  </span>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenAuthModal();
                    }}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                  >
                    <Handshake className="h-5 w-5 text-slate-400" />
                    <span>Únete a la familia SADYA</span>
                  </button>
                </div>
              )}

              {/* 4. Sección: Cuenta y Soporte */}
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
                  SOPORTE
                </span>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (user) {
                      if (onOpenProfile) onOpenProfile();
                    } else {
                      onOpenLogin();
                    }
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                >
                  <User className="h-5 w-5 text-slate-400" />
                  <span>Información de mi cuenta</span>
                </button>

                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    alert("Centro de Ayuda y Tutoriales.");
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer"
                >
                  <HelpCircle className="h-5 w-5 text-slate-400" />
                  <span>Ayuda y Tutoriales</span>
                </button>
              </div>

            </div>

            {/* 5. Footer del Menú (Fijado abajo) */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-3 mt-auto">
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                  Ubicación de entrega
                </span>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-xs text-slate-600 hover:bg-slate-100 transition-colors truncate font-semibold"
                >
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                  <span className="truncate">{currentLocation}</span>
                </button>
              </div>

              {user && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Location Selection Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setIsLocationModalOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          {/* Modal Card */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all duration-300 border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Dirección de entrega
              </h3>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-500">
                Mostraremos ofertas y tiendas con base a la cercanía de tu dirección de entrega.
              </p>
              
              {/* Current Address Display Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Dirección actual</span>
                    <span className="text-sm font-bold text-slate-900 block truncate max-w-[220px]">{currentLocation}</span>
                  </div>
                </div>
                <Check className="h-5 w-5 text-green-600 shrink-0" />
              </div>
            </div>

            {/* Custom Input */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                {user ? 'Agregar o cambiar por otra dirección:' : 'Ingresa tu dirección de entrega:'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Calle 85 # 11-20, Bogotá"
                  value={tempLocation.replace('📍 ', '')}
                  onChange={(e) => setTempLocation(e.target.value ? `📍 ${e.target.value}` : '')}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
                />
                <button
                  onClick={() => {
                    const cleanVal = tempLocation.replace('📍 ', '').trim();
                    if (cleanVal) {
                      handleSaveLocation(cleanVal);
                    }
                  }}
                  className="rounded-2xl bg-blue-600 text-white px-5 py-2.5 text-xs font-extrabold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100 cursor-pointer shrink-0"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
