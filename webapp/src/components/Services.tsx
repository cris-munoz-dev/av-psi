export default function Services() {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-8 py-stack-lg flex flex-col gap-stack-md"
      id="servicios"
    >
      <div className="flex flex-col items-center text-center gap-4 mb-8">
        <span className="font-label-md text-label-md text-tertiary uppercase tracking-widest">
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
              La terapia individual es un espacio personal y confidencial diseñado para ayudarte a explorar tus pensamientos, emociones y comportamientos en un ambiente seguro y de apoyo. En nuestras sesiones, trabajaremos juntos para:
            </p>
            <ul className="list-disc pl-5 font-body-md text-body-md text-on-surface-variant text-sm flex flex-col gap-1 mt-2">
              <li>Identificar y abordar los desafíos que estás enfrentando</li>
              <li>Desarrollar estrategias de afrontamiento efectivas</li>
              <li>Mejorar tu autoconocimiento y autoestima</li>
              <li>Establecer metas personales y profesionales</li>
              <li>Fomentar un crecimiento personal positivo</li>
            </ul>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(148,163,150,0.05)] transition-shadow duration-300">
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">groups</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-[20px]">
              Talleres de psicoterapia
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Mis talleres de psicoterapia ofrecen una experiencia de aprendizaje grupal dinámica y enriquecedora. Estos talleres están diseñados para:
            </p>
            <ul className="list-disc pl-5 font-body-md text-body-md text-on-surface-variant text-sm flex flex-col gap-1 mt-2">
              <li>Proporcionar herramientas prácticas para el manejo del estrés y las emociones</li>
              <li>Fomentar la conexión y el apoyo mutuo entre los participantes</li>
              <li>Explorar temas específicos de salud mental en un entorno colaborativo</li>
              <li>Desarrollar habilidades de comunicación y relaciones interpersonales</li>
              <li>Promover el autocuidado y la resiliencia emocional</li>
            </ul>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6 hover:shadow-[0_8px_30px_rgba(148,163,150,0.05)] transition-shadow duration-300">
          <div className="w-12 h-12 rounded-full bg-primary-fixed/30 flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">school</span>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-headline-md text-headline-md text-on-surface text-[20px]">
              Apoyo a colegios en políticas de convivencia
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm">
              Trabajo en estrecha colaboración con la administración escolar, docentes, estudiantes y padres para crear un ambiente educativo seguro, respetuoso y propicio para el aprendizaje y el crecimiento personal de todos los miembros de la comunidad escolar. Mi enfoque incluye:
            </p>
            <ul className="list-disc pl-5 font-body-md text-body-md text-on-surface-variant text-sm flex flex-col gap-1 mt-2">
              <li>Evaluación del clima escolar actual e identificación de áreas de mejora</li>
              <li>Diseño de políticas de convivencia inclusivas y efectivas</li>
              <li>Capacitación para personal docente y administrativo en manejo de conflictos y comunicación efectiva</li>
              <li>Implementación de programas de prevención de bullying y promoción de relaciones saludables</li>
              <li>Desarrollo de estrategias para fomentar una cultura escolar positiva y respetuosa</li>
              <li>Asesoramiento en la creación de protocolos de intervención en situaciones de crisis</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
