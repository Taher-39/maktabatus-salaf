import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "শর্তাবলী (Terms & Conditions)",
  description: "মাক্তাবাতুস সালাফ—Terms & Conditions",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-emerald-950 dark:text-emerald-50">
        শর্তাবলী (Terms & Conditions)
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-emerald-700 dark:text-emerald-200">
        এই ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলীতে সম্মতি প্রদান করছেন।
        আপনি যদি এসব শর্তাবলীতে সম্মত না হন, তাহলে দয়া করে সাইটটি ব্যবহার করবেন না।
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-emerald-900 dark:text-emerald-100">
        <section>
          <h2 className="mb-2 text-lg font-semibold">১) পরিষেবার ব্যবহার</h2>
          <p>
            আপনি সাইটটি আইনসম্মত উদ্দেশ্যে ব্যবহার করবেন। ভুয়া তথ্য প্রদান, প্রতারণামূলক
            কার্যক্রম বা সাইটের স্বাভাবিক কার্যক্রমে ব্যাঘাত ঘটাতে পারে—এমন কোনো আচরণ
            নিষিদ্ধ।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">২) পণ্য/বিষয়বস্তুর তথ্য</h2>
          <p>
            পণ্যের মূল্য, বিবরণ, ছবি ইত্যাদির তথ্য ওয়েবসাইটে প্রদর্শিত হয়। তবুও, প্রযুক্তিগত
            কারণে বা আপডেটের ফলে তথ্যের ক্ষেত্রে সামান্য পার্থক্য হতে পারে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৩) অর্ডার ও পেমেন্ট</h2>
          <p>
            অর্ডার কনফার্ম করার পর পেমেন্ট পদ্ধতি অনুযায়ী অর্থ গ্রহণ করা হয়। কোনো
            কারণে পেমেন্ট ব্যর্থ হলে অর্ডার প্রক্রিয়া বন্ধ/বাতিল হতে পারে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৪) ডেলিভারি</h2>
          <p>
            অর্ডারকৃত পণ্য নির্ধারিত সময়ের মধ্যে প্রেরণ/ডেলিভারি করা হয়। তবে আবহাওয়া,
            পরিবহন বা বাহ্যিক কারণবশত ডেলিভারিতে বিলম্ব হতে পারে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৫) রিফান্ড/রিটার্ন</h2>
          <p>
            পণ্য সম্পর্কিত রিফান্ড/রিটার্ন নীতিমালা আলাদা ভাবে জানানো হতে পারে।
            পণ্যের অবস্থা, ক্রয়ের প্রমাণ ও প্রযোজ্য শর্ত অনুযায়ী সিদ্ধান্ত গৃহীত হবে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">৬) শর্তাবলী পরিবর্তনের অধিকার</h2>
          <p>
            আমাদের ওয়েবসাইট যে কোনো সময় এই শর্তাবলী আপডেট/পরিবর্তন করতে পারে।
            পরিবর্তনগুলো ওয়েবসাইটে প্রকাশিত হওয়ার সাথে সাথেই কার্যকর হবে।
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">যোগাযোগ</h2>
          <p>
            কোনো প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন: <span className="font-medium">maktabatussalaf47@gmail.com</span>
          </p>
        </section>
      </div>
    </div>
  );
}

