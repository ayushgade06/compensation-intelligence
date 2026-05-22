import "dotenv/config";

import { PrismaClient, RoleCategory } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding...");

  await prisma.compensation.deleteMany();
  await prisma.location.deleteMany();
  await prisma.company.deleteMany();
  await prisma.level.deleteMany();
  await prisma.role.deleteMany();

  const roles = await Promise.all([
    prisma.role.create({
      data: {
        name: "Software Engineer",
        category: RoleCategory.ENGINEERING,
      },
    }),

    prisma.role.create({
      data: {
        name: "Product Manager",
        category: RoleCategory.PRODUCT,
      },
    }),

    prisma.role.create({
      data: {
        name: "Data Scientist",
        category: RoleCategory.DATA,
      },
    }),

    prisma.role.create({
      data: {
        name: "Designer",
        category: RoleCategory.DESIGN,
      },
    }),

    prisma.role.create({
      data: {
        name: "Engineering Manager",
        category: RoleCategory.MANAGEMENT,
      },
    }),
  ]);

  const levels = await Promise.all([
    prisma.level.create({
      data: {
        name: "Junior (L3)",
        code: "L3",
        order: 3,
        description: "0–2 years",
      },
    }),

    prisma.level.create({
      data: {
        name: "Mid-Level (L4)",
        code: "L4",
        order: 4,
        description: "2–5 years",
      },
    }),

    prisma.level.create({
      data: {
        name: "Senior (L5)",
        code: "L5",
        order: 5,
        description: "5–8 years",
      },
    }),

    prisma.level.create({
      data: {
        name: "Staff (L6)",
        code: "L6",
        order: 6,
        description: "8–12 years",
      },
    }),

    prisma.level.create({
      data: {
        name: "Principal (L7)",
        code: "L7",
        order: 7,
        description: "12+ years",
      },
    }),
  ]);

  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: "Google",
        normalized_name: "google",
        slug: "google",
        industry: "Technology",
      },
    }),

    prisma.company.create({
      data: {
        name: "Meta",
        normalized_name: "meta",
        slug: "meta",
        industry: "Technology",
      },
    }),

    prisma.company.create({
      data: {
        name: "Microsoft",
        normalized_name: "microsoft",
        slug: "microsoft",
        industry: "Technology",
      },
    }),

    prisma.company.create({
      data: {
        name: "Amazon",
        normalized_name: "amazon",
        slug: "amazon",
        industry: "Technology",
      },
    }),

    prisma.company.create({
      data: {
        name: "Netflix",
        normalized_name: "netflix",
        slug: "netflix",
        industry: "Entertainment",
      },
    }),
  ]);

  const [google, meta, microsoft, amazon, netflix] = companies;

  const locations = await Promise.all([
    prisma.location.create({
      data: {
        city: "San Francisco",
        state: "California",
        country: "USA",
        normalized: "san francisco,california,usa",
      },
    }),

    prisma.location.create({
      data: {
        city: "Seattle",
        state: "Washington",
        country: "USA",
        normalized: "seattle,washington,usa",
      },
    }),

    prisma.location.create({
      data: {
        city: "New York",
        state: "New York",
        country: "USA",
        normalized: "new york,new york,usa",
      },
    }),

    prisma.location.create({
      data: {
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        normalized: "bangalore,karnataka,india",
      },
    }),

    prisma.location.create({
      data: {
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        normalized: "pune,maharashtra,india",
      },
    }),
  ]);

  const [
  sf,
  ,
  ,
  bangalore,
  pune,
] = locations;

  await prisma.compensation.createMany({
    data: [
      // GOOGLE
      {
  company_id: google.id,
  role_id: roles[0].id,
  level_id: levels[0].id,
  location_id: sf.id,

  base_salary: 180000,
  bonus: 10000,
  stock_value: 30000,

  total_compensation: 220000,

  years_of_experience: 2,

  currency: "USD",

  verified: true,
},

      {
        company_id: google.id,
        role_id: roles[0].id,
        level_id: levels[2].id,
        location_id: sf.id,

        base_salary: 230000,
        bonus: 25000,
        stock_value: 90000,

        total_compensation: 345000,

        years_of_experience: 6,

        currency: "USD",
      },

      {
        company_id: google.id,
        role_id: roles[0].id,
        level_id: levels[3].id,
        location_id: sf.id,

        base_salary: 300000,
        bonus: 60000,
        stock_value: 180000,

        total_compensation: 540000,

        years_of_experience: 10,

        currency: "USD",
        verified: true,
      },

      // META
      {
        company_id: meta.id,
        role_id: roles[0].id,
        level_id: levels[2].id,
        location_id: sf.id,

        base_salary: 250000,
        bonus: 30000,
        stock_value: 100000,

        total_compensation: 380000,

        years_of_experience: 7,

        currency: "USD",
        verified: true,
      },

      {
        company_id: meta.id,
        role_id: roles[0].id,
        level_id: levels[3].id,
        location_id: sf.id,

        base_salary: 320000,
        bonus: 50000,
        stock_value: 200000,

        total_compensation: 570000,

        years_of_experience: 11,

        currency: "USD",
      },

      // MICROSOFT
      {
        company_id: microsoft.id,
        role_id: roles[0].id,
        level_id: levels[0].id,
        location_id: bangalore.id,

        base_salary: 2200000,
        bonus: 300000,
        stock_value: 400000,

        total_compensation: 2900000,

        years_of_experience: 2,

        currency: "INR",
        verified: true,
      },

      {
        company_id: microsoft.id,
        role_id: roles[0].id,
        level_id: levels[2].id,
        location_id: bangalore.id,

        base_salary: 4000000,
        bonus: 700000,
        stock_value: 1200000,

        total_compensation: 5900000,

        years_of_experience: 7,

        currency: "INR",
      },

      // AMAZON
      {
        company_id: amazon.id,
        role_id: roles[0].id,
        level_id: levels[1].id,
        location_id: pune.id,

        base_salary: 2600000,
        bonus: 400000,
        stock_value: 800000,

        total_compensation: 3800000,

        years_of_experience: 4,

        currency: "INR",
        verified: true,
      },

      {
        company_id: amazon.id,
        role_id: roles[0].id,
        level_id: levels[2].id,
        location_id: pune.id,

        base_salary: 4500000,
        bonus: 700000,
        stock_value: 1800000,

        total_compensation: 7000000,

        years_of_experience: 8,

        currency: "INR",
      },

      // NETFLIX
      {
        company_id: netflix.id,
        role_id: roles[0].id,
        level_id: levels[3].id,
        location_id: sf.id,

        base_salary: 420000,
        bonus: 80000,
        stock_value: 100000,

        total_compensation: 600000,

        years_of_experience: 12,

        currency: "USD",  
      },
    ],
  });

  console.log("Done.");
}

main().finally(async () => {
  await prisma.$disconnect();
});
