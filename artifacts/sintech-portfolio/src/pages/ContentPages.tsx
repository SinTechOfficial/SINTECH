import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, BarChart3, Check, Cloud, Code2, Database, Layout, Megaphone, PenTool, Search, ShieldCheck, Smartphone, TrendingUp, Users, Wrench } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { PageIntro } from "../components/PageIntro";
import { PageMeta } from "../components/PageMeta";
import { site } from "../data/site";
import { services } from "../data/services";
import { processSteps } from "../data/process";
import { faqs } from "../data/faq";
import { projects } from "../data/projects";
import { testimonials } from "../data/testimonials";
import { posts } from "../data/posts";
import { founders, team } from "../data/team";
import { track } from "../lib/analytics";

const orgJsonLd={ "@context":"https://schema.org","@type":"Organization",name:"SinTech",email:site.contactEmail,url:site.domain||undefined };
const faqJsonLd={ "@context":"https://schema.org","@type":"FAQPage",mainEntity:faqs.map(f=>({"@type":"Question",name:f.question,acceptedAnswer:{"@type":"Answer",text:f.answer}})) };

const dockServices = [
  { label: "Software Dev", href: "/services/software-development", icon: <Code2 size={20} /> },
  { label: "Research & Innovation", href: "/services/research-data-analysis", icon: <Search size={20} /> },
  { label: "UI/UX & Design", href: "/services/ui-ux-graphic-design", icon: <PenTool size={20} /> },
  { label: "Data Analysis", href: "/services/research-data-analysis", icon: <BarChart3 size={20} /> },
  { label: "Digital Marketing", href: "/services/website-development", icon: <Megaphone size={20} /> },
  { label: "Cybersecurity", href: "/security", icon: <ShieldCheck size={20} /> },
  { label: "SEO & Growth", href: "/services/website-development", icon: <TrendingUp size={20} /> },
];

function PersonImage({photo,name,role,size}:{photo:string;name:string;role:string;size:number}) {
  const [failed,setFailed]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(part=>part[0]).join("");
  const photoUrl=`${import.meta.env.BASE_URL}${photo.replace(/^\/+/,"")}`;
  return failed
    ? <span role="img" aria-label={`Portrait of ${name}, ${role}`} className="grid shrink-0 place-items-center rounded-full border border-white/10 bg-[#15294b] font-heading font-bold text-[#a9c7ff]" style={{width:size,height:size}}>{initials}</span>
    : <span className="shrink-0 overflow-hidden rounded-full bg-[#15294b] bg-cover bg-center" style={{width:size,height:size,backgroundImage:`url("${photoUrl}-blur.webp")`}}><img src={`${photoUrl}-320.webp`} srcSet={`${photoUrl}-320.webp 320w, ${photoUrl}-640.webp 640w`} sizes={`${size}px`} width={size} height={size} loading="lazy" decoding="async" alt={`Portrait of ${name}, ${role}`} className={`h-full w-full rounded-full object-cover transition-opacity duration-200 ${loaded?"opacity-100":"opacity-0"}`} onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)}/></span>;
}
function Cta({title="Have a project in mind?",copy="Share what you are working on and the kind of support you need.",location="page"}:{title?:string;copy?:string;location?:string}) {
  return <section className="section-pad"><div className="container-wide rounded-3xl border border-sky-500/40 bg-[linear-gradient(135deg,#0d1d3b_0%,#091428_50%,#0b1a38_100%)] p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_30px_rgba(14,165,233,0.18)]"><div className="max-w-3xl"><p className="eyebrow">Next step</p><h2 className="mt-3 text-3xl font-bold md:text-5xl text-white">{title}</h2><p className="mt-4 text-lg text-slate-300">{copy}</p><Link href="/contact" onClick={()=>track("cta_click",{location})} className="btn-lets-build mt-8 group"><span className="text-base px-2">Let's Build Together</span><span className="btn-arrow-badge"><ArrowRight size={16}/></span></Link></div></div></section>;
}
const technologyGroups = [
  {label:"Frontend",items:["React","Next.js","Tailwind CSS"]},{label:"Backend",items:["Node.js","Python","AWS","PostgreSQL"]},
  {label:"Mobile",items:["Flutter","React Native","Firebase"]},{label:"Data",items:["Python","Power BI","SQL","Machine Learning","Excel"]},
  {label:"QA",items:["Selenium","Cypress","Jest"]},{label:"Design",items:["Figma","Adobe XD","Illustrator","Motion Design"]},
];
const engagements=[
  {title:"Fixed-scope project",for:"A defined outcome with agreed boundaries.",includes:"A scope, deliverables, and review points agreed before work begins.",how:"Plan the work against the brief and confirm what is in and out of scope."},
  {title:"Dedicated team",for:"Ongoing product work that needs a consistent team.",includes:"A team arrangement shaped around the work and skills required.",how:"Discuss responsibilities, collaboration, and priorities before starting."},
  {title:"Ongoing support",for:"Teams planning follow-on improvements or maintenance.",includes:"Support coverage and tasks agreed for the engagement.",how:"Set practical expectations and a working rhythm together."},
];

