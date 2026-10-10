export type Post = { slug:string; title:string; summary:string; published:boolean; date?:string; tags:string[]; outline:string[]; body?:string };
export const posts: Post[] = [
  {slug:"planning-a-software-project",title:"Planning a software project before development",summary:"An outline for turning an initial idea into a useful first scope.",published:false,tags:["Planning","Software"],outline:["Describe the user and problem","List constraints and dependencies","Agree an initial scope and review points"]},
  {slug:"website-project-brief",title:"What to include in a website project brief",summary:"A practical checklist for sharing the context behind a website request.",published:false,tags:["Web","Briefs"],outline:["Audience and content","Required pages and functions","Assets, integrations, and priorities"]},
  {slug:"qa-before-release",title:"Building a useful QA plan before release",summary:"A starting outline for defining test coverage around a product.",published:false,tags:["QA","Release"],outline:["Identify critical user journeys","Choose target environments","Connect checks to release requirements"]},
];
