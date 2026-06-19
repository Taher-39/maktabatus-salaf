export default function Stats() {
  const stats = [
    { label: "মোট বই", value: "1,842" },
    { label: "সক্রিয় ব্যবহারকারী", value: "12,430" },
    { label: "মোট অর্ডার", value: "8,214" },
    { label: "সন্তুষ্ট গ্রাহক", value: "9,900+" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-emerald-100 bg-white p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-900">{s.value}</div>
            <div className="mt-1 text-sm text-emerald-600">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
