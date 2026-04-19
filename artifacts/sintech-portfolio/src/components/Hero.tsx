import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export function Hero() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
        >
          <span className="text-lg">🚀</span>
          <span className="text-sm font-medium text-accent">Innovating the Future</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-5xl"
        >
          Transforming Ideas Into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-300">
            Digital Reality
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-10 leading-relaxed"
        >
          <strong className="text-foreground">Tech is the Solution</strong> — We build scalable software, stunning designs, and powerful digital experiences.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Button 
            size="lg"
            onClick={() => scrollTo("services")}
            className="bg-primary hover:bg-accent text-white font-medium px-8 h-14 rounded-full shadow-[0_0_20px_rgba(30,74,184,0.5)] hover:shadow-[0_0_30px_rgba(79,142,247,0.6)] transition-all duration-300 w-full sm:w-auto text-base"
          >
            Explore Services
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => scrollTo("contact")}
            className="border-white/20 hover:bg-white/5 text-white font-medium px-8 h-14 rounded-full transition-all duration-300 w-full sm:w-auto text-base group"
          >
            Start a Project
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full max-w-4xl"
        >
          {[
            { value: "15+", label: "Team Members" },
            { value: "7+", label: "Services" },
            { value: "100%", label: "Client Focused" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-card/50 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center transform hover:-translate-y-2 transition-transform duration-300"
            >
              <h3 className="text-4xl font-heading font-bold text-accent mb-2">{stat.value}</h3>
              <p className="text-sm font-medium text-foreground/60 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
