import React from 'react';
import { X, Phone } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.62 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.83 2.97C6.01 7.37 8.78 5.04 12 5.04z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z"
    />
    <path
      fill="#FBBC05"
      d="M5.07 14.69c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.24 7.14C.45 8.72 0 10.49 0 12.4s.45 3.68 1.24 5.26l3.83-2.97z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.22 0-5.99-2.33-6.97-5.65L1.24 15.68C3.2 19.67 7.24 23 12 23z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.004-2.117 3.674-.54 9.122 1.519 12.087 1.007 1.45 2.201 3.071 3.771 3.011 1.515-.06 2.09-.974 3.916-.974 1.824 0 2.348.974 3.931.94 1.615-.027 2.661-1.464 3.64-2.894 1.134-1.651 1.6-3.245 1.629-3.328-.035-.015-3.123-1.196-3.153-4.757-.027-2.981 2.443-4.413 2.56-4.482-1.393-2.039-3.541-2.274-4.302-2.328-2.031-.164-3.513 1.078-4.591 1.078zM15.932 3.56c.915-1.11 1.528-2.656 1.359-4.204-1.328.055-2.937.887-3.889 1.996-.826.953-1.551 2.527-1.36 4.04 1.48.115 2.977-.722 3.89-1.832z" />
  </svg>
);

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay with Blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Auth Container */}
      <div className="relative w-full max-w-sm transform z-10 flex flex-col items-center">
        
        {/* Title above the Card */}
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl mb-4 tracking-tight drop-shadow-md">
          Cliente
        </h1>

        {/* The White Card */}
        <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl border border-slate-100/50 flex flex-col relative transition-all duration-300">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Card Title */}
          <h2 className="text-xl font-black text-center text-slate-800 leading-tight tracking-tight mt-2 px-2">
            Regístrate o ingresa para continuar
          </h2>

          {/* Buttons Column */}
          <div className="flex flex-col gap-4 mt-8 w-full">
            
            {/* 1. Google Button (Primary Custom) */}
            <button
              onClick={() => {
                alert("Simulando inicio de sesión con Google");
                onClose();
              }}
              className="flex items-center justify-between w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2.5 pl-3 pr-3 shadow-md shadow-blue-200 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer text-left"
            >
              {/* Left: User Avatar */}
              <div className="h-8 w-8 rounded-full overflow-hidden border border-white/20 shrink-0 bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Leandro" 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Center: Texts stacked */}
              <div className="flex-grow px-3 min-w-0 flex flex-col">
                <span className="text-xs font-black truncate leading-tight">
                  Continuar como Leandro
                </span>
                <span className="text-[9px] text-blue-100 truncate leading-none mt-0.5 font-medium">
                  joseleandro.544@gmail.com
                </span>
              </div>

              {/* Right: G Circle Logo */}
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-inner">
                <GoogleIcon />
              </div>
            </button>

            {/* 2. Celular Button */}
            <button
              onClick={() => alert("Continuando con celular...")}
              className="flex items-center w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-3.5 px-6 shadow-md shadow-emerald-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
            >
              <Phone className="h-5 w-5 absolute left-6 shrink-0" />
              <span className="text-xs font-extrabold tracking-wider uppercase w-full text-center">
                Continuar con tu celular
              </span>
            </button>

            {/* 3. Facebook Button */}
            <button
              onClick={() => alert("Continuando con Facebook...")}
              className="flex items-center w-full bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full py-3.5 px-6 shadow-md shadow-blue-100/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
            >
              <div className="absolute left-6 shrink-0">
                <FacebookIcon />
              </div>
              <span className="text-xs font-extrabold tracking-wider uppercase w-full text-center">
                Continuar con Facebook
              </span>
            </button>

            {/* 4. Apple Button */}
            <button
              onClick={() => alert("Continuando con Apple...")}
              className="flex items-center w-full bg-black hover:bg-slate-900 text-white rounded-full py-3.5 px-6 shadow-md shadow-slate-400/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
            >
              <div className="absolute left-6 shrink-0">
                <AppleIcon />
              </div>
              <span className="text-xs font-extrabold tracking-wider uppercase w-full text-center">
                Continuar con Apple
              </span>
            </button>

            {/* Space separator */}
            <div className="h-2" />

            {/* 5. Ya tengo cuenta Button (Outlined) */}
            <button
              onClick={() => alert("Abriendo inicio de sesión...")}
              className="flex items-center justify-center w-full bg-white border-2 border-green-400 text-emerald-500 hover:bg-green-50/50 rounded-full py-3.5 px-6 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="text-xs font-black tracking-wider uppercase text-center">
                Ya tengo cuenta
              </span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
