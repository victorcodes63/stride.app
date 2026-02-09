import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SlidingHRQuestions from '@/components/SlidingHRQuestions';
import StickyAboutSection from '@/components/StickyAboutSection';
import AccordionServicesSection from '@/components/AccordionServicesSection';
import FeaturedJobs from '@/components/FeaturedJobs';
import FloatingTestimonials from '@/components/FloatingTestimonials';
import Footer from '@/components/Footer';
import { Testimonial } from '@/types';

export default function Home() {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Mwangi',
      position: 'HR Director',
      company: 'Tech Solutions Kenya',
      content: 'Eagle HR transformed our recruitment process. Their expertise in finding the right talent has been invaluable to our growth.',
      rating: 5,
      image: '/images/about/smile_1.jpg'
    },
    {
      id: '2',
      name: 'James Ochieng',
      position: 'CEO',
      company: 'Innovate Africa Ltd',
      content: 'The training programs provided by Eagle HR have significantly improved our team\'s performance and productivity.',
      rating: 5,
      image: '/images/about/smile_2.jpg'
    },
    {
      id: '3',
      name: 'Grace Wanjiku',
      position: 'Operations Manager',
      company: 'Green Energy Co.',
      content: 'Professional, reliable, and results-driven. Eagle HR\'s HR outsourcing services have streamlined our operations.',
      rating: 5,
      image: '/images/about/smile_4.jpg'
    }
  ];

  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SlidingHRQuestions />
      <StickyAboutSection />
      <AccordionServicesSection />
      <FeaturedJobs />
      <FloatingTestimonials testimonials={testimonials} />
      <Footer />
    </main>
  );
}
