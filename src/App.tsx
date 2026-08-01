import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter, matchRoute } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { MarketplacePage } from '@/pages/MarketplacePage';
import { VehicleDetailsPage } from '@/pages/VehicleDetailsPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { InquiryPage } from '@/pages/InquiryPage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  const { route, navigate } = useRouter();
  const { path } = route;

  let page: React.ReactNode;
  let showChrome = true;

  if (path === '/' || path === '') {
    page = <HomePage />;
  } else if (path === '/marketplace') {
    page = <MarketplacePage />;
  } else if (matchRoute(path, '/vehicle/:id')) {
    const params = matchRoute(path, '/vehicle/:id')!;
    page = <VehicleDetailsPage id={params.id} />;
  } else if (path === '/calculator') {
    page = <CalculatorPage />;
  } else if (path === '/inquiry') {
    page = <InquiryPage />;
  } else if (path === '/about') {
    page = <AboutPage />;
  } else if (path === '/portal' || path === '/admin') {
    page = (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F5F6F8] px-4 text-center">
        <div className="rounded-xl border border-gray-200 bg-white p-10 max-w-md">
          <h1 className="text-xl font-extrabold text-navy">
            {path === '/portal' ? 'Customer Portal' : 'Admin ERP'}
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            This module is part of the BIKS platform roadmap. The public website,
            marketplace, calculator, and inquiry system are fully functional.
          </p>
          <button onClick={() => navigate('/')} className="btn-primary mt-6">
            Back to Home
          </button>
        </div>
      </div>
    );
  } else {
    page = (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-extrabold text-navy">Page Not Found</h1>
        <p className="mt-2 text-sm text-gray-500">The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-6">
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
