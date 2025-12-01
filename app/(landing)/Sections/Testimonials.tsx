// app/(landing)/Sections/Testimonials.tsx
"use client";
const list = [
  { name: "Sarah J.", role: "Alumni 2024", quote: "Life-changing education." },
  { name: "Michael C.", role: "MBA Student", quote: "Hands-on learning and industry links." }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Student Success Stories</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {list.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded shadow">
              <p className="text-gray-700 italic">"{t.quote}"</p>
              <div className="mt-4 font-semibold">{t.name}</div>
              <div className="text-sm text-gray-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
