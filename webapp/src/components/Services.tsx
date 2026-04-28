export default function Services() {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-8 py-stack-lg flex flex-col gap-stack-md"
      id="servicios"
    >
      <div className="flex flex-col items-center text-center gap-4 mb-8">
        <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest">
          Enfoque Clínico
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Servicios Profesionales
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(148,163,150,0.05)] transition-shadow duration-300">
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-[20px]">
              Terapia Individual
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Sesiones 1 a 1 diseñadas para explorar narrativas personales, resolver conflictos internos y desarrollar una mayor autoconsciencia en un entorno confidencial.
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(148,163,150,0.05)] transition-shadow duration-300">
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">water_drop</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-[20px]">
              Manejo de Ansiedad
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Herramientas prácticas y comprensión profunda de los mecanismos del estrés y la ansiedad para recuperar la regulación del sistema nervioso.
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(148,163,150,0.05)] transition-shadow duration-300">
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">nature</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-[20px]">
              Desarrollo Personal
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Acompañamiento en procesos de transición vital, búsqueda de sentido, fortalecimiento de autoestima y establecimiento de límites sanos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
