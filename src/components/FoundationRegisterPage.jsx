import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User, Heart, CheckCircle } from 'lucide-react';

export default function FoundationRegisterPage({ onBack }) {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    nombreFundacion: '',
    tieneTransporte: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCharityAgreement, setAcceptCharityAgreement] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    if (form.password.length < 8) {
      alert('La contraseña debe tener un mínimo de 8 caracteres.');
      return;
    }
    if (!form.tieneTransporte) {
      alert('Por favor selecciona si cuentas con transporte propio.');
      return;
    }
    if (!acceptTerms || !acceptCharityAgreement) {
      alert('Debes aceptar todos los acuerdos y términos legales.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Fundación registrada!</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Los datos de la organización <strong>{form.nombreFundacion}</strong> han sido ingresados al sistema. 
          En breve verificaremos la documentación y nos contactaremos al correo <strong>{form.email}</strong> para coordinar la entrega y recolección de donaciones alimentarias.
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
            SADYA · <span className="text-blue-600 font-extrabold">Registra tu Fundación</span>
          </span>
        </div>
      </div>

      {/* ── Card Area ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:p-12 lg:py-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-6 sm:p-10 transition-all">
          
          {/* Header Card */}
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registra tu Fundación receptora
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
                    placeholder="Ej: Carmen"
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
                  placeholder="Ej: Silva Castro"
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
                    placeholder="contacto@fundacion.org"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 2: Teléfono */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="telefono" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Teléfono (+57)
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
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Fila 4: Nombre de la Fundación */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombreFundacion" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nombre de la Fundación
                </label>
                <div className="relative">
                  <Heart className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="nombreFundacion"
                    type="text"
                    required
                    placeholder="Ej: Fundación Alimento para Todos"
                    value={form.nombreFundacion}
                    onChange={handleChange('nombreFundacion')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 4: Transporte Propio */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="tieneTransporte" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ¿Tienes transporte propio para recoger alimentos?
                </label>
                <select
                  id="tieneTransporte"
                  required
                  value={form.tieneTransporte}
                  onChange={handleChange('tieneTransporte')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 cursor-pointer"
                >
                  <option value="" disabled>Selecciona una opción</option>
                  <option value="si">Sí, cuento con transporte</option>
                  <option value="no">No, requiero ayuda con la entrega</option>
                </select>
              </div>

            </div>

            {/* Fila Inferior: Checkboxes y Botón */}
            <div className="flex flex-col gap-5 mt-3 border-t border-slate-100 pt-5">
              
              {/* Checkboxes de aceptación */}
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 leading-normal">
                    Acepto los{' '}
                    <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones de Uso</a>{' '}
                    y la{' '}
                    <a href="#" className="text-blue-600 font-bold hover:underline">Política de Privacidad</a>{' '}
                    de SADYA.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptCharityAgreement}
                    onChange={(e) => setAcceptCharityAgreement(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 leading-normal">
                    Acepto el{' '}
                    <a href="#" className="text-blue-600 font-bold hover:underline">Acuerdo de Donación y Distribución Responsable</a>{' '}
                    de excedentes de alimentos para poblaciones vulnerables.
                  </span>
                </label>
              </div>

              {/* Botón Principal */}
              <button
                type="submit"
                className="h-12 w-full bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-lg shadow-amber-100 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center"
              >
                Crear cuenta
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
