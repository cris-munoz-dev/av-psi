import avLogo from '../assets/av_logo.png';

export default function Header() {
  return (
    <header className="bg-[#F9F7F2] dark:bg-stone-950 font-manrope font-light tracking-wide docked full-width top-0 border-b border-b border-[#94A396]/20 flat no shadows flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto sticky z-50">
      <div className="flex items-center gap-4">
        <img
          alt="Alejandra Valenzuela Logo"
          className="h-10 w-auto opacity-80"
          src={avLogo}
        />
        <span className="text-xl font-medium tracking-tighter text-stone-800 dark:text-stone-100 hidden md:block">
          Alejandra Valenzuela
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a
          className="text-stone-900 dark:text-white font-semibold border-b border-stone-800 dark:border-white pb-1 hover:opacity-80 transition-all hover:text-[#94A396] duration-300"
          href="#inicio"
        >
          Inicio
        </a>
        <a
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 hover:text-[#94A396] transition-colors duration-300"
          href="#sobre-mi"
        >
          Sobre Mí
        </a>
        <a
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 hover:text-[#94A396] transition-colors duration-300"
          href="#servicios"
        >
          Servicios
        </a>
        <a
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 hover:text-[#94A396] transition-colors duration-300"
          href="#mision"
        >
          Misión
        </a>
        <a
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 hover:text-[#94A396] transition-colors duration-300"
          href="#contacto"
        >
          Contacto
        </a>
      </nav>
      <a
        className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-3 rounded hover:opacity-90 transition-opacity hidden md:inline-flex items-center gap-2"
        href="#contacto"
      >
        Agendar Cita
      </a>
      <button aria-label="Menu" className="md:hidden text-primary">
        <span className="material-symbols-outlined text-[24px]">menu</span>
      </button>
    </header>
  );
}
