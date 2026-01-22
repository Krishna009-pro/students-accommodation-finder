import { motion } from "framer-motion";
import { ArrowRight, Shield, Star, Users, Zap, Building2, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CollegeSearch } from "@/components/CollegeSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import heroImage from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Shield,
    title: "Verified Properties",
    description: "Every listing is verified by our team for your safety",
  },
  {
    icon: Star,
    title: "Real Reviews",
    description: "Honest reviews from students like you",
  },
  {
    icon: Clock,
    title: "Commute Insights",
    description: "Know exactly how far you are from campus",
  },
  {
    icon: Zap,
    title: "AI Recommendations",
    description: "Smart matching based on your preferences",
  },
];

const stats = [
  { value: "10K+", label: "Properties" },
  { value: "50K+", label: "Students" },
  { value: "500+", label: "Colleges" },
  { value: "4.8", label: "Avg Rating" },
];

const Index = () => {
  const { data: properties = [] } = useProperties();
  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Student accommodation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Student Housing</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect{" "}
              <span className="text-gradient-primary">Student Home</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Discover verified accommodations near your college. Compare prices, read reviews,
              and find your ideal place to live and study.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <CollegeSearch variant="hero" />
            </motion.div>




          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-4 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Students Love <span className="text-gradient-primary">Student Haven</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We make finding student accommodation easy, safe, and stress-free
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Properties</h2>
              <p className="text-muted-foreground">Handpicked accommodations for you</p>
            </div>
            <Link to="/search">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Join 50,000+ Students</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your New Home?
            </h2>

            <p className="text-muted-foreground mb-8 text-lg">
              Sign up today and get personalized recommendations, price alerts,
              and exclusive deals on student accommodations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button variant="hero" size="xl" className="gap-2">
                  <Users className="w-5 h-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/search">
                <Button variant="outline" size="xl" className="gap-2">
                  <Building2 className="w-5 h-5" />
                  Browse Properties
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="StudentHaven Logo" className="w-8 h-8 rounded-lg" />
                <span className="font-bold text-xl">StudentHaven</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Making student housing simple, safe, and stress-free.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/search" className="hover:text-foreground transition-colors">Search Properties</Link></li>
                <li><Link to="/compare" className="hover:text-foreground transition-colors">Compare</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Safety Tips</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 Student Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
