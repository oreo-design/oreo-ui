import type { PresencePerson } from "@/components/presence";
import emma from "@/patterns/review-workspace/assets/avatar-emma.webp";
import ava from "@/patterns/review-workspace/assets/avatar-ava.webp";
import liam from "@/patterns/review-workspace/assets/avatar-liam.webp";
import olivia from "@/patterns/review-workspace/assets/avatar-olivia.webp";
import profile from "@/patterns/review-workspace/assets/avatar-profile.webp";
export const ROOM_PEOPLE: PresencePerson[] = [
  {id:"you",name:"Alex Morgan",src:profile,status:"online",detail:"Viewing the brief"},
  {id:"emma",name:"Emma Wilson",src:emma,status:"typing",detail:"Writing a comment"},
  {id:"liam",name:"Liam Carter",src:liam,status:"online",detail:"Reviewing the checklist"},
  {id:"ava",name:"Ava Mitchell",src:ava,status:"away",detail:"Back in a few minutes"},
  {id:"olivia",name:"Olivia Bennett",src:olivia,status:"online",detail:"Reading the overview"},
  {id:"ravi",name:"Ravi Shah",status:"online",detail:"Just joined the room"},
  {id:"jules",name:"Jules Park",status:"typing",detail:"Writing a comment"},
];
export const INITIAL_BRIEF = "Make the first five minutes feel effortless. A calmer workspace, a clearer next step, and room for the whole team to contribute.";
export const INITIAL_TASKS = [
  {id:"story",title:"Agree on the launch story",done:true,owner:"Emma"},
  {id:"product",title:"Review the product walkthrough",done:true,owner:"Liam"},
  {id:"access",title:"Check keyboard and mobile flows",done:false,owner:"Ava"},
  {id:"notes",title:"Publish the release notes",done:false,owner:"Alex"},
];
