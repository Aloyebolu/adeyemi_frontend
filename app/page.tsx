'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MenuGrid from '@/components/MenuGrid';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col dark:bg-gray-900">
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

// // app/page.tsx
// "use client"; // Required for interactivity

// import { useEffect, useState } from "react";

// export default function HomePage() {
//   const [isDark, setIsDark] = useState(false);

//   // Initialize theme from localStorage
//   // useEffect(() => {
//   //   const savedTheme = localStorage.getItem("theme");
//   //   if (savedTheme === "dark") {
//   //     document.documentElement.classList.add("dark");
//   //     setIsDark(true);
//   //   }
//   // }, []);

//   const toggleDarkMode = () => {
//     const html = document.documentElement;
//     if (html.classList.contains("dark")) {
//       html.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setIsDark(false);
//     } else {
//       html.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setIsDark(true);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
//       <h1 className="text-4xl font-bold mb-4">Next.js Light/Dark Mode</h1>
//       <p className="mb-6 text-lg">
//         Current theme: {isDark ? "Dark" : "Light"}
//       </p>
//       <button
//         onClick={toggleDarkMode}
//         className="px-6 py-3 rounded bg-[var(--color-primary)] text-white dark:bg-[var(--color-primary-hover)] dark:text-black transition-colors duration-300"
//       >
//         Toggle Dark/Light
//       </button>
//     </div>
//   );
// }
