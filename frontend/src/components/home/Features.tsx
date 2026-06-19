export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold text-emerald-900">আমাদের সুবিধাসমূহ</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <div className="flex flex-col items-start gap-3 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-900">বিশুদ্ধ কালেকশন</h3>
          <p className="text-sm text-emerald-600">রিলায়েবল ইসলামিক প্রকাশনা ও খ্যাতিমান লেখকদের বই</p>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-900">দ্রুত ডেলিভারি</h3>
          <p className="text-sm text-emerald-600">বাংলাদেশজুড়ে দ্রুত ও নিরাপদ শিপিং</p>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-emerald-900">নির্ভরযোগ্য পেমেন্ট</h3>
          <p className="text-sm text-emerald-600">সিকিউর পেমেন্ট ও সহজ রিটার্ন নীতি</p>
        </div>
      </div>
    </section>
  );
}
