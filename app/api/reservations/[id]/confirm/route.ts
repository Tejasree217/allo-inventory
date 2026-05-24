import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const reservationId =
      Number(id);

    const reservation =
      await prisma.reservation.findUnique({
        where: {
          id: reservationId,
        },
      });

    if (!reservation) {
      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    // CHECK IF EXPIRED
    if (
      new Date() >
      reservation.expiresAt
    ) {
      // RELEASE RESERVED STOCK
      await prisma.inventory.update({
        where: {
          id:
            reservation.inventoryId,
        },

        data: {
          reservedStock: {
            decrement:
              reservation.quantity,
          },
        },
      });

      // UPDATE RESERVATION STATUS
      await prisma.reservation.update({
        where: {
          id: reservationId,
        },

        data: {
          status: "RELEASED",

          releasedAt:
            new Date(),
        },
      });

      return NextResponse.json(
        {
          error:
            "Reservation expired and released",
        },
        {
          status: 400,
        }
      );
    }

    // CONFIRM RESERVATION
    const updatedReservation =
      await prisma.reservation.update({
        where: {
          id: reservationId,
        },

        data: {
          status: "CONFIRMED",

          confirmedAt:
            new Date(),
        },
      });

    return NextResponse.json(
      updatedReservation
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error:
          "Confirmation failed",
      },
      {
        status: 500,
      }
    );
  }
}