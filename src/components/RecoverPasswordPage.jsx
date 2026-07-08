import React, { useState, useRef } from 'react';
import { Mail, Key, ShieldCheck, ShieldAlert, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function RecoverPasswordPage({ onBack, onBackToLogin }) {
  // States: 'request' | 'reset' | 'success'
  const [step, setStep] = useState('request');

  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugOtp, setDebugOtp] = useState('');

  const handleCodeChange = (index, value) => {
    if (/^[0-9]$/.test(value) || value === '') {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      setError('');
      if (value !== '' && index < 5) {
        codeRefs[index + 1].current.focus();
      }
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      codeRefs[index - 1].current.focus();
    }
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al solicitar el código de recuperación.');
        setLoading(false);
        return;
      }
      setLoading(false);
      if (data.debugCode) {
        setDebugOtp(data.debugCode);
      }
      setStep('reset');
      setSuccess('Te hemos enviado un código de seguridad a tu correo.');
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const joinedCode = code.join('');
    if (joinedCode.length !== 6) {
      setError('Por favor ingresa el código completo de 6 dígitos.');
      return;
    }
    if (!newPassword.trim()) {
      setError('Por favor ingresa tu nueva contraseña.');
      return;
    }
    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          code: joinedCode,
          newPassword: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al restablecer la contraseña.');
        setLoading(false);
        return;
      }
      setLoading(false);
      setStep('success');
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative">
        {/* Back Button */}
        {step !== 'success' && (
          <button
            onClick={step === 'reset' ? () => setStep('request') : onBackToLogin}
            className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-extrabold text-2xl shadow-md shadow-blue-200 mx-auto">
            S
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-slate-900 tracking-tight">
            Restablecer Contraseña
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {step === 'request' && 'Ingresa tu correo para recibir un código de seguridad'}
            {step === 'reset' && 'Ingresa el código enviado y tu nueva contraseña'}
            {step === 'success' && 'Tu contraseña ha sido actualizada con éxito'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Global Success Banner */}
        {success && step !== 'success' && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl p-3 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Development Debug Code Notification */}
        {debugOtp && step === 'reset' && (
          <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-xl p-4 text-xs">
            <p className="font-bold mb-1">🛠️ Código de prueba generado (Modo Desarrollo):</p>
            <p className="text-base font-black tracking-widest">{debugOtp}</p>
            <p className="text-[10px] text-blue-500 mt-1">Usa este código para simular la validación si no configuraste el SMTP de correo.</p>
          </div>
        )}

        {/* STEP 1: Request Reset Code */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  placeholder="ej. juan@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-blue-100 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Enviando...' : 'Enviar Código de Seguridad'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Verify Code and Reset Password */}
        {step === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* 6 OTP Inputs */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center">
                Ingresa el código de 6 dígitos
              </label>
              <div className="flex justify-center gap-2.5">
                {code.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={codeRefs[idx]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(idx, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                    className="h-12 w-10 text-center font-extrabold text-lg rounded-xl border border-slate-200 outline-none transition-all focus:ring-4 focus:ring-blue-100/50 bg-slate-50 focus:bg-white focus:border-blue-500"
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-11 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirmar Nueva Contraseña
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Repite la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-green-100 transition-all duration-300 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </button>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="space-y-6 text-center">
            <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">¡Contraseña Modificada!</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tu contraseña se ha restablecido exitosamente en el sistema. Ya puedes iniciar sesión con tus nuevas credenciales de acceso.
              </p>
            </div>
            <button
              onClick={onBackToLogin}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-blue-100 transition-all duration-300 active:scale-[0.98] cursor-pointer"
            >
              Ir al Inicio de Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
