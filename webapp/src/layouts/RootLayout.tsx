import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RootLayout = () => {
  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <Header />
      <main className="flex-grow flex flex-col items-center w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
