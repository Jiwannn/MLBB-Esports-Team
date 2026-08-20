import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <div style={{ overflowX: 'hidden', width: '100%' }}>
      {!isAdminPage && <Navbar />}
      <Component {...pageProps} />
      {!isAdminPage && <Footer />}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#FFD700',
            border: '1px solid #FFD700',
          },
        }}
      />
    </div>
  );
}

export default MyApp;