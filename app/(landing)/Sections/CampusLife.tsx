// app/(landing)/Sections/CampusLife.tsx
"use client";
export default function CampusLife() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">Campus Life & Facilities</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold">Libraries</h3>
            <p className="text-sm text-gray-600 mt-2">24/7 access to resources and journals.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold">Research Labs</h3>
            <p className="text-sm text-gray-600 mt-2">Equipped labs across sciences & engineering.</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold">Student Life</h3>
            <p className="text-sm text-gray-600 mt-2">Clubs, sports, and cultural groups.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
