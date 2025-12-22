// app/(landing)/Sections/Research.tsx
"use client";
export default function Research() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Research & Innovation</h2>
        <p className="text-gray-700 max-w-3xl">Faculty and students collaborate on projects in AI, renewable energy, biotechnology, and social innovation. We emphasize applied research that impacts communities directly.</p>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h4 className="font-semibold">AI & Data Science</h4>
            <p className="text-sm text-gray-600 mt-2">Machine learning research and labs.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h4 className="font-semibold">Renewables</h4>
            <p className="text-sm text-gray-600 mt-2">Sustainable energy projects.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h4 className="font-semibold">Biomedical</h4>
            <p className="text-sm text-gray-600 mt-2">Biotech and clinical research.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
