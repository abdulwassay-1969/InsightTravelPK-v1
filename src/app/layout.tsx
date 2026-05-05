import type {Metadata} from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ConnectivityManager from '@/components/connectivity-manager';
import NavigationProgress from '@/components/navigation-progress';
import { Inter, Poppins } from 'next/font/google';
import { AuthProvider } from '@/components/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});


export const metadata: Metadata = {
  title: 'InsightTravelPK',
  description:
    'Discover the breathtaking beauty and rich cultural heritage of Pakistan. Your official guide to tourism in Pakistan.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} !scroll-smooth`} suppressHydrationWarning>
      <head>
        {/* Google AdSense Placeholder */}
        {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXX" crossOrigin="anonymous"></script> */}
      </head>
      <body
        className="font-body antialiased flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[3000] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
          >
            Skip to main content
          </a>
          <Header />
          <ConnectivityManager />
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          <main id="main-content" className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
