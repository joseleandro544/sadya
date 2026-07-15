import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Lock, Info, Save, 
  Building, CreditCard, Truck, Calendar, ShieldCheck, HelpCircle, Loader2
} from 'lucide-react';

export default function UserProfilePage({ user, onBack, onProfileUpdate }) {
  const [profileData, setProfileData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    genero: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    numero_identidad: '',
    fecha_nacimiento: '',
    tipo_rol: '',
    fecha_registro: '',
    foto_perfil: '',
    
    // Store specific
    nombre_establecimiento: '',
    nit: '',
    direccion_local: '',
    banco: '',
    numero_cuenta: '',
    tipo_cuenta: '',
    tiene_domicilio_propio: false,

    // Domiciliario specific
    no_documento: '',
    direccion_residencia: '',
    tipo_repartidor: '',

    // Fundación specific
    nombre_fundacion: '',
    tiene_transporte_propio: false
  });

  const [isInitialIdentityPlaceholder, setIsInitialIdentityPlaceholder] = useState(false);
  const [isInitialNitPlaceholder, setIsInitialNitPlaceholder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const userId = user?.id || user?.id_usuario;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setError('Sesión de usuario no válida. Inicia sesión de nuevo.');
      setLoading(false);
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/profile/${userId}`);
      const result = await res.json();
      
      if (res.ok && result.status === 'ok') {
        // Format birth date for input date tag (YYYY-MM-DD)
        let formattedBirthDate = '';
        if (result.data.fecha_nacimiento) {
          formattedBirthDate = new Date(result.data.fecha_nacimiento).toISOString().split('T')[0];
        }
        
        const identityVal = result.data.numero_identidad || result.data.no_documento || '';
        const nitVal = result.data.nit || '';
        
        setIsInitialIdentityPlaceholder(!identityVal || identityVal.trim() === '' || identityVal === 'Sin Documento');
        setIsInitialNitPlaceholder(!nitVal || nitVal.trim() === '' || nitVal === 'Sin NIT');
        
        setProfileData({
          ...result.data,
          numero_identidad: identityVal,
          fecha_nacimiento: formattedBirthDate
        });
      } else {
        setError(result.message || 'Error al obtener la información de perfil.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor para obtener los datos de perfil.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          foto_perfil: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!profileData.nombres?.trim()) errors.nombres = 'El nombre es obligatorio.';
    if (!profileData.apellidos?.trim()) errors.apellidos = 'El apellido es obligatorio.';
    
    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!profileData.email?.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(profileData.email)) {
      errors.email = 'Ingresa un formato de correo electrónico válido.';
    }

    if (!profileData.telefono?.trim()) {
      errors.telefono = 'El teléfono es obligatorio.';
    }

    // Role specific validations
    const role = profileData.tipo_rol || user?.rol;
    if (role === 'Tienda' || role === 'Tendero') {
      if (!profileData.nombre_establecimiento?.trim()) {
        errors.nombre_establecimiento = 'El nombre de establecimiento es obligatorio.';
      }
    } else if (role === 'Fundación') {
      if (!profileData.nombre_fundacion?.trim()) {
        errors.nombre_fundacion = 'El nombre de la fundación es obligatorio.';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario.');
      return;
    }

    setSaveLoading(true);
    try {
      const res = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      const result = await res.json();

      if (res.ok && result.status === 'ok') {
        setSuccess(result.message || '¡Tu perfil ha sido actualizado con éxito!');
        
        setIsInitialIdentityPlaceholder(false);
        setIsInitialNitPlaceholder(false);
        
        // Notify parent application to update header names if needed
        if (onProfileUpdate) {
          onProfileUpdate({
            ...user,
            nombres: profileData.nombres,
            apellidos: profileData.apellidos,
            email: profileData.email,
            telefono: profileData.telefono,
            foto_perfil: profileData.foto_perfil
          });
        }
      } else {
        setError(result.message || 'Error al actualizar el perfil.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor para guardar los cambios.');
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  // Helper to format date for display
  const formatRegisterDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  // Helper to get role badge colors
  const getRoleBadgeStyle = (role) => {
    const normalizedRole = (role || '').toLowerCase();
    if (normalizedRole === 'campesino' || normalizedRole === 'productor') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (normalizedRole === 'tienda' || normalizedRole === 'tendero') {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (normalizedRole === 'domiciliario' || normalizedRole === 'transportador') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (normalizedRole === 'fundación' || normalizedRole === 'fundacion') {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    } else {
      return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  // Render a standard field
  const renderField = (label, name, type = 'text', placeholder = '', disabled = false) => {
    const hasError = !!validationErrors[name];
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={name} className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={profileData[name] || ''}
          onChange={handleInputChange}
          disabled={disabled}
          className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20
            ${disabled 
              ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' 
              : hasError
                ? 'border-red-400 focus:border-red-500'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-500'
            }`}
        />
        {hasError && <span className="text-xs text-red-500 font-semibold">{validationErrors[name]}</span>}
      </div>
    );
  };

  // Render a special read-only fiscal warning field
  const renderReadOnlyFiscalField = (label, name, value, type = 'text') => {
    // Determine placeholder status using the initial page-load flags
    const isPlaceholder = name === 'numero_identidad' ? isInitialIdentityPlaceholder : isInitialNitPlaceholder;
    
    if (isPlaceholder) {
      return renderField(label, name, type, `Registra tu ${label.toLowerCase()}`);
    }

    return (
      <div className="flex flex-col gap-1.5 w-full relative">
        <div className="flex items-center gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </label>
          {/* Tooltip Wrapper */}
          <div className="group relative cursor-help inline-flex items-center text-slate-400 hover:text-slate-600">
            <Info className="h-4 w-4" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 font-normal leading-relaxed text-center pointer-events-none">
              Por razones de seguridad fiscal, este documento no puede modificarse. Si hay un error, contacta a soporte
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
            </div>
          </div>
        </div>
        <div className="relative">
          <input
            name={name}
            type={type}
            value={value || ''}
            readOnly
            className="w-full rounded-xl border border-slate-200 bg-slate-100/80 text-slate-500 px-4 py-3 text-sm font-semibold cursor-not-allowed focus:outline-none pr-10"
          />
          <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-extrabold text-sm animate-pulse">Cargando tu información de perfil...</p>
        </div>
      </div>
    );
  }

  const role = profileData.tipo_rol || user?.rol;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 mb-8">
          <button 
            onClick={onBack}
            className="self-start flex items-center gap-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-4 py-2 text-sm font-bold shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al inicio</span>
          </button>

          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración del Perfil</h1>
            <p className="text-slate-500 text-sm mt-1">Gestiona tus datos personales, ubicación y detalles específicos de tu cuenta.</p>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700 animate-fadeIn">
            <span className="font-bold">⚠️ Error:</span>
            <p className="text-sm font-semibold leading-relaxed">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 text-emerald-700 animate-fadeIn">
            <span className="font-bold">✅ ¡Listo!</span>
            <p className="text-sm font-semibold leading-relaxed">{success}</p>
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - User Badge & Overview Card */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              
              {/* Dynamic Avatar with Upload Option */}
              <div className="relative group mb-4">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100 select-none">
                  {profileData.foto_perfil ? (
                    <img src={profileData.foto_perfil} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      {profileData.nombres ? profileData.nombres[0].toUpperCase() : 'U'}
                      {profileData.apellidos ? profileData.apellidos[0].toUpperCase() : ''}
                    </>
                  )}
                </div>
                {/* Upload Camera Hover Overlay */}
                <label 
                  htmlFor="avatar-upload-file" 
                  className="absolute inset-0 bg-black/40 hover:bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-extrabold cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <span>Cambiar</span>
                  <span>Foto</span>
                </label>
                <input
                  type="file"
                  id="avatar-upload-file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Full Name */}
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {profileData.nombres} {profileData.apellidos}
              </h2>
              
              <p className="text-slate-400 text-xs font-semibold mt-1">
                {profileData.email}
              </p>

              {/* Role Badge */}
              <div className="mt-4 flex flex-col items-center">
                <span className={`px-4 py-1.5 rounded-full border text-xs font-extrabold tracking-wide uppercase ${getRoleBadgeStyle(role)}`}>
                  {role}
                </span>
              </div>

              {/* Footer info inside Card */}
              <div className="w-full border-t border-slate-100 mt-6 pt-6 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-semibold">
                    Registrado el {formatRegisterDate(profileData.fecha_registro)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold text-emerald-600">Cuenta Verificada</span>
                </div>
              </div>

            </div>

            {/* Support / Quick Help Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5">
                <HelpCircle className="h-40 w-40" />
              </div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-blue-400">¿Necesitas Ayuda?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Si detectas un error en tu documento de identidad o NIT fiscal, no podrás editarlo directamente por políticas de seguridad de la DIAN y SADYA.
              </p>
              <button 
                type="button"
                onClick={() => alert('Soporte SADYA: soporte@sadya.org')}
                className="mt-4 text-xs font-black text-white hover:text-blue-300 transition-colors duration-150 flex items-center gap-1"
              >
                <span>Contactar a Soporte</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Right Column - Profile Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-8">
              
              {/* SECTION 1: Personal Information */}
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Información Personal</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {renderField('Nombres', 'nombres', 'text', 'Ej. Carlos')}
                  {renderField('Apellidos', 'apellidos', 'text', 'Ej. Gómez')}
                  
                  {/* Read Only Fiscal Fields with Tooltips */}
                  {renderReadOnlyFiscalField('Número de Identidad', 'numero_identidad', profileData.numero_identidad)}
                  {renderField('Fecha de Nacimiento', 'fecha_nacimiento', 'date')}
                  
                  <div className="flex flex-col gap-1.5 w-full">
                    <label htmlFor="genero" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Género
                    </label>
                    <select
                      id="genero"
                      name="genero"
                      value={profileData.genero || ''}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 bg-white"
                    >
                      <option value="">Selecciona tu género</option>
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                      <option value="OTRO">Otro / Prefiero no decirlo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Contact & Location */}
              <div>
                <h3 className="text-lg font-black text-slate-950 mb-5 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>Ubicación y Contacto</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {renderField('Número Celular', 'telefono', 'tel', 'Ej. 3001234567')}
                  {renderField('Dirección Principal', 'direccion', 'text', 'Ej. Calle 45 # 12-34')}
                  {renderField('Ciudad', 'ciudad', 'text', 'Ej. Bogotá')}
                  {renderField('Correo Electrónico', 'email', 'email', 'correo@ejemplo.com')}
                </div>
              </div>

              {/* SECTION 3: Role-Specific Details (if applicable) */}
              
              {/* Tienda Specific Details */}
              {(role === 'Tienda' || role === 'Tendero') && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Detalles del Establecimiento</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderField('Nombre Comercial / Establecimiento', 'nombre_establecimiento', 'text', 'Ej. Frutería El Campo')}
                    {renderReadOnlyFiscalField('NIT Comercial', 'nit', profileData.nit)}
                    {renderField('Dirección Local Comercial', 'direccion_local', 'text', 'Misma dirección o local específico')}
                    
                    <div className="flex items-center gap-3 sm:col-span-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-2">
                      <input 
                        type="checkbox"
                        id="tiene_domicilio_propio"
                        name="tiene_domicilio_propio"
                        checked={profileData.tiene_domicilio_propio || false}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="tiene_domicilio_propio" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                        Ofrezco servicio de domicilio propio en mi tienda
                      </label>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-3 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Datos de Facturación y Cuenta Bancaria</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {renderField('Banco', 'banco', 'text', 'Ej. Bancolombia')}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label htmlFor="tipo_cuenta" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tipo de Cuenta
                      </label>
                      <select
                        id="tipo_cuenta"
                        name="tipo_cuenta"
                        value={profileData.tipo_cuenta || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 bg-white"
                      >
                        <option value="">Selecciona tipo</option>
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </select>
                    </div>
                    {renderField('Número de Cuenta', 'numero_cuenta', 'text', 'Ej. 123-456789-01')}
                  </div>
                </div>
              )}

              {/* Domiciliario Specific Details */}
              {(role === 'Domiciliario' || role === 'Transportador') && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span>Información de Transportador</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderField('Dirección de Residencia', 'direccion_residencia', 'text', 'Ej. Calle 10 # 5-20')}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label htmlFor="tipo_repartidor" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Vehículo / Tipo de Repartidor
                      </label>
                      <select
                        id="tipo_repartidor"
                        name="tipo_repartidor"
                        value={profileData.tipo_repartidor || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 bg-white"
                      >
                        <option value="">Selecciona tu vehículo</option>
                        <option value="Bicicleta">Bicicleta</option>
                        <option value="Motocicleta">Motocicleta</option>
                        <option value="Automóvil">Automóvil / Carro</option>
                        <option value="Caminando">A Pie / Caminando</option>
                      </select>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-3 flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4" />
                    <span>Datos para Recepción de Pagos</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {renderField('Banco', 'banco', 'text', 'Ej. Bancolombia')}
                    <div className="flex flex-col gap-1.5 w-full">
                      <label htmlFor="tipo_cuenta" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tipo de Cuenta
                      </label>
                      <select
                        id="tipo_cuenta"
                        name="tipo_cuenta"
                        value={profileData.tipo_cuenta || ''}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 bg-white"
                      >
                        <option value="">Selecciona tipo</option>
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                      </select>
                    </div>
                    {renderField('Número de Cuenta', 'numero_cuenta', 'text', 'Ej. 123-456789-01')}
                  </div>
                </div>
              )}

              {/* Fundación Specific Details */}
              {role === 'Fundación' && (
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-5 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Building className="h-5 w-5 text-blue-600" />
                    <span>Detalles de la Fundación</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {renderField('Nombre de la Fundación', 'nombre_fundacion', 'text', 'Ej. Fundación Alimento para Todos')}
                    
                    <div className="flex items-center gap-3 sm:col-span-2 bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-2">
                      <input 
                        type="checkbox"
                        id="tiene_transporte_propio"
                        name="tiene_transporte_propio"
                        checked={profileData.tiene_transporte_propio || false}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="tiene_transporte_propio" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                        Tenemos transporte propio para recoger donaciones grandes
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="border-t border-slate-100 pt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-6 py-3 text-sm font-extrabold shadow-sm transition-all duration-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="rounded-full bg-blue-600 text-white px-8 py-3 text-sm font-extrabold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-95 disabled:opacity-75 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
