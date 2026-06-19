export default function Testimonials() {
  const items = [
    { name: "মোঃ রাশেদ", text: "দ্রুত ডেলিভারি এবং ব্যতিক্রমী সার্ভিস — পুনরায় অর্ডার করব।" },
    { name: "শারমিন আহমেদ", text: "বইয়ের সংগ্রহ উচ্চমানের এবং মূল্যসঙ্গত।" },
    { name: "আব্দুল্লাহ আলি", text: "সার্ভিস টীম খুবই সহায়ক এবং সময়মত যোগাযোগ করেছে।" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-emerald-900">ক্রেতাদের মতামত</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((it) => (
          <div key={it.name} className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="mb-4 text-sm text-emerald-700">“{it.text}”</p>
            <div className="text-sm font-semibold text-emerald-900">{it.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
