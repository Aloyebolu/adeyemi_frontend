'use client';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0B3D2E] text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" alt="AFUED Logo" className="h-10 w-10" />
          <span className="font-bold text-lg">Adeyemi Federal University of Education, Ondo</span>
        </div>
        <div className="text-sm">Wednesday, October 08, 2025 • 02:02 PM WAT</div>
      </div>
    </header>
  );
}
