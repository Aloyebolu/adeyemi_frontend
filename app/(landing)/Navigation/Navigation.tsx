"use client";

import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[#003B5C] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl md:text-2xl font-bold">
          Adeyemi Federal University of Education
        </h1>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="hover:text-yellow-400">About</a>
          <a href="#programs" className="hover:text-yellow-400">Academics</a>
          <a href="#admissions" className="hover:text-yellow-400">Admissions</a>
          <a href="/login" className="px-4 py-2 bg-yellow-400 text-[#003B5C] rounded-lg font-semibold flex items-center space-x-2">
            <LogIn size={18} />
            <span>Login</span>
          </a>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#02395a] px-6 py-4 space-y-2">
          <a href="#about" className="block py-2">About</a>
          <a href="#programs" className="block py-2">Academics</a>
          <a href="#admissions" className="block py-2">Admissions</a>
          <a href="/login" className="block py-2 bg-yellow-400 text-[#003B5C] rounded-lg text-center font-semibold">
            Login
          </a>
        </div>
      )}
    </nav>
  );
}
