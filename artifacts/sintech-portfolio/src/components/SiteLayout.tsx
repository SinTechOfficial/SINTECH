import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { site } from "../data/site";
import { services } from "../data/services";
import { track } from "../lib/analytics";

const navItems = [
  {href:"/services",label:"Services"}, {href:"/work",label:"Work"}, {href:"/about",label:"About"},
  {href:"/team",label:"Team"}, {href:"/insights",label:"Insights"}, {href:"/careers",label:"Careers"},
];
export function SiteLayout({children}:{children:React.ReactNode}) {
  const [path] = useLocation();
  const [open,setOpen] = useState(false);
  useEffect(()=>setOpen(false),[path]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);
  },[]);
  const cta=()=>track("cta_click",{location:path});
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <div className="container-wide flex h-[76px] items-center justify-between gap-5">
        <Link href="/" className="flex shrink-0 items-center">
          <img
            src={`${import.meta.env.BASE_URL}images/sintech-logo-trimmed.png`}
            alt="SinTech — Tech is the Solution"
            width={800}
            height={235}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6">
          {navItems.map(item=><Link key={item.href} href={item.href} className="nav-link" aria-current={path===item.href?"page":undefined}>{item.label}</Link>)}
          <Link href="/contact" onClick={cta} className="button-primary !min-h-10 !py-2 !px-4 text-sm">Start a project <ArrowRight size={16}/></Link>
        </nav>
        <button type="button" className="lg:hidden button-quiet !min-h-11 !px-3" aria-label={open?"Close navigation menu":"Open navigation menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(v=>!v)} data-testid="button-mobile-menu">
          {open?<X aria-hidden="true"/>:<Menu aria-hidden="true"/>}
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="Mobile navigation" hidden={!open} className="menu-panel lg:hidden">
        <div className="container-wide grid gap-1">
          {navItems.map(item=><Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className="nav-link border-b border-white/10 py-3" aria-current={path===item.href?"page":undefined}>{item.label}</Link>)}
          <Link href="/contact" onClick={()=>{setOpen(false);cta()}} className="button-primary mt-4">Start a project <ArrowRight size={17}/></Link>
        </div>
      </nav>
    </header>
    <main id="main-content" className="min-h-[70dvh]">{children}</main>
    <footer className="section-rule bg-[#091224] py-14">
      <div className="container-wide grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div><p className="font-heading text-2xl font-bold">SinTech</p><p className="mt-3 max-w-sm text-muted">Tech is the Solution. Software, web, mobile, design, research, and quality assurance services.</p></div>
        <div><h2 className="text-base font-bold tracking-normal">Explore</h2><div className="mt-4 grid gap-2">{[{href:"/about",label:"About"},{href:"/team",label:"Team"},{href:"/careers",label:"Careers"},{href:"/work",label:"Work"},{href:"/insights",label:"Insights"}].map(x=><Link key={x.href} href={x.href} className="text-muted hover:text-white">{x.label}</Link>)}</div></div>
        <div><h2 className="text-base font-bold tracking-normal">Services</h2><div className="mt-4 grid gap-2">{services.map(s=><Link key={s.slug} href={`/services/${s.slug}`} className="text-muted hover:text-white">{s.title}</Link>)}</div></div>
        <div><h2 className="text-base font-bold tracking-normal">Contact</h2><a className="mt-4 inline-block text-[#79a9ff] underline underline-offset-4" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a><div className="mt-5 grid gap-2"><Link href="/security" className="text-muted hover:text-white">Security</Link><Link href="/privacy" className="text-muted hover:text-white">Privacy</Link><Link href="/terms" className="text-muted hover:text-white">Terms</Link></div></div>
      </div>
      <div className="container-wide mt-12 border-t border-white/10 pt-5 text-sm text-muted">© {new Date().getFullYear()} SinTech</div>
    </footer>
  </>;
}
