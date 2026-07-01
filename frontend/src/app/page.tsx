import HeroBanner from "@/components/home/HeroBanner";
import PromoBanner from "@/components/home/PromoBanner";
import PopularBooks from "@/components/home/PopularBooks";
import NewBooks from "@/components/home/NewBooks";
import AuthorsCarousel from "@/components/home/AuthorsCarousel";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";
import VideoReviews from "@/components/home/VideoReviews";
import BlogPreview from "@/components/home/BlogPreview";
import ContactUs from "@/components/home/ContactUs";
import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <main>
        <Categories />
        <NewBooks />
        <Features />
        <PromoBanner />
        <AuthorsCarousel />
        <PopularBooks />
        <Stats />
        <Testimonials />
        <VideoReviews />
        <BlogPreview />
        <ContactUs />
        <CTA />
      </main>
    </>
  );
}

