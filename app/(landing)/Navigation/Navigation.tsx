"use client";

import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog/dialog"; // Adjust import path as needed

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const roles = [
    { label: "Student", href: "/student-login" },
    { label: "Lecturer", href: "/lecturer-login" },
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-[#003B5C] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl md:text-2xl font-bold">
          Adeyemi Federal University of Education
        </h1>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
          <a href="#programs" className="hover:text-yellow-400 transition-colors">Academics</a>
          <a href="#admissions" className="hover:text-yellow-400 transition-colors">Admissions</a>
          
          {/* Desktop Login Dialog Trigger */}
          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogTrigger asChild>
              <button className="px-4 py-2 bg-yellow-400 text-[#003B5C] rounded-lg font-semibold flex items-center space-x-2 hover:bg-yellow-500 transition-colors">
                <LogIn size={18} />
                <span>Login</span>
              </button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <div className="p-6">
                <DialogTitle className="text-xl font-bold text-center text-primary mb-2">
                  Select Your Portal
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 text-center mb-6">
                  Choose the login area appropriate for you.
                </DialogDescription>

                <div className="space-y-3">
                  {roles.map(role => (
                    <a
                      key={role.href}
                      href={role.href}
                      className="block w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryHover transition text-center"
                    >
                      {role.label} Login
                    </a>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile menu Dialog */}
        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <button className="md:hidden p-2" aria-label="Toggle menu">
              <Menu size={28} />
            </button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-xs bg-[#02395a] text-white border-0 p-0">
            <div className="px-6 py-8 space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Menu</h2>
                <DialogClose asChild>
                  <button 
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </DialogClose>
              </div>
              
              <nav className="space-y-6">
                <a 
                  href="#about" 
                  className="block py-3 text-lg hover:text-yellow-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#programs" 
                  className="block py-3 text-lg hover:text-yellow-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Academics
                </a>
                <a 
                  href="#admissions" 
                  className="block py-3 text-lg hover:text-yellow-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Admissions
                </a>
              </nav>
              
              <div className="pt-6 border-t border-white/20">
                {/* Mobile Login Dialog Trigger */}
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <button className="w-full py-3 bg-yellow-400 text-[#003B5C] rounded-lg text-center font-semibold flex items-center justify-center space-x-2 hover:bg-yellow-500 transition-colors">
                      <LogIn size={20} />
                      <span className="text-lg">Login</span>
                    </button>
                  </DialogTrigger>
                  
                  <DialogContent className="sm:max-w-md">
                    <div className="p-6">
                      <DialogTitle className="text-xl font-bold text-center text-primary mb-2">
                        Select Your Portal
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-600 text-center mb-6">
                        Choose the login area appropriate for you.
                      </DialogDescription>

                      <div className="space-y-3">
                        {roles.map(role => (
                          <a
                            key={role.href}
                            href={role.href}
                            className="block w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryHover transition text-center"
                            onClick={() => {
                              setLoginOpen(false);
                              setMenuOpen(false); // Also close mobile menu
                            }}
                          >
                            {role.label} Login
                          </a>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </nav>
  );
}