export default function Mission() {
  return (
    <section
      className="w-full bg-primary-container text-on-primary-container py-stack-lg my-stack-md"
      id="mision"
    >
      <div className="max-w-4xl mx-auto px-8 flex flex-col items-center text-center gap-8">
        <span className="material-symbols-outlined text-[48px] opacity-20">
          format_quote
        </span>
        <h2 className="font-headline-lg text-headline-lg md:text-[40px] leading-tight font-light">
          Mi misión es proporcionar un refugio donde la vulnerabilidad se convierta en la herramienta más poderosa para el cambio.
        </h2>
        <div className="w-16 h-[1px] bg-on-primary-container/30 my-4"></div>
        <p className="font-body-lg text-body-lg max-w-2xl opacity-90 font-light">
          Creo en una psicología desmitificada, accesible y profundamente humana. Un proceso donde caminamos lado a lado hacia la claridad, desenredando las historias que nos limitan para dar paso a una vida más auténtica y conectada.
        </p>
      </div>
    </section>
  );
}
