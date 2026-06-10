import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function LoginPage({ onBack, onOpenRegister, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Por favor ingresa tu correo electrónico o número de celular.');
      return;
    }
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }
    setError('');
    // Simulate login success
    if (onLoginSuccess) {
      onLoginSuccess(`¡Bienvenido de nuevo, ${identifier}!`);
    }
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

        {/* SSO Buttons */}
        <div className="space-y-3 mt-8">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
          >
            {/* Google G multicolor icon SVG */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.54l3.86 3C6.26 7.56 8.9 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.91 3.41-8.6z"
              />
              <path
                fill="#FBBC05"
                d="M5.36 14.46c-.23-.69-.36-1.42-.36-2.18s.13-1.49.36-2.18v-3.8l-3.86-3C.68 5.08 0 7.82 0 10.78s.68 5.7 1.5 7.48l3.86-3.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.1 0-5.74-2.52-6.68-5.5l-3.86 3C3.4 20.35 7.35 23 12 23z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-black rounded-xl py-3 px-4 text-sm font-semibold text-white hover:bg-slate-900 active:scale-[0.98] transition-all cursor-pointer"
          >
            {/* Apple Logo SVG */}
            <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.26-.54 3-1.44z" />
            </svg>
            <span>Continuar con Apple</span>
          </button>
        </div>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-bold tracking-widest">O</span>
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Identifier Input */}
          <div>
            <label htmlFor="identifier" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Correo electrónico o número de celular
            </label>
            <input
              type="text"
              id="identifier"
              placeholder="ej. juan@correo.com o 320123..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 px-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contraseña
              </label>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Funcionalidad de recuperación de contraseña simulada.');
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
                placeholder="Ingresa tu contraseña"
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
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 text-sm tracking-wide shadow-lg shadow-green-100 transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </form>

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
    </div>
  );
}
