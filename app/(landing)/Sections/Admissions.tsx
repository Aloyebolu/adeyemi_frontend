// app/(landing)/Sections/Admissions.tsx
"use client";
export default function Admissions() {
  const steps = [
    { step: "01", title: "Choose Program" },
    { step: "02", title: "Apply Online" },
    { step: "03", title: "Interview/Screening" },
    { step: "04", title: "Enroll" },
  ];

  return (
    <section id="admissions" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Admissions Process</h2>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map(s => (
            <div key={s.step} className="bg-white rounded p-6 shadow text-center">
              <div className="text-3xl font-bold text-yellow-400">{s.step}</div>
              <div className="mt-3 font-semibold">{s.title}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a href="/apply" className="px-6 py-3 rounded bg-yellow-400 text-[#003B5C] font-semibold">Start Application</a>
        </div>
      </div>
    </section>
  );
}
