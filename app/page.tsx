'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MenuGrid from '@/components/MenuGrid';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Header />
      <div className="mt-24 flex-grow">
        <div className="max-w-6xl mx-auto p-6">
          <HeroSection />
          <MenuGrid />
        </div>
      </div>
      <Footer />
    </main>
  );
}