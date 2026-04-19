import React from "react";
import { Zap, Mail, Linkedin, Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-primary/10 rounded-[100%] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-white">
                <Zap className="w-6 h-6" fill="currentColor" />
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight">SinTech</span>
            </div>
            <p className="text-foreground/60 mb-6 max-w-sm">
              Tech is the Solution. We build scalable software, stunning designs, and powerful digital experiences for forward-thinking brands.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#about" className="text-foreground/60 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#team" className="text-foreground/60 hover:text-primary transition-colors">Team</a></li>
              <li><a href="#contact" className="text-foreground/60 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-4">
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">Software Development</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">Web Development</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">Mobile Apps</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">QA & Testing</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">Research & Data</a></li>
              <li><a href="#services" className="text-foreground/60 hover:text-primary transition-colors">UI/UX Design</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-lg mb-6">Connect</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:sintech11395@gmail.com" className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
                sintech11395@gmail.com
              </a>
              <div className="flex gap-4 mt-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-white transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} SinTech. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
