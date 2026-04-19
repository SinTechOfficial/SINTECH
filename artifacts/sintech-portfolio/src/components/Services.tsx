import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    icon: "💻",
    title: "Software Development",
    description: "Custom software solutions built for scale and performance. We tackle complex problems with elegant architecture."
  },
  {
    icon: "🌐",
    title: "Website Development",
    description: "Beautiful, responsive websites that drive results. From landing pages to complex web applications."
  },
  {
    icon: "📱",
    title: "Mobile App Development",
    description: "iOS and Android apps crafted for seamless user experience with native performance and feel."
  },
  {
    icon: "🔍",
    title: "QA & Testing",
    description: "Rigorous quality assurance to ensure flawless performance across all devices and scenarios."
  },
  {
    icon: "📊",
    title: "Research & Data Analysis",
    description: "Data-driven insights to power smarter decisions and uncover hidden opportunities."
  },
  {
    icon: "🎨",
    title: "UI/UX & Graphic Design",
    description: "Pixel-perfect designs that engage and convert, focusing on user journeys and brand identity."
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What We Offer</h2>
            <p className="text-lg text-foreground/70">
              Comprehensive digital solutions tailored to elevate your business in a technology-driven world.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-card border border-white/5 rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Animated Top Border */}
              <div className="absolute top-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 ease-out" />
              
              <div className="text-4xl mb-6">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-foreground/60 mb-8 leading-relaxed">
                {service.description}
              </p>
              
              <a href="#contact" className="inline-flex items-center text-accent font-medium hover:text-white transition-colors group-hover:gap-2">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
