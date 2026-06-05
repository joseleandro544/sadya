import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, MapPin, Building2, User, Mail, Lock, CheckCircle, ChevronDown, Search } from 'lucide-react';

/* ─── Inline Flag Icon ─── */
const ColombiaFlag = () => (
  <svg className="h-5 w-8 rounded shadow-sm border border-slate-200" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#FCD116" />
    <rect width="3" height="1" y="1" fill="#003893" />
    <rect width="3" height="0.5" y="1.5" fill="#CE1126" />
  </svg>
);

const COLOMBIAN_CITIES = [
  "Bogotá D.C.",
  "Medellín (Antioquia)",
  "Cali (Valle del Cauca)",
  "Barranquilla (Atlántico)",
  "Cartagena (Bolívar)",
  "Bucaramanga (Santander)",
  "Cúcuta (Norte de Santander)",
  "Pereira (Risaralda)",
  "Ibagué (Tolima)",
  "Santa Marta (Magdalena)",
  "Pasto (Nariño)",
  "Manizales (Caldas)",
  "Villavicencio (Meta)",
  "Neiva (Huila)",
  "Armenia (Quindío)",
  "Valledupar (Cesar)",
  "Montería (Córdoba)",
  "Sincelejo (Sucre)",
  "Tunja (Boyacá)",
  "Popayán (Cauca)",
  "Chía (Cundinamarca)",
  "Soacha (Cundinamarca)"
];

