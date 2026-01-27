import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const theme = useSelector((state) => state.theme.mode);

  useEffect(() => {
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="app">
      <Navbar />
      <main className="pt-20">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;