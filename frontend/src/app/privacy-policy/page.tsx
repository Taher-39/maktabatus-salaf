import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy)",
  description: "মাক্তাবাতুস সালাফ—Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">
        গোপনীয়তা নীতি (Privacy Policy)
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-emerald-700 dark:text-emerald-200">
        আপনার গোপনীয়তা আমাদের কাছে গুরুত্বপূর্ণ। এই নীতিমালায় আমরা কীভাবে ব্যবহারকারীর
        তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত রাখি—তার সাধারণ বিবরণ দেওয়া হলো।
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
        <section>
          <h2 className="mb-2 text-lg font-semibold">১) আমরা যে তথ্য সংগ্রহ করি</h2>
          <p>
            আপনি যখন অর্ডার করেন বা ফর্ম পূরণ করেন, তখন নাম, ইমেইল, ফোন নম্বর,
            ডেলিভারি সংক্রান্ত তথ্য এবং প্রয়োজনীয় লেনদেন সম্পর্কিত তথ্য সংগ্রহ করা হতে পারে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">২) তথ্য ব্যবহার</h2>
          <p>
            সংগৃহীত তথ্য ব্যবহার করা হয় অর্ডার প্রক্রিয়াকরণ, ডেলিভারি নিশ্চিত করা,
            যোগাযোগ রক্ষা এবং পরিষেবা উন্নত করার জন্য।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৩) কুকি/ট্র্যাকিং</h2>
          <p>
            ওয়েবসাইটে কুকি বা অনুরূপ প্রযুক্তি ব্যবহার হতে পারে, যাতে ব্যবহারকারীর
            অভিজ্ঞতা উন্নত হয় এবং নির্দিষ্ট ফিচার সঠিকভাবে কাজ করে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৪) তথ্য শেয়ার</h2>
          <p>
            আইনগতভাবে প্রয়োজন হলে অথবা সেবা প্রদানের অংশ হিসেবে বিশ্বস্ত তৃতীয় পক্ষের সাথে
            তথ্য শেয়ার হতে পারে। আমরা অপ্রয়োজনে আপনার ব্যক্তিগত তথ্য বিক্রি করি না।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৫) ডেটা সিকিউরিটি</h2>
          <p>
            আপনার তথ্য সুরক্ষায় আমরা প্রযুক্তিগত ও সাংগঠনিক নিরাপত্তা ব্যবস্থা প্রয়োগের
            চেষ্টা করি। তবে, ইন্টারনেটের মাধ্যমে তথ্য প্রেরণ সবসময় ১০০% নিরাপদ গ্যারান্টি করা যায় না।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৬) নীতিমালা পরিবর্তন</h2>
          <p>
            আমরা যে কোনো সময় এই Privacy Policy আপডেট করতে পারি। আপডেটগুলো
            ওয়েবসাইটে প্রকাশিত হলেই তা কার্যকর হবে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">যোগাযোগ</h2>
          <p>
            কোনো প্রশ্ন থাকলে ইমেইল করুন: <span className="font-medium">maktabatussalaf47@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}

