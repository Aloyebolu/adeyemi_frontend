'use client'
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, Calendar, Users, BookOpen, Award, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Search, Clock, ArrowRight, Star, CheckCircle, PlayCircle, TrendingUp, Target, Lightbulb, Shield } from 'lucide-react';

// CSS Variables for Color System
const styles = `
  :root {
    --color-background: #ffffff;
    --color-background2: #f8f9fa;
    --text-2: #6c757d;
    --color-foreground: #212529;
    --color-primary: #1a5490;
    --color-primary-hover: #143d6b;
    --color-accent: #ffc107;
    --color-surface: #ffffff;
    --color-surface-elevated: #f8f9fa;
    --color-border: #dee2e6;
    --color-text-primary: #212529;
    --color-on-brand: #ffffff;
    --color-text-on-primary: #ffffff;
    --color-info: #0dcaf0;
    --color-error: #dc3545;
    --color-success: #198754;
    --color-warning: #ffc107;
    --color-orange: #fd7e14;
    --color-secondary: #6c757d;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background: var(--color-background);
    color: var(--color-text-primary);
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-in;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-slide-in {
    animation: slideIn 0.8s ease-out;
  }

  @keyframes slideIn {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .gradient-text {
    background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }

  .image-overlay {
    position: relative;
    overflow: hidden;
  }

  .image-overlay::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6));
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  .float-animation {
    animation: float 3s ease-in-out infinite;
  }

  .scroll-smooth {
    scroll-behavior: smooth;
  }
`;

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      name: 'About',
      dropdown: ['History', 'Mission & Vision', 'Leadership', 'Accreditation']
    },
    {
      name: 'Academics',
      dropdown: ['Programs', 'Faculties', 'Research', 'Libraries']
    },
    {
      name: 'Admissions',
      dropdown: ['Undergraduate', 'Postgraduate', 'International', 'Requirements']
    },
    {
      name: 'Student Life',
      dropdown: ['Campus Life', 'Housing', 'Clubs & Organizations', 'Sports']
    },
    { name: 'News & Events' },
    { name: 'Contact' }
  ];

  return (
    <>
      <style>{styles}</style>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-effect shadow-lg' : 'bg-primary'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <BookOpen className={isScrolled ? "text-primary" : "text-on-brand"} size={24} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isScrolled ? 'text-primary' : 'text-on-brand'}`}>
                  Adeyemi University
                </h1>
                <p className={`text-xs ${isScrolled ? 'text-text2' : 'text-on-brand opacity-80'}`}>
                  Excellence in Education
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-1 ${isScrolled ? 'text-text-primary hover:bg-surface-elevated' : 'text-on-brand hover:bg-primary-hover'}`}>
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown size={16} />}
                  </button>
                  
                  {item.dropdown && activeDropdown === index && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-lg shadow-xl border border-border py-2">
                      {item.dropdown.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={`#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-text-primary hover:bg-surface-elevated transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <button className="ml-4 px-6 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-warning transition-all">
                Apply Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden ${isScrolled ? 'text-primary' : 'text-on-brand'}`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-surface border-t border-border">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  <button className="w-full text-left px-4 py-3 text-text-primary hover:bg-surface-elevated rounded-lg transition-all flex items-center justify-between">
                    <span>{item.name}</span>
                    {item.dropdown && <ChevronDown size={16} />}
                  </button>
                  {item.dropdown && (
                    <div className="ml-4 mt-2 space-y-1">
                      {item.dropdown.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href={`#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-text2 hover:text-primary transition-colors"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full mt-4 px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-warning transition-all">
                Apply Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Welcome to AFUED",
      subtitle: "Where Excellence Meets Innovation",
      description: "Join a community of scholars, researchers, and leaders shaping the future",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=600&fit=crop"
    },
    {
      title: "World-Class Education",
      subtitle: "Transforming Lives Through Learning",
      description: "Experience cutting-edge facilities and expert faculty dedicated to your success",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop"
    },
    {
      title: "Research & Innovation",
      subtitle: "Pioneering Tomorrow's Solutions",
      description: "Be part of groundbreaking research that impacts communities worldwide",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen pt-20 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-transparent z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl animate-fade-in">
                <h2 className="text-5xl md:text-7xl font-bold text-on-brand mb-4">
                  {slide.title}
                </h2>
                <p className="text-2xl md:text-3xl text-accent font-semibold mb-4">
                  {slide.subtitle}
                </p>
                <p className="text-xl text-on-brand mb-8">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-warning transition-all flex items-center space-x-2">
                    <span>Explore Programs</span>
                    <ArrowRight size={20} />
                  </button>
                  <button className="px-8 py-4 bg-surface text-primary font-bold rounded-lg hover:bg-surface-elevated transition-all flex items-center space-x-2">
                    <PlayCircle size={20} />
                    <span>Watch Video</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-accent w-8' : 'bg-on-brand/50'}`}
          />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard number="15,000+" label="Students" icon={Users} />
            <StatCard number="500+" label="Faculty Members" icon={Award} />
            <StatCard number="100+" label="Programs" icon={BookOpen} />
            <StatCard number="50+" label="Countries" icon={Globe} />
          </div>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ number, label, icon: Icon }) => (
  <div className="text-center">
    <Icon className="mx-auto mb-2 text-primary" size={32} />
    <p className="text-3xl font-bold text-primary mb-1">{number}</p>
    <p className="text-text2">{label}</p>
  </div>
);

