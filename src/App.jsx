import { useState } from 'react';
import Navbar from './components/Navbar';
import RegisterPage from './components/RegisterPage';
import FarmerRegisterPage from './components/FarmerRegisterPage';
import StoreRegisterPage from './components/StoreRegisterPage';
import FoundationRegisterPage from './components/FoundationRegisterPage';
import DelivererRegisterPage from './components/DelivererRegisterPage';
import HeroMetrics from './components/HeroMetrics';
import Categories from './components/Categories';
import Promotions from './components/Promotions';
import ProductGrid from './components/ProductGrid';
import CategoryGroupedView from './components/CategoryGroupedView';
import FamilySection from './components/FamilySection';
import LoginPage from './components/LoginPage';
import SellerProductsPage from './components/SellerProductsPage';
import UserProfilePage from './components/UserProfilePage';
import RecoverPasswordPage from './components/RecoverPasswordPage';
import ProductDetailModal from './components/ProductDetailModal';
import { X, Trash2, ShieldAlert, HeartHandshake, CheckCircle } from 'lucide-react';

const getLocationCoords = (locationStr) => {
  const loc = (locationStr || '').replace('📍 ', '').trim();
  if (loc.includes('Calle 45')) return { lat: 4.632, lng: -74.068 };
  if (loc.includes('Carrera 7')) return { lat: 4.655, lng: -74.055 };
  if (loc.includes('Avenida 19')) return { lat: 4.686, lng: -74.052 };
  if (loc.includes('Calle 100')) return { lat: 4.687, lng: -74.043 };
  if (loc.includes('Chía')) return { lat: 4.862, lng: -74.053 };
  return { lat: 4.632, lng: -74.068 }; // Default
};

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userPreferences, setUserPreferences] = useState([]);
  
  // Shopping Cart States
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sadya_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [currentLocation, setCurrentLocation] = useState(() => {
    const savedUser = localStorage.getItem('sadya_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const dir = parsed?.direccion || parsed?.direccion_local || parsed?.direccion_residencia;
        if (dir) return dir.startsWith('📍') ? dir : `📍 ${dir}`;
      } catch (e) {}
    }
    const savedLoc = localStorage.getItem('sadya_location');
    return savedLoc || '📍 Ingresa tu dirección';
  });

  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'register'
  const [toast, setToast] = useState(null);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Sync user location automatically on login/registration change
  useEffect(() => {
    if (user) {
      const userDir = user.direccion || user.direccion_local || user.direccion_residencia;
      if (userDir) {
        const formatted = userDir.startsWith('📍') ? userDir : `📍 ${userDir}`;
        setCurrentLocation(formatted);
      }
    }
  }, [user]);

  // Add to cart handler
  const handleAddToCart = (product, quantity = 1) => {
    if (product.diasParaVencer < 0 || product.expiryText === 'Vencido') {
      showToast('⚠️ Producto vencido: compra prohibida. Solo disponible para donar.');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Show custom toast notification
    showToast(`¡Añadiste ${quantity}x ${product.name} al carrito!`);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleRegisterSuccess = (userData, role, message) => {
    const userDir = userData?.direccion || userData?.direccion_local || userData?.direccion_residencia || '';
    const loggedUser = {
      id: userData?.id || userData?.id_usuario,
      nombres: userData?.nombres || 'Usuario',
      apellidos: userData?.apellidos || '',
      email: userData?.email || '',
      telefono: userData?.telefono || '',
      direccion: userDir,
      rol: role
    };
    setUser(loggedUser);
    localStorage.setItem('sadya_user', JSON.stringify(loggedUser));
    localStorage.removeItem('sadya_read_notifications');
    if (userDir) {
      const formatted = userDir.startsWith('📍') ? userDir : `📍 ${userDir}`;
      setCurrentLocation(formatted);
      localStorage.setItem('sadya_location', formatted);
    }
    showToast(message);
    setCurrentPage('home');
  };

  const handleUpdateQuantity = (productId, amount) => {
    setCartItems((prev) => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setCartItems((prev) => prev.filter(item => item.product.id !== productId));
  };

  // Promotion Category click - sets category filter and scrolls to grid
  const handleSelectPromoCategory = (categoryKey) => {
    setSelectedCategory(categoryKey);
    const element = document.getElementById('productos');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Formatter for COP currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val).replace('COP', 'COP ');
  };

  if (currentPage === 'register-farmer') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <FarmerRegisterPage 
          onBack={() => setCurrentPage('home')} 
          onRegisterSuccess={(userData, role, msg) => handleRegisterSuccess(userData, role, msg)}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'register-store') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <StoreRegisterPage 
          onBack={() => setCurrentPage('home')} 
          onRegisterSuccess={(userData, role, msg) => handleRegisterSuccess(userData, role, msg)}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'register-foundation') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <FoundationRegisterPage 
          onBack={() => setCurrentPage('home')} 
          onRegisterSuccess={(userData, role, msg) => handleRegisterSuccess(userData, role, msg)}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'register-deliverer') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <DelivererRegisterPage 
          onBack={() => setCurrentPage('home')} 
          onRegisterSuccess={(userData, role, msg) => handleRegisterSuccess(userData, role, msg)}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'register') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <RegisterPage 
          onBack={() => setCurrentPage('home')} 
          onRegisterSuccess={(userData, role, msg) => handleRegisterSuccess(userData, role, msg)}
          onOpenLogin={() => setCurrentPage('login')}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <LoginPage 
          onBack={() => setCurrentPage('home')} 
          onOpenRegister={() => setCurrentPage('register')}
          onOpenForgotPassword={() => setCurrentPage('recover-password')}
          onLoginSuccess={(userData, message) => {
            setUser(userData);
            localStorage.setItem('sadya_user', JSON.stringify(userData));
            localStorage.removeItem('sadya_read_notifications');
            const userDir = userData?.direccion || userData?.direccion_local || userData?.direccion_residencia || '';
            if (userDir) {
              const formatted = userDir.startsWith('📍') ? userDir : `📍 ${userDir}`;
              setCurrentLocation(formatted);
              localStorage.setItem('sadya_location', formatted);
            }
            showToast(message);
            setCurrentPage('home');
          }}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'recover-password') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <RecoverPasswordPage 
          onBack={() => setCurrentPage('home')} 
          onBackToLogin={() => setCurrentPage('login')}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'seller-products') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <SellerProductsPage 
          user={user} 
          onBack={() => setCurrentPage('home')} 
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
        <UserProfilePage 
          user={user} 
          onBack={() => setCurrentPage('home')} 
          onProfileUpdate={(newUserData) => {
            setUser(newUserData);
            localStorage.setItem('sadya_user', JSON.stringify(newUserData));
          }}
        />
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <span className="text-xs font-bold tracking-tight">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  const { lat, lng } = getLocationCoords(currentLocation);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar 
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        currentLocation={currentLocation}
        setCurrentLocation={setCurrentLocation}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuthModal={() => setCurrentPage('register')}
        onOpenLogin={() => setCurrentPage('login')}
        onOpenFarmerRegister={() => setCurrentPage('register-farmer')}
        onOpenStoreRegister={() => setCurrentPage('register-store')}
        onOpenDelivererRegister={() => setCurrentPage('register-deliverer')}
        onOpenFoundationRegister={() => setCurrentPage('register-foundation')}
        onOpenSellerProducts={() => setCurrentPage('seller-products')}
        onOpenProfile={() => setCurrentPage('profile')}
        onGoToHome={() => {
          setCurrentPage('home');
          setSelectedCategory('all');
        }}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setCurrentPage('home');
          setTimeout(() => {
            const element = document.getElementById('productos');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('sadya_user');
          localStorage.removeItem('sadya_read_notifications');
          showToast('Sesión cerrada con éxito');
          setCurrentPage('home');
        }}
      />

      <main className="flex-grow">
        {/* 2. Hero Section / Métricas */}
        <HeroMetrics />

        {/* 3. Categorías Carrusel */}
        <Categories 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* 3.5. Vista Agrupada por Categoria Seleccionada (Solo si no es 'all') */}
        {selectedCategory !== 'all' && (
          <CategoryGroupedView 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onAddToCart={handleAddToCart}
            onOpenProductModal={setSelectedProductForModal}
            lat={lat}
            lng={lng}
            user={user}
            searchQuery={searchQuery}
          />
        )}

        {/* 4. Súper Promociones */}
        <Promotions 
          onSelectPromoCategory={handleSelectPromoCategory}
        />

        {/* 5. Grid de Productos (Alimentos cerca de ti, al mejor precio - Siempre visible) */}
        <ProductGrid 
          searchQuery={searchQuery}
          selectedCategory="all"
          setSelectedCategory={setSelectedCategory}
          onAddToCart={handleAddToCart}
          onOpenProductModal={setSelectedProductForModal}
          userPreferences={userPreferences}
          setUserPreferences={setUserPreferences}
          lat={lat}
          lng={lng}
          user={user}
        />

        {/* 6. Haz parte de nuestra familia SADYA */}
        <FamilySection />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold shadow">
                  S
                </div>
                <span className="text-lg font-bold text-slate-900">SADYA</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                SADYA es una plataforma de impacto social comprometida con erradicar el desperdicio de alimentos conectando excedentes de comida de calidad con personas que buscan ahorrar y cuidar del planeta.
              </p>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                Impacto Social
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li>• Familias Vulnerables Aseguradas</li>
                <li>• Prevención de Emisiones de CO2</li>
                <li>• Reducción de Pérdidas de Tiendas Locales</li>
                <li>• Alianza con Bancos de Alimentos</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
                Contacto & Soporte
              </h4>
              <p className="text-xs text-slate-500 mb-2">
                ¿Tienes una tienda y quieres unirte al cambio? Escríbenos.
              </p>
              <a href="mailto:soporte@sadya.org" className="text-xs font-bold text-blue-600 hover:underline">
                soporte@sadya.org
              </a>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1.5 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                TODOS LOS DERECHOS RESERVADOS
              </span>
              <span className="text-xs font-medium text-sky-400/85">
                Fundación SADYA.com NIT 1463718-8. Calle 85 #45-49 Piso 3, Bogotá, Colombia
              </span>
              <span className="text-[10px] text-slate-400 mt-1">
                © {new Date().getFullYear()} SADYA Marketplace · Emojis por Microsoft Fluent Emoji Gallery.
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <span>Hecho con</span>
              <HeartHandshake className="h-4 w-4 text-rose-500 animate-pulse" />
              <span>por el Impacto Social</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart Drawer (Slide-Over) */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Background overlay */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-500">
              <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-3xl border-l border-slate-100">
                
                {/* Cart Header */}
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-950">
                      Mi Carrito de Rescate
                    </h2>
                    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                      {cartCount}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-950 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div 
                        key={item.product.id}
                        className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl group transition-all"
                      >
                        {/* Product Thumbnail */}
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="h-16 w-16 rounded-xl object-cover border border-slate-200/50"
                        />
                        {/* Info details */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-blue-600 block uppercase">
                            {item.product.store}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-bold text-slate-500 block mt-0.5">
                            {formatCurrency(item.product.price)} c/u
                          </span>
                        </div>
                        {/* Quantity controls */}
                        <div className="flex flex-col items-center gap-1.5">
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-white transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          
                          <div className="flex items-center gap-2 bg-white rounded-full border border-slate-200 px-2.5 py-1 shadow-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, -1)}
                              className="text-xs font-extrabold text-slate-500 hover:text-slate-900 px-1"
                            >
                              -
                            </button>
                            <span className="text-xs font-extrabold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.product.id, 1)}
                              className="text-xs font-extrabold text-slate-500 hover:text-slate-900 px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300 mx-auto mb-4 border border-slate-100">
                        🛒
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Tu carrito está vacío</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Los productos agregados aparecerán aquí para realizar el pedido. ¡Ayúdanos a salvar comida hoy!
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 rounded-full bg-blue-600 text-white px-6 py-2.5 text-xs font-bold hover:bg-blue-700 shadow-md transition-colors"
                      >
                        Continuar Comprando
                      </button>
                    </div>
                  )}
                </div>

                {/* Cart Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t border-slate-100 p-6 bg-slate-50 rounded-t-3xl">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
                      <span>Subtotal Rescate:</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(cartSubtotal)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-[10px] text-green-700 font-bold bg-green-50 px-3 py-2 rounded-xl">
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                      <span>Al comprar en SADYA, ahorraste aproximadamente {formatCurrency(cartSubtotal * 0.4)} comparado al precio comercial.</span>
                    </div>
                    <button
                      onClick={() => {
                        showToast("¡Pedido simulado realizado con éxito! Gracias por tu impacto social.");
                        setCartItems([]);
                        setIsCartOpen(false);
                      }}
                      className="w-full rounded-2xl bg-blue-600 text-white py-3.5 text-xs font-black tracking-wider uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      🤝 Confirmar Pedido de Rescate
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 animate-slide-in border border-slate-800">
          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          <span className="text-xs font-bold tracking-tight">{toast}</span>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}

export default App;
