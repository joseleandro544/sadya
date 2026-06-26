import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Phone, User, Mail, Lock, CheckCircle } from 'lucide-react';
import SocialAuthModal from './SocialAuthModal';


/* ─── Inline SVG Brand Icons ─── */
const GoogleIcon = () => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.62 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.83 2.97C6.01 7.37 8.78 5.04 12 5.04z" />
    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z" />
    <path fill="#FBBC05" d="M5.07 14.69c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.24 7.14C.45 8.72 0 10.49 0 12.4s.45 3.68 1.24 5.26l3.83-2.97z" />
    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.22 0-5.99-2.33-6.97-5.65L1.24 15.68C3.2 19.67 7.24 23 12 23z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.004-2.117 3.674-.54 9.122 1.519 12.087 1.007 1.45 2.201 3.071 3.771 3.011 1.515-.06 2.09-.974 3.916-.974 1.824 0 2.348.974 3.931.94 1.615-.027 2.661-1.464 3.64-2.894 1.134-1.651 1.6-3.245 1.629-3.328-.035-.015-3.123-1.196-3.153-4.757-.027-2.981 2.443-4.413 2.56-4.482-1.393-2.039-3.541-2.274-4.302-2.328-2.031-.164-3.513 1.078-4.591 1.078zM15.932 3.56c.915-1.11 1.528-2.656 1.359-4.204-1.328.055-2.937.887-3.889 1.996-.826.953-1.551 2.527-1.36 4.04 1.48.115 2.977-.722 3.89-1.832z" />
  </svg>
);

