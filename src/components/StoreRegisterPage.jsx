import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User, Building2, ShieldAlert, CheckCircle, MapPin } from 'lucide-react';

const CITIES = [
  "Bogotá D.C.",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Bucaramanga",
  "Pereira",
  "Ibagué",
  "Santa Marta"
];

import { useState } from 'react';

export default function StoreRegisterPage({ onBack, onRegisterSuccess, onOpenLogin }) {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    nombreTienda: '',
    nitOrDocumento: '',
    direccion: '',
    ciudad: ''
  });

  const [hasOwnDelivery, setHasOwnDelivery] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptAgreement, setAcceptAgreement] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    acceptTerms: '',
    acceptAgreement: ''
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'password' || field === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    let hasError = false;
    const newErrors = { password: '', confirmPassword: '', acceptTerms: '', acceptAgreement: '' };

    if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener un mínimo de 8 caracteres.';
      hasError = true;
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      hasError = true;
    }
    if (!acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los Términos y Condiciones.';
      hasError = true;
    }
    if (!acceptAgreement) {
      newErrors.acceptAgreement = 'Debes aceptar el Acuerdo Comercial.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: form.nombres,
          apellidos: form.apellidos,
          email: form.email,
          telefono: form.telefono,
          password: form.password,
          nombreTienda: form.nombreTienda,
          nitOrDocumento: form.nitOrDocumento,
          hasOwnDelivery,
          direccion: form.direccion,
          ciudad: form.ciudad,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || 'Error al registrar.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess({ ...data.data, email: form.email, telefono: form.telefono }, 'Tienda', '¡Tienda registrada con éxito! Los datos del comercio ' + form.nombreTienda + ' han sido registrados.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setApiError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Tienda registrada con éxito!</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Los datos del comercio <strong>{form.nombreTienda}</strong> han sido registrados. 
          Te hemos enviado un correo a <strong>{form.email}</strong> para completar la validación de tu NIT / RUT y configurar tu catálogo de productos.
        </p>
        <button
          onClick={onBack}
          className="rounded-full bg-blue-600 text-white px-8 py-3 text-sm font-extrabold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 active:scale-95 cursor-pointer"
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
            SADYA · <span className="text-blue-600 font-extrabold">Registra tu Tienda</span>
          </span>
        </div>
      </div>

      {/* ── Card Area ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:py-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 transition-all">
          
          {/* Header Card */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registra tu Tienda
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Haz clic aquí
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Fila 1: Nombres */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombres" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nombres
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="nombres"
                    type="text"
                    required
                    placeholder="Ej: Laura"
                    value={form.nombres}
                    onChange={handleChange('nombres')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 1: Apellidos */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="apellidos" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Apellidos
                </label>
                <input
                  id="apellidos"
                  type="text"
                  required
                  placeholder="Ej: Rojas Silva"
                  value={form.apellidos}
                  onChange={handleChange('apellidos')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                />
              </div>

              {/* Fila 2: Correo electrónico */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="contacto@mitienda.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 2: Teléfono */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="telefono" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Teléfono
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 transition-all">
                  <div className="h-12 px-4 bg-slate-100 border-r border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
                    +57
                  </div>
                  <input
                    id="telefono"
                    type="tel"
                    required
                    placeholder="300 123 4567"
                    value={form.telefono}
                    onChange={handleChange('telefono')}
                    className="h-12 flex-grow bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  />
                </div>
              </div>

              {/* Fila 3: Contraseña */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Contraseña
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
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-4 ${
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/60'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <span className="text-[10px] font-bold text-red-500 block mt-0.5">{errors.password}</span>}
              </div>

              {/* Fila 3: Confirmar contraseña */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repite tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-4 ${
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/60'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-[10px] font-bold text-red-500 block mt-0.5">{errors.confirmPassword}</span>}
              </div>

              {/* Fila 4: Nombre de la Tienda / Marca */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombreTienda" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nombre de la Tienda / Marca
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="nombreTienda"
                    type="text"
                    required
                    placeholder="Ej: Tienda Eco-Frutas"
                    value={form.nombreTienda}
                    onChange={handleChange('nombreTienda')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 4: NIT o Documento */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nitOrDocumento" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  NIT o Documento
                </label>
                <input
                  id="nitOrDocumento"
                  type="text"
                  required
                  placeholder="Ej: 900.456.789-2"
                  value={form.nitOrDocumento}
                  onChange={handleChange('nitOrDocumento')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                />
              </div>

              {/* Fila 5: Dirección de la Tienda */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="direccion" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Dirección de la Tienda
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="direccion"
                    type="text"
                    required
                    placeholder="Ej: Calle 85 # 11-20"
                    value={form.direccion}
                    onChange={handleChange('direccion')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 5: Ciudad */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ciudad" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Ciudad
                </label>
                <select
                  id="ciudad"
                  required
                  value={form.ciudad}
                  onChange={handleChange('ciudad')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 cursor-pointer"
                >
                  <option value="" disabled>Selecciona tu ciudad</option>
                  {CITIES.map(c => (
                    <option key={c} value={c.toLowerCase()}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Switch/Checkbox Crucial: Domicilio Propio */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/60 mt-2 md:col-span-2">
                <div className="flex flex-col gap-0.5 pr-2">
                  <span className="text-sm font-bold text-slate-800">¿Tienes servicio de domicilio propio?</span>
                  <span className="text-xs text-slate-400">Activa esta casilla si tu establecimiento cuenta con repartidores.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHasOwnDelivery(!hasOwnDelivery)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hasOwnDelivery ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      hasOwnDelivery ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Fila Inferior: Checkboxes y Botón */}
            <div className="flex flex-col gap-5 mt-3 border-t border-slate-100 pt-5">
              
              {/* Checkboxes de aceptación */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => {
                        setAcceptTerms(e.target.checked);
                        setErrors((prev) => ({ ...prev, acceptTerms: '' }));
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 leading-normal">
                      Acepto los{' '}
                      <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones de Uso</a>{' '}
                      y la{' '}
                      <a href="#" className="text-blue-600 font-bold hover:underline">Política de Tratamiento de Datos</a>{' '}
                      de SADYA.
                    </span>
                  </label>
                  {errors.acceptTerms && <span className="text-[10px] font-bold text-red-500 block">{errors.acceptTerms}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={acceptAgreement}
                      onChange={(e) => {
                        setAcceptAgreement(e.target.checked);
                        setErrors((prev) => ({ ...prev, acceptAgreement: '' }));
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs text-slate-500 leading-normal">
                      Acepto el{' '}
                      <a href="#" className="text-blue-600 font-bold hover:underline">Acuerdo Comercial de Intermediación</a>{' '}
                      para ventas de excedentes alimentarios dentro de la aplicación.
                    </span>
                  </label>
                  {errors.acceptAgreement && <span className="text-[10px] font-bold text-red-500 block">{errors.acceptAgreement}</span>}
                </div>
              </div>

              {/* Error de API */}
              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                  <span>⚠️</span><span>{apiError}</span>
                </div>
              )}

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold rounded-xl shadow-lg shadow-amber-100 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Registrando...</>
                ) : 'Crear cuenta'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