export default function MerchantRegisterPage({ onBack }) {
  const [form, setForm] = useState({
    nombreTienda: '',
    nitOrRut: '',
    direccion: '',
    nombreContacto: '',
    apellidoContacto: '',
    email: '',
    celular: '',
    password: '',
  });

  const [selectedCity, setSelectedCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cityDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const filteredCities = COLOMBIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCity) {
      alert('Por favor selecciona tu Ciudad / Municipio.');
      return;
    }
    if (!form.nitOrRut.trim()) {
      alert('El NIT o RUT es obligatorio para registrar tu establecimiento.');
      return;
    }
    if (!form.password.trim() || form.password.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Tu solicitud ha sido recibida!</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Hemos guardado los datos de <strong>{form.nombreTienda}</strong> en nuestra base de datos.
          Un agente de SADYA se pondrá en contacto contigo en las próximas 24 horas para verificar la información comercial y activar tu cuenta de vendedor.
        </p>
        <button
          onClick={onBack}
          className="rounded-full bg-blue-600 text-white px-8 py-3 text-sm font-extrabold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 active:scale-95"
        >
          Volver al Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* ── Page Header ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs shadow">S</div>
          <span className="font-extrabold text-slate-900 text-sm">
            SADYA · <span className="text-amber-500">Registro de Comercio</span>
          </span>
        </div>
      </div>

      {/* ── Main Form Card Area ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:py-16">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 transition-all">
          
          {/* Header Card */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quiero registrar mi tienda en SADYA
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => alert('Inicio de sesión próximamente')}
                className="text-blue-600 font-bold hover:underline"
              >
                Haz clic aquí
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* ════ SECCIÓN 1: UBICACIÓN ════ */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Sección 1: Ubicación
              </h3>
              <div className="flex flex-col gap-4">
                {/* País (Deshabilitado) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    País
                  </label>
                  <div className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100/70 px-4 flex items-center gap-3 select-none text-slate-500 text-sm font-medium">
                    <ColombiaFlag />
                    <span>Colombia (CO +57)</span>
                  </div>
                </div>

                {/* Ciudad / Municipio (Searchable Select) */}
                <div className="flex flex-col gap-1.5 relative" ref={cityDropdownRef}>
                  <label htmlFor="city-input" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ciudad / Municipio
                  </label>
                  <div className="relative">
                    <button
                      id="city-input"
                      type="button"
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-left text-sm text-slate-800 placeholder-slate-400 outline-none flex items-center justify-between transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    >
                      <span className={selectedCity ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                        {selectedCity || "Selecciona o busca tu ciudad..."}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isCityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCityDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-100 shadow-2xl p-2 z-50 max-h-60 overflow-y-auto flex flex-col gap-1">
                        <div className="relative p-1">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Buscar ciudad..."
                            value={citySearch}
                            onChange={(e) => setCitySearch(e.target.value)}
                            className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-4 text-xs outline-none focus:border-blue-500 bg-slate-50 focus:bg-white"
                          />
                        </div>
                        <div className="h-px bg-slate-100 my-1" />
                        {filteredCities.length > 0 ? (
                          filteredCities.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onClick={() => {
                                setSelectedCity(city);
                                setIsCityDropdownOpen(false);
                                setCitySearch('');
                              }}
                              className="w-full text-left rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50/50 hover:text-blue-600 transition-colors"
                            >
                              {city}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 text-center py-4">No se encontraron ciudades</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ════ SECCIÓN 2: DATOS DEL COMERCIO ════ */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Sección 2: Datos del Comercio
              </h3>
              <div className="flex flex-col gap-4">
                {/* Nombre del Establecimiento */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nombreTienda" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nombre del Establecimiento
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="nombreTienda"
                      type="text"
                      required
                      placeholder="Nombre de la tienda o finca"
                      value={form.nombreTienda}
                      onChange={handleChange('nombreTienda')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    />
                  </div>
                </div>

                {/* NIT o RUT */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="nitOrRut" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    NIT o RUT (Obligatorio)
                  </label>
                  <input
                    id="nitOrRut"
                    type="text"
                    required
                    placeholder="Ej: 900.123.456-7"
                    value={form.nitOrRut}
                    onChange={handleChange('nitOrRut')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>

                {/* Dirección Comercial */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="direccion" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Dirección Comercial
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="direccion"
                      type="text"
                      required
                      placeholder="Ej: Calle 85 # 11-20, Bogotá"
                      value={form.direccion}
                      onChange={handleChange('direccion')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ════ SECCIÓN 3: DATOS DEL CONTACTO ════ */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                Sección 3: Datos del Contacto
              </h3>
              <div className="flex flex-col gap-4">
                
                {/* Nombres y Apellidos Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="nombreContacto" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Nombre(s)
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        id="nombreContacto"
                        type="text"
                        required
                        placeholder="Ej: Juan"
                        value={form.nombreContacto}
                        onChange={handleChange('nombreContacto')}
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="apellidoContacto" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Apellido(s)
                    </label>
                    <input
                      id="apellidoContacto"
                      type="text"
                      required
                      placeholder="Ej: Pérez"
                      value={form.apellidoContacto}
                      onChange={handleChange('apellidoContacto')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="contacto@establecimiento.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    />
                  </div>
                </div>

                {/* Teléfono Celular */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="celular" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Teléfono Celular
                  </label>
                  <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 transition-all">
                    <div className="h-12 px-4 bg-slate-100 border-r border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
                      +57
                    </div>
                    <input
                      id="celular"
                      type="tel"
                      required
                      placeholder="300 123 4567"
                      value={form.celular}
                      onChange={handleChange('celular')}
                      className="h-12 flex-grow bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
                    />
                  </div>
                </div>

                {/* Crea tu Contraseña */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Crea tu Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={handleChange('password')}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ════ FILA INFERIOR: AVISO Y BOTÓN ════ */}
            <div className="flex flex-col gap-4 mt-2">
              <p className="text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
                Al hacer clic en registrarme, declaras que aceptas los{' '}
                <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones</a>{' '}
                y las{' '}
                <a href="#" className="text-blue-600 font-bold hover:underline">Políticas de Privacidad</a>{' '}
                de la plataforma SADYA.
              </p>
              
              <button
                type="submit"
                className="h-12 w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-lg shadow-amber-100 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center"
              >
                Registrarme
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
