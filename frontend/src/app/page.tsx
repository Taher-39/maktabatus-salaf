import HeroBanner from "@/components/home/HeroBanner";
import PromoBanner from "@/components/home/PromoBanner";
import PopularBooks from "@/components/home/PopularBooks";
import NewBooks from "@/components/home/NewBooks";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import BlogPreview from "@/components/home/BlogPreview";
import Newsletter from "@/components/home/Newsletter";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <main>
        <Features />
        <PromoBanner />
        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-emerald-900">বই ব্রাউজ করুন</h2>
          </div>
        </section>

        <Categories />
        <PopularBooks />
        <NewBooks />
        <Stats />
        <Testimonials />
        <BlogPreview />
        <Newsletter />
        <CTA />
      </main>
    </>
  );
}
