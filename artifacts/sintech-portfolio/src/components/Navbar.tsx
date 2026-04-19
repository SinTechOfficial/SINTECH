import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md py-3 shadow-lg border-b border-white/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex items-center gap-2 group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Zap className="w-6 h-6" fill="currentColor" />
            <div className="absolute inset-0 bg-primary rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight">SinTech</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollTo("about")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About</button>
          <button onClick={() => scrollTo("services")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Services</button>
          <button onClick={() => scrollTo("team")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Team</button>
          <button onClick={() => scrollTo("contact")} className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</button>
          <Button 
            onClick={() => scrollTo("contact")}
            className="bg-primary hover:bg-accent text-white font-medium px-6 rounded-full shadow-[0_0_15px_rgba(30,74,184,0.5)] hover:shadow-[0_0_25px_rgba(79,142,247,0.6)] transition-all duration-300"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-foreground/80 hover:text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-xl md:hidden flex flex-col p-6 gap-4"
          >
            <button onClick={() => scrollTo("about")} className="text-lg font-medium text-left py-2 border-b border-border/50 text-foreground/80 hover:text-primary">About</button>
            <button onClick={() => scrollTo("services")} className="text-lg font-medium text-left py-2 border-b border-border/50 text-foreground/80 hover:text-primary">Services</button>
            <button onClick={() => scrollTo("team")} className="text-lg font-medium text-left py-2 border-b border-border/50 text-foreground/80 hover:text-primary">Team</button>
            <button onClick={() => scrollTo("contact")} className="text-lg font-medium text-left py-2 border-b border-border/50 text-foreground/80 hover:text-primary">Contact</button>
            <Button 
              onClick={() => scrollTo("contact")}
              className="bg-primary hover:bg-accent text-white font-medium w-full mt-4 rounded-xl"
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
