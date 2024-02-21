"use client";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import Link from "next/link";
import LoadingScreen from "./loadingScreen";

const ObtenerCuenta = () => {
  const [cuentas, setCuentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtener("admin/usuarios", token);

      setCuentas(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!cuentas || cuentas.length === 0) {
    return LoadingScreen();
  }

  return (
    <div>
      <div className="table-container">
        <div className="center-h1">
          <h1>Listado de Cuentas</h1>
        </div>

        <Link href={`/cuenta/agregar/`}>
          <button className="btn btn-primary">Agregar Nueva Cuenta</button>
        </Link>

        <table className="table">
          <thead>
            <tr>
              <th>Nombre de Usuario</th>
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
                <td>{cuenta.cuenta.nombre_usuario}</td>
                <td>{cuenta.nombres}</td>
                <td>{cuenta.apellidos}</td>
                <td>{cuenta.cedula}</td>
                <td>
                  <a href="https://chat.openai.com/" target="_blank" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                    {cuenta.rol.nombre}
                  </a>
                </td>            <td>
                  <Link href={`/cuenta/modificar/${cuenta.external_id}`}>
                    <button className="btn btn-primary">Modificar</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .table-container {
          overflow-x: auto;
          width: 80%;
          margin: 20px auto;
          padding: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          overflow: hidden;
          background-color: #fff;
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

        tr:hover {
          background-color: #f5f5f5;
        }

        .btn {
          text-decoration: none;
          color: #fff;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 10px;
        }

        .btn-primary {
          background-color: #007bff;
        }

        .btn-secondary {
          background-color: #6c757d;
        }

        .center-h1 {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ObtenerCuenta;
