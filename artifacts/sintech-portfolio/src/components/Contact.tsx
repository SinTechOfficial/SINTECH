import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Globe, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg text-foreground/70 mb-12 max-w-md">
              Ready to start your next project? Reach out to us. Our team is ready to provide the technical solutions you need.
            </p>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 bg-card/50 border border-white/5 p-4 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-accent rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50 font-medium mb-1">Email Us</p>
                  <a href="mailto:sintech11395@gmail.com" className="text-lg font-semibold hover:text-accent transition-colors">sintech11395@gmail.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-card/50 border border-white/5 p-4 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-accent rounded-lg flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50 font-medium mb-1">Website</p>
                  <a href="#" className="text-lg font-semibold hover:text-accent transition-colors">sintech.com</a>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-card/50 border border-white/5 p-4 rounded-xl">
                <div className="w-12 h-12 bg-primary/20 text-accent rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50 font-medium mb-1">Location</p>
                  <p className="text-lg font-semibold">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column (Form) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Full Name</label>
                  <Input placeholder="John Doe" className="bg-background/50 border-white/10 focus-visible:ring-primary focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(30,74,184,0.2)] h-12 transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="bg-background/50 border-white/10 focus-visible:ring-primary focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(30,74,184,0.2)] h-12 transition-all" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Service Interested In</label>
                  <select defaultValue="" className="flex h-12 w-full items-center justify-between rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(30,74,184,0.2)] focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all">
                    <option value="" disabled className="bg-card text-foreground">Select a service</option>
                    <option value="software" className="bg-card text-foreground">Software Development</option>
                    <option value="web" className="bg-card text-foreground">Website Development</option>
                    <option value="mobile" className="bg-card text-foreground">Mobile App Development</option>
                    <option value="qa" className="bg-card text-foreground">QA & Testing</option>
                    <option value="research" className="bg-card text-foreground">Research & Data Analysis</option>
                    <option value="design" className="bg-card text-foreground">UI/UX & Graphic Design</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Message</label>
                  <Textarea placeholder="Tell us about your project..." className="bg-background/50 border-white/10 focus-visible:ring-primary focus:border-primary/50 focus:shadow-[0_0_0_3px_rgba(30,74,184,0.2)] min-h-[120px] resize-none transition-all" />
                </div>
                
                <Button className="w-full h-14 mt-4 bg-primary hover:bg-accent text-white font-bold text-lg rounded-xl transition-all duration-300">
                  <Send className="w-5 h-5 mr-2" />
                  Submit Request
                </Button>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
