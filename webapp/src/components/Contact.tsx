export default function Contact() {
  return (
    <section
      className="w-full max-w-7xl mx-auto px-8 py-stack-lg flex flex-col md:flex-row gap-stack-md mb-section-padding"
      id="contacto"
    >
      <div className="flex-1 flex flex-col gap-6 pr-0 md:pr-12">
        <span className="font-label-md text-label-md text-tertiary uppercase tracking-widest">
          Contacto
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Inicia tu proceso
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
          Dar el primer paso suele ser lo más difícil. Déjame un mensaje y te contactaré a la brevedad para coordinar una primera evaluación o resolver tus dudas.
        </p>
        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">mail</span>
            <span className="font-body-md text-body-md">
              alejandrav.psicologa@gmail.com
            </span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">call</span>
            <span className="font-body-md text-body-md">+56 9 9444 9094</span>
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant mt-4">
            <a
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center hover:bg-surface-container transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </a>
            <a
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-outline-variant/50 flex items-center justify-center hover:bg-surface-container transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[20px]">
                photo_camera
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <form className="bg-surface-container-lowest border border-outline-variant/30 rounded p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-tertiary" htmlFor="nombre">
              Nombre completo
            </label>
            <input
              className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface transition-colors"
              id="nombre"
              placeholder="Tu nombre"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-tertiary" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface transition-colors"
              id="email"
              placeholder="tu@email.com"
              type="email"
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <label className="font-label-md text-label-md text-tertiary" htmlFor="mensaje">
              Mensaje
            </label>
            <textarea
              className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary px-0 py-2 font-body-md text-on-surface transition-colors resize-none"
              id="mensaje"
              placeholder="¿En qué te puedo ayudar?"
              rows={3}
            ></textarea>
          </div>
          <button
            className="mt-4 bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded hover:bg-on-primary-fixed-variant transition-colors self-start"
            type="button"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>
    </section>
  );
}
