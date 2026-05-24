"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [reservations, setReservations] =
    useState([]);

  const [quantity, setQuantity] =
    useState("");

  const [warehouseId, setWarehouseId] =
    useState("1");

  const [
    reserveQuantities,
    setReserveQuantities,
  ] = useState<{ [key: number]: string }>(
    {}
  );

  async function loadProducts() {
    try {
      const productRes =
        await fetch("/api/products");

      const productData =
        await productRes.json();

      setProducts(productData);

      const reservationRes =
        await fetch("/api/reservations");

      const reservationData =
        await reservationRes.json();

      setReservations(
        reservationData
      );
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct() {
    if (!quantity) return;

    await fetch("/api/products", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        productId: 1,

        warehouseId:
          Number(warehouseId),

        quantity: Number(quantity),
      }),
    });

    setQuantity("");

    await loadProducts();
  }

  async function reserveStock(
    id: number
  ) {
    try {
      const res = await fetch(
        "/api/reserve",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            inventoryId: id,

            quantity: Number(
              reserveQuantities[
                id
              ] || 0
            ),
          }),
        }
      );

      const data =
        await res.json();

      console.log(data);

      setReserveQuantities({
        ...reserveQuantities,

        [id]: "",
      });

      await loadProducts();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteInventory(
    id: number
  ) {
    try {
      await fetch(
        "/api/products",
        {
          method: "DELETE",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id,
          }),
        }
      );

      await loadProducts();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor:
          "#f4f4f4",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          backgroundColor:
            "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow:
            "0px 0px 10px rgba(0,0,0,0.1)",
          maxWidth: "1100px",
          margin: "auto",
        }}
      >
        <h1
          style={{
            marginBottom: "30px",
            color: "#333",
          }}
        >
          Inventory Dashboard
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
          }}
        >
          <select
            value={warehouseId}
            onChange={(e) =>
              setWarehouseId(
                e.target.value
              )
            }
            style={{
              padding: "12px",
              border:
                "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            <option value="1">
              Chennai Warehouse
            </option>

            <option value="2">
              Bangalore Warehouse
            </option>
          </select>

          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(
                e.target.value
              )
            }
            style={{
              padding: "12px",
              width: "200px",
              border:
                "1px solid #ccc",
              borderRadius: "5px",
            }}
          />

          <button
            onClick={addProduct}
            style={{
              padding:
                "12px 20px",
              backgroundColor:
                "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Stock
          </button>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor:
                  "#0070f3",
                color: "white",
              }}
            >
              <th style={{ padding: "12px" }}>
                ID
              </th>

              <th style={{ padding: "12px" }}>
                Product
              </th>

              <th style={{ padding: "12px" }}>
                Warehouse
              </th>

              <th style={{ padding: "12px" }}>
                Available Stock
              </th>

              <th style={{ padding: "12px" }}>
                Reserve Quantity
              </th>

              <th style={{ padding: "12px" }}>
                Reserve
              </th>

              <th style={{ padding: "12px" }}>
                Delete
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((item: any) => (
              <tr
                key={item.id}
                style={{
                  textAlign:
                    "center",
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                <td style={{ padding: "12px" }}>
                  {item.id}
                </td>

                <td style={{ padding: "12px" }}>
                  {item.product}
                </td>

                <td style={{ padding: "12px" }}>
                  {item.warehouse}
                </td>

                <td style={{ padding: "12px" }}>
                  <div>
                    {item.available}
                  </div>

                  {item.available <=
                    5 && (
                    <div
                      style={{
                        color:
                          "red",
                        fontWeight:
                          "bold",
                        marginTop:
                          "5px",
                      }}
                    >
                      ⚠️ Low
                      Stock
                    </div>
                  )}
                </td>

                <td style={{ padding: "12px" }}>
                  <input
                    type="number"
                    min="1"
                    value={
                      reserveQuantities[
                        item.id
                      ] || ""
                    }
                    onChange={(e) =>
                      setReserveQuantities(
                        {
                          ...reserveQuantities,

                          [item.id]:
                            e.target
                              .value,
                        }
                      )
                    }
                    style={{
                      padding: "8px",
                      width: "80px",
                      border:
                        "1px solid #ccc",
                      borderRadius:
                        "5px",
                    }}
                  />
                </td>

                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() =>
                      reserveStock(
                        item.id
                      )
                    }
                    style={{
                      padding:
                        "8px 12px",
                      backgroundColor:
                        "green",
                      color:
                        "white",
                      border:
                        "none",
                      borderRadius:
                        "5px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Reserve
                  </button>
                </td>

                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() =>
                      deleteInventory(
                        item.id
                      )
                    }
                    style={{
                      padding:
                        "8px 12px",
                      backgroundColor:
                        "red",
                      color:
                        "white",
                      border:
                        "none",
                      borderRadius:
                        "5px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2
          style={{
            marginTop: "40px",
            marginBottom:
              "20px",
            color: "#333",
          }}
        >
          Reservation History
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor:
                  "#222",
                color: "white",
              }}
            >
              <th style={{ padding: "12px" }}>
                Reservation ID
              </th>

              <th style={{ padding: "12px" }}>
                Inventory ID
              </th>

              <th style={{ padding: "12px" }}>
                Quantity
              </th>

              <th style={{ padding: "12px" }}>
                Status
              </th>

              <th style={{ padding: "12px" }}>
                Expires At
              </th>

              <th style={{ padding: "12px" }}>
                Confirm
              </th>
            </tr>
          </thead>

          <tbody>
  {reservations.map((item: any) => (
    <tr
      key={item.id}
      style={{
        textAlign: "center",
        borderBottom: "1px solid #ddd",
      }}
    >
      <td style={{ padding: "12px" }}>
        {item.id}
      </td>

      <td style={{ padding: "12px" }}>
        {item.inventoryId}
      </td>

      <td style={{ padding: "12px" }}>
        {item.quantity}
      </td>

      <td style={{ padding: "12px" }}>
        {item.status}
      </td>

      <td style={{ padding: "12px" }}>
        {new Date(
          item.expiresAt
        ).toLocaleString()}
      </td>

      <td style={{ padding: "12px" }}>
        {item.status ===
        "PENDING" ? (
          <button
            onClick={async () => {
              await fetch(
                `/api/reservations/${item.id}/confirm`,
                {
                  method: "POST",
                }
              );

              loadProducts();
            }}
            style={{
              padding: "8px 12px",
              backgroundColor:
                "orange",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Confirm
          </button>
        ) : item.status ===
  "CONFIRMED" ? (
  <span
    style={{
      color: "green",
      fontWeight: "bold",
    }}
  >
    Confirmed
  </span>
) : (
  <span
    style={{
      color: "red",
      fontWeight: "bold",
    }}
  >
    Released
  </span>
)}
      </td>
    </tr>
  ))}
  </tbody>
        </table>
      </div>
    </main>
  );
}