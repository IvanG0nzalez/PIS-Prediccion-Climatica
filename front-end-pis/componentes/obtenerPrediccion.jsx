"use client";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import Link from "next/link";
import LoadingScreen from "./loadingScreen";

const ObtenerPrediccion = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtener("reporte", token);
      setReportes(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!reportes || reportes.length === 0) {
    return LoadingScreen();
  }

  // Reporte por hora
  const reportesPorHoras = reportes.reduce((acc, reporte) => {
    const hora = `${reporte.fecha} - ${reporte.hora}`;
    if (!acc[hora]) {
      acc[hora] = [];
    }
    acc[hora].push(reporte);
    return acc;
  }, {});

  return (
    <div className="container">
      {Object.entries(reportesPorHoras).map(([hora, reportesHora], index) => (
        <div key={index}>
          <h3>{`Reportes para ${hora}`}</h3>
          <table>
            <thead>
              <tr>
                <th>Tipo Medicion</th>
                <th>Valor Calculado</th>
                <th>Valor Real</th>
                <th>Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {reportesHora.map((reporte, i) => (
                <tr key={i}>
                  <td>{reporte.tipo_medicion}</td>
                  <td>{reporte.valor_calculado}</td>
                  <td>{reporte.valor_real}</td>
                  <td>{reporte.error.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <style jsx>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }
      `}</style>
    </div>
  );
};

export default ObtenerPrediccion;
