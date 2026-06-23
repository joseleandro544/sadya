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
      'Disminuir las pérdidas postcosecha mediante la comercialización oportuna',
      'Comercializar productos con diferentes estándares de calidad',
      'Obtener mayor visibilidad de sus productos mediante SADYA',
      'Acceder a información actualizada sobre precios de productos',
      'Facilitar la gestión logística mediante la conexión con transportadores',
      'Donar alimentos aptos para consumo, beneficiando a familias vulnerables',
      'Recibir incentivos, descuentos u otros beneficios por la entrega de desperdicios y donaciones'
    ]
  },
  {
    id: 'tiendas',
    title: 'Tiendas',
    image: tenderoImg,
    benefits: [
      'Aumentar los ingresos mediante la venta de productos próximos a ven',
      'Reducir significativamente las pérdidas',
      'Obtener mayor rotación de productos y optimizar el manejo del inventario',
      'Incrementar la visibilidad de su negocio',
      'Acceder a productos frescos directamente de productores a precios competitivos',
      'Llegar a nuevos clientes mediante la plataforma tecnológica SADYA',
      'Realizar donaciones de alimentos y generar impacto social',
      'Recibir incentivos, descuentos u otros beneficios por la entrega de desperdicios y donaciones'
    ]
  },
  {
    id: 'domiciliario',
    title: 'Domiciliario',
    image: domiciliarioImg,
    benefits: [
      'Acceder a oportunidades permanentes de entrega de pedidos',
      'Generar ingresos adicionales de forma flexible',
      'Optimizar las rutas mediante geolocalización y planificación inteligente',
      'Recibir solicitudes cercanas a su ubicación actual',
      'Optimizar tiempos de desplazamiento mediante rutas inteligentes',
      'Recibir pagos seguros y oportunos',
      'Incrementar sus ganancias mediante incentivos por cumplimiento',
      'Participar en una iniciativa con impacto social y ambiental',
      'Recibir incentivos, descuentos u otros beneficios por la entrega de desperdicios y donaciones'
    ]
  },
  {
    id: 'transportador',
    title: 'Transportador',
    image: transportadorImg,
    benefits: [
      'Generar ingresos adicionales por servicios de transporte de alimentos',
      'Acceder a ofertas constantes de viajes y servicios logísticos',
      'Optimizar las rutas mediante geolocalización y planificación inteligente',
      'Reducir tiempos muertos y recorridos sin carga',
      'Recibir pagos seguros a través de la plataforma',
      'Incrementar sus oportunidades laborales sin necesidad de intermediarios',
      'Obtener incentivos y bonificaciones por cumplimiento de servicios'
    ]
  },
  {
    id: 'clientes',
    title: 'Clientes',
    image: clienteImg,
    benefits: [
      'Acceder a productos frescos a precios más económicos',
      'Ahorrar dinero mediante promociones y descuentos especiales',
      'Comprar productos próximos a vencer con total información y seguridad',
      'Encontrar alimentos de temporada y cosecha a mejores precios',
      'Acceder a recetas saludables y recibir recomendaciones personalizadas',
      'Contribuir a la reducción del desperdicio alimentario',
      'Apoyar directamente a productores locales y pequeños comerciantes',
      'Participar en descuentos u otros beneficios exclusivos por tus compras'
    ]
  },
  {
    id: 'fundacion',
    title: 'Fundación',
    image: fundacionImg,
    benefits: [
      'Recibir alimentos aptos para consumo humano',
      'Incrementar la cobertura de atención a poblaciones vulnerables',
      'Reducir tiempos de gestión y búsqueda de donantes',
      'Optimizar la distribución de ayudas alimentarias',
      'Acceder a reportes e indicadores de impacto social',
      'Coordinar la recolección de donaciones mediante rutas inteligentes',
      'Fortalecer programas de seguridad alimentaria',
      'Disminuir el desperdicio de alimentos aptos para consumo'
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
