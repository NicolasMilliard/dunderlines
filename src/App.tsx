import { useEffect, useState } from 'react';
import { CreditsPage } from './pages/CreditsPage';
import { HomePage } from './pages/HomePage';
import { getRouteIdFromPathname, type AppRouteId } from './routes';

function App() {
  const [routeId, setRouteId] = useState<AppRouteId>(() =>
    getRouteIdFromPathname(window.location.pathname),
  );

  useEffect(() => {
    function handleRouteChange() {
      setRouteId(getRouteIdFromPathname(window.location.pathname));
    }

    window.addEventListener('popstate', handleRouteChange);

    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return routeId === 'credits' ? <CreditsPage /> : <HomePage />;
}

export default App;
