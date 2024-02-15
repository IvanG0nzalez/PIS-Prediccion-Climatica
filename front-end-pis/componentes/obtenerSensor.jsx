"use client";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import { getToken } from "@/hooks/SessionUtil";
import Link from "next/link";
import LoadingScreen from "./loadingScreen";

const ObtenerSensor = () => {
  const [sensores, setSensores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtener("admin/sensores", token);
      setSensores(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  if (!sensores || sensores.length === 0) {
    return LoadingScreen();
  }

  return (
    <div>
      <h1>Listado de Sensores</h1>

      <div className="center-button">
        <Link href={`/sensor/agregar/`}>
          <button className="btn btn-primary">Agregar Sensor</button>
        </Link>
      </div>

      <div className="sensor-list">
        {sensores.map((sensor, i) => (
          <div key={i} className="sensor-item">
            <div className="sensor-header">
              <h3>{sensor.alias}</h3>
              <span className="sensor-icon">&#128266;</span>
            </div>
            <p>
              <strong>IP:</strong> {sensor.ip}
            </p>
            <p>
              <strong>Tipo de Medición:</strong> {sensor.tipo_medicion}
            </p>
            <Link href={`/sensor/modificar/${sensor.external_id}`}>
              <button className="btn btn-primary">Modificar</button>
            </Link>
          </div>
        ))}
      </div>

      <style jsx>{`
        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .sensor-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          margin-top: 20px;
        }

        .sensor-item {
          width: 300px;
          padding: 20px;
          margin: 10px;
          border: 1px solid #4caf50;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          background-color: #e7f7e4;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .sensor-item:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }

        .sensor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sensor-icon {
          font-size: 24px;
          color: #4caf50;
        }

        h3 {
          margin-bottom: 10px;
          color: #333;
        }

        p {
          margin: 5px 0;
          color: #666;
        }

        strong {
          color: #333;
        }

        .center-button {
          text-align: center;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ObtenerSensor;
