import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Yasir",
      email: "yasir@example.com",
    },
  });

  console.log("New User:", user);

  const allUsers = await prisma.user.findMany();
  console.log("All Users:", allUsers);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