export function HomePage(){
  const publishedProjects=projects.filter(x=>x.published), publishedTestimonials=testimonials.filter(x=>x.published), publishedPosts=posts.filter(x=>x.published);
  return <>
    <PageMeta title="Software, web and mobile development" description={site.metaDescription} jsonLd={[orgJsonLd,faqJsonLd]}/>
    
    {/* 3D Concept Landing Hero */}
    <section className="relative overflow-hidden pt-6 pb-14 lg:pt-10 lg:pb-20">
      {/* Background Atmosphere: Radial Glows & Flowing Neon Light Waves */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-12%] left-1/2 -translate-x-1/2 h-[520px] w-[950px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(14,165,233,0.18)_0%,_rgba(59,130,246,0.08)_50%,_transparent_75%)] blur-3xl" />
        <div className="absolute top-[12%] right-[-6%] h-[550px] w-[650px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.22)_0%,_rgba(99,102,241,0.12)_45%,_transparent_75%)] blur-3xl" />
        <div className="absolute top-[22%] left-[-8%] h-[450px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.16)_0%,_rgba(14,165,233,0.1)_50%,_transparent_75%)] blur-3xl" />

        {/* Animated Cyber Waves / Light Ribbons sweeping across the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden opacity-90">
          <svg className="w-full h-full min-w-[1200px] animate-ribbon" viewBox="0 0 1440 280" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="neonRibbon1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                <stop offset="25%" stopColor="#00f0ff" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="85%" stopColor="#8b5cf6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="neonRibbon2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="35%" stopColor="#00e5ff" stopOpacity="0.75" />
                <stop offset="70%" stopColor="#6366f1" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,140 C320,60 520,220 860,110 C1140,20 1320,180 1440,120 L1440,280 L0,280 Z" fill="url(#neonRibbon2)" opacity="0.12" />
            <path d="M0,170 C360,70 600,240 920,130 C1180,40 1360,190 1440,150" stroke="url(#neonRibbon1)" strokeWidth="3.5" strokeLinecap="round" filter="drop-shadow(0 0 12px #00f0ff)" />
            <path d="M0,210 C300,120 580,260 900,160 C1200,60 1350,210 1440,190" stroke="url(#neonRibbon2)" strokeWidth="2" strokeLinecap="round" filter="drop-shadow(0 0 8px #3b82f6)" />
          </svg>
        </div>
      </div>

      <div className="container-wide">
        {/* Main 2-Column Hero Stage */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 pb-8">
          
          {/* Left Column: 3D Logo & Branding */}
          <div className="relative z-10 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/35 bg-sky-950/50 px-3.5 py-1 text-xs font-semibold text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.25)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Next-Generation Digital Products & Engineering</span>
            </div>

            {/* Prominent 3D Levitating Emblem & Title */}
            <div className="mt-6 flex items-center gap-4 sm:gap-6">
              <div className="relative group shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/35 via-sky-400/25 to-purple-500/35 blur-xl group-hover:blur-2xl transition-all" />
                <img
                  src={`${import.meta.env.BASE_URL}images/sintech-emblem-3d.webp`}
                  alt="SinTech 3D Hexagonal Emblem"
                  width={236}
                  height={258}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="relative h-20 w-auto sm:h-24 md:h-28 object-contain animate-float-slow drop-shadow-[0_16px_30px_rgba(6,182,212,0.4)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <h1 tabIndex={-1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none">
                  <span className="text-white">Sin</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]">Tech</span>
                </h1>
                
                {/* Glowing Tagline with Rule Lines: — TECH IS SOLUTION — */}
                <div className="mt-2.5 flex items-center gap-2.5 sm:gap-3">
                  <span className="h-[2px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-cyan-400" />
                  <span className="font-mono text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.24em] text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]">
                    TECH IS SOLUTION
                  </span>
                  <span className="h-[2px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-cyan-400" />
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              From bespoke software architecture to high-performance web platforms and mobile ecosystems, SinTech engineers end-to-end digital solutions designed to accelerate your growth.
            </p>

            {/* Dual CTAs matching concept buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                onClick={() => track("cta_click", { location: "home-hero" })}
                className="btn-lets-build group"
              >
                <span>Let's Build Together</span>
                <span className="btn-arrow-badge">
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </Link>

              <a
                href="#services-preview"
                className="button-quiet group inline-flex items-center gap-2"
              >
                <span>Explore Services</span>
                <ArrowRight size={15} className="text-cyan-400 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Highlights Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-sky-500/15 pt-5 text-xs sm:text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <Check size={14} className="text-cyan-400" /> Custom Architecture
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-cyan-400" /> End-to-End Delivery
              </span>
              <span className="flex items-center gap-2">
                <Check size={14} className="text-cyan-400" /> Zero-Trust Security
              </span>
            </div>
          </div>

          {/* Right Column: 3D Workstation Stage with 4 Floating Holographic Badges */}
          <div className="relative perspective-1200 py-4 lg:py-0">
            <div className="relative mx-auto max-w-[540px] transform-style-3d">
              {/* Backlight reflection pool under workstation */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-sky-500/18 via-blue-600/10 to-transparent blur-2xl -z-10" />

              {/* The 3D Workstation Base Graphic from the concept banner */}
              <div className="relative rounded-2xl overflow-hidden border border-sky-400/30 bg-[#091326]/75 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(14,165,233,0.22)] transition-transform duration-500 hover:scale-[1.01]">
                <img
                  src={`${import.meta.env.BASE_URL}images/hero-3d-workstation.webp`}
                  alt="SinTech 3D Workstation with live code editor and telemetry monitor"
                  width={449}
                  height={306}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-auto object-cover select-none"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060c1c]/80 via-transparent to-transparent" />
              </div>

              {/* 4 Interactive Levitating 3D Holographic Badges */}
              
              {/* 1. Cloud Architecture (Top-Center) */}
              <div className="absolute -top-6 left-[28%] z-20 animate-holo-1">
                <div className="holo-card-glass flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-white shadow-xl cursor-default">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/20 text-cyan-300 border border-sky-400/40">
                    <Cloud size={16} />
                  </span>
                  <div>
                    <span className="block text-[11px] text-cyan-300 font-mono leading-none">Cloud Native</span>
                    <span className="text-[10px] text-slate-400">High Availability</span>
                  </div>
                </div>
              </div>

              {/* 2. Data & Analytics (Top-Right) */}
              <div className="absolute -top-3 -right-2 sm:-right-4 z-20 animate-holo-2">
                <div className="holo-card-glass flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white shadow-xl cursor-default">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                    <BarChart3 size={16} />
                  </span>
                  <div>
                    <span className="block text-[11px] text-sky-200 font-mono leading-none">Telemetry</span>
                    <span className="text-[10px] text-slate-400">Real-Time Data</span>
                  </div>
                </div>
              </div>

              {/* 3. Security Shield (Middle-Left) */}
              <div className="absolute top-[32%] -left-3 sm:-left-6 z-20 animate-holo-3">
                <div className="holo-card-glass flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white shadow-xl cursor-default">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <span className="block text-[11px] text-cyan-300 font-mono leading-none">Zero-Trust</span>
                    <span className="text-[10px] text-slate-400">Active Defense</span>
                  </div>
                </div>
              </div>

              {/* 4. Code & Software (Bottom-Right) */}
              <div className="absolute -bottom-4 right-2 sm:right-4 z-20 animate-holo-4">
                <div className="holo-card-glass flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white shadow-xl cursor-default">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/40">
                    <Code2 size={16} />
                  </span>
                  <div>
                    <span className="block text-[11px] text-blue-300 font-mono leading-none">Fullstack & APIs</span>
                    <span className="text-[10px] text-slate-400">Clean Architecture</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* The Floating Services Dock (Directly from Concept Image Banner!) */}
        <div className="mt-4 sm:mt-6">
          <div className="services-dock-bar p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2.5 px-2">
              <span className="font-mono text-[11px] tracking-wider text-cyan-300/80 uppercase font-bold">
                Core Capabilities & Disciplines
              </span>
              <Link href="/services" className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                View all services <ArrowRight size={12} />
              </Link>
            </div>
            
            {/* 7 Interactive Category Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {dockServices.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="dock-tile group flex flex-col items-center justify-center p-3 rounded-xl border border-white/5 bg-white/[0.02] text-center"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/10 text-cyan-400 border border-sky-500/20 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:text-cyan-300 transition-all duration-300 shadow-[0_0_12px_rgba(56,189,248,0.15)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                    {item.icon}
                  </span>
                  <span className="mt-2 text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* Services Bento Grid */}
    <section className="section-pad section-rule" id="services-preview"><div className="container-wide"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow">Capabilities</p><h2 className="mt-3 text-3xl font-bold md:text-4xl text-white">Services for the whole product journey</h2></div><Link href="/services" className="nav-link inline-flex items-center gap-2">All services <ArrowRight size={16}/></Link></div>
      <div className="service-grid mt-9">{services.map((s,i)=><article key={s.slug} className="service-tile surface group relative overflow-hidden"><div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-sky-500/5 blur-2xl group-hover:bg-sky-500/10 transition-all" /><div className="flex items-start justify-between relative z-10"><span className="grid h-11 w-11 place-items-center rounded-xl bg-sky-500/20 text-cyan-300 border border-sky-400/30 group-hover:border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all">{[<Code2 key="c"/>,<Layout key="l"/>,<Smartphone key="m"/>,<ShieldCheck key="q"/>,<Database key="d"/>,<PenTool key="p"/>][i]}</span><span className="font-mono text-sm text-[#8295b1]">{s.number}</span></div><h3 className="mt-6 text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{s.title}</h3><p className="mt-3 flex-1 text-muted">{s.short}</p><ul className="mt-4 grid gap-1 text-sm text-[#c7d2e2]">{s.deliverables.slice(0,3).map(d=><li key={d} className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-cyan-400"/>{d}</li>)}</ul><Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-cyan-300 hover:text-white transition-colors">Explore service <ArrowRight size={16}/></Link></article>)}</div>
    </div></section>
    {publishedProjects.length>0&&<section className="section-pad section-rule"><div className="container-wide"><p className="eyebrow">Selected work</p><h2 className="mt-3 text-4xl font-bold text-white">Work in context</h2><div className="mt-8 grid gap-5 md:grid-cols-3">{publishedProjects.slice(0,3).map(p=><Link key={p.slug} href={`/work/${p.slug}`} className="surface p-6 hover:border-cyan-400/40"><h3 className="text-xl font-bold text-white">{p.title}</h3><p className="mt-3 text-muted">{p.summary}</p></Link>)}</div></div></section>}
    <section className="section-pad section-rule"><div className="container-wide"><div className="max-w-2xl"><p className="eyebrow">How work moves</p><h2 className="mt-3 text-4xl font-bold text-white">A clear path from brief to handover</h2><p className="mt-4 text-lg text-muted">The steps below describe a practical working sequence. The scope and depth of each step depend on the project.</p></div><ol className="mt-10 grid gap-4 md:grid-cols-3">{processSteps.map((step,i)=><li key={step.title} className="surface p-6 relative group overflow-hidden"><div className="flex items-center justify-between"><p className="font-mono text-sm font-bold text-cyan-300">0{i+1}</p><span className="h-2 w-2 rounded-full bg-sky-400/50 group-hover:bg-cyan-300 transition-colors shadow-[0_0_8px_rgba(56,189,248,0.5)]"/></div><h3 className="mt-4 text-xl font-bold text-white">{step.title}</h3><p className="mt-3 text-muted">{step.text}</p></li>)}</ol></div></section>
    <section className="section-pad section-rule"><div className="container-wide"><p className="eyebrow">Technologies in current service descriptions</p><h2 className="mt-3 text-4xl font-bold text-white">Tools mentioned across our services</h2><p className="mt-4 max-w-2xl text-muted">The technology mix depends on the work. These are the tools and platforms currently listed in SinTech service information.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{technologyGroups.map(g=><div key={g.label} className="surface p-5"><h3 className="font-bold text-white">{g.label}</h3><div className="mt-4 flex flex-wrap gap-2">{g.items.map(t=><span key={t} className="rounded-full border border-sky-400/20 bg-sky-950/30 px-3 py-1.5 text-sm text-[#d4ddeb] hover:border-cyan-400/50 hover:text-white transition-colors">{t}</span>)}</div></div>)}</div></div></section>
    {publishedTestimonials.length>0&&<section className="section-pad section-rule"><div className="container-wide"><p className="eyebrow">Client perspectives</p>{publishedTestimonials.map(t=><blockquote key={t.name} className="mt-5 surface p-8"><p className="text-xl text-white">{t.quote}</p><footer className="mt-4 text-muted">{t.name} · {t.role} · {t.company}</footer></blockquote>)}</div></section>}
    <section className="section-pad section-rule"><div className="container-wide"><p className="eyebrow">Ways to work together</p><h2 className="mt-3 text-4xl font-bold text-white">Engagement models</h2><p className="mt-4 max-w-2xl text-muted">No fixed menu fits every project. These are starting points for a conversation about scope and collaboration.</p><div className="mt-8 grid gap-4 lg:grid-cols-3">{engagements.map(e=><article key={e.title} className="surface p-6"><h3 className="text-xl font-bold text-white">{e.title}</h3><p className="mt-4 font-semibold text-cyan-300">Good fit for</p><p className="mt-1 text-muted">{e.for}</p><p className="mt-4 font-semibold text-cyan-300">Could include</p><p className="mt-1 text-muted">{e.includes}</p><p className="mt-4 font-semibold text-cyan-300">Working approach</p><p className="mt-1 text-muted">{e.how}</p></article>)}</div></div></section>
    {publishedPosts.length>0&&<section className="section-pad section-rule"><div className="container-wide"><p className="eyebrow">Insights</p><h2 className="mt-3 text-4xl font-bold text-white">Notes from the team</h2><div className="mt-7 grid gap-4 md:grid-cols-3">{publishedPosts.slice(0,3).map(p=><Link key={p.slug} href={`/insights/${p.slug}`} className="surface p-6"><h3 className="text-xl font-bold text-white">{p.title}</h3><p className="mt-3 text-muted">{p.summary}</p></Link>)}</div></div></section>}
    <section className="section-pad section-rule"><div className="container-wide grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">People behind the work</p><h2 className="mt-3 text-4xl font-bold text-white">Meet the SinTech team</h2><p className="mt-4 text-muted">A team spanning engineering, design, management, QA, research, and HR.</p><Link href="/team" className="button-quiet mt-6">Meet the team <ArrowRight size={17}/></Link></div><div className="grid gap-3 sm:grid-cols-3">{founders.map(f=><div key={f.name} className="surface p-4"><p className="font-bold text-white">{f.name}</p><p className="mt-1 text-sm text-muted">{f.role}</p></div>)}</div></div></section>
    <section className="section-pad section-rule"><div className="container-wide max-w-4xl"><p className="eyebrow">Useful answers</p><h2 className="mt-3 text-4xl font-bold text-white">Frequently asked questions</h2><Accordion type="single" collapsible className="mt-7 border-y border-white/10">{faqs.map((f,i)=><AccordionItem key={f.question} value={`faq-${i}`} className="border-white/10"><AccordionTrigger className="text-left text-lg font-semibold hover:no-underline text-white">{f.question}</AccordionTrigger><AccordionContent className="max-w-3xl text-muted">{f.answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>
    <Cta location="home-final"/>
  </>;
}
export function ServicesPage(){
 return <><PageMeta title="Services" description="Explore SinTech software, website, mobile, quality assurance, research, and design services."/><PageIntro eyebrow="What we do" title="Services built around your product needs" copy="Browse the six service areas SinTech currently offers. Each detail page explains typical work and useful questions to discuss."/><section className="container-wide pb-20"><div className="grid gap-4 md:grid-cols-2">{services.map(s=><Link key={s.slug} href={`/services/${s.slug}`} className="surface flex flex-col p-7 hover:border-[#4f8ef7]/50"><span className="eyebrow">{s.number} / Service</span><h2 className="mt-4 text-2xl font-bold">{s.title}</h2><p className="mt-3 text-muted">{s.description}</p><span className="mt-5 inline-flex items-center gap-2 font-semibold text-[#8cb5ff]">Service details <ArrowRight size={16}/></span></Link>)}</div></section></>;
}
export function ServiceDetailPage(){
 const {slug=""}=useParams(); const item=services.find(s=>s.slug===slug);
 if(!item)return <NotFoundPage/>;
 const serviceSchema={"@context":"https://schema.org","@type":"Service",name:item.title,description:item.description,provider:orgJsonLd};
 return <><PageMeta title={item.title} description={item.short} jsonLd={serviceSchema}/><PageIntro eyebrow={`Service / ${item.number}`} title={item.title} copy={item.description}/><section className="container-wide grid gap-8 pb-16 lg:grid-cols-[1.2fr_.8fr]"><div className="surface p-7 md:p-9"><h2 className="text-2xl font-bold">Who this may suit</h2><p className="mt-3 text-lg text-muted">{item.audience}</p><h2 className="mt-9 text-2xl font-bold">Possible deliverables</h2><ul className="mt-4 grid gap-3">{item.deliverables.map(d=><li key={d} className="flex gap-3 text-[#d5deeb]"><Check className="mt-1 shrink-0 text-[#83adff]"/>{d}</li>)}</ul><h2 className="mt-9 text-2xl font-bold">How we deliver</h2><p className="mt-3 text-muted">Project work can move through discovery, design, build, QA, launch preparation, and support discussion. The exact steps are set with the project scope.</p></div><aside className="surface h-fit p-7"><p className="eyebrow">Technology references</p><h2 className="mt-3 text-2xl font-bold">Tools listed for this service</h2><div className="mt-5 flex flex-wrap gap-2">{item.technologies.map(t=><span key={t} className="rounded-full border border-white/15 px-3 py-1.5 text-sm">{t}</span>)}</div><h3 className="mt-8 text-lg font-bold">Ways to engage</h3><p className="mt-2 text-muted">Discuss a fixed-scope project, a dedicated team arrangement, or ongoing support. Scope and terms are confirmed for each engagement.</p><Link href="/contact" onClick={()=>track("cta_click",{location:`service-${item.slug}`})} className="button-primary mt-6 w-full">Discuss this service <ArrowRight size={17}/></Link></aside></section><section className="container-wide pb-20"><h2 className="text-3xl font-bold">Questions about {item.title.toLowerCase()}</h2><div className="mt-5 max-w-4xl divide-y divide-white/10 border-y border-white/10">{item.faqs.map(f=><details key={f.question} className="py-5"><summary className="cursor-pointer text-lg font-semibold">{f.question}</summary><p className="mt-3 text-muted">{f.answer}</p></details>)}</div></section></>;
}
export function WorkPage(){
 const list=projects.filter(p=>p.published); const [filter,setFilter]=useState("All");
 const filters=["All",...Array.from(new Set(list.map(p=>p.service)))]; const shown=filter==="All"?list:list.filter(p=>p.service===filter);
 return <><PageMeta title="Work" description="Published SinTech case studies and project examples."/><PageIntro eyebrow="Work" title="Projects, told with context" copy="Published case studies will appear here when approved for sharing."/><section className="container-wide pb-24">{list.length===0?<div className="surface flex min-h-60 flex-col justify-center p-8 md:p-12"><p className="eyebrow">No published case studies yet</p><h2 className="mt-3 text-3xl font-bold">Case studies coming soon</h2><p className="mt-4 max-w-xl text-lg text-muted">There are no public project examples to show at the moment. Talk to us about your project and the kind of support you need.</p><Link href="/contact" className="button-primary mt-6 w-fit">Talk about a project <ArrowRight size={17}/></Link></div>:<><div className="mb-6 flex flex-wrap gap-2" aria-label="Filter projects">{filters.map(f=><button key={f} className={`button-quiet !min-h-10 !py-2 ${filter===f?"!bg-[#1e4ab8]":""}`} onClick={()=>setFilter(f)}>{f}</button>)}</div><div className="grid gap-5 md:grid-cols-2">{shown.map(p=><Link href={`/work/${p.slug}`} key={p.slug} className="surface p-7"><h2 className="text-2xl font-bold">{p.title}</h2><p className="mt-3 text-muted">{p.summary}</p></Link>)}</div></>}</section></>;
}
export function WorkDetailPage(){
 const {slug=""}=useParams();const project=projects.find(p=>p.slug===slug&&p.published);
 useEffect(()=>{if(project)track("case_study_view",{slug:project.slug})},[project]);
 if(!project)return <NotFoundPage/>;
 return <><PageMeta title={project.title} description={project.summary}/><PageIntro eyebrow="Case study" title={project.title} copy={project.summary}/><article className="container-wide content-prose pb-20"><h2>The challenge</h2><p>{project.problem}</p><h2>Approach</h2><p>{project.approach}</p><h2>Solution</h2><p>{project.solution}</p><h2>Technology</h2><p>{project.stack.join(", ")}</p></article></>;
}
export function AboutPage(){
 return <><PageMeta title="About SinTech" description="Learn about SinTech and the software, web, mobile, design, research, and QA services it offers." jsonLd={orgJsonLd}/><PageIntro eyebrow="About SinTech" title="Technology work, grounded in the brief" copy="SinTech is a software company offering services across product design, development, testing, and research. This site describes the current service areas and the people listed by the team."/><section className="container-wide grid gap-5 pb-20 md:grid-cols-3"><article className="surface p-7"><p className="eyebrow">Purpose</p><h2 className="mt-4 text-2xl font-bold">Make useful digital work</h2><p className="mt-3 text-muted">Work begins with understanding the product need and the people it serves.</p></article><article className="surface p-7"><p className="eyebrow">Approach</p><h2 className="mt-4 text-2xl font-bold">Bring the right disciplines together</h2><p className="mt-3 text-muted">Engineering, design, QA, research, and management are represented across SinTech's listed team.</p></article><article className="surface p-7"><p className="eyebrow">Working together</p><h2 className="mt-4 text-2xl font-bold">Agree the details up front</h2><p className="mt-3 text-muted">Scope, communication cadence, review process, ownership, and any NDA terms should be discussed and confirmed for each project.</p></article></section><section className="container-wide pb-20"><h2 className="text-3xl font-bold">Working principles to confirm</h2><p className="mt-4 max-w-3xl text-muted">Questions about communication cadence, code review, QA gates, intellectual property ownership, or NDA availability can be discussed directly. This page does not state unconfirmed company policies.</p><Link href="/team" className="button-quiet mt-6">Meet the team <ArrowRight size={17}/></Link></section></>;
}
export function TeamPage(){
 const [filter,setFilter]=useState("All");const departments=useMemo(()=>["All",...new Set(team.map(p=>p.department))],[]);
 const people=filter==="All"?team:team.filter(p=>p.department===filter);
 return <><PageMeta title="Team" description="Meet the founders and team members listed by SinTech."/><PageIntro eyebrow="People" title="Meet the SinTech team" copy="Founders and team members, with names and roles as listed in the current company information."/><section className="container-wide pb-12"><h2 className="text-2xl font-bold">Founders</h2><div className="mt-5 grid gap-4 md:grid-cols-3">{founders.map(f=><article key={f.name} className="surface flex items-center gap-5 p-5"><PersonImage photo={f.photo} name={f.name} role={f.role} size={88}/><div><h3 className="font-bold">{f.name}</h3><p className="mt-1 text-sm text-muted">{f.role}</p></div></article>)}</div></section><section className="container-wide pb-20"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-bold">Team</h2><p className="mt-2 text-muted">Filter the current team list by department.</p></div><Link href="/careers" className="nav-link inline-flex items-center gap-2">Careers <ArrowRight size={16}/></Link></div><div className="my-5 flex flex-wrap gap-2" aria-label="Filter team by department">{departments.map(d=><button type="button" key={d} onClick={()=>setFilter(d)} aria-pressed={filter===d} className={`button-quiet !min-h-10 !py-2 ${filter===d?"!bg-[#1e4ab8]":""}`}>{d}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{people.map(p=><article key={p.name} className="surface flex items-center gap-4 p-5"><PersonImage photo={p.photo} name={p.name} role={p.role} size={72}/><div><h3 className="font-bold">{p.name}</h3><p className="mt-1 text-sm text-muted">{p.role}</p><span className="mt-2 inline-block rounded-full border border-[#4f8ef7]/35 bg-[#1e4ab8]/20 px-2.5 py-1 text-xs text-[#a9c7ff]">{p.department}</span></div></article>)}</div></section></>;
}
export function CareersPage(){
 return <><PageMeta title="Careers" description="SinTech careers and open roles."/><PageIntro eyebrow="Careers" title="Work with SinTech" copy="This page will list roles when openings are available."/><section className="container-wide pb-24"><div className="surface p-8 md:p-12"><Users size={28} className="text-[#83adff]"/><h2 className="mt-5 text-3xl font-bold">No open roles are listed right now</h2><p className="mt-4 max-w-2xl text-lg text-muted">There are no confirmed openings to share at this time. Please check back later; we are not currently collecting general applications through this site.</p></div></section></>;
}
export function InsightsPage(){
 const published=posts.filter(p=>p.published);
 return <><PageMeta title="Insights" description="Articles and practical notes from SinTech."/><PageIntro eyebrow="Insights" title="Ideas and practical notes" copy="Articles will appear here when they are ready to publish."/><section className="container-wide pb-24">{published.length===0?<div className="surface p-8 md:p-12"><p className="eyebrow">No published articles</p><h2 className="mt-3 text-3xl font-bold">Notes are in development</h2><p className="mt-4 max-w-xl text-muted">There are no published articles yet. Check back as useful guidance is prepared for publication.</p></div>:<div className="grid gap-4 md:grid-cols-2">{published.map(p=><Link key={p.slug} href={`/insights/${p.slug}`} className="surface p-7"><h2 className="text-2xl font-bold">{p.title}</h2><p className="mt-3 text-muted">{p.summary}</p></Link>)}</div>}</section></>;
}
export function InsightDetailPage(){
 const {slug=""}=useParams();const post=posts.find(p=>p.slug===slug&&p.published);
 if(!post)return <NotFoundPage/>;
 const schema={"@context":"https://schema.org","@type":"Article",headline:post.title,description:post.summary,datePublished:post.date,author:{"@type":"Organization",name:site.name}};
 return <><PageMeta title={post.title} description={post.summary} jsonLd={schema}/><PageIntro eyebrow="Insights" title={post.title} copy={post.summary}/><article className="container-wide content-prose pb-20">{post.body?.split("\n").map((line,i)=><p key={i}>{line}</p>)}</article></>;
}
export function SecurityPage(){
 return <><PageMeta title="Security" description="How to ask SinTech about security requirements for a project."/><PageIntro eyebrow="Security" title="Security conversations start with your requirements" copy="Every project has different data, access, and delivery needs. Ask SinTech about the measures relevant to your work before sharing sensitive information."/><section className="container-wide pb-24"><div className="surface max-w-3xl p-8 md:p-10"><ShieldCheck size={30} className="text-[#83adff]"/><h2 className="mt-5 text-2xl font-bold">What to ask about</h2><p className="mt-4 text-muted">Access control, code review, backups, data handling, and NDA availability have not been confirmed for publication. Please ask about the practices and terms applicable to your project.</p><a href={`mailto:${site.contactEmail}`} className="button-primary mt-6">Ask SinTech about security</a></div></section></>;
}
export function PrivacyPage(){
 return <><PageMeta title="Privacy" description="Privacy information for the SinTech website and project contact form."/><PageIntro eyebrow="Privacy" title="Privacy information" copy="This page explains what information the current contact form requests. Additional processing and retention details need confirmation from SinTech before a complete privacy notice can be published."/><article className="container-wide content-prose pb-24"><h2>Information you submit</h2><p>The project contact form requests a name, email address, service selection, project details, and consent. Phone number, budget, and timeline may also be submitted. The form sends these details to SinTech to receive and review a project inquiry.</p><h2>Analytics</h2><p>Optional analytics are only loaded when analytics URL and site ID environment values are configured. The specific provider and deployment settings should be confirmed for the live site.</p><h2>Questions</h2><p>For questions about information submitted through the form, contact <a className="text-[#8cb5ff] underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.</p><p className="mt-8 rounded-xl border border-[#4f8ef7]/30 bg-[#1e4ab8]/10 p-5 text-[#d6e3f5]">Privacy details such as storage duration, access, deletion, and hosting need confirmation. This page is not a complete privacy policy.</p></article></>;
}
export function TermsPage(){
 return <><PageMeta title="Terms" description="Website terms information for SinTech."/><PageIntro eyebrow="Terms" title="Website terms" copy="The terms that govern use of this site and project engagements have not been supplied for publication."/><section className="container-wide pb-24"><div className="surface max-w-3xl p-8 md:p-10"><Wrench size={28} className="text-[#83adff]"/><h2 className="mt-5 text-2xl font-bold">Project terms need to be agreed</h2><p className="mt-4 text-muted">Scope, deliverables, fees, timelines, ownership, and other engagement terms should be confirmed directly with SinTech before work begins. This page does not establish legal terms.</p><a className="button-primary mt-6" href={`mailto:${site.contactEmail}`}>Contact SinTech</a></div></section></>;
}
export function NotFoundPage(){
 return <><PageMeta title="Page not found" description="The page you requested could not be found."/><section className="container-wide flex min-h-[65dvh] flex-col justify-center py-20"><p className="eyebrow">404 / Not found</p><h1 tabIndex={-1} className="mt-4 text-5xl font-bold">This page isn’t here</h1><p className="mt-5 max-w-xl text-lg text-muted">The address may have changed, or the page may not be published. Try a page below.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="button-primary">Go home</Link><Link href="/services" className="button-quiet">Explore services</Link><Link href="/contact" className="button-quiet">Contact SinTech</Link></div></section></>;
}
