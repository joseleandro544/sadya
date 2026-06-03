import { Users, Leaf, Sprout } from 'lucide-react';

export default function HeroMetrics() {
  const metrics = [
    {
      id: 1,
      icon: <Users className="h-7 w-7 text-orange-600" />,
      value: "1,240",
      label: "Familias Beneficiadas",
      colorClass: "bg-orange-50 text-orange-600",
      borderColor: "border-orange-100",
      shadowColor: "hover:shadow-orange-100/50"
    },
    {
      id: 2,
      icon: <Leaf className="h-7 w-7 text-green-600" />,
      value: "8,450 kg",
      label: "Alimentos Rescatados",
      colorClass: "bg-green-50 text-green-600",
      borderColor: "border-green-100",
      shadowColor: "hover:shadow-green-100/50"
    },
    {
      id: 3,
      icon: <Sprout className="h-7 w-7 text-purple-600" />,
      value: "32 t",
      label: "Emisiones de CO2 evitadas",
      colorClass: "bg-purple-50 text-purple-600",
      borderColor: "border-purple-100",
      shadowColor: "hover:shadow-purple-100/50"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
      {/* Title */}
      <div className="max-w-4xl mx-auto mb-10">
        <h1 className="text-3xl font-normal text-slate-900 leading-tight sm:text-4xl md:text-5xl tracking-tight">
          ¡Ayúdanos a <strong className="font-extrabold text-blue-600">asegurar la alimentación</strong> de las poblaciones más vulnerables, <strong className="font-extrabold text-green-600">prevenir el desperdicio</strong> de alimentos y <strong className="font-extrabold text-amber-500">ahorrar tu dinero</strong>!
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
          En SADYA conectamos excedentes de comida de calidad con hogares que los necesitan, generando un impacto económico y ambiental positivo.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`group relative flex flex-col items-center p-6 bg-white border border-slate-100 rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${metric.shadowColor}`}
          >
            {/* Top Light Effect */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-300" />
            
            {/* Icon Container */}
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${metric.colorClass} mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm`}>
              {metric.icon}
            </div>

            {/* Value */}
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              {metric.value}
            </span>

            {/* Label */}
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {metric.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
