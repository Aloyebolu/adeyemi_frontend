// app/(landing)/Sections/International.tsx
"use client";
export default function International() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#003B5C]">International Students</h2>
          <p className="mt-4 text-gray-700">We welcome students from across the world — support for visas, housing, and language training is available.</p>
        </div>
        <div>
          <img src="/images/registry-block.jpg" alt="International" className="w-full h-64 object-cover rounded shadow" />
        </div>
      </div>
    </section>
  );
}
