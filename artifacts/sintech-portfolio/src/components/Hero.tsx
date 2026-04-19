import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

const FloatingShape = ({ 
  type, 
  size, 
  color, 
  initialPosition, 
  depth, 
  duration,
  delay 
}: { 
  type: "browser" | "code" | "phone" | "cursor" | "terminal"; 
  size: number; 
  color: string; 
  initialPosition: { x: string; y: string }; 
  depth: number;
  duration: number;
  delay: number;
}) => {
  const getShape = () => {
    switch (type) {
      case "browser":
        return (
          <svg width={size} height={size} viewBox="0 0 80 60" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="78" height="58" rx="6"></rect>
            <path d="M1 17h78M1 17a6 6 0 0 0 6-6V1a6 6 0 0 0-6 6z" stroke="none" fill="currentColor" opacity="0.1" />
            <line x1="1" y1="17" x2="79" y2="17"></line>
            <circle cx="12" cy="9" r="3"></circle>
            <circle cx="22" cy="9" r="3"></circle>
            <circle cx="32" cy="9" r="3"></circle>
            <rect x="40" y="5" width="30" height="8" rx="3"></rect>
            <line x1="8" y1="28" x2="52" y2="28"></line>
            <line x1="8" y1="36" x2="52" y2="36"></line>
            <line x1="8" y1="44" x2="52" y2="44"></line>
            <rect x="56" y="22" width="16" height="28"></rect>
          </svg>
        );
      case "code":
        return (
          <svg width={size} height={size} viewBox="0 0 60 40" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18,5 8,20 18,35"></polyline>
            <polyline points="42,5 52,20 42,35"></polyline>
            <line x1="34" y1="5" x2="26" y2="35"></line>
          </svg>
        );
      case "phone":
        return (
          <svg width={size} height={size} viewBox="0 0 40 72" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="36" height="68" rx="6"></rect>
            <circle cx="20" cy="63" r="4"></circle>
            <rect x="6" y="12" width="28" height="44" rx="2"></rect>
            <circle cx="20" cy="7" r="2"></circle>
          </svg>
        );
      case "cursor":
        return (
          <svg width={size} height={size} viewBox="0 0 30 36" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="4,2 4,28 10,22 16,34 20,32 14,20 22,20"></polygon>
          </svg>
        );
      case "terminal":
        return (
          <svg width={size} height={size} viewBox="0 0 80 56" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="1" width="78" height="54" rx="4"></rect>
            <line x1="1" y1="15" x2="79" y2="15"></line>
            <circle cx="10" cy="8" r="3"></circle>
            <circle cx="18" cy="8" r="3"></circle>
            <circle cx="26" cy="8" r="3"></circle>
            <polyline points="8,26 12,28 8,30"></polyline>
            <line x1="16" y1="28" x2="50" y2="28"></line>
            <line x1="8" y1="38" x2="35" y2="38"></line>
            <line x1="8" y1="48" x2="25" y2="48"></line>
            <rect x="28" y="45" width="6" height="6" fill={color} opacity="0.7"></rect>
          </svg>
        );
    }
  };

  return (
    <motion.div
      className="absolute hidden md:block"
      style={{
        left: initialPosition.x,
        top: initialPosition.y,
        translateZ: depth,
        filter: `blur(${Math.max(0, (depth * -1) / 100)}px)`,
        opacity: Math.max(0.1, 1 - (Math.abs(depth) / 800)),
      }}
      animate={{
        y: [0, -30, 0],
        rotateX: [0, 180, 360],
        rotateY: [0, 360, 0],
        rotateZ: [0, 180, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
    >
      {getShape()}
    </motion.div>
  );
};

const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 pointer-events-none perspective-[1000px] overflow-hidden flex items-end justify-center">
      <motion.div 
        className="w-[300vw] h-[100vh] bottom-[-20vh] absolute origin-bottom"
        style={{
          backgroundSize: '60px 60px',
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to top, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          rotateX: 75,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '0px 60px']
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "linear"
        }}
      />
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

const StatCard = ({ stat, mouseX, mouseY }: { stat: { value: string; label: string }; mouseX: any; mouseY: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    x.set((mouseXPos / width) - 0.5);
    y.set((mouseYPos / height) - 0.5);
  };

  const handleMouseEnter = () => setHovering(true);
  const handleMouseLeave = () => {
    setHovering(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: hovering ? rotateX : 0,
        rotateY: hovering ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className="relative bg-card/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center transition-all duration-500 ease-out group"
    >
      <div 
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(79,142,247,0.1) 0%, transparent 60%)`
        }}
      />
      <motion.div style={{ translateZ: 40 }} className="relative z-10 flex flex-col items-center">
        <h3 className="text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 mb-2 drop-shadow-lg">{stat.value}</h3>
        <p className="text-sm font-medium text-accent uppercase tracking-widest">{stat.label}</p>
      </motion.div>
    </motion.div>
  );
};

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  const xForeground = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
  const yForeground = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);
  
  const xBackground = useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]);
  const yBackground = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const titleText = "Transforming Ideas Into";
  const titleWords = titleText.split(" ");

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-24 pb-16 perspective-[1200px]"
    >
      {/* Dynamic Animated Orbs */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none opacity-40 mix-blend-screen"
        style={{ x: xBackground, y: yBackground, background: 'radial-gradient(circle, rgba(30,74,184,0.8) 0%, rgba(0,0,0,0) 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[120px] pointer-events-none opacity-30 mix-blend-screen"
        style={{ x: xForeground, y: yForeground, background: 'radial-gradient(circle, rgba(79,142,247,0.6) 0%, rgba(0,0,0,0) 70%)' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <AnimatedGrid />

      {/* Floating 3D Shapes */}
      <div className="absolute inset-0 pointer-events-none transform-style-3d">
        <FloatingShape type="browser" size={80} color="rgba(79,142,247,0.3)" initialPosition={{ x: "15%", y: "25%" }} depth={-200} duration={18} delay={0} />
        <FloatingShape type="code" size={60} color="rgba(255,255,255,0.2)" initialPosition={{ x: "82%", y: "18%" }} depth={100} duration={22} delay={2} />
        <FloatingShape type="phone" size={56} color="rgba(255,255,255,0.15)" initialPosition={{ x: "87%", y: "65%" }} depth={-300} duration={16} delay={1} />
        <FloatingShape type="cursor" size={44} color="rgba(79,142,247,0.4)" initialPosition={{ x: "8%", y: "70%" }} depth={50} duration={14} delay={3} />
        <FloatingShape type="terminal" size={72} color="rgba(255,255,255,0.12)" initialPosition={{ x: "52%", y: "10%" }} depth={-400} duration={20} delay={5} />
      </div>

      <motion.div 
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ translateZ: 60 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_30px_rgba(79,142,247,0.15)]"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
          <span className="text-sm font-semibold tracking-wide text-white uppercase">Innovating the Future</span>
        </motion.div>

        <motion.h1 
          style={{ translateZ: 100 }}
          className="text-5xl md:text-7xl lg:text-[6rem] font-bold tracking-tighter mb-6 max-w-5xl leading-[1.1] transform-style-3d"
        >
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block transform-origin-bottom"
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.span 
            initial={{ opacity: 0, y: 100, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-white drop-shadow-[0_0_40px_rgba(79,142,247,0.4)]"
          >
            Digital Reality
          </motion.span>
        </motion.h1>

        <motion.p 
          style={{ translateZ: 80 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-foreground/70 max-w-3xl mb-12 leading-relaxed"
        >
          <strong className="text-white font-semibold">Tech is the Solution</strong> — We build scalable software, stunning designs, and powerful digital experiences.
        </motion.p>

        <motion.div 
          style={{ translateZ: 120 }}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Button 
            size="lg"
            onClick={() => scrollTo("services")}
            className="group relative bg-primary hover:bg-accent text-white font-semibold px-10 h-16 rounded-full shadow-[0_0_40px_rgba(30,74,184,0.6)] hover:shadow-[0_0_60px_rgba(79,142,247,0.8)] transition-all duration-500 w-full sm:w-auto text-lg overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
            <span className="relative z-10 flex items-center">
              Explore Services
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={() => scrollTo("contact")}
            className="relative border-white/20 hover:bg-white/10 hover:border-white/40 text-white font-semibold px-10 h-16 rounded-full transition-all duration-500 w-full sm:w-auto text-lg backdrop-blur-sm"
          >
            Start a Project
          </Button>
        </motion.div>

        {/* Floating 3D Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ translateZ: 50 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 mt-24 w-full max-w-5xl"
        >
          {[
            { value: "15+", label: "Team Members" },
            { value: "7+", label: "Services" },
            { value: "100%", label: "Client Focused" },
          ].map((stat, i) => (
            <StatCard key={i} stat={stat} mouseX={mouseX} mouseY={mouseY} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