/* ─── Input Field Helper ─── */
function InputField({ id, label, type = 'text', icon: Icon, placeholder, value, onChange, extra, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-2xl border bg-slate-50 py-3 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-100/60' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100/60'
          } ${Icon ? 'pl-11' : 'pl-4'}`}
        />
        {extra}
      </div>
      {error && <span className="text-[10px] font-bold text-red-500 mt-0.5 block">{error}</span>}
    </div>
  );
}

/* ─── Main Component ─── */
export default function RegisterPage({ onBack, onRegisterSuccess, onOpenLogin }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    password: '',
    confirmPassword: '',
    genero: '',
    terminos: false,
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    terminos: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Social Auth Modal states
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState('Google');

  const handleSocialSuccess = async (socialData) => {
    setIsSocialModalOpen(false);
    setApiError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...socialData, rol: 'Cliente' })
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.message || 'Error en la autenticación social.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess(data.data, 'Cliente', data.message);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setApiError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    if (field === 'password' || field === 'confirmPassword') {
      setErrors((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    let hasError = false;
    const newErrors = { password: '', confirmPassword: '', terminos: '' };

    if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener mínimo 8 caracteres.';
      hasError = true;
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      hasError = true;
    }
    if (!form.terminos) {
      newErrors.terminos = 'Debes aceptar los Términos y Condiciones.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: form.nombre,
          apellidos: form.apellido,
          email: form.email,
          telefono: form.celular,
          password: form.password,
          genero: form.genero,
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
        onRegisterSuccess({ ...data.data, email: form.email, telefono: form.celular }, 'Cliente', '¡Bienvenido/a a SADYA! Tu cuenta de cliente ha sido creada.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setApiError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  /* ── Success State ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6 shadow-inner">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Bienvenido/a a SADYA!</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-8">
          Tu cuenta de cliente ha sido creada. Ya puedes empezar a rescatar alimentos y ahorrar dinero.
        </p>
        <button
          onClick={onBack}
          className="rounded-full bg-blue-600 text-white px-8 py-3 text-sm font-extrabold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
        >
          Ir al Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 font-sans">

      {/* ── Page Header ── */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center gap-4">
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
          <span className="font-extrabold text-slate-900 text-sm">SADYA · <span className="text-blue-600">Registro de Cliente</span></span>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="mx-auto max-w-6xl px-4 sm:px-8 py-10 lg:py-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        {/* ════ LEFT: Registration Form ════ */}
        <div>
          <div className="mb-8">
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 mb-3 tracking-wider uppercase">
              Nuevo Cliente
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              Crea tu cuenta<br />
              <span className="text-blue-600">gratis en segundos</span>
            </h1>
            <p className="mt-3 text-sm text-slate-500 max-w-md">
              Únete a miles de colombianos que ya rescatan alimentos de calidad, ahorran dinero y generan impacto social positivo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Row: Nombre & Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                id="nombre"
                label="Nombre(s)"
                icon={User}
                placeholder="Ej: María"
                value={form.nombre}
                onChange={set('nombre')}
              />
              <InputField
                id="apellido"
                label="Apellido(s)"
                placeholder="Ej: García López"
                value={form.apellido}
                onChange={set('apellido')}
              />
            </div>

            {/* Email */}
            <InputField
              id="email"
              label="Correo Electrónico"
              type="email"
              icon={Mail}
              placeholder="tucorreo@ejemplo.com"
              value={form.email}
              onChange={set('email')}
            />

            {/* Celular */}
            <InputField
              id="celular"
              label="Número de Celular"
              type="tel"
              icon={Phone}
              placeholder="+57 300 000 0000"
              value={form.celular}
              onChange={set('celular')}
            />

            {/* Password */}
            <InputField
              id="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              extra={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {/* Confirm Password */}
            <InputField
              id="confirmPassword"
              label="Confirmar Contraseña"
              type={showConfirm ? 'text' : 'password'}
              icon={Lock}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              extra={
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {/* Género */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Género</label>
              <div className="flex gap-3 flex-wrap">
                {['Hombre', 'Mujer', 'Prefiero no decir'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="genero"
                      value={g}
                      checked={form.genero === g}
                      onChange={set('genero')}
                      className="accent-blue-600 h-4 w-4"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Términos */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.terminos}
                  onChange={set('terminos')}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                />
                <span className="text-xs text-slate-500 leading-relaxed">
                  Acepto los{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:underline">Términos y Condiciones</a>{' '}
                  y la{' '}
                  <a href="#" className="text-blue-600 font-semibold hover:underline">Política de Privacidad</a>{' '}
                  de SADYA.
                </span>
              </label>
              {errors.terminos && <span className="text-[10px] font-bold text-red-500 block">{errors.terminos}</span>}
            </div>

            {/* Error de API */}
            {apiError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                <span>⚠️</span><span>{apiError}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-blue-600 py-4 text-sm font-black text-white tracking-wider uppercase shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Registrando...</>
              ) : '🚀 Crear mi cuenta'}
            </button>

            {/* Ya tengo cuenta */}
            <p className="text-center text-xs text-slate-500 pb-2">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={onOpenLogin}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </p>
          </form>
        </div>

        {/* ════ RIGHT: Social Login Panel ════ */}
        <div className="flex flex-col gap-6">

          {/* Card */}
          <div className="rounded-3xl bg-white border border-slate-100 shadow-xl p-8 flex flex-col items-center text-center">

            {/* Branding */}
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-2xl shadow-md shadow-blue-200 mb-4">
              S
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight mb-1">
              Ingresa rápidamente
            </h2>
            <p className="text-xs text-slate-400 mb-8 max-w-xs">
              Usa una de tus cuentas existentes para registrarte o iniciar sesión en un solo clic.
            </p>

            {/* Social Buttons */}
            <div className="flex flex-col gap-3 w-full">

              {/* Google */}
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('Google');
                  setIsSocialModalOpen(true);
                }}
                className="flex items-center w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3.5 px-5 shadow-md shadow-blue-100 transition-all duration-200 hover:scale-105 active:scale-95 gap-3 cursor-pointer"
              >
                <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shrink-0">
                  <GoogleIcon />
                </div>
                <span className="text-xs font-extrabold tracking-wider uppercase flex-1 text-center">
                  Continuar con Google
                </span>
              </button>

              {/* Celular */}
              <button
                type="button"
                onClick={() => alert('Registro con Celular próximamente.')}
                className="flex items-center w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-3.5 px-5 shadow-md shadow-emerald-100 transition-all duration-200 hover:scale-105 active:scale-95 gap-3 cursor-pointer"
              >
                <Phone className="h-5 w-5 shrink-0" />
                <span className="text-xs font-extrabold tracking-wider uppercase flex-1 text-center">
                  Continuar con tu celular
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('Facebook');
                  setIsSocialModalOpen(true);
                }}
                className="flex items-center w-full bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full py-3.5 px-5 shadow-md shadow-blue-100/50 transition-all duration-200 hover:scale-105 active:scale-95 gap-3 cursor-pointer"
              >
                <FacebookIcon />
                <span className="text-xs font-extrabold tracking-wider uppercase flex-1 text-center">
                  Continuar con Facebook
                </span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={() => {
                  setSocialProvider('Apple');
                  setIsSocialModalOpen(true);
                }}
                className="flex items-center w-full bg-black hover:bg-slate-800 text-white rounded-full py-3.5 px-5 shadow-md shadow-slate-300/20 transition-all duration-200 hover:scale-105 active:scale-95 gap-3 cursor-pointer"
              >
                <AppleIcon />
                <span className="text-xs font-extrabold tracking-wider uppercase flex-1 text-center">
                  Continuar con Apple
                </span>
              </button>

              {/* Outlined — Ya tengo cuenta */}
              <div className="h-px bg-slate-100 my-1" />
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center justify-center w-full bg-white border-2 border-green-400 text-emerald-600 hover:bg-emerald-50/60 rounded-full py-3.5 px-5 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="text-xs font-black tracking-wider uppercase">
                  Ya tengo cuenta
                </span>
              </button>
            </div>

          </div>

          {/* Impact blurb */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 px-6 py-5 flex flex-col gap-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">🌿 ¿Por qué unirte?</span>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              Al registrarte como cliente en SADYA accedes a <strong>descuentos de hasta el 60%</strong> en alimentos de calidad, 
              contribuyes a reducir el desperdicio de comida y <strong>apoyas a familias vulnerables</strong> en Colombia.
            </p>
          </div>
        </div>
      </div>

      {/* Social Auth Modal */}
      <SocialAuthModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        provider={socialProvider}
        onSuccess={handleSocialSuccess}
      />
    </div>
  );
}
