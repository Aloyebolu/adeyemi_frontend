"use client";

import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[90vh] w-full flex items-center">
      
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/registry-block.jpg"
          alt="AFUED Registry Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003B5C]/95 via-[#003B5C]/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
            Adeyemi Federal University
            <br />
            <span className="text-yellow-400">of Education</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 font-light">
            Excellence in Teaching • Learning • Research
          </p>

          <p className="text-white/70">
            Join a federally recognized institution committed to developing
            world-class educators and leaders for future generations.
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <button className="px-8 py-4 bg-yellow-400 text-[#003B5C] font-bold rounded-lg shadow-lg hover:bg-yellow-500 transition flex items-center space-x-2">
              <span>Apply for Admission</span> <ArrowRight size={20} />
            </button>

            <button className="px-8 py-4 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/20 transition backdrop-blur-sm">
              Explore Programs
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
