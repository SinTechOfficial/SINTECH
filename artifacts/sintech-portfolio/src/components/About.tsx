import React from "react";
import { motion } from "framer-motion";
import { Zap, HeartHandshake, Award } from "lucide-react";

export function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Column */}
          <motion.div variants={itemVariants} className="relative">
            <div className="bg-card border border-white/5 p-8 md:p-10 rounded-3xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on Excellence. Driven by Innovation.</h2>
              <p className="text-foreground/70 text-lg leading-relaxed mb-8">
                Based in Dhaka, SinTech is a premier technology partner delivering end-to-end software, web, mobile, and design services worldwide. We believe that technology is the solution to complex business challenges.
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Our Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Flutter', 'Python', 'TypeScript', 'Next.js', 'AWS', 'Figma'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary-foreground text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm font-medium text-white/80">Client Focused</div>
                </div>
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl -z-10" />
          </motion.div>

          {/* Right Column */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <div className="flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent mt-1">
                <Zap className="w-6 h-6" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-foreground/60 leading-relaxed">
                  We embrace cutting-edge technologies to deliver forward-thinking solutions that keep you ahead of the curve.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent mt-1">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Partnership</h3>
                <p className="text-foreground/60 leading-relaxed">
                  We work closely with clients to ensure their vision becomes reality, functioning as an extension of your team.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-accent mt-1">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality</h3>
                <p className="text-foreground/60 leading-relaxed">
                  Every line of code, every pixel, crafted with precision and care to ensure flawless performance and aesthetics.
                </p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
