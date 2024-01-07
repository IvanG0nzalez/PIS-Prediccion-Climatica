"use client";
import { useEffect, useState } from "react";
import { obtenerClimatify } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";

const ObtenerPrediccion = () => {
  const [predicciones, setPredicciones] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerClimatify("predicciones", token);
      setPredicciones(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!predicciones || predicciones.length === 0) {
    return (
      <div className="error-screen">
        <img
          src="./error.png"
          alt="Mensaje de error"
          style={{ height: "150px", width: "auto" }}
        />
        <p>No hay predicciones disponibles.</p>
        <Link href="/">Volver a la página principal</Link>

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
    <div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <div className="list-group">
            {predicciones.map((prediccion, i) => (
              <div key={i} className="list-group-item">
                <div className="content">
                  <h5>
                    {prediccion.fecha} - {prediccion.hora}
                  </h5>
                  <p> {prediccion.sensor.alias} </p>
                  <p> {prediccion.valor_medido} % </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          {predicciones.map((auto, i) => (
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
