import { prisma } from "@/lib/prisma";

async function main(){
  const s = await prisma.chatSession.create({ data: { title: "Career: Software dev path", topic: "Switching to MERN" }});
  console.log("created session:", s);
}
main().finally(()=>prisma.$disconnect());
