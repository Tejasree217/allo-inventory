import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const inventory = await prisma.inventory.findMany({
    orderBy: {
      warehouseId: "asc",
    },

    include: {
      warehouse: true,
      product: true,
    },
  });

  const formatted = inventory.map((item) => ({
    id: item.id,
    product: item.product.name,
    warehouse: item.warehouse.name,

    available:
      item.totalStock - item.reservedStock,
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const existingInventory =
      await prisma.inventory.findFirst({
        where: {
          productId: body.productId,
          warehouseId: body.warehouseId,
        },
      });

    if (existingInventory) {
      const updatedInventory =
        await prisma.inventory.update({
          where: {
            id: existingInventory.id,
          },

          data: {
            totalStock: {
              increment: body.quantity,
            },
          },
        });

      return NextResponse.json(updatedInventory);
    }

    const newInventory =
      await prisma.inventory.create({
        data: {
          productId: body.productId,
          warehouseId: body.warehouseId,
          totalStock: body.quantity,
          reservedStock: 0,
        },
      });

    return NextResponse.json(newInventory);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.inventory.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}