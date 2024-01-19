"use client";
import { useEffect, useState } from "react";
import { obtenerClimatify } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";

const ObtenerCuenta = () => {
  const [cuentas, setCuentas] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerClimatify("admin/usuarios", token);
      setCuentas(response.data);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!cuentas || cuentas.length === 0) {
    return (
      <div className="error-screen">
        <img
          src="./error.png"
          alt="Mensaje de error"
          style={{ height: "150px", width: "auto" }}
        />
        <p>No hay cuentas disponibles.</p>

        <style jsx>{`
          .error-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            text-align: center;
          }

          img {
            max-width: 100%;
            height: auto;
            margin-bottom: 10px; /* Ajusta el margen según tus necesidades */
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Cédula</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta, i) => (
            <tr key={i}>
              <td>{cuenta.nombres}</td>
              <td>{cuenta.apellidos}</td>
              <td>{cuenta.cedula}</td>
              <td>{cuenta.id_rol}</td>
              <td>
                <Link href={`/cuentas/modificar/${cuenta.external_id}`}>
                  <button className="btn btn-primary">Modificar</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <style jsx>{`
        .table-container {
          overflow-x: auto;
          width: 80%;
          margin: 0 auto;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
        }
  
        th,
        td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
          vertical-align: middle;
        }
  
        th {
          background-color: #f2f2f2;
        }
  
        .btn {
          text-decoration: none;
          color: #fff;
          padding: 10px 16px;
          background-color: #007bff;
          border: none;
          border-radius: 4px;
          cursor: pointer;

        }
  
        tr:hover {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};
export default ObtenerCuenta;
