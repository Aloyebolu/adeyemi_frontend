// app/(landing)/Sections/Partners.tsx
"use client";
const partners = ["Microsoft", "Google", "UNESCO", "World Bank"];

export default function Partners() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-xl font-semibold text-[#003B5C] mb-6">Partners & Affiliations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map(p => <div key={p} className="bg-white p-4 rounded shadow text-center">{p}</div>)}
        </div>
      </div>
    </section>
  );
}
