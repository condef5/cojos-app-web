import { players } from "./seed-players";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function destroyAllData() {
  console.log(`Destroying all data...`);

  await prisma.user.deleteMany({});
  await prisma.player.deleteMany({});

  console.log(`All data destroyed. 🗑️`);
}

async function seedPlayers() {
  for (const player of players) {
    await prisma.player.create({
      data: {
        name: player.name,
        level: player.level,
      },
    });
  }
}

async function seed() {
  await destroyAllData();

  const email = "frankcondezo@gmail.com";
  const hashedPassword = await bcrypt.hash("letmein", 10);
  const user = await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
    update: {},
  });

  console.log(`User created: ${user.email} (ID: ${user.id})`);

  seedPlayers();

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
