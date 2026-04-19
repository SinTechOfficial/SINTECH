import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "wouter";

export function SinTechMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <path
            key={i}
            d="M 40 40 C 40 22, 55 12, 62 22 C 69 32, 62 48, 50 50 C 38 52, 28 46, 30 38 C 32 30, 42 26, 46 32"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            transform={`rotate(${deg}, 40, 40)`}
            opacity={0.85}
          />
        ))}
      </g>
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileMenuOpen(false);
    setLocation(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/92 backdrop-blur-md py-2 shadow-lg border-b border-white/5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 flex items-center justify-center text-accent group-hover:text-white transition-colors duration-300">
            <SinTechMark className="w-10 h-10" />
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-lg tracking-[0.15em] uppercase text-white">
              Sin Tech
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/50 font-medium mt-0.5">
              Tech Is Solution
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {[{id: 'about', label: 'ABOUT'}, {id: 'services', label: 'SERVICES'}, {id: 'team', label: 'TEAM'}, {id: 'contact', label: 'CONTACT'}].map(({ id, label }) => {
            const path = `/${id}`;
            const isActive = location === path;
            return (
              <Link
                key={id}
                href={path}
                className={`text-xs font-medium tracking-[0.12em] uppercase transition-colors ${isActive ? 'text-accent' : 'text-foreground/70 hover:text-accent'}`}
              >
                {label}
              </Link>
            );
          })}
          <Button
            onClick={() => handleNav("/contact")}
            className="bg-primary hover:bg-accent text-white font-medium px-6 rounded-full shadow-[0_0_15px_rgba(79,142,247,0.3)] hover:shadow-[0_0_25px_rgba(79,142,247,0.55)] transition-all duration-300 tracking-wider text-xs uppercase"
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Toggle */}
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
            {[{id: 'about', label: 'ABOUT'}, {id: 'services', label: 'SERVICES'}, {id: 'team', label: 'TEAM'}, {id: 'contact', label: 'CONTACT'}].map(({ id, label }) => {
              const path = `/${id}`;
              const isActive = location === path;
              return (
                <Link
                  key={id}
                  href={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium text-left py-2 border-b border-border/50 uppercase tracking-[0.12em] ${isActive ? 'text-accent' : 'text-foreground/80 hover:text-accent'}`}
                >
                  {label}
                </Link>
              );
            })}
            <Button
              onClick={() => handleNav("/contact")}
              className="bg-primary hover:bg-accent text-white font-medium w-full mt-4 rounded-xl tracking-wider text-xs uppercase"
            >
              Get Started
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
