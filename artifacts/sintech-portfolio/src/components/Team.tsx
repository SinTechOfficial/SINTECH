import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const getBadgeColor = (dept: string) => {
  switch (dept) {
    case 'Engineering': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Design': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Management': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'QA': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Research': return 'bg-teal-500/20 text-teal-400 border-teal-500/30';
    case 'HR': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
    default: return 'bg-primary/20 text-primary border-primary/30';
  }
};

const founders = [
  { name: "Mostafic Yellahy Najid", role: "Founder & Lead Architect", img: "/images/Nahid.jpg", quote: "Architecting the future of scalable systems." },
  { name: "Iftikher Rahman Ifti", role: "Co-Founder & Management Head", img: "/images/iFTI.png", quote: "Driving operational excellence and growth." },
  { name: "Samir Hossain Sobuj", role: "Co-Founder & Marketing Head", img: "/images/Sobuj.png", quote: "Connecting our vision with global clients." }
];

const team = [
  { name: "Monira Islam Eva", role: "General Manager", dept: "Management", img: "/images/Eva.jpg" },
  { name: "Enamul Hakim Khan", role: "Lead Developer", dept: "Engineering", img: "/images/fAHIM.png" },
  { name: "Ashraful Islam", role: "Lead Designer & QA", dept: "Design", img: "/images/Ashraful.png" },
  { name: "Md Mahbul Islam", role: "Coder", dept: "Engineering", img: "/images/Mahbub.jpg" },
  { name: "Shahed Ahmed Sium", role: "Coder", dept: "Engineering", img: "/images/Sium.png" },
  { name: "Rifat Ahmed Ratul", role: "QA Engineer", dept: "QA", img: "/images/Ratul.jpg" },
  { name: "Ashraful Haque Akash", role: "Researcher", dept: "Research", img: "/images/Akash.png" },
  { name: "Md Emon Hossain", role: "Researcher", dept: "Research", img: "/images/Emon.jpg" },
  { name: "Farhan Alam", role: "Graphics Designer", dept: "Design", img: "/images/Farhan.jpg" },
  { name: "Mairea", role: "Designer", dept: "Design", img: "/images/Mariea.png" },
  { name: "Tahrim Maria", role: "Designer", dept: "Design", img: "/images/Asha.png" },
  { name: "Tanzina Akter Tanni", role: "HR", dept: "HR", img: "/images/tANNI.png" }
];

export function Team() {
  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              The brilliant minds behind SinTech. A collective of passionate engineers, designers, and strategists.
            </p>
          </motion.div>
        </div>

        {/* Founders Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {founders.map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 flex items-center gap-6 group hover:border-primary/50 transition-colors"
            >
              <Avatar className="w-20 h-20 border-2 border-primary/50 shadow-lg shrink-0">
                <AvatarImage src={person.img} className="object-cover" />
                <AvatarFallback className="text-xl bg-primary text-white">{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{person.name}</h3>
                <p className="text-sm font-medium text-primary mb-2">{person.role}</p>
                <p className="text-xs text-foreground/60 italic border-l-2 border-white/10 pl-2">"{person.quote}"</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {team.map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-white/5 rounded-xl p-6 flex flex-col items-center text-center group hover:bg-white/5 transition-colors"
            >
              <Avatar className="w-24 h-24 mb-4 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                <AvatarImage src={person.img} className="object-cover" />
                <AvatarFallback className="text-2xl bg-card text-foreground">{person.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h4 className="font-bold text-sm mb-1">{person.name}</h4>
              <p className="text-xs text-foreground/60 mb-3">{person.role}</p>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md border ${getBadgeColor(person.dept)}`}>
                {person.dept}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
