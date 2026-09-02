import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">
          Encuentra tu espacio de <span className="text-blue-600">bienestar emocional</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Atención psicológica personalizada, presencial u online. Un espacio seguro para conversar, entender y sanar.
        </p>
        <div className="pt-8">
          <Link 
            to="/agendar" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Agenda tu primera sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
