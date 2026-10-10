type EventName = "cta_click" | "contact_step_complete" | "contact_submit_success" | "whatsapp_click" | "booking_click" | "case_study_view";
let loaded = false;
export function track(name: EventName, props: Record<string,string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as Window & { plausible?: (event:string, options?:{props?:Record<string,string>})=>void; umami?: {track:(event:string,props?:Record<string,string>)=>void} };
  if (!loaded) {
    const src = import.meta.env.VITE_ANALYTICS_URL as string | undefined;
    const siteId = import.meta.env.VITE_ANALYTICS_SITE_ID as string | undefined;
    if (src && siteId && !document.querySelector(`script[data-sintech-analytics="${siteId}"]`)) {
      const script = document.createElement("script");
      script.src = src; script.defer = true; script.dataset.sintechAnalytics = siteId;
      script.dataset.domain = siteId; script.setAttribute("data-website-id", siteId);
      document.head.appendChild(script);
    }
    loaded = true;
  }
  if (w.plausible) w.plausible(name, {props});
  else if (w.umami) w.umami.track(name, props);
}
