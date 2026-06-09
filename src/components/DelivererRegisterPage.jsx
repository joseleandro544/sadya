import { useState, useRef } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User, CheckCircle, Upload, Camera } from 'lucide-react';

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

export default function DelivererRegisterPage({ onBack }) {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    ciudad: '',
    whatsapp: '',
    password: '',
    vehiculo: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // KYC Modal States
  const [isKycOpen, setIsKycOpen] = useState(false);
  const [kycStep, setKycStep] = useState(1); // 1: OTP, 2: Uploads
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  // File upload simulation states
  const [cedulaUploaded, setCedulaUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOtpChange = (index, value) => {
    // Only allow single digit
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto focus next input
      if (value !== '' && index < 5) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Auto focus previous input on backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (!form.ciudad) {
      alert('Por favor selecciona tu ciudad.');
      return;
    }
    if (!form.vehiculo) {
      alert('Por favor selecciona tu tipo de vehículo.');
      return;
    }
    if (!acceptTerms) {
      alert('Debes aceptar los Términos y Condiciones.');
      return;
    }
    // Open KYC Modal
    setIsKycOpen(true);
    setKycStep(1);
  };

  const handleValidateOtp = () => {
    // Check if OTP is fully entered
    if (otp.some(digit => digit === '')) {
      alert('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }
    // Proceed to Step 2
    setKycStep(2);
  };

  const handleFinalSubmit = () => {
    if (!cedulaUploaded || !selfieUploaded) {
      alert('Por favor sube ambos archivos requeridos para continuar.');
      return;
    }
    // Close KYC modal and show final success state
    setIsKycOpen(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/50 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6 shadow-inner animate-bounce">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">¡Solicitud Enviada!</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
          Tu cuenta de transportador ha sido creada y tus documentos se encuentran en revisión. 
          Te notificaremos por WhatsApp a <strong>+57 {form.whatsapp}</strong> tan pronto como tu perfil de domiciliario esté activo para empezar a recibir pedidos.
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
            SADYA · <span className="text-rose-500 font-extrabold">Únete como Domiciliario</span>
          </span>
        </div>
      </div>

      {/* ── Form Card Area ── */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8 md:p-12 lg:py-16">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden transition-all">
          
          {/* Eye-catching Onboarding Header */}
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 px-6 py-10 text-white text-center relative overflow-hidden">
            {/* Dot pattern background */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight relative z-10">
              Únete como Domiciliario / Transportador
            </h1>
            <p className="mt-2 text-xs text-rose-100 max-w-sm mx-auto relative z-10">
              Genera ingresos rescatando alimentos de calidad y entregándolos cerca de ti.
            </p>
          </div>

          <form onSubmit={handleRegisterClick} className="p-6 sm:p-10 flex flex-col gap-6">
            
            {/* Grid 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Fila 1: Nombre */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="nombre" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    id="nombre"
                    type="text"
                    required
                    placeholder="Ej: Carlos"
                    value={form.nombre}
                    onChange={handleChange('nombre')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 1: Apellido */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="apellido" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  required
                  placeholder="Ej: Martínez"
                  value={form.apellido}
                  onChange={handleChange('apellido')}
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
                    placeholder="ejemplo@correo.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60"
                  />
                </div>
              </div>

              {/* Fila 2: Ciudad (Select) */}
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

              {/* Fila 3: WhatsApp (+57) */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="whatsapp" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Número de WhatsApp (+57)
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/60 transition-all">
                  <div className="h-12 px-4 bg-slate-100 border-r border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
                    +57
                  </div>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    placeholder="300 123 4567"
                    value={form.whatsapp}
                    onChange={handleChange('whatsapp')}
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

              {/* Fila 4: Tipo de Vehículo */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="vehiculo" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tipo de Vehículo
                </label>
                <select
                  id="vehiculo"
                  required
                  value={form.vehiculo}
                  onChange={handleChange('vehiculo')}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/60 cursor-pointer"
                >
                  <option value="" disabled>Selecciona tu vehículo</option>
                  <option value="moto">Moto / Bicicleta</option>
                  <option value="carro">Automóvil</option>
                  <option value="camion">Camión de carga</option>
                </select>
              </div>

            </div>

            {/* Fila Inferior: Checkbox y Botón */}
            <div className="flex flex-col gap-4 mt-3 border-t border-slate-100 pt-5">
              
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600 cursor-pointer"
                />
                <span className="text-xs text-slate-500 leading-normal">
                  Acepto los{' '}
                  <a href="#" className="text-blue-600 font-bold hover:underline">Términos y Condiciones de uso</a>{' '}
                  y las{' '}
                  <a href="#" className="text-blue-600 font-bold hover:underline">Políticas de Privacidad y de Seguridad KYC</a>{' '}
                  para transportadores colaboradores de SADYA.
                </span>
              </label>

              {/* Botón Principal (Verde Esmeralda) */}
              <button
                type="submit"
                className="h-12 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center mt-2"
              >
                Registrarse
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── MODAL INTERACTIVO DE SEGURIDAD (VERIFICACIÓN KYC) ── */}
      {isKycOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all duration-300 border border-slate-100 z-10">
            
            {/* Step 1: WhatsApp OTP */}
            {kycStep === 1 && (
              <div className="flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                  <Phone className="h-7 w-7 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Te enviamos un código a WhatsApp
                </h3>
                <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                  Ingresa los 6 números enviados al <strong className="text-slate-800">+57 {form.whatsapp || "3XXXXXXXXX"}</strong> para verificar tu línea de contacto.
                </p>

                {/* 6 OTP Inputs */}
                <div className="flex gap-2.5 my-6">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 w-10 sm:w-11 text-center font-extrabold text-lg rounded-xl border border-slate-200 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 bg-slate-50 focus:bg-white"
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full mt-2">
                  <button
                    onClick={handleValidateOtp}
                    className="h-11 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-xs tracking-wider uppercase cursor-pointer"
                  >
                    Validar código
                  </button>
                  <button
                    onClick={() => {
                      setOtp(['', '', '', '', '', '']);
                      otpRefs[0].current.focus();
                      alert('Código reenviado.');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-2"
                  >
                    No lo recibí
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Identidad & Selfie */}
            {kycStep === 2 && (
              <div className="flex flex-col">
                <h3 className="text-lg font-black text-slate-900 tracking-tight text-center sm:text-left">
                  Verificación de Seguridad
                </h3>
                <p className="text-xs text-slate-400 mt-1 text-center sm:text-left leading-relaxed">
                  Para activar tu perfil de repartidor, por favor carga tus documentos de identidad.
                </p>

                {/* Dropzones */}
                <div className="flex flex-col gap-4 my-6">
                  
                  {/* Zone A: Cédula */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      1. Sube foto frontal de tu Cédula
                    </span>
                    <button
                      type="button"
                      onClick={() => setCedulaUploaded(true)}
                      className={`h-28 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${
                        cedulaUploaded
                          ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800 font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {cedulaUploaded ? (
                        <>
                          <CheckCircle className="h-7 w-7 text-emerald-600 mb-1" />
                          <span className="text-xs">Foto de Cédula Cargada con éxito</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-7 w-7 text-slate-400 mb-1" />
                          <span className="text-xs font-semibold">Hacer clic para subir o arrastrar foto</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Formatos: JPG, PNG (Max 5MB)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Zone B: Selfie */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      2. Tómate una Selfie (Foto de rostro)
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelfieUploaded(true)}
                      className={`h-28 w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-all ${
                        selfieUploaded
                          ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800 font-semibold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {selfieUploaded ? (
                        <>
                          <CheckCircle className="h-7 w-7 text-emerald-600 mb-1" />
                          <span className="text-xs">Selfie capturada con éxito</span>
                        </>
                      ) : (
                        <>
                          <Camera className="h-7 w-7 text-slate-400 mb-1" />
                          <span className="text-xs font-semibold">Tomar foto / Cargar archivo selfie</span>
                          <span className="text-[10px] text-slate-400 mt-0.5">Asegura buena iluminación de tu rostro</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Final Submit Button */}
                <button
                  onClick={handleFinalSubmit}
                  className="h-12 w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg transition-colors text-xs tracking-wider uppercase cursor-pointer"
                >
                  Enviar a verificación
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
