import { useState } from 'react';
import { Menu, MapPin, Search, Bell, User, ShoppingCart, X, Check } from 'lucide-react';

export default function Navbar({ 
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
  onOpenFoundationRegister
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);
  const [isRegisterDropdownOpen, setIsRegisterDropdownOpen] = useState(false);

  const locations = [
    "📍 Calle 45 # 12-34, Bogotá",
    "📍 Carrera 7 # 72-10, Bogotá",
    "📍 Avenida 19 # 100-50, Bogotá",
    "📍 Calle 100 # 15-22, Bogotá",
    "📍 Cl. 10 #3-45, Chía"
  ];

  const handleSaveLocation = (loc) => {
    setCurrentLocation(loc);
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

              {/* Notifications */}
              <button className="group flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 transition-colors duration-200">
                <div className="relative p-1">
                  <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                </div>
                <span className="text-[10px] font-medium mt-0.5 tracking-tight hidden md:block text-slate-500 group-hover:text-blue-600">
                  Notificaciones
                </span>
              </button>

              {/* My Account */}
              <button 
                onClick={onOpenLogin}
                className="group flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
              >
                <div className="p-1">
                  <User className="h-5 w-5 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[10px] font-medium mt-0.5 tracking-tight hidden md:block text-slate-500 group-hover:text-blue-600">
                  Mi Cuenta
                </span>
              </button>

              {/* Registrar Dropdown */}
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
          <div className="relative mr-auto flex h-full w-full max-w-[280px] flex-col bg-white p-6 shadow-2xl transition-transform duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold shadow">
                  S
                </div>
                <span className="text-lg font-bold text-slate-900">SADYA Menu</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-4">
              <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                Inicio
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                Mis Compras
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                Impacto Social
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                Tiendas Aliadas
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                Ayuda y Soporte
              </a>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 font-extrabold py-2.5 text-xs tracking-wider uppercase shadow-sm transition-colors cursor-pointer mt-4"
              >
                Iniciar Sesión
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuthModal('cliente');
                }}
                className="w-full flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2.5 text-xs tracking-wider uppercase shadow-md transition-colors cursor-pointer mt-2"
              >
                Registrar
              </button>
            </nav>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Ubicación Actual
              </div>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLocationModalOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50"
              >
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                <span className="truncate">{currentLocation}</span>
              </button>
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
                Selecciona tu ubicación
              </h3>
              <button 
                onClick={() => setIsLocationModalOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-slate-500 mb-2">
                Mostraremos ofertas y tiendas con base a la cercanía de tu dirección de entrega.
              </p>
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleSaveLocation(loc)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left text-sm transition-all duration-200 ${
                    currentLocation === loc
                      ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-semibold'
                      : 'border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{loc}</span>
                  {currentLocation === loc && (
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">O ingresa otra dirección:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: Calle 85 # 11-20"
                  value={tempLocation.replace('📍 ', '')}
                  onChange={(e) => setTempLocation(e.target.value ? `📍 ${e.target.value}` : '')}
                  className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    if (tempLocation.trim()) {
                      handleSaveLocation(tempLocation);
                    }
                  }}
                  className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-100"
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
