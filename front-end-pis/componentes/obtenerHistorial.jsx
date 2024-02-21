"use client";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import { getToken, getRol } from "@/hooks/SessionUtil";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import LoadingScreen from "./loadingScreen";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

const ObtenerHistorial = () => {
  const [historiales, setHistoriales] = useState([]);
  const [historialesG, setHistorialesG] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [historialPorPagina] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const response = await obtener("admin/historiales", token);
      setHistoriales(response.datos.reverse());
      setHistorialesG(response.datos);
    };

    if (typeof window !== "undefined") {
      fetchData();
    }
  }, []);

  // Paginación
  const indexUltimoHistorial = paginaActual * historialPorPagina;
  const indexPrimerHistorial = indexUltimoHistorial - historialPorPagina;
  const historialesActuales = historiales.slice(
    indexPrimerHistorial,
    indexUltimoHistorial
  );

  const paginate = (pageNumber) => setPaginaActual(pageNumber);

  const formatoValorMedido = (valor, alias) => {
    switch (alias.toLowerCase()) {
      case "temperatura":
        return `${valor} °C`;
      case "humedad":
        return `${valor} %`;
      case "atmosferica":
        return `${valor} hPa`;
      default:
        return valor;
    }
  };

  const fechasUnicas = Array.from(
    new Set(historialesG.map((historial) => historial.fecha))
  ).sort((a, b) => new Date(a) - new Date(b));

  const options = {
    scales: {
      x: {
        type: "category",
        labels: fechasUnicas,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    responsive: true,
  };

  const botonesPaginacion = () => {
    const paginasTotales = Math.ceil(historiales.length / historialPorPagina);
    const botonesMostrar = [];
    const botonesMaximos = 10;

    let inicio = Math.max(1, paginaActual - Math.floor(botonesMaximos / 2));
    let fin = Math.min(paginasTotales, inicio + botonesMaximos - 1);

    if (inicio + botonesMaximos - 1 > paginasTotales) {
      inicio -= inicio + botonesMaximos - 1 - paginasTotales;
    }

    for (let i = inicio; i <= fin; i++) {
      botonesMostrar.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`pagination-button ${paginaActual === i ? "active" : ""}`}
          style={{
            padding: "5px 10px",
            margin: "2px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: paginaActual === i ? "#007bff" : "#fff",
            color: paginaActual === i ? "#fff" : "#007bff",
            fontWeight: paginaActual === i ? "bold" : "normal",
          }}
        >
          {i}
        </button>
      );
    }

    return botonesMostrar;
  };

  const obtenerDatosPorSensor = (alias, fechas) => {
    return fechas.map((fecha) => {
      const historial = historialesG.find(
        (h) =>
          h.sensor.alias.toLowerCase() === alias.toLowerCase() &&
          h.fecha === fecha
      );
      return historial ? historial.valor_medido : null;
    });
  };

  const dataTemperatura = {
    labels: fechasUnicas,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: obtenerDatosPorSensor("Temperatura", fechasUnicas),
        fill: false,
        borderColor: "rgba(173, 216, 230, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(173, 216, 230, 1)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const dataHumedad = {
    labels: fechasUnicas,
    datasets: [
      {
        label: "Humedad (%)",
        data: obtenerDatosPorSensor("Humedad", fechasUnicas),
        fill: false,
        borderColor: "rgba(0,128,0,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0,128,0,1)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const dataAtmosferica = {
    labels: fechasUnicas,
    datasets: [
      {
        label: "Presión Atmosférica (hPa)",
        data: obtenerDatosPorSensor("Atmosferica", fechasUnicas),
        fill: false,
        borderColor: "rgba(0,0,255,1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(0,0,255,1)",
        pointRadius: 5,
        pointHoverRadius: 8,
      },
    ],
  };

  if (!historiales || historiales.length === 0) {
    return LoadingScreen();
  }

  return (
    <div className="filasxd">
      <div className="table-container">
        <div className="pagination">
          <button
            onClick={() => paginate(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="pagination-button"
          >
            «
          </button>
          {botonesPaginacion()}
          <button
            onClick={() => paginate(paginaActual + 1)}
            disabled={
              paginaActual ===
              Math.ceil(historiales.length / historialPorPagina)
            }
            className="pagination-button"
          >
            »
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Sensor</th>
              <th>Valor Medido</th>
            </tr>
          </thead>
          <tbody>
            {historialesActuales.slice().map((historial, i) => (
              <tr key={i}>
                <td>{historial.fecha}</td>
                <td>{historial.hora}</td>
                <td>{historial.sensor.alias}</td>
                <td>
                  {formatoValorMedido(
                    historial.valor_medido,
                    historial.sensor.alias
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="charts-container">
        {/* Gráfica de Temperatura */}
        <div className="chart">
          <h2>Temperatura</h2>
          <Line data={dataTemperatura} options={options} />
        </div>

        {/* Gráfica de Humedad */}
        <div className="chart">
          <h2>Humedad</h2>
          <Line data={dataHumedad} options={options} />
        </div>

        {/* Gráfica Atmosférica */}
        <div className="chart">
          <h2>Presión Atmosférica</h2>
          <Line data={dataAtmosferica} options={options} />
        </div>
      </div>

      <style jsx>{`
        .filasxd {
          display: flex;
          width: 100%;
        }

        .table-container {
          flex: 1;
          margin-right: 20px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        th,
        td {
          border: 1px solid #ddd;
          padding: 14px;
          text-align: left;
        }

        th {
          background-color: #f2f2f2;
        }

        tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .charts-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          margin: 20px;
        }

        .chart {
          margin: 20px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
        }

        .pagination-button {
          padding: 5px 10px;
          margin: 2px;
          border: 1px solid #ccc;
          cursor: pointer;
          background-color: #fff;
          color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default ObtenerHistorial;
