import Hero from "./(landing)/Hero/Hero";
import Navigation from "./(landing)/Navigation/Navigation";
import About from "./(landing)/Sections/About";
import Programs from "./(landing)/Sections/Programs";
import Admissions from "./(landing)/Sections/Admissions";
import CampusLife from "./(landing)/Sections/CampusLife";
import Research from "./(landing)/Sections/Research";
import NewsEvents from "./(landing)/Sections/NewsEvents";
import Testimonials from "./(landing)/Sections/Testimonials";
import International from "./(landing)/Sections/International";
import FAQ from "./(landing)/Sections/FAQ";
import CTA from "./(landing)/Sections/CTA";
import Partners from "./(landing)/Sections/Partners";
import Footer from "./(landing)/Sections/Footer";
import Map from "./(landing)/Sections/Map";

export default function HomePage() {
  return (
    <main className="scroll-smooth">
      <Navigation />
      <Hero />
      <About />
      <Programs />
      <Admissions />
      <CampusLife />
      <Research />
      <NewsEvents />
      <Testimonials />
      <International />
      <Partners />
      <FAQ />
      <CTA />
      <Map />
      <Footer />
    </main>
  );
}
