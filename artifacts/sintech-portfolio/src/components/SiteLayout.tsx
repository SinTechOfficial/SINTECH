import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { site } from "../data/site";
import { services } from "../data/services";
import { track } from "../lib/analytics";
import { SinChatbot } from "./SinChatbot";

const navItems = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
];

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isContactPage = path === "/contact";

  useEffect(() => {
    setOpen(false);
    setServicesDropdownOpen(false);
  }, [path]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setServicesDropdownOpen(false);
      }
    };
    const onClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  const cta = () => track("cta_click", { location: path });

  const hasWhatsapp = Boolean(site.whatsappNumber && site.whatsappNumber.trim().length > 0);
  const whatsappUrl = hasWhatsapp
    ? `https://wa.me/${site.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(site.whatsappPrefill)}`
    : "";

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="container-wide">
          <div className="nav-floating-pill flex items-center justify-between gap-3 sm:gap-6">
            <Link href="/" className="flex shrink-0 items-center transition-transform hover:scale-[1.02]">
              <img
                src={`${import.meta.env.BASE_URL}images/sintech-logo-trimmed.png`}
                alt="SinTech — Tech is Solution"
                width={794}
                height={258}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-8 w-auto object-contain sm:h-10"
              />
            </Link>

            {/* Desktop Navigation matching concept banner */}
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className={`nav-link px-3.5 py-1.5 rounded-full transition-all ${
                  path === "/" ? "bg-white/10 text-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] font-bold" : "hover:text-cyan-300"
                }`}
                aria-current={path === "/" ? "page" : undefined}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setServicesDropdownOpen(true)}
                onMouseLeave={() => setServicesDropdownOpen(false)}
              >
                <div className="flex items-center">
                  <Link
                    href="/services"
                    className={`nav-link flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                      path.startsWith("/services") ? "bg-white/10 text-cyan-300 font-bold" : "hover:text-cyan-300"
                    }`}
                    aria-current={path.startsWith("/services") ? "page" : undefined}
                  >
                    Services
                  </Link>
                  <button
                    type="button"
                    onClick={() => setServicesDropdownOpen((v) => !v)}
                    className="text-[#a7b4c6] hover:text-cyan-300 p-1 rounded-full transition-colors"
                    aria-expanded={servicesDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Toggle services menu"
                  >
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>

                {servicesDropdownOpen && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 rounded-2xl border border-sky-500/25 bg-[#0b1733]/95 p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all"
                    role="menu"
                    aria-label="Services submenu"
                  >
                    <div className="grid gap-1">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          role="menuitem"
                          className="group flex flex-col rounded-lg px-3 py-2 text-sm text-[#d3dbea] transition-colors hover:bg-[#182f57] hover:text-white"
                          onClick={() => setServicesDropdownOpen(false)}
                        >
                          <span className="font-semibold text-white group-hover:text-[#8cb5ff]">
                            {s.title}
                          </span>
                          <span className="text-xs text-[#8da0bd] line-clamp-1">
                            {s.short}
                          </span>
                        </Link>
                      ))}
                      <div className="mt-1 border-t border-white/10 pt-1">
                        <Link
                          href="/services"
                          role="menuitem"
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-[#8cb5ff] hover:bg-[#182f57]"
                          onClick={() => setServicesDropdownOpen(false)}
                        >
                          All Services Overview <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/work"
                className={`nav-link px-3.5 py-1.5 rounded-full transition-all ${
                  path === "/work" ? "bg-white/10 text-cyan-300 font-bold" : "hover:text-cyan-300"
                }`}
                aria-current={path === "/work" ? "page" : undefined}
              >
                Projects
              </Link>

              <Link
                href="/about"
                className={`nav-link px-3.5 py-1.5 rounded-full transition-all ${
                  path === "/about" ? "bg-white/10 text-cyan-300 font-bold" : "hover:text-cyan-300"
                }`}
                aria-current={path === "/about" ? "page" : undefined}
              >
                About
              </Link>

              <Link
                href="/team"
                className={`nav-link px-3.5 py-1.5 rounded-full transition-all ${
                  path === "/team" ? "bg-white/10 text-cyan-300 font-bold" : "hover:text-cyan-300"
                }`}
                aria-current={path === "/team" ? "page" : undefined}
              >
                Team
              </Link>

              <Link
                href="/contact"
                className={`nav-link px-3.5 py-1.5 rounded-full transition-all ${
                  path === "/contact" ? "bg-white/10 text-cyan-300 font-bold" : "hover:text-cyan-300"
                }`}
                aria-current={path === "/contact" ? "page" : undefined}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action: Signature "Let's Build Together" Pill Button */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                onClick={cta}
                className="btn-lets-build group"
              >
                <span className="whitespace-nowrap hidden sm:inline">Let's Build Together</span>
                <span className="whitespace-nowrap sm:hidden">Build</span>
                <span className="btn-arrow-badge">
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="grid place-items-center w-9 h-9 rounded-full border border-sky-500/25 bg-slate-900/80 text-white lg:hidden transition-colors hover:border-sky-400"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={open}
                aria-controls="mobile-navigation"
                onClick={() => setOpen((v) => !v)}
                data-testid="button-mobile-menu"
              >
                {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          hidden={!open}
          className="menu-panel lg:hidden max-h-[85vh] overflow-y-auto"
        >
          <div className="container-wide grid gap-1 py-2">
            <div>
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="nav-link flex items-center justify-between border-b border-white/10 py-3 font-bold"
                aria-current={path === "/services" ? "page" : undefined}
              >
                Services <ArrowRight size={16} />
              </Link>
              <div className="ml-3 my-1 grid gap-1 border-l border-white/10 pl-3 py-1">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="py-1.5 text-xs text-[#a7b9d4] hover:text-white"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link border-b border-white/10 py-3"
                aria-current={path === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => {
                setOpen(false);
                cta();
              }}
              className="button-primary mt-4 w-full"
            >
              Start a project <ArrowRight size={17} />
            </Link>
          </div>
        </nav>
      </header>

      <main id="main-content" className="min-h-[70dvh]">
        {children}
      </main>

      {/* Floating WhatsApp Click-to-Chat Button (Hidden on /contact page) */}
      {hasWhatsapp && !isContactPage && (
        <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("whatsapp_click")}
            className="group flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-[#20ba5a] focus-visible:outline-2 focus-visible:outline-white"
            aria-label="Chat with SinTech on WhatsApp (opens in new window)"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
              className="shrink-0"
            >
              <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.176.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.675-2.085-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.516-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.2 2.12 3.238 5.136 4.542.717.311 1.278.496 1.715.635.72.229 1.375.197 1.893.121.577-.085 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.075-.126-.276-.201-.577-.351zM12.04 2C6.54 2 2.08 6.46 2.08 11.96c0 1.83.5 3.55 1.37 5.04L2 22l5.16-1.35c1.44.79 3.09 1.24 4.88 1.24 5.5 0 9.96-4.46 9.96-9.96C22 6.46 17.54 2 12.04 2zm0 18.25c-1.56 0-3.03-.43-4.3-1.18l-.31-.18-3.06.8.82-2.98-.2-.32a8.21 8.21 0 0 1-1.26-4.43c0-4.57 3.72-8.29 8.29-8.29 4.57 0 8.29 3.72 8.29 8.29 0 4.57-3.72 8.29-8.29 8.29z" />
            </svg>
            <span className="hidden sm:inline text-xs font-bold tracking-wide">
              Chat with us
            </span>
          </a>
        </aside>
      )}

      <footer className="section-rule bg-[#091224] py-14">
        <div className="container-wide grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-heading text-2xl font-bold">SinTech</p>
            <p className="mt-3 max-w-sm text-muted">
              Tech is the Solution. Software, web, mobile, design, research, and quality assurance services.
            </p>
            {site.location && (
              <p className="mt-3 text-xs text-[#8da0bd]">
                Based in {site.location}
              </p>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold tracking-normal">Explore</h2>
            <div className="mt-4 grid gap-2">
              {[
                { href: "/about", label: "About" },
                { href: "/team", label: "Team" },
                { href: "/careers", label: "Careers" },
                { href: "/work", label: "Work" },
                { href: "/insights", label: "Insights" },
              ].map((x) => (
                <Link key={x.href} href={x.href} className="text-muted hover:text-white">
                  {x.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-normal">Services</h2>
            <div className="mt-4 grid gap-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="text-muted hover:text-white"
                >
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-normal">Contact</h2>
            <a
              className="mt-4 inline-block text-[#79a9ff] underline underline-offset-4"
              href={`mailto:${site.contactEmail}`}
            >
              {site.contactEmail}
            </a>
            {site.bookingUrl && (
              <div className="mt-2">
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("booking_click")}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8cb5ff] hover:underline"
                >
                  Book a call online <ArrowRight size={13} />
                </a>
              </div>
            )}
            <div className="mt-5 grid gap-2">
              <Link href="/security" className="text-muted hover:text-white">
                Security
              </Link>
              <Link href="/privacy" className="text-muted hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
        <div className="container-wide mt-12 border-t border-white/10 pt-5 text-sm text-muted">
          © {new Date().getFullYear()} SinTech
        </div>
      </footer>

      <SinChatbot />
    </>
  );
}
