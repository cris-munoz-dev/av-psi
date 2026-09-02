import heroImage from '../assets/hero_warm.png';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-8 py-stack-lg md:py-[120px] flex flex-col md:flex-row items-center gap-stack-md relative"
      id="inicio"
    >
      <div className="flex-1 flex flex-col gap-stack-sm md:pr-12 z-10">
        <h1 className="font-headline-xl text-headline-xl text-on-surface">
          Un espacio seguro para tu bienestar emocional
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mt-4">
          La psicoterapia es un viaje hacia la comprensión de ti mismo. Te acompaño en el proceso de encontrar tu propio equilibrio y libertad mental.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link
            className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded hover:bg-on-primary-fixed-variant transition-colors inline-flex items-center gap-2"
            to="/agendar"
          >
            Agenda tu sesión
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
      <div className="flex-1 w-full mt-12 md:mt-0 relative">
        <div className="aspect-[4/5] md:aspect-square rounded-lg overflow-hidden relative border border-outline-variant/30">
          <img
            alt="Psicóloga Alejandra Valenzuela"
            className="w-full h-full object-cover opacity-95"
            src={heroImage}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-surface/20 to-transparent mix-blend-overlay"></div>
        </div>
        <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b border-l border-primary/30 z-0 hidden md:block"></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 border-t border-r border-primary/30 z-0 hidden md:block"></div>
      </div>
    </section>
  );
}
