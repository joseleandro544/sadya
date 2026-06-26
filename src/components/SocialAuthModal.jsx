import React, { useState } from 'react';
import { X, User, Mail, ShieldCheck } from 'lucide-react';

export default function SocialAuthModal({ isOpen, onClose, provider, onSuccess }) {
  const [customMode, setCustomMode] = useState(false);
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Mock profile definitions
  const mockProfiles = {
    Google: [
      {
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        idSocial: 'google_123456_juan'
      },
      {
        nombres: 'María',
        apellidos: 'Gómez',
        email: 'maria.gomez@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
        idSocial: 'google_789012_maria'
      }
    ],
    Apple: [
      {
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@icloud.com',
        avatar: null,
        idSocial: 'apple_123456_juan'
      },
      {
        nombres: 'Sofía',
        apellidos: 'Rodríguez',
        email: 'sofia.rodriguez@icloud.com',
        avatar: null,
        idSocial: 'apple_789012_sofia'
      }
    ],
    Facebook: [
      {
        nombres: 'Juan',
        apellidos: 'Pérez',
        email: 'juan.perez@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        idSocial: 'facebook_123456_juan'
      },
      {
        nombres: 'Carlos',
        apellidos: 'Mendoza',
        email: 'carlos.mendoza@facebook.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        idSocial: 'facebook_789012_carlos'
      }
    ]
  };

  const handleSelectProfile = async (profile) => {
    setLoading(true);
    setError('');
    // Simulate real OAuth communication delay
    setTimeout(async () => {
      try {
        await onSuccess({
          email: profile.email,
          nombres: profile.nombres,
          apellidos: profile.apellidos,
          idSocial: profile.idSocial,
          metodoRegistro: provider
        });
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error en la autenticación social.');
        setLoading(false);
      }
    }, 1200);
  };

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    if (!nombres.trim() || !email.trim()) {
      setError('Nombre y Correo electrónico son obligatorios.');
      return;
    }
    setError('');
    const profile = {
      nombres: nombres.trim(),
      apellidos: apellidos.trim() || null,
      email: email.trim().toLowerCase(),
      // Generate a stable-looking but randomized idSocial for write-in mock
      idSocial: `${provider.toLowerCase()}_custom_${nombres.toLowerCase().replace(/\s+/g, '')}_${Math.random().toString(36).substr(2, 6)}`,
    };
    handleSelectProfile(profile);
  };

  // Provider Styling configurations
  const styling = {
    Google: {
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      headerBg: 'bg-slate-50',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white',
      accentColor: 'text-blue-600',
      logo: (
        <svg className="h-6 w-6" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.67 0 3.2.58 4.38 1.69l3.27-3.27C17.67 1.62 14.98 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.83 2.97C6.01 7.37 8.78 5.04 12 5.04z" />
          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.2-2.03 3.67-5.02 3.67-8.64z" />
          <path fill="#FBBC05" d="M5.07 14.69c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.24 7.14C.45 8.72 0 10.49 0 12.4s.45 3.68 1.24 5.26l3.83-2.97z" />
          <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.5 1.18-4.2 1.18-3.22 0-5.99-2.33-6.97-5.65L1.24 15.68C3.2 19.67 7.24 23 12 23z" />
        </svg>
      )
    },
    Apple: {
      bgColor: 'bg-zinc-900',
      textColor: 'text-white',
      headerBg: 'bg-zinc-950',
      btnColor: 'bg-white hover:bg-zinc-100 text-black',
      accentColor: 'text-zinc-400',
      logo: (
        <svg className="h-6 w-6 fill-current text-white" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.26-.54 3-1.44z" />
        </svg>
      )
    },
    Facebook: {
      bgColor: 'bg-white',
      textColor: 'text-slate-800',
      headerBg: 'bg-blue-50/50',
      btnColor: 'bg-[#1877F2] hover:bg-[#166fe5] text-white',
      accentColor: 'text-[#1877F2]',
      logo: (
        <svg className="h-6 w-6 fill-current text-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    }
  };

  const currentStyle = styling[provider] || styling.Google;
  const isApple = provider === 'Apple';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className={`relative w-full max-w-md transform overflow-hidden rounded-3xl ${currentStyle.bgColor} shadow-2xl transition-all duration-300 border ${isApple ? 'border-zinc-800' : 'border-slate-100'} z-10 font-sans`}>
        
        {/* Header */}
        <div className={`px-6 py-5 flex items-center justify-between border-b ${isApple ? 'border-zinc-800 bg-zinc-950' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex items-center gap-3">
            {currentStyle.logo}
            <span className={`text-sm font-black tracking-tight ${isApple ? 'text-zinc-200' : 'text-slate-800'}`}>
              {provider === 'Google' && 'Iniciar sesión con Google'}
              {provider === 'Apple' && 'Apple ID'}
              {provider === 'Facebook' && 'Iniciar sesión con Facebook'}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${isApple ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className={`h-12 w-12 border-4 border-t-transparent ${isApple ? 'border-white' : 'border-blue-600'} rounded-full animate-spin mb-6`}></div>
              <p className={`text-sm font-black tracking-tight ${currentStyle.textColor}`}>
                Conectando de forma segura con SADYA...
              </p>
              <p className={`text-xs mt-2 ${isApple ? 'text-zinc-400' : 'text-slate-400'}`}>
                Verificando credenciales del proveedor social
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-3 text-xs font-semibold">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {!customMode ? (
                <div>
                  <div className="mb-5 text-center">
                    <p className={`text-sm font-bold ${isApple ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {provider === 'Apple' ? 'Selecciona tu Apple ID para continuar' : 'Elige una cuenta para continuar a SADYA'}
                    </p>
                  </div>

                  {/* List of Mock Profiles */}
                  <div className="space-y-3">
                    {mockProfiles[provider]?.map((profile, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectProfile(profile)}
                        className={`w-full flex items-center gap-4 p-3 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                          isApple 
                            ? 'border-zinc-800 hover:bg-zinc-800/50 bg-zinc-900/60 text-white' 
                            : 'border-slate-100 hover:bg-slate-50 bg-white text-slate-800 hover:border-slate-200'
                        }`}
                      >
                        {profile.avatar ? (
                          <img src={profile.avatar} alt={profile.nombres} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${isApple ? 'bg-zinc-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {profile.nombres[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-extrabold truncate">
                            {profile.nombres} {profile.apellidos}
                          </p>
                          <p className={`text-xs truncate ${isApple ? 'text-zinc-400' : 'text-slate-400'}`}>
                            {profile.email}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isApple ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-500'}`}>
                          Simulada
                        </span>
                      </button>
                    ))}

                    {/* Custom account selector option */}
                    <button
                      onClick={() => setCustomMode(true)}
                      className={`w-full flex items-center gap-4 p-3 rounded-2xl border border-dashed text-left transition-all active:scale-[0.98] ${
                        isApple 
                          ? 'border-zinc-700 hover:bg-zinc-800/40 text-zinc-300' 
                          : 'border-slate-300 hover:bg-slate-50/50 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border border-dashed ${isApple ? 'border-zinc-700 bg-zinc-800/40 text-zinc-400' : 'border-slate-300 bg-slate-50 text-slate-400'}`}>
                        +
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Usar otra cuenta...</p>
                        <p className={`text-xs ${isApple ? 'text-zinc-500' : 'text-slate-400'}`}>
                          Ingresar correo y nombre personalizado
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Information Badge */}
                  <div className={`mt-6 p-4 rounded-2xl flex items-start gap-3 ${isApple ? 'bg-zinc-950/80 border border-zinc-800' : 'bg-sky-50/50 border border-sky-100'}`}>
                    <ShieldCheck className={`h-5 w-5 shrink-0 mt-0.5 ${currentStyle.accentColor}`} />
                    <p className={`text-xs leading-relaxed ${isApple ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <strong>Sandbox Seguro:</strong> SADYA utiliza una integración simulada. Al seleccionar una cuenta social, se registrará y validará en la base de datos real sin necesidad de compartir contraseñas reales.
                    </p>
                  </div>
                </div>
              ) : (
                /* Write-in custom social account mode */
                <form onSubmit={handleCustomSubmit} className="space-y-4">
                  <div className="mb-2">
                    <h4 className={`text-sm font-extrabold ${isApple ? 'text-zinc-200' : 'text-slate-800'}`}>
                      Configurar cuenta simulada personalizada
                    </h4>
                    <p className={`text-xs mt-1 ${isApple ? 'text-zinc-400' : 'text-slate-400'}`}>
                      Ingresa los datos para simular el inicio de sesión a través de {provider}.
                    </p>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isApple ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Nombre(s)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ej: Juan"
                        value={nombres}
                        required
                        onChange={(e) => setNombres(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          isApple 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isApple ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Apellido(s)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ej: Pérez (Opcional)"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          isApple 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isApple ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${
                          isApple 
                            ? 'bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-zinc-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCustomMode(false);
                        setError('');
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-center cursor-pointer transition-colors ${
                        isApple ? 'bg-zinc-850 hover:bg-zinc-800 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      className={`flex-grow py-2.5 rounded-xl text-xs font-black tracking-wider uppercase shadow-md transition-all active:scale-[0.98] cursor-pointer ${currentStyle.btnColor}`}
                    >
                      Continuar
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
