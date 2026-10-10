import { useEffect } from "react";
import { site } from "../data/site";
export function PageMeta({title,description,jsonLd}:{title:string;description:string;jsonLd?:unknown}) {
  useEffect(()=>{
    document.title=`${title} | SinTech`;
    const setMeta=(selector:string,attrs:Record<string,string>,content:string)=>{
      let el=document.querySelector<HTMLMetaElement>(selector);
      if(!el){el=document.createElement("meta");document.head.appendChild(el)}
      Object.entries(attrs).forEach(([key,value])=>el!.setAttribute(key,value));
      el.content=content;
    };
    setMeta('meta[name="description"]',{name:"description"},description);
    setMeta('meta[property="og:title"]',{property:"og:title"},`${title} | SinTech`);
    setMeta('meta[property="og:description"]',{property:"og:description"},description);
    setMeta('meta[property="og:type"]',{property:"og:type"},"website");
    setMeta('meta[name="twitter:card"]',{name:"twitter:card"},"summary_large_image");
    setMeta('meta[name="twitter:title"]',{name:"twitter:title"},`${title} | SinTech`);
    setMeta('meta[name="twitter:description"]',{name:"twitter:description"},description);
    const url=site.domain?new URL(window.location.pathname,site.domain).toString():"";
    let canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if(url){if(!canonical){canonical=document.createElement("link");canonical.rel="canonical";document.head.appendChild(canonical)}canonical.href=url}
    const image=site.domain?new URL("/opengraph.jpg",site.domain).toString():"";
    if(image){setMeta('meta[property="og:image"]',{property:"og:image"},image);setMeta('meta[name="twitter:image"]',{name:"twitter:image"},image)}
    const old=document.getElementById("route-jsonld"); old?.remove();
    if(jsonLd){const script=document.createElement("script");script.id="route-jsonld";script.type="application/ld+json";script.textContent=JSON.stringify(jsonLd);document.head.appendChild(script)}
    return ()=>{document.getElementById("route-jsonld")?.remove()};
  },[title,description,jsonLd]);
  return null;
}
