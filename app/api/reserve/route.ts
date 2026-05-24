import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const inventory = await prisma.inventory.findUnique({
      where: {
        id: body.inventoryId,
      },
    });

    if (!inventory) {
      return NextResponse.json(
        { error: "Inventory not found" },
        { status: 404 }
      );
    }

    const available =
      inventory.totalStock - inventory.reservedStock;

    if (available < body.quantity) {
      return NextResponse.json(
        { error: "Not enough stock available" },
        { status: 400 }
      );
    }

    const updatedInventory =
      await prisma.inventory.update({
        where: {
          id: body.inventoryId,
        },

        data: {
          reservedStock:
            inventory.reservedStock + body.quantity,
        },
      });

    return NextResponse.json(updatedInventory);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Reserve failed" },
      { status: 500 }
    );
  }
}