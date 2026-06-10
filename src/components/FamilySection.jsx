import React from 'react';
import campesinoImg from '../assets/familia/15-Campesino.JPG';
import tenderoImg from '../assets/familia/13-Tendero.JPG';
import domiciliarioImg from '../assets/familia/14-Domiciliario.JPG';
import transportadorImg from '../assets/familia/16-Transportador.JPG';
import clienteImg from '../assets/familia/17-Cliente.JPG';
import fundacionImg from '../assets/familia/18-Fundacion.JPG';

const FAMILY_ROLES = [
  {
    id: 'campesino',
    title: 'Productor / Campesino',
    image: campesinoImg,
    benefits: [
      'Aumentar ingresos económicos vendiendo excedentes',
      'Disminuir la pérdida de productos cosechados',
      'Evitar intermediarios y conectar directamente',
      'Visibilidad digital de su finca y cosechas'
    ]
  },
  {
    id: 'tiendas',
    title: 'Tiendas',
    image: tenderoImg,
    benefits: [
      'Recuperar el costo de mermas y productos próximos a vencer',
      'Atraer nuevos clientes locales a su establecimiento',
      'Optimizar la rotación de inventario diario',
      'Posicionar su negocio como un comercio sostenible'
    ]
  },
  {
    id: 'domiciliario',
    title: 'Domiciliario',
    image: domiciliarioImg,
    benefits: [
      'Ganar dinero extra con total flexibilidad',
      'Elegir horarios y zonas de trabajo convenientes',
      'Recibir el 100% de tus propinas diarias',
      'Rutas de entrega cortas y optimizadas'
    ]
  },
  {
    id: 'transportador',
    title: 'Transportador',
    image: transportadorImg,
    benefits: [
      'Optimizar espacio de carga en fletes de retorno',
      'Aumentar la rentabilidad del vehículo o camión',
      'Acceder a contratos estables de recolección',
      'Contribuir a reducir la huella de carbono'
    ]
  },
  {
    id: 'clientes',
    title: 'Clientes',
    image: clienteImg,
    benefits: [
      'Comprar alimentos de calidad hasta 70% más baratos',
      'Prevenir el desperdicio de comida en tu ciudad',
      'Descubrir nuevos comercios y productos cercanos',
      'Ahorrar dinero en la compra de la canasta básica'
    ]
  },
  {
    id: 'fundacion',
    title: 'Fundación',
    image: fundacionImg,
    benefits: [
      'Recibir donaciones de alimentos en perfectas condiciones',
      'Ampliar la cobertura de personas vulnerables beneficiadas',
      'Reducir costos operativos de abastecimiento',
      'Lograr beneficios tributarios certificados'
    ]
  }
];

export default function FamilySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title Section */}
      <div className="mb-8 mt-16">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Haz parte de nuestra familia SADYA
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          Descubre cómo cada miembro de nuestro ecosistema genera impacto social y ambiental mientras obtiene grandes beneficios.
        </p>
      </div>

      {/* Grid container with horizontal scroll on mobile for better UX */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-4 sm:pb-0 no-scrollbar">
        {FAMILY_ROLES.map((role) => (
          <div
            key={role.id}
            className="flex-none w-72 sm:w-auto snap-start flex flex-col bg-white border border-gray-300 rounded-[2rem] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            {/* Upper part (Image) */}
            <div className="h-48 overflow-hidden relative">
              <img
                src={role.image}
                alt={role.title}
                className="w-full h-full object-cover rounded-t-[2rem] transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.src = `https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400&auto=format&fit=crop&q=60`;
                }}
              />
            </div>

            {/* Title stripe */}
            <div className="bg-gray-300 py-3 px-4 text-center border-t border-b border-gray-350">
              <span className="font-bold text-gray-800 text-sm tracking-tight block truncate" title={role.title}>
                {role.title}
              </span>
            </div>

            {/* Bottom part (Benefits) */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Beneficios:
                </h4>
                <ul className="list-disc pl-4 space-y-1.5">
                  {role.benefits.map((benefit, index) => (
                    <li key={index} className="text-xs text-gray-600 leading-snug">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
