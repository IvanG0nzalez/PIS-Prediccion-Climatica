"use client";
import { useEffect, useState } from "react";
import { obtenerClimatify } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import Link from "next/link";
import { Carousel } from "react-bootstrap";

const ObtenerPrediccion = () => {
  const [predicciones, setPredicciones] = useState([]);
  const rol = getRol();

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtenerClimatify("/", token);
      setPredicciones(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!predicciones || predicciones === 0) {
    return <p>No hay historiales disponibles.</p>;
  }

  return (
    <div>
      {rol === "gerente" && (
        <div
          style={{
            position: "relative",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Link href={"/historiales/agregarAuto"} className="btn btn-warning">
            Agregar Auto
          </Link>
        </div>
      )}

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

                  {rol === "gerente" && (
                    <div className="button-container">
                      <Link
                        href={`historiales/actualizarhistoriales/${prediccion.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Modificar
                      </Link>

                      <Link
                        href={`historiales/agregarImagen/${prediccion.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Agregar Imagen
                      </Link>
                    </div>
                  )}
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