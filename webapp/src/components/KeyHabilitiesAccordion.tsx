import { useState } from 'react';

const expertiseItems = [
  {
    name: 'Evaluación psicológica',
    description:
      'Capacidad para aplicar y analizar pruebas psicométricas, entrevistas clínicas y observaciones para comprender en profundidad la situación mental y emocional de cada paciente.',
  },
  {
    name: 'Consejería y apoyo emocional',
    description:
      'Habilidad para proporcionar orientación y soporte emocional a los pacientes, ayudándoles a enfrentar desafíos, tomar decisiones y desarrollar estrategias de afrontamiento efectivas.',
  },
  {
    name: 'Escucha activa y empatía',
    description:
      'Capacidad para escuchar atentamente a los pacientes sin juzgar, comprendiendo sus perspectivas y emociones, y creando un ambiente de confianza y comprensión.',
  },
  {
    name: 'Comunicación efectiva',
    description:
      'Habilidad para expresar ideas, conceptos y recomendaciones de manera clara y comprensible, adaptando el lenguaje y el estilo de comunicación a las necesidades de cada paciente.',
  },
  {
    name: 'Desarrollo de planes de tratamiento individualizados',
    description:
      'Capacidad para diseñar y implementar estrategias terapéuticas personalizadas, basadas en las necesidades específicas, objetivos y circunstancias únicas de cada paciente.',
  },
  {
    name: 'Conocimiento en teorías y enfoques terapéuticos',
    description:
      'Dominio de diversas teorías psicológicas y técnicas terapéuticas, con la capacidad de aplicarlas de manera flexible y efectiva según las necesidades de cada caso.',
  },
];

export default function KeyHabilitiesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-8 py-stack-lg flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-4 mb-4">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Habilidades clave
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {expertiseItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`bg-surface-container-lowest border rounded p-6 transition-all duration-300 cursor-pointer ${
                isOpen
                  ? 'border-primary/50 shadow-[0_8px_30px_rgba(148,163,150,0.1)]'
                  : 'border-outline-variant/30 hover:border-outline-variant/60 hover:shadow-[0_4px_15px_rgba(148,163,150,0.05)]'
              }`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-headline-md text-headline-md text-on-surface text-[18px] md:text-[20px] m-0">
                  {item.name}
                </h3>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isOpen ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
