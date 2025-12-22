// app/(landing)/Sections/Footer.tsx
"use client";
export default function Footer() {
  return (
    <footer className="bg-[#003B5C] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold">Adeyemi Federal University of Education</h4>
          <p className="text-sm text-white/80 mt-2">Excellence in Education since 19XX</p>
        </div>
        <div>
          <h5 className="font-semibold">Quick Links</h5>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a href="#programs" className="hover:text-yellow-400">Programs</a></li>
            <li><a href="#admissions" className="hover:text-yellow-400">Admissions</a></li>
            <li><a href="#about" className="hover:text-yellow-400">About</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold">Contact</h5>
          <p className="text-sm mt-3">info@adeyemi.edu.ng</p>
          <p className="text-sm">+234 800 ADEYEMI</p>
        </div>
      </div>
      <div className="bg-[#022a35] py-4 text-center text-sm">© {new Date().getFullYear()} Adeyemi Federal University of Education</div>
    </footer>
  );
}
