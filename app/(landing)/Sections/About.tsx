// app/(landing)/Sections/About.tsx
"use client";
export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#003B5C]">About Adeyemi Federal University of Education</h2>
          <p className="mt-4 text-gray-700">
            Established to train high-quality educators and researchers, AFUED combines rigorous academics,
            practical training, and impactful research. Our commitment to accessible, research-driven education
            has produced leaders across Nigeria and beyond.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <div className="text-2xl font-bold text-[#003B5C]">15,000+</div>
              <div className="text-sm text-gray-500">Students</div>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-2xl font-bold text-[#003B5C]">100+</div>
              <div className="text-sm text-gray-500">Programs</div>
            </div>
          </div>
        </div>

        <div className="rounded overflow-hidden shadow-lg">
          <img src="/images/registry-block.jpg" alt="Campus" className="w-full h-72 object-cover" />
        </div>
      </div>
    </section>
  );
}
