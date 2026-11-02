import { api } from '../api';
import React, { useState, useRef } from 'react';
import { Eye, EyeOff, ArrowLeft, ShieldAlert, Phone, X } from 'lucide-react';
import SocialAuthModal from './SocialAuthModal';


export default function LoginPage({ onBack, onOpenRegister, onLoginSuccess, onOpenForgotPassword }) {
  // Auth mode: 'password' | 'code'
  const [authMode, setAuthMode] = useState('password');

  // Shared
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password mode
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Code mode
  const [celular, setCelular] = useState('');

  // Social Auth Modal states
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [socialProvider, setSocialProvider] = useState('Google');

  const handleSocialSuccess = async (socialData) => {
    setIsSocialModalOpen(false);
    setError('');
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/social'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialData)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error en la autenticación social.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(data.data, data.message);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  // OTP Modal
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpError, setOtpError] = useState('');

  const handleOtpChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');
      if (value !== '' && index < 5) {
        otpRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Por favor ingresa tu correo electrónico o número de celular.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña o PIN de 4 números.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (onLoginSuccess) onLoginSuccess(data.data, data.message);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!celular.trim()) {
      setError('Por favor ingresa tu número de celular.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/login-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celular: celular.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'No se encontró una cuenta con ese número.');
        setLoading(false);
        return;
      }
      setLoading(false);
      setOtp(['', '', '', '', '', '']);
      setOtpError('');
      setIsOtpOpen(true);
      setTimeout(() => {
        if (otpRefs[0].current) otpRefs[0].current.focus();
      }, 150);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const handleValidateOtp = async () => {
    if (otp.some(digit => digit === '')) {
      setOtpError('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }
    setOtpError('');
    setLoading(true);
    try {
      const res = await fetch(api('/api/auth/verify-otp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ celular: celular.trim(), otp: otp.join('') }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.message || 'Código inválido.');
        setLoading(false);
        return;
      }
      setLoading(false);
      setIsOtpOpen(false);
      if (onLoginSuccess) onLoginSuccess(data.data, data.message);
    } catch (err) {
      setOtpError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          title="Volver al inicio"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-2xl shadow-md shadow-blue-200 mx-auto">
            S
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
            Te damos la bienvenida a SADYA
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6"></div>

        {/* ── Pill Tab Selector ── */}
        <div className="bg-gray-100 rounded-full flex p-1">
          <button
            type="button"
            onClick={() => switchMode('password')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
              authMode === 'password'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Usar Contraseña
          </button>
          <button
            type="button"
            onClick={() => switchMode('code')}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
              authMode === 'code'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Usar Código
          </button>
        </div>

        {/* ── Form: Password Mode ── */}
        {authMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            {/* Identifier Input */}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correo electrónico o número de celular
              </label>
              <input
                type="text"
                id="identifier"
                placeholder="ej. 3101234567 o juan@correo.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contraseña o PIN (4 dígitos)
                </label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenForgotPassword) onOpenForgotPassword();
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Ingresa tu contraseña o PIN de 4 números"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-100/80 text-[11px] text-amber-800 flex items-start gap-1.5 leading-snug">
                <span className="shrink-0 text-xs">🌾</span>
                <span>
                  <strong>Campesinos / Productores:</strong> Ingresa tu número de celular registrado y tu <strong>PIN de 4 números</strong> como clave.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-green-100 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Verificando...</>
              ) : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {/* ── Form: Code Mode (Campesinos / Sin Contraseña) ── */}
        {authMode === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            {/* Info hint */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>¿No tienes contraseña?</strong> Si eres campesino o productor, ingresa tu número de celular registrado y te enviaremos un código por Mensaje de Texto (SMS) para iniciar sesión.
              </p>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="celular" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Número de celular
              </label>
              <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100/50 transition-all duration-300">
                <div className="h-12 px-4 bg-slate-100 border-r border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm select-none">
                  +57
                </div>
                <input
                  type="tel"
                  id="celular"
                  placeholder="310 123 4567"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                  className="h-12 flex-grow bg-transparent px-4 text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-emerald-100 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Buscando...</>
              ) : (
                <><Phone className="h-4 w-4" />Recibir código por SMS</>
              )}
            </button>
          </form>
        )}

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500 font-medium">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onOpenRegister}
              className="text-blue-600 hover:text-blue-700 font-bold underline transition-colors focus:outline-none cursor-pointer"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

      </div>

      {/* ── OTP MODAL (Código por WhatsApp) ── */}
      {isOtpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOtpOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl transition-all duration-300 border border-slate-100 z-10">
            {/* Close */}
            <button
              onClick={() => setIsOtpOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                <Phone className="h-7 w-7 text-emerald-600 animate-pulse" />
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Ingresa el código de 6 dígitos
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                Enviamos un código por Mensaje de Texto (SMS) al{' '}
                <strong className="text-slate-800">+57 {celular || '3XXXXXXXXX'}</strong>.
                Ingrésalo a continuación para iniciar sesión.
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
                    className={`h-12 w-10 sm:w-11 text-center font-extrabold text-lg rounded-xl border outline-none transition-all focus:ring-4 focus:ring-blue-100/50 bg-slate-50 focus:bg-white ${
                      otpError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-blue-500'
                    }`}
                  />
                ))}
              </div>
              {otpError && <span className="text-xs font-bold text-red-500 block mb-4 text-center">{otpError}</span>}

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <button
                  onClick={handleValidateOtp}
                  className="h-11 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-xl shadow-md transition-colors text-xs tracking-wider uppercase cursor-pointer"
                >
                  Validar código
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(['', '', '', '', '', '']);
                    setOtpError('Código reenviado por SMS.');
                    if (otpRefs[0].current) otpRefs[0].current.focus();
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-2 cursor-pointer"
                >
                  No lo recibí · Reenviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
