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
      const response = await obtener("admin/reporte", token);
      setReportes(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!reportes || reportes.length === 0) {
    return LoadingScreen();
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <div className="list-group">
            {reportes.map((reporte, i) => (
              <div key={i} className="list-group-item">
                <div className="content">
                  <h5>
                    {reporte.fecha} - {reporte.hora}
                  </h5>
                  <p> {reporte.valor_calculado} </p>
                  <p> {reporte.valor_real} </p>
                  <p> {reporte.error} </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          {reportes.map((auto, i) => (
            <div key={i} className="list-group-item"></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-carousel {
          max-height: 200px;
        }

        .custom-carousel-image {
          max-height: 200px;
          object-fit: contain;
        }

        .list-group {
          display: flex;
          flex-wrap: wrap;
        }

        .list-group-item {
          flex: 0 0 48%;
          margin: 1%;
        }

        .content {
          padding-right: 20px;
        }

        .button-container {
          display: flex;
          gap: 5px;
        }
      `}</style>
    </div>
  );
};

export default ObtenerPrediccion;
