// app/(landing)/Sections/FAQ.tsx
"use client";
const faqs = [
  { q: "How to apply?", a: "Visit the admissions page and complete the online application." },
  { q: "Tuition?", a: "Tuition varies by program; check Admissions > Tuition." }
];

export default function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="bg-white p-4 rounded shadow">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
