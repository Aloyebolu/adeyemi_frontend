// app/(landing)/Sections/Programs.tsx
"use client";
const programs = [
  { title: "Education & Teacher Training", desc: "Undergrad & Postgrad programs for future educators" },
  { title: "Sciences", desc: "Computer Science, Biology, Chemistry, Physics, Mathematics" },
  // { title: "Engineering Technology", desc: ", Electrical, Civil" },
];

export default function Programs() {
  return (
    <section id="programs" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Academic Programs</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {programs.map((p) => (
            <div key={p.title} className="bg-white p-6 rounded shadow">
              <h3 className="font-semibold text-lg text-[#003B5C]">{p.title}</h3>
              <p className="text-gray-600 mt-3">{p.desc}</p>
              <a className="mt-4 inline-block text-yellow-400 font-semibold" href="#">Explore &rarr;</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
