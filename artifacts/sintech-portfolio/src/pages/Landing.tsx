import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Code2, Globe, Smartphone } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";

export function Landing() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Hero />
      
      {/* ServicesPreview section */}
      <section id="services-preview" className="py-24 bg-card/20 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <span className="text-sm font-bold tracking-widest text-accent uppercase bg-accent/10 px-4 py-1.5 rounded-full inline-block mb-4">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-heading">What We Build</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">End-to-end digital solutions crafted with precision</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code2 className="w-8 h-8" />,
                title: "Software Development",
                desc: "Custom enterprise software, SaaS platforms, and automation tools",
                tags: ["React", "Node.js", "Python"]
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Website Development",
                desc: "High-performance, SEO-optimized web experiences that convert",
                tags: ["Next.js", "Tailwind", "CMS"]
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile Apps",
                desc: "Native-quality iOS and Android apps with Flutter and React Native",
                tags: ["Flutter", "React Native", "Firebase"]
              }
            ].map((service, i) => (
              <div key={i} className="bg-card border border-white/5 rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-accent mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full border border-white/10">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button onClick={() => setLocation('/services')} size="lg" className="bg-primary hover:bg-accent text-white font-bold rounded-full px-8">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* WhySinTech section */}
      <section className="py-20">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "15+", label: "Team Members" },
              { num: "6", label: "Core Services" },
              { num: "100%", label: "Client Focus" },
              { num: "Dhaka", label: "Based In" },
            ].map((stat, i) => (
              <div key={i} className="bg-card/50 border border-white/5 rounded-2xl p-8 text-center hover:shadow-[0_0_30px_rgba(79,142,247,0.15)] transition-all duration-300">
                <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-accent mb-2 drop-shadow-lg">{stat.num}</div>
                <div className="text-foreground/60 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTABanner section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">Ready to Build Something Extraordinary?</h2>
            <p className="text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">Let's turn your vision into reality. Our team is ready to deliver.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => setLocation('/contact')} size="lg" className="bg-primary hover:bg-accent text-white font-bold h-14 px-8 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(79,142,247,0.5)] transition-all w-full sm:w-auto text-lg">
                Start a Project
              </Button>
              <Button onClick={() => setLocation('/services')} variant="outline" size="lg" className="border-white/20 hover:bg-white/10 hover:border-white/40 h-14 px-8 rounded-full transition-all w-full sm:w-auto text-lg backdrop-blur-sm font-bold text-white">
                Explore Our Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
