export default function About() {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-8 py-stack-lg flex flex-col md:flex-row gap-gutter items-center"
      id="sobre-mi"
    >
      <div className="flex-1 w-full order-2 md:order-1 relative">
        <div className="aspect-[3/4] w-full max-w-md mx-auto relative rounded-lg overflow-hidden border border-outline-variant/30 p-2 bg-surface">
          <img
            alt="Consultorio"
            className="w-full h-full object-cover rounded"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP2ny3AmhGAtsmVuOG2gFyPCuU3GHQUIobE18hXuk9xsCidTWbA0k9vmv15JTx4nMijkOg0XFEUShtukRNqdZXA1Vctww_unSgxSqpTw0E1-74q2-ucdMSawTFrnOGZCiXwvh1fW9zslSD99QpeWydCaQcmkd4DZiyqpKqLRDvLB5lmWLrH9F-Cr3iFRggbJ6dpUw8xdBMN3nIxSfE9QR1gTIF5VPSJ_UqQZP1GS_r0eUEkwhLnZLLbmmOp_5uZ76qyFBOSOfpHmmK"
          />
        </div>
        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 opacity-10 pointer-events-none hidden md:block">
          <svg
            className="text-primary"
            fill="none"
            height="200"
            stroke="currentColor"
            strokeWidth="0.5"
            viewBox="0 0 120 200"
            width="120"
          >
            <path d="M60 200 Q60 100 20 0 M60 150 Q90 120 100 80 M60 100 Q30 70 40 30 M60 50 Q80 30 90 10"></path>
          </svg>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-6 order-1 md:order-2">
        <span className="font-label-md text-label-md text-tertiary uppercase tracking-widest">
          Sobre Mí
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Soy una psicóloga graduada y de vocación...
        </h2>
        <div className="font-body-md text-body-md text-on-surface-variant flex flex-col gap-4">
          <p>
            Poseo una profunda pasión por ayudar a las personas a superar los desafíos emocionales y psicológicos que enfrentan en la vida. Mi enfoque se basa en la empatía, la escucha activa y la construcción de una relación de confianza con mis pacientes.
          </p>
          <p>
            Mi enfoque terapéutico se basa en crear un espacio verdaderamente libre de juicios, donde la palabra y el silencio tienen el mismo valor. Creo firmemente que la salud mental no es la ausencia de problemas, sino la capacidad de transitar por ellos con herramientas, conciencia y compasión.
          </p>
          <p>
            Durante mi trayectoria profesional he acompañada a personas en procesos de duelo, manejo de la ansiedad, transición y desarrollo personal, ayudándolos a encontrar claridad, fortaleza y nuevas perspectivas en sus desafíos vitales.
          </p>
        </div>
      </div>
    </section>
  );
}
