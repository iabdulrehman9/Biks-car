import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter, matchRoute } from '@/lib/router';
import { AdminLanguageProvider } from '@/lib/i18n';
import { HomePage } from '@/pages/HomePage';
import { CollectionPage } from '@/pages/CollectionPage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage';
import { AboutPage } from '@/pages/AboutPage';
import { SellPage } from '@/pages/SellPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';

function App() {
  const { route, navigate } = useRouter();
  const { path } = route;

  let page: React.ReactNode;
  let showChrome = true;

  if (path === '/' || path === '') {
    page = <HomePage />;
  } else if (path === '/collection' || path === '/marketplace') {
    page = <CollectionPage />;
  } else if (matchRoute(path, '/vehicle/:id')) {
    const params = matchRoute(path, '/vehicle/:id')!;
    page = <VehicleDetailsPage id={params.id} />;
  } else if (path === '/sell') {
    page = <SellPage />;
  } else if (path === '/about') {
    page = <AboutPage />;
  } else if (path === '/admin/login') {
    showChrome = false;
    page = (
      <AdminLanguageProvider>
        <AdminLoginPage />
      </AdminLanguageProvider>
    );
  } else if (path === '/admin') {
    showChrome = false;
    page = (
      <AdminLanguageProvider>
        <AdminDashboardPage />
      </AdminLanguageProvider>
    );
  } else {
    page = (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-extrabold text-navy">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-6"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showChrome && <Navbar />}
      <main className="flex-1">{page}</main>
      {showChrome && <Footer />}
    </div>
  );
}

export default App;