// app/(landing)/Sections/CTA.tsx
"use client";
export default function CTA() {
  return (
    <section className="py-16 bg-[#003B5C] text-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold">Ready to join AFUED?</h3>
        <p className="mt-2 text-gray-200">Apply now for the next academic session — limited seats available.</p>
        <div className="mt-6">
          <a href="/apply" className="px-6 py-3 bg-yellow-400 text-[#003B5C] rounded font-semibold">Apply Now</a>
        </div>
      </div>
    </section>
  );
}