// About Section Component
const AboutSection = () => {
  return (
    <section className="py-20 bg-background2">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Adeyemi University
            </h2>
            <p className="text-lg text-text2 mb-6">
              Founded in 1985, Adeyemi University has been at the forefront of academic excellence 
              and innovation for nearly four decades. Our commitment to providing world-class 
              education has made us a leading institution in higher learning.
            </p>
            <p className="text-lg text-text2 mb-6">
              We pride ourselves on our diverse community of scholars, state-of-the-art facilities, 
              and a curriculum that prepares students for the challenges of tomorrow. Our graduates 
              are leaders, innovators, and change-makers in their respective fields.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <FeatureItem icon={Target} text="Mission-Driven Education" />
              <FeatureItem icon={Lightbulb} text="Innovation & Research" />
              <FeatureItem icon={Shield} text="Accredited Programs" />
              <FeatureItem icon={TrendingUp} text="Career Success" />
            </div>
            <button className="px-8 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
              Learn More About Us
            </button>
          </div>
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl hover-lift">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=800&fit=crop"
                alt="Campus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-accent/20 rounded-lg -z-10" />
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-primary/20 rounded-lg -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="text-success" size={20} />
    <span className="text-text-primary">{text}</span>
  </div>
);

// Programs Section Component
const ProgramsSection = () => {
  const programs = [
    {
      title: "Engineering & Technology",
      icon: "🔧",
      courses: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
      color: "primary"
    },
    {
      title: "Business & Management",
      icon: "💼",
      courses: ["Business Administration", "Accounting", "Marketing", "Finance"],
      color: "success"
    },
    {
      title: "Health Sciences",
      icon: "🏥",
      courses: ["Medicine", "Nursing", "Pharmacy", "Public Health"],
      color: "error"
    },
    {
      title: "Arts & Humanities",
      icon: "🎨",
      courses: ["English", "History", "Philosophy", "Fine Arts"],
      color: "warning"
    },
    {
      title: "Natural Sciences",
      icon: "🔬",
      courses: ["Biology", "Chemistry", "Physics", "Mathematics"],
      color: "info"
    },
    {
      title: "Social Sciences",
      icon: "📊",
      courses: ["Psychology", "Sociology", "Economics", "Political Science"],
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Academic Programs
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Discover a wide range of undergraduate and graduate programs designed to 
            prepare you for success in your chosen field
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ProgramCard key={index} {...program} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
            View All Programs
          </button>
        </div>
      </div>
    </section>
  );
};

const ProgramCard = ({ title, icon, courses, color }) => (
  <div className="bg-surface rounded-lg shadow-lg hover-lift p-8 border border-border">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className={`text-2xl font-bold mb-4 text-${color}`}>{title}</h3>
    <ul className="space-y-2 mb-6">
      {courses.map((course, index) => (
        <li key={index} className="flex items-center space-x-2 text-text2">
          <ChevronRight size={16} className="text-primary" />
          <span>{course}</span>
        </li>
      ))}
    </ul>
    <button className="text-primary font-semibold flex items-center space-x-2 hover:text-primary-hover transition-colors">
      <span>Explore Program</span>
      <ArrowRight size={16} />
    </button>
  </div>
);

// Admissions Section Component
const AdmissionsSection = () => {
  const steps = [
    {
      number: "01",
      title: "Choose Your Program",
      description: "Explore our wide range of programs and find the one that matches your interests and career goals"
    },
    {
      number: "02",
      title: "Submit Application",
      description: "Complete our online application form with your academic records and personal statement"
    },
    {
      number: "03",
      title: "Review & Interview",
      description: "Our admissions team will review your application and may invite you for an interview"
    },
    {
      number: "04",
      title: "Receive Decision",
      description: "Get your admission decision and start your journey towards academic excellence"
    }
  ];

  return (
    <section className="py-20 bg-background2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Admissions Process
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Your journey to Adeyemi University begins here. Follow these simple steps 
            to join our vibrant academic community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <AdmissionStep key={index} {...step} isLast={index === steps.length - 1} />
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-on-brand mb-4">
            Ready to Apply?
          </h3>
          <p className="text-xl text-on-brand/90 mb-8 max-w-2xl mx-auto">
            Applications for the 2025/2026 academic year are now open. 
            Don't miss this opportunity to join our prestigious institution.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-accent text-primary font-bold rounded-lg hover:bg-warning transition-all">
              Start Application
            </button>
            <button className="px-8 py-4 bg-surface text-primary font-bold rounded-lg hover:bg-surface-elevated transition-all">
              Download Brochure
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <InfoCard
            icon={Calendar}
            title="Important Dates"
            items={["Application Deadline: June 30", "Entrance Exam: July 15", "Semester Starts: September 1"]}
          />
          <InfoCard
            icon={BookOpen}
            title="Requirements"
            items={["High School Diploma", "Transcripts", "Recommendation Letters", "Personal Statement"]}
          />
          <InfoCard
            icon={Award}
            title="Financial Aid"
            items={["Merit Scholarships", "Need-Based Aid", "Student Loans", "Work-Study Programs"]}
          />
        </div>
      </div>
    </section>
  );
};

const AdmissionStep = ({ number, title, description, isLast }) => (
  <div className="relative">
    <div className="bg-surface rounded-lg shadow-lg p-6 hover-lift">
      <div className="text-5xl font-bold text-accent/20 mb-4">{number}</div>
      <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
      <p className="text-text2">{description}</p>
    </div>
    {!isLast && (
      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
        <ArrowRight className="text-accent" size={32} />
      </div>
    )}
  </div>
);

const InfoCard = ({ icon: Icon, title, items }) => (
  <div className="bg-surface rounded-lg shadow-lg p-6 border border-border">
    <Icon className="text-primary mb-4" size={40} />
    <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start space-x-2 text-text2">
          <CheckCircle className="text-success mt-1 flex-shrink-0" size={16} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Campus Life Section Component
const CampusLifeSection = () => {
  const facilities = [
    {
      title: "Modern Libraries",
      description: "Access millions of books, journals, and digital resources 24/7",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      icon: BookOpen
    },
    {
      title: "Sports Complex",
      description: "State-of-the-art facilities for athletics, fitness, and recreation",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
      icon: Award
    },
    {
      title: "Student Housing",
      description: "Comfortable and secure accommodation options on campus",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop",
      icon: Users
    },
    {
      title: "Research Labs",
      description: "Cutting-edge laboratories equipped with the latest technology",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
      icon: Target
    },
    {
      title: "Arts & Culture",
      description: "Theaters, galleries, and spaces for creative expression",
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop",
      icon: Star
    },
    {
      title: "Dining Services",
      description: "Diverse dining options catering to all dietary preferences",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      icon: Globe
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Campus Life & Facilities
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Experience a vibrant campus environment with world-class facilities 
            designed to support your academic and personal growth
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {facilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary to-primary-hover rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-on-brand mb-4">
                Join 200+ Student Organizations
              </h3>
              <p className="text-on-brand/90 mb-6">
                From academic clubs to cultural societies, sports teams to volunteer groups, 
                there's something for everyone at Adeyemi University.
              </p>
              <button className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-warning transition-all">
                Explore Clubs
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ClubCategory icon="🎭" name="Arts & Culture" count="45+" />
              <ClubCategory icon="⚽" name="Sports" count="30+" />
              <ClubCategory icon="🔬" name="Academic" count="60+" />
              <ClubCategory icon="🤝" name="Community Service" count="40+" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FacilityCard = ({ title, description, image, icon: Icon }) => (
  <div className="bg-surface rounded-lg shadow-lg overflow-hidden hover-lift border border-border">
    <div className="relative h-48 overflow-hidden">
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-primary/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <Icon className="text-on-brand" size={48} />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-text2">{description}</p>
    </div>
  </div>
);

const ClubCategory = ({ icon, name, count }) => (
  <div className="bg-surface/10 backdrop-blur-sm rounded-lg p-4 text-center">
    <div className="text-4xl mb-2">{icon}</div>
    <p className="text-on-brand font-semibold mb-1">{name}</p>
    <p className="text-accent text-sm">{count} clubs</p>
  </div>
);

// Research & Innovation Section Component
const ResearchSection = () => {
  const researchAreas = [
    {
      title: "Artificial Intelligence",
      description: "Leading research in machine learning, neural networks, and AI applications",
      projects: 45,
      publications: 120,
      color: "primary"
    },
    {
      title: "Renewable Energy",
      description: "Developing sustainable energy solutions for a greener future",
      projects: 32,
      publications: 98,
      color: "success"
    },
    {
      title: "Biotechnology",
      description: "Advancing medical research and pharmaceutical innovations",
      projects: 38,
      publications: 145,
      color: "error"
    },
    {
      title: "Climate Science",
      description: "Understanding and mitigating the impacts of climate change",
      projects: 28,
      publications: 87,
      color: "info"
    }
  ];

  return (
    <section className="py-20 bg-background2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Research & Innovation
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Our research initiatives are driving innovation and creating solutions 
            to global challenges across multiple disciplines
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {researchAreas.map((area, index) => (
            <ResearchCard key={index} {...area} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ResearchStat number="$50M+" label="Research Funding" icon={TrendingUp} />
          <ResearchStat number="500+" label="Research Papers" icon={BookOpen} />
          <ResearchStat number="100+" label="Patents Filed" icon={Award} />
        </div>

        <div className="bg-surface rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-4">
                Collaborate with Industry Leaders
              </h3>
              <p className="text-text2 mb-6">
                Our research partnerships with leading corporations and organizations 
                provide students and faculty with real-world project opportunities and 
                cutting-edge resources.
              </p>
              <div className="space-y-3 mb-6">
                <PartnerFeature text="Access to state-of-the-art equipment" />
                <PartnerFeature text="Industry mentorship programs" />
                <PartnerFeature text="Internship and employment opportunities" />
                <PartnerFeature text="Collaborative research grants" />
              </div>
              <button className="px-8 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
                Explore Research Opportunities
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1581093458791-9d42e3c6e4d8?w=600&h=400&fit=crop"
                alt="Research"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResearchCard = ({ title, description, projects, publications, color }) => (
  <div className="bg-surface rounded-lg shadow-lg p-8 hover-lift border border-border">
    <h3 className={`text-2xl font-bold text-${color} mb-3`}>{title}</h3>
    <p className="text-text2 mb-6">{description}</p>
    <div className="flex gap-6">
      <div className="flex-1">
        <p className="text-3xl font-bold text-primary">{projects}</p>
        <p className="text-text2 text-sm">Active Projects</p>
      </div>
      <div className="flex-1">
        <p className="text-3xl font-bold text-primary">{publications}</p>
        <p className="text-text2 text-sm">Publications</p>
      </div>
    </div>
  </div>
);

const ResearchStat = ({ number, label, icon: Icon }) => (
  <div className="text-center p-8 bg-surface rounded-lg shadow-lg hover-lift border border-border">
    <Icon className="mx-auto text-primary mb-4" size={48} />
    <p className="text-4xl font-bold text-primary mb-2">{number}</p>
    <p className="text-text2">{label}</p>
  </div>
);

const PartnerFeature = ({ text }) => (
  <div className="flex items-center space-x-2">
    <CheckCircle className="text-success flex-shrink-0" size={20} />
    <span className="text-text-primary">{text}</span>
  </div>
);

// News & Events Section Component
const NewsEventsSection = () => {
  const news = [
    {
      title: "Adeyemi University Ranks Top 10 in National Survey",
      date: "November 10, 2025",
      category: "Achievement",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop",
      excerpt: "Our commitment to excellence has been recognized in the latest national university rankings..."
    },
    {
      title: "New Research Center Opens for Renewable Energy",
      date: "November 8, 2025",
      category: "Research",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
      excerpt: "State-of-the-art facility will advance sustainable energy solutions and climate research..."
    },
    {
      title: "International Student Exchange Program Expands",
      date: "November 5, 2025",
      category: "International",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop",
      excerpt: "New partnerships with universities in 15 countries offer students global opportunities..."
    }
  ];

  const events = [
    {
      date: "NOV\n20",
      title: "Open House Day",
      time: "9:00 AM - 5:00 PM",
      location: "Main Campus",
      color: "primary"
    },
    {
      date: "NOV\n25",
      title: "Research Symposium",
      time: "10:00 AM - 4:00 PM",
      location: "Science Building",
      color: "success"
    },
    {
      date: "DEC\n01",
      title: "Career Fair 2025",
      time: "11:00 AM - 6:00 PM",
      location: "Sports Complex",
      color: "warning"
    },
    {
      date: "DEC\n10",
      title: "Winter Graduation",
      time: "2:00 PM",
      location: "Main Auditorium",
      color: "info"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-primary">Latest News</h2>
              <button className="text-primary font-semibold flex items-center space-x-2 hover:text-primary-hover">
                <span>View All</span>
                <ArrowRight size={20} />
              </button>
            </div>
            <div className="space-y-6">
              {news.map((item, index) => (
                <NewsCard key={index} {...item} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-4xl font-bold text-primary">Events</h2>
              <Calendar className="text-primary" size={32} />
            </div>
            <div className="space-y-4">
              {events.map((event, index) => (
                <EventCard key={index} {...event} />
              ))}
            </div>
            <button className="w-full mt-6 px-6 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
              View Full Calendar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const NewsCard = ({ title, date, category, image, excerpt }) => (
  <div className="bg-surface rounded-lg shadow-lg overflow-hidden hover-lift border border-border">
    <div className="md:flex">
      <div className="md:w-1/3">
        <img src={image} alt={title} className="w-full h-48 md:h-full object-cover" />
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex items-center space-x-3 mb-3">
          <span className="px-3 py-1 bg-accent text-primary text-sm font-semibold rounded-full">
            {category}
          </span>
          <span className="text-text2 text-sm flex items-center">
            <Calendar size={14} className="mr-1" />
            {date}
          </span>
        </div>
        <h3 className="text-xl font-bold text-primary mb-2 hover:text-primary-hover cursor-pointer">
          {title}
        </h3>
        <p className="text-text2 mb-4">{excerpt}</p>
        <button className="text-primary font-semibold flex items-center space-x-2 hover:text-primary-hover">
          <span>Read More</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  </div>
);

const EventCard = ({ date, title, time, location, color }) => (
  <div className="bg-surface rounded-lg shadow-lg p-4 hover-lift border border-border flex space-x-4">
    <div className={`bg-${color} text-on-brand rounded-lg p-3 text-center flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center`}>
      <span className="text-xs font-semibold whitespace-pre-line leading-tight">{date}</span>
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-primary mb-1">{title}</h4>
      <p className="text-text2 text-sm flex items-center mb-1">
        <Clock size={14} className="mr-1" />
        {time}
      </p>
      <p className="text-text2 text-sm flex items-center">
        <MapPin size={14} className="mr-1" />
        {location}
      </p>
    </div>
  </div>
);

// Testimonials Section Component
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Graduate, 2024",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      quote: "Adeyemi University gave me the skills and confidence to pursue my dream career in tech. The faculty's dedication and the hands-on learning approach made all the difference.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "MBA Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quote: "The business program here is world-class. I've had opportunities to work on real projects with industry partners, which has been invaluable for my career development.",
      rating: 5
    },
    {
      name: "Amara Okafor",
      role: "Medicine Graduate, 2023",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
      quote: "The medical program exceeded all my expectations. From the state-of-the-art facilities to the mentorship from experienced physicians, I felt prepared for my career from day one.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-background2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Student Success Stories
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Hear from our students and alumni about their experiences at Adeyemi University
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary via-primary-hover to-primary rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-on-brand mb-4">
            Join Our Alumni Network
          </h3>
          <p className="text-on-brand/90 text-lg mb-8 max-w-2xl mx-auto">
            Connect with over 50,000 alumni worldwide. Access exclusive networking events, 
            mentorship programs, and career opportunities.
          </p>
          <button className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-warning transition-all">
            Connect with Alumni
          </button>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ name, role, image, quote, rating }) => (
  <div className="bg-surface rounded-lg shadow-lg p-8 hover-lift border border-border">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="text-warning fill-current" size={20} />
      ))}
    </div>
    <p className="text-text2 mb-6 italic">"{quote}"</p>
    <div className="flex items-center space-x-4">
      <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
      <div>
        <p className="font-bold text-primary">{name}</p>
        <p className="text-text2 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

// FAQ Section Component
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What are the admission requirements?",
      answer: "Admission requirements vary by program but generally include a high school diploma or equivalent, transcripts, standardized test scores, letters of recommendation, and a personal statement. International students may need to provide English proficiency test scores."
    },
    {
      question: "How much is tuition?",
      answer: "Tuition varies by program and student status. Undergraduate tuition for domestic students starts at $15,000 per year, while international students pay approximately $25,000 per year. Graduate program tuition ranges from $18,000 to $35,000 annually."
    },
    {
      question: "Are scholarships available?",
      answer: "Yes, we offer a variety of scholarships including merit-based scholarships, need-based financial aid, athletic scholarships, and special program scholarships. Over 70% of our students receive some form of financial assistance."
    },
    {
      question: "What is campus housing like?",
      answer: "We offer various housing options including traditional residence halls, suite-style accommodations, and apartment-style living. All housing includes Wi-Fi, utilities, and access to dining facilities. First-year students are guaranteed on-campus housing."
    },
    {
      question: "Can I study abroad?",
      answer: "Absolutely! We have partnerships with over 100 universities in 50 countries. Students can participate in semester-long exchange programs, short-term study tours, or international internships. Financial aid can often be applied to study abroad programs."
    },
    {
      question: "What career support services are available?",
      answer: "Our Career Services Center offers resume reviews, interview preparation, job search assistance, career counseling, networking events, and job fairs. We maintain strong relationships with employers and have a 95% graduate employment rate within six months."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-text2">
            Find answers to common questions about Adeyemi University
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-text2 mb-4">Still have questions?</p>
          <button className="px-8 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
            Contact Admissions
          </button>
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="bg-surface rounded-lg shadow-lg border border-border overflow-hidden">
    <button
      onClick={onClick}
      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-surface-elevated transition-colors"
    >
      <span className="font-bold text-primary text-lg">{question}</span>
      <ChevronDown
        className={`text-primary transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        size={24}
      />
    </button>
    {isOpen && (
      <div className="px-6 py-4 bg-background2">
        <p className="text-text2">{answer}</p>
      </div>
    )}
  </div>
);

// Contact Section Component
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="py-20 bg-background2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg shadow-lg p-8 border border-border">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-primary font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-text-primary font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-text-primary font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-text-primary font-semibold mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject</option>
                      <option value="admissions">Admissions</option>
                      <option value="programs">Programs</option>
                      <option value="financial-aid">Financial Aid</option>
                      <option value="campus-visit">Campus Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-text-primary font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary text-on-brand font-bold rounded-lg hover:bg-primary-hover transition-all"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <ContactInfo
              icon={MapPin}
              title="Address"
              content="123 University Avenue, Adeyemi Campus, Lagos, Nigeria"
            />
            <ContactInfo
              icon={Phone}
              title="Phone"
              content="+234 800 ADEYEMI"
            />
            <ContactInfo
              icon={Mail}
              title="Email"
              content="info@adeyemi.edu.ng"
            />
            <ContactInfo
              icon={Clock}
              title="Office Hours"
              content="Mon - Fri: 8:00 AM - 5:00 PM"
            />

            <div className="bg-surface rounded-lg shadow-lg p-6 border border-border">
              <h3 className="font-bold text-primary mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <SocialIcon icon={Facebook} />
                <SocialIcon icon={Twitter} />
                <SocialIcon icon={Instagram} />
                <SocialIcon icon={Linkedin} />
                <SocialIcon icon={Youtube} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactInfo = ({ icon: Icon, title, content }) => (
  <div className="bg-surface rounded-lg shadow-lg p-6 border border-border">
    <div className="flex items-start space-x-4">
      <div className="bg-primary/10 rounded-lg p-3">
        <Icon className="text-primary" size={24} />
      </div>
      <div>
        <h3 className="font-bold text-primary mb-1">{title}</h3>
        <p className="text-text2">{content}</p>
      </div>
    </div>
  </div>
);

const SocialIcon = ({ icon: Icon }) => (
  <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-on-brand transition-all">
    <Icon size={20} />
  </button>
);

// Footer Component
const Footer = () => {
  const footerSections = [
    {
      title: "About",
      links: ["History", "Mission & Vision", "Leadership", "Accreditation", "Campus Map"]
    },
    {
      title: "Academics",
      links: ["Programs", "Faculties", "Online Learning", "Libraries", "Research"]
    },
    {
      title: "Admissions",
      links: ["Apply Now", "Requirements", "Tuition & Fees", "Financial Aid", "Visit Campus"]
    },
    {
      title: "Resources",
      links: ["Student Login","Lecturer Login", "Alumni Portal", "Career Services", "IT Support", "News & Media"]

    }
  ];

  return (
    <footer className="bg-primary text-on-brand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <BookOpen className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Adeyemi University</h3>
                <p className="text-on-brand/80 text-sm">Excellence in Education</p>
              </div>
            </div>
            <p className="text-on-brand/80 mb-6">
              Empowering students to achieve their full potential through innovative education, 
              groundbreaking research, and community engagement since 1985.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={Facebook} />
              <SocialIcon icon={Twitter} />
              <SocialIcon icon={Instagram} />
              <SocialIcon icon={Linkedin} />
              <SocialIcon icon={Youtube} />
            </div>
          </div>

          {footerSections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        <div className="border-t border-on-brand/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-on-brand/80 text-sm">
              © 2025 Adeyemi University. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-on-brand/80 text-sm">
              <a href="#privacy" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#accessibility" className="hover:text-accent transition-colors">Accessibility</a>
              <a href="#sitemap" className="hover:text-accent transition-colors">Site Map</a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary-hover py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-on-brand/60 text-sm">
            Designed with excellence | Empowering the next generation of leaders
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, links }) => (
  <div>
    <h4 className="font-bold text-lg mb-4">{title}</h4>
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={index}>
          <a href={`${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-on-brand/80 hover:text-accent transition-colors text-sm">
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

// Quick Stats Banner Component
const QuickStatsBanner = () => {
  return (
    <section className="bg-gradient-to-r from-primary via-primary-hover to-primary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">98%</div>
            <p className="text-on-brand/90">Student Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">95%</div>
            <p className="text-on-brand/90">Graduate Employment</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">$50M+</div>
            <p className="text-on-brand/90">Research Funding</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-accent mb-2">50K+</div>
            <p className="text-on-brand/90">Global Alumni</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Virtual Tour Section Component
const VirtualTourSection = () => {
  const tourLocations = [
    {
      name: "Main Library",
      description: "Explore our 5-story library with over 2 million volumes",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&h=300&fit=crop"
    },
    {
      name: "Science Labs",
      description: "State-of-the-art research facilities and equipment",
      image: "https://images.unsplash.com/photo-1581093458791-9d42e3c6e4d8?w=400&h=300&fit=crop"
    },
    {
      name: "Student Center",
      description: "Hub for student activities and social gatherings",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop"
    },
    {
      name: "Sports Complex",
      description: "Olympic-standard facilities for all sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Take a Virtual Tour
          </h2>
          <p className="text-xl text-text2 max-w-3xl mx-auto">
            Experience our beautiful campus from anywhere in the world. Explore our facilities, 
            classrooms, and student spaces through our interactive virtual tour.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tourLocations.map((location, index) => (
            <TourLocationCard key={index} {...location} />
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-primary text-on-brand font-bold rounded-lg hover:bg-primary-hover transition-all flex items-center space-x-2 mx-auto">
            <PlayCircle size={24} />
            <span>Start Full Virtual Tour</span>
          </button>
        </div>
      </div>
    </section>
  );
};

const TourLocationCard = ({ name, description, image }) => (
  <div className="group relative overflow-hidden rounded-lg shadow-lg hover-lift cursor-pointer">
    <img src={image} alt={name} className="w-full h-64 object-cover transition-transform group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-on-brand mb-2">{name}</h3>
        <p className="text-on-brand/90 text-sm">{description}</p>
      </div>
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
      <PlayCircle className="text-accent" size={64} />
    </div>
  </div>
);

// International Students Section Component
const InternationalSection = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Global Community",
      description: "Join students from over 50 countries in a truly international environment"
    },
    {
      icon: Award,
      title: "Scholarships Available",
      description: "Merit-based scholarships specifically for international students"
    },
    {
      icon: Users,
      title: "Support Services",
      description: "Dedicated international student office to help with visa, housing, and integration"
    },
    {
      icon: BookOpen,
      title: "English Support",
      description: "ESL programs and language support services for non-native speakers"
    }
  ];

  return (
    <section className="py-20 bg-background2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              International Students Welcome
            </h2>
            <p className="text-lg text-text2 mb-8">
              Adeyemi University is proud to welcome students from around the world. Our diverse 
              campus community enriches the learning experience for everyone and prepares students 
              for success in an interconnected global society.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <InternationalBenefit key={index} {...benefit} />
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-primary text-on-brand font-semibold rounded-lg hover:bg-primary-hover transition-all">
                International Admissions
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-on-brand transition-all">
                Schedule a Call
              </button>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=800&fit=crop"
              alt="International Students"
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-accent rounded-lg p-6 shadow-xl">
              <p className="text-5xl font-bold text-primary mb-2">50+</p>
              <p className="text-primary font-semibold">Countries Represented</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InternationalBenefit = ({ icon: Icon, title, description }) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="text-primary" size={24} />
      </div>
    </div>
    <div>
      <h3 className="font-bold text-primary mb-1">{title}</h3>
      <p className="text-text2 text-sm">{description}</p>
    </div>
  </div>
);

// Partners and Affiliations Section Component
const PartnersSection = () => {
  const partners = [
    "Harvard University", "MIT", "Stanford", "Oxford", "Cambridge",
    "UNESCO", "World Bank", "Microsoft", "Google", "IBM",
    "Johnson & Johnson", "Pfizer", "Shell", "Chevron", "Amazon"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Partners & Affiliations
          </h2>
          <p className="text-lg text-text2 max-w-3xl mx-auto">
            We collaborate with leading institutions and organizations worldwide to provide 
            exceptional opportunities for our students and faculty
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-8 items-center">
          {partners.map((partner, index) => (
            <PartnerLogo key={index} name={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnerLogo = ({ name }) => (
  <div className="bg-surface rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow border border-border flex items-center justify-center h-24">
    <p className="text-text2 font-semibold text-center text-sm">{name}</p>
  </div>
);

// Call to Action Section Component
const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary-hover to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-warning rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-on-brand mb-6">
            Your Future Starts Here
          </h2>
          <p className="text-xl md:text-2xl text-on-brand/90 mb-8 max-w-3xl mx-auto">
            Join thousands of students who are transforming their lives through education at 
            Adeyemi University. Take the first step towards your dream career today.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <button className="px-10 py-5 bg-accent text-primary font-bold text-lg rounded-lg hover:bg-warning transition-all shadow-2xl flex items-center space-x-3">
              <span>Apply Now</span>
              <ArrowRight size={24} />
            </button>
            <button className="px-10 py-5 bg-surface text-primary font-bold text-lg rounded-lg hover:bg-surface-elevated transition-all shadow-2xl">
              Schedule Campus Visit
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <CTAFeature
              icon={CheckCircle}
              text="No Application Fee"
            />
            <CTAFeature
              icon={Clock}
              text="Rolling Admissions"
            />
            <CTAFeature
              icon={Award}
              text="Scholarships Available"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CTAFeature = ({ icon: Icon, text }) => (
  <div className="flex items-center justify-center space-x-3 text-on-brand">
    <Icon size={24} className="text-accent" />
    <span className="font-semibold">{text}</span>
  </div>
);

// Newsletter Subscription Component
const NewsletterSection = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <section className="py-16 bg-background2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-2xl shadow-xl p-8 md:p-12 border border-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-text2">
              Subscribe to our newsletter for the latest news, events, and opportunities at Adeyemi University
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-on-brand font-bold rounded-lg hover:bg-primary-hover transition-all whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>

          <p className="text-center text-text2 text-sm mt-6">
            By subscribing, you agree to receive emails from Adeyemi University. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

// Announcements Banner Component
const AnnouncementsBanner = () => {
  const announcements = [
    "🎓 Applications for Fall 2025 are now open!",
    "🏆 Adeyemi University ranked #1 in research output",
    "🌟 New scholarship program announced - Up to 100% tuition coverage",
    "📚 Virtual Open House - December 15th, 2025"
  ];

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-accent text-primary py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4">
          <span className="font-bold">📢 ANNOUNCEMENT:</span>
          <div className="relative h-6 flex-1 max-w-3xl">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentAnnouncement ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-center font-semibold">{announcement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Accreditations Component
const AccreditationsSection = () => {
  const accreditations = [
    {
      name: "National Universities Commission",
      acronym: "NUC",
      description: "Fully accredited by Nigeria's regulatory body for universities"
    },
    {
      name: "Association of African Universities",
      acronym: "AAU",
      description: "Member institution of the premier association of African universities"
    },
    {
      name: "International Association of Universities",
      acronym: "IAU",
      description: "Recognized globally for academic excellence and quality standards"
    },
    {
      name: "Association of Commonwealth Universities",
      acronym: "ACU",
      description: "Part of the world's first and oldest international university network"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Accreditations & Memberships
          </h2>
          <p className="text-lg text-text2 max-w-3xl mx-auto">
            Our commitment to excellence is recognized by leading educational bodies worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accreditations.map((accreditation, index) => (
            <AccreditationCard key={index} {...accreditation} />
          ))}
        </div>
      </div>
    </section>
  );
};
interface GoogleMapEmbedProps {
  /** The Google Maps embed URL (copy from "Share → Embed a map" on Google Maps) */
  src?: string;

  /** Height of the map (default: 380px) */
  height?: string | number;

  /** Optional width (default: 100%) */
  width?: string | number;

  /** Border width for iframe (default: 0) */
  border?: string | number;

  /** Optional marquee text below the map */
  marqueeText?: string;

  /** Marquee text color */
  marqueeColor?: string;

  /** Font size for marquee text */
  marqueeFontSize?: string | number;
}

/**
 * GoogleMapEmbed
 * A responsive Google Maps iframe with optional marquee text.
 */
const GoogleMapEmbed: React.FC<GoogleMapEmbedProps> = ({
  src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.123456789012!2d4.8136234!3d7.0733019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10386328add66a6f%3A0x27f15847046d73ba!2sAdeyemi%20Federal%20University%20of%20Education!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng",
  height = "380px",
  width = "100%",
  border = 0,
  marqueeText = "Welcome to Adeyemi Federal University of Education, Ondo.!",
  marqueeColor = "#ae2c2c",
  marqueeFontSize = "30px",
}) => {
  return (
    <div
      className="gdlr-core-wp-google-map-plugin-item gdlr-core-item-pdlr gdlr-core-item-pdb"
      style={{ paddingBottom: 0 }}
    >
      <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
        <iframe
          src={src}
          style={{
            width,
            height,
            border: `${border}px solid transparent`,
          }}
          loading="lazy"
          allowFullScreen
        />
        <div
          style={{
            position: "absolute",
            width: "80%",
            bottom: "20px",
            left: 0,
            right: 0,
            margin: "0 auto",
            color: "#000",
          }}
        />
        <style>{`#gmap_canvas img{max-width:none!important;background:none!important}`}</style>
      </div>

      {/* Optional Marquee */}
      {marqueeText && (
        <div style={{ marginTop: 10, padding: 5 }}>
          <marquee
            behavior="scroll"
            direction="left"
            style={{
              color: marqueeColor,
              fontWeight: 600,
              fontSize: marqueeFontSize,
            }}
          >
            {marqueeText}
          </marquee>
        </div>
      )}
    </div>
  );
};



const AccreditationCard = ({ name, acronym, description }) => (
  <div className="bg-surface rounded-lg shadow-lg p-6 border border-border hover-lift text-center">
    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-2xl font-bold text-primary">{acronym}</span>
    </div>
    <h3 className="font-bold text-primary mb-2">{name}</h3>
    <p className="text-text2 text-sm">{description}</p>
  </div>
);

// Main App Component
const AdeyemiUniversityWebsite = () => {
  return (
    <div className="scroll-smooth">
      <AnnouncementsBanner />
      <Navigation />
      <HeroSection />
      <QuickStatsBanner />
      <AboutSection />
      <ProgramsSection />
      <AdmissionsSection />
      <CampusLifeSection />
      <ResearchSection />
      <VirtualTourSection />
      <InternationalSection />
      <TestimonialsSection />
      <NewsEventsSection />
      <AccreditationsSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
      <ContactSection />
      <GoogleMapEmbed />
      <Footer />
    </div>
  );
};

export default AdeyemiUniversityWebsite;