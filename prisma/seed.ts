import { players } from "./seed-players";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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
  const email = "frankcondezo@gmail.com";
  const hashedPassword = await bcrypt.hash("letmein", 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
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
