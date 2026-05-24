import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const product = await prisma.product.create({
    data: {
      name: "iPhone 15",
    },
  });

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Chennai Warehouse",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse1.id,
      totalStock: 10,
      reservedStock: 0,
    },
  });

  await prisma.inventory.create({
    data: {
      productId: product.id,
      warehouseId: warehouse2.id,
      totalStock: 5,
      reservedStock: 0,
    },
  });

  console.log("Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });