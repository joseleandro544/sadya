import { useState } from 'react';
import { ArrowLeft, MapPin, User, Phone, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';

export default function FarmerRegisterPage({ onBack, onRegisterSuccess, onOpenLogin }) {
  const [form, setForm] = useState({
    nombreCompleto: '',
    direccion: '',
    telefono: '',
    pin: ''
  });
  
  const [showPin, setShowPin] = useState(false);

  const [errors, setErrors] = useState({
    nombreCompleto: false,
    telefono: '',
    pin: '',
    terms: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'pin') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    
    if (field === 'nombreCompleto') {
      setErrors((prev) => ({ ...prev, nombreCompleto: value.trim() === '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    let hasError = false;
    const newErrors = { nombreCompleto: false, telefono: '', pin: '', terms: '' };

    if (form.nombreCompleto.trim() === '') {
      newErrors.nombreCompleto = true;
      hasError = true;
    }
    if (form.telefono.trim() === '') {
      newErrors.telefono = 'El teléfono es obligatorio.';
      hasError = true;
    }
    if (!form.pin || form.pin.length !== 4) {
      newErrors.pin = 'La clave debe ser un PIN de 4 números.';
      hasError = true;
    }
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los Términos y Condiciones.';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);

    try {
      const res = await fetch('/api/register/farmer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombreCompleto: form.nombreCompleto.trim(),
          direccion: form.direccion.trim(),
          telefono: form.telefono.trim(),
          pin: form.pin.trim()
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || 'Error al registrar. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(data.data, 'Productor', '¡Registro completado, Productor! Hemos guardado tu información.');
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      setApiError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Registro completado, Productor!</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Hemos guardado tu información. Bienvenido a la comunidad de productores de <strong>SADYA</strong>. 
          Pronto nos comunicaremos contigo al teléfono ingresado para ayudarte a subir tus primeros productos de la finca.
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
            SADYA · <span className="text-amber-500">Registro de usuario</span>
          </span>
        </div>
      </div>

      {/* ── Card Area ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-8 transition-all">
          
          {/* Header Card */}
          <div className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registro de usuario
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Nombre Completo */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombreCompleto" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="nombreCompleto"
                  type="text"
                  placeholder="Ej: Pedro José Gómez"
                  value={form.nombreCompleto}
                  onChange={handleChange('nombreCompleto')}
                  className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-blue-100/60 ${
                    errors.nombreCompleto ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.nombreCompleto && (
                <span className="text-[10px] font-bold text-red-500 tracking-wide">
                  No puede quedar vacío
                </span>
              )}
            </div>

            {/* Dirección */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="direccion" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="direccion"
                  type="text"
                  required
                  placeholder="Dirección de la finca"
                  value={form.direccion}
                  onChange={handleChange('direccion')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                />
              </div>
            </div>

            {/* Teléfono */}
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
                  placeholder="310 123 4567"
                  value={form.telefono}
                  onChange={handleChange('telefono')}
                  className="h-12 flex-grow bg-white px-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>
              {errors.telefono && (
                <span className="text-[10px] font-bold text-red-500 tracking-wide mt-0.5 block">
                  {errors.telefono}
                </span>
              )}
            </div>

            {/* Clave / PIN de 4 números */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="pin" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Clave (PIN de 4 números)
                </label>
                <span className={`text-[11px] font-bold ${form.pin.length === 4 ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {form.pin.length}/4 números
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={4}
                  required
                  placeholder="Ej: 1234"
                  value={form.pin}
                  onChange={handleChange('pin')}
                  className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-base text-slate-800 tracking-widest placeholder-slate-400 placeholder:tracking-normal outline-none transition-all focus:ring-4 focus:ring-blue-100/60 font-mono ${
                    errors.pin ? 'border-red-500 focus:border-red-500 focus:ring-red-100/50' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1 transition-colors"
                  title={showPin ? 'Ocultar PIN' : 'Ver PIN'}
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.pin ? (
                <span className="text-[10px] font-bold text-red-500 tracking-wide mt-0.5 block">
                  {errors.pin}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Crea un PIN de 4 números. Lo usarás como clave para entrar a tu cuenta.
                </span>
              )}
            </div>

            {/* Términos y Botón */}
            <div className="flex flex-col gap-4 mt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    setErrors((prev) => ({ ...prev, terms: '' }));
                  }}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-500 leading-normal">
                  Acepto los{' '}
                  <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones</a>{' '}
                  y las{' '}
                  <a href="#" className="text-blue-600 font-bold hover:underline">Políticas de Privacidad</a>{' '}
                  de la plataforma SADYA.
                </span>
              </label>
              {errors.terms && (
                <span className="text-[10px] font-bold text-red-500 block">
                  {errors.terms}
                </span>
              )}

              {/* Error de API */}
              {apiError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                  <span>⚠️</span>
                  <span>{apiError}</span>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold rounded-xl shadow-lg shadow-amber-100 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registrando...
                  </>
                ) : (
                  'Registrarme'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
