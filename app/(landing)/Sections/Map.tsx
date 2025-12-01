// app/(landing)/Sections/Map.tsx
"use client";
export default function Map() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-xl font-semibold text-[#003B5C] mb-4">Find Us</h3>
        <div className="w-full rounded overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            width="100%"
            height="380"
            loading="lazy"
            className="border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
