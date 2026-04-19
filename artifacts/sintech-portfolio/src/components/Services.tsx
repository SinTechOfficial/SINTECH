import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Code2, Globe, Smartphone, ShieldCheck, LineChart, Palette } from "lucide-react";

const services = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Software Development",
    shortDesc: "Custom software solutions built for scale and performance.",
    description: "End-to-end custom software engineered for performance and scale. We build everything from enterprise SaaS platforms to automation tools, using modern stacks like React, Node.js, Python, and cloud-native architectures. Every system is designed for reliability, maintainability, and growth.",
    tags: ["React", "Node.js", "Python", "AWS", "PostgreSQL"],
    number: "01"
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Website Development",
    shortDesc: "Beautiful, responsive websites that drive results.",
    description: "High-performance websites that combine stunning aesthetics with technical excellence. From marketing sites to complex web apps, we craft pixel-perfect, SEO-optimized, and accessibility-compliant digital experiences that load fast and convert visitors.",
    tags: ["Next.js", "React", "Tailwind CSS", "SEO", "CMS"],
    number: "02"
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Mobile App Development",
    shortDesc: "iOS and Android apps crafted for seamless user experience.",
    description: "Native-quality iOS and Android applications built with Flutter and React Native. We handle everything from UX wire-framing to App Store deployment — delivering smooth, intuitive mobile experiences that users love and businesses depend on.",
    tags: ["Flutter", "React Native", "iOS", "Android", "Firebase"],
    number: "03"
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "QA & Testing",
    shortDesc: "Rigorous quality assurance for flawless performance.",
    description: "Comprehensive quality assurance that catches bugs before your users do. Our QA engineers design and execute manual and automated test suites covering unit, integration, regression, and performance testing across all target environments and browsers.",
    tags: ["Selenium", "Cypress", "Jest", "Manual Testing", "CI/CD"],
    number: "04"
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: "Research & Data Analysis",
    shortDesc: "Data-driven insights to power smarter decisions.",
    description: "Transform raw data into strategic intelligence. We build data pipelines, dashboards, and analytical models that surface the insights driving smarter business decisions. From market research to predictive modeling, we make your data work harder.",
    tags: ["Python", "Power BI", "SQL", "Machine Learning", "Excel"],
    number: "05"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "UI/UX & Graphic Design",
    shortDesc: "Pixel-perfect designs that engage and convert.",
    description: "Brand identities and user experiences crafted with intention. Our designers blend aesthetics with psychology to create interfaces that feel natural and brands that resonate. We deliver everything from Figma prototypes to final production-ready assets.",
    tags: ["Figma", "Adobe XD", "Illustrator", "Motion Design", "Brand Identity"],
    number: "06"
  }
];

const ServiceCard = ({ service, index }: { service: typeof services[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 400, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // For 3D tilt
    mouseX.set((x / rect.width) - 0.5);
    mouseY.set((y / rect.height) - 0.5);

    // For glowing border effect
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-[1200px]"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className={`relative h-full rounded-3xl bg-card border border-white/5 cursor-pointer overflow-hidden transition-colors duration-500 ${isHovered ? 'bg-card/80 border-white/10' : ''}`}
      >
        {/* Glow effect tracking mouse */}
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(79,142,247,0.06), transparent 40%)`
          }}
        />

        {/* Glow border overlay */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 pointer-events-none z-20"
          style={{
            opacity: isHovered ? 1 : 0,
            padding: "1px",
            background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(79,142,247,0.5), transparent 40%)`,
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />

        <div className="p-8 sm:p-10 flex flex-col h-full relative z-10" style={{ transformStyle: "preserve-3d", translateZ: 30 }}>
          {/* Large Background Number */}
          <div 
            className="absolute top-4 right-6 text-8xl font-heading font-black text-white/[0.03] select-none pointer-events-none transition-transform duration-500"
            style={{ translateZ: isHovered ? 60 : 0 }}
          >
            {service.number}
          </div>

          <div 
            className={`w-16 h-16 rounded-2xl bg-primary/10 text-accent flex items-center justify-center mb-8 transition-transform duration-500`}
            style={{ translateZ: isHovered ? 50 : 0 }}
          >
            {service.icon}
          </div>

          <h3 
            className="text-2xl font-bold mb-4 font-heading"
            style={{ translateZ: isHovered ? 40 : 0 }}
          >
            {service.title}
          </h3>

          <div className="relative flex-1" style={{ translateZ: isHovered ? 30 : 0 }}>
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="short"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <p className="text-foreground/70 leading-relaxed mb-6">
                    {service.shortDesc}
                  </p>
                  <div className="mt-auto flex items-center text-accent text-sm font-medium group">
                    <span className="mr-2">Click to reveal details</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300" />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="long"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-foreground/80 leading-relaxed mb-6 text-sm sm:text-base">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-foreground/80">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export function Services() {
  return (
    <section id="services" className="py-32 bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[50vw] h-[400px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <span className="text-sm font-medium text-accent uppercase tracking-widest">Capabilities</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative inline-block mb-8"
          >
            <h2 className="text-5xl md:text-6xl font-bold font-heading">Our Services</h2>
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
              className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent origin-left"
            />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-foreground/70 leading-relaxed"
          >
            We deliver end-to-end digital solutions — from concept to launch and beyond. Every service is executed with precision, backed by a dedicated team of specialists.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
