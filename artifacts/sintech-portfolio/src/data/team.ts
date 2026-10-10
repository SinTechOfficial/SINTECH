export type Person = { name:string; role:string; department:string; photo:string; founder?:boolean; bio?:string };
export const founders: Person[] = [
  {name:"Mostafic Yellahy Nahid",role:"Founder & Lead Architect",department:"Engineering",photo:"/images/team/nahid",founder:true},
  {name:"Iftikher Rahman Ifti",role:"Co-Founder & Management Head",department:"Management",photo:"/images/team/ifti",founder:true},
  {name:"Samir Hossain Sobuj",role:"Co-Founder & Marketing Head",department:"Management",photo:"/images/team/sobuj",founder:true},
];
export const team: Person[] = [
  {name:"Monira Islam Eva",role:"General Manager",department:"Management",photo:"/images/team/eva"},
  {name:"Enamul Hakim Khan",role:"Lead Developer",department:"Engineering",photo:"/images/team/fahim"},
  {name:"Ashraful Islam",role:"Lead Designer & QA",department:"Design",photo:"/images/team/ashraful"},
  {name:"Md Mahbul Islam",role:"Coder",department:"Engineering",photo:"/images/team/mahbub"},
  {name:"Shahed Ahmed Sium",role:"Coder",department:"Engineering",photo:"/images/team/sium"},
  {name:"Rifat Ahmed Ratul",role:"QA Engineer",department:"QA",photo:"/images/team/ratul"},
  {name:"Ashraful Haque Akash",role:"Researcher",department:"Research",photo:"/images/team/akash"},
  {name:"Md Emon Hossain",role:"Researcher",department:"Research",photo:"/images/team/emon"},
  {name:"Farhan Alam",role:"Graphics Designer",department:"Design",photo:"/images/team/farhan"},
  {name:"Mairea",role:"Designer",department:"Design",photo:"/images/team/mariea"},
  {name:"Tahrim Maria",role:"Designer",department:"Design",photo:"/images/team/asha"},
  {name:"Tanzina Akter Tanni",role:"HR",department:"HR",photo:"/images/team/tanni"},
];
