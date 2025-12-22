// app/(landing)/Sections/NewsEvents.tsx
"use client";
const news = [
  { title: "Open House December 15", date: "Dec 15, 2025", excerpt: "Visit campus, meet faculty." },
  { title: "Research Symposium", date: "Jan 10, 2026", excerpt: "Presentations from faculty & students." }
];

export default function NewsEvents() {
  return (
    <section id="news" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#003B5C] mb-6">News & Events</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {news.map(n => (
            <article key={n.title} className="bg-white p-6 rounded shadow">
              <div className="text-sm text-gray-500">{n.date}</div>
              <h3 className="font-semibold mt-2">{n.title}</h3>
              <p className="text-gray-600 mt-2">{n.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
