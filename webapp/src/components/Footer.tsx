export default function Footer() {
  return (
    <footer className="bg-[#F9F7F2] dark:bg-stone-950 font-manrope text-sm font-light full-width border-t border-t border-[#94A396]/20 flat no shadows transition-all duration-200 w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6 mt-auto">
      <div className="flex flex-col items-center md:items-start gap-2">
        <span className="text-lg font-light text-stone-700 dark:text-stone-300">
          Alejandra Valenzuela
        </span>
        <span className="text-stone-500 text-xs">
          © 2024 Alejandra Valenzuela — Psicóloga. Transformación y libertad mental.
        </span>
      </div>
      <div className="flex gap-6 items-center flex-wrap justify-center">
        <a
          className="text-stone-500 hover:text-stone-800 underline decoration-[#94A396]/30 transition-colors"
          href="#"
        >
          Privacidad
        </a>
        <a
          className="text-stone-500 hover:text-stone-800 underline decoration-[#94A396]/30 transition-colors"
          href="#"
        >
          Términos
        </a>
        <a
          className="text-stone-500 hover:text-stone-800 underline decoration-[#94A396]/30 transition-colors"
          href="#"
        >
          WhatsApp
        </a>
        <a
          className="text-stone-500 hover:text-stone-800 underline decoration-[#94A396]/30 transition-colors"
          href="#"
        >
          Instagram
        </a>
      </div>
    </footer>
  );
}
