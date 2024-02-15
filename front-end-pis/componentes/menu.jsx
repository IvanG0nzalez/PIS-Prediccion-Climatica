"use client";
import Link from "next/link";
import { borrarSesion, getId, getToken } from "@/hooks/SessionUtil";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Menu() {
  const router = useRouter();
  const token = getToken();
  const external = getId();

  const [usuarioData, setUsuarioData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const infoUsuario = async () => {
      try {
        const response = await obtener(
          "admin/usuarios/obtener/" + external,
          token
        );

        if (response.code === 200) {
          setUsuarioData(response.datos);
        } else {
          setError("Error al obtener usuario");
        }
      } catch (error) {
        setError("Error inesperado al obtener usuario");
      }
    };

    infoUsuario();
  }, [external, token]);

  const handleLogout = () => {
    borrarSesion();
    router.push("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  href="/historial"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-cloud"></i> Historial
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/prediccion"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-clock-rotate-left"></i> Predicciones
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href="/sensor"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fa-solid fa-microchip"></i> Sensores
                </Link>
              </li>

              {usuarioData &&
                usuarioData.rol.nombre === "Super-Administrador" && (
                  <li className="nav-item">
                    <Link
                      href="/cuenta"
                      className="nav-link active text-light"
                      aria-current="page"
                    >
                      <i className="fas fa-user-tie"></i> Cuentas
                    </Link>
                  </li>
                )}
            </ul>
            <div className="navbar-text text-light fs-4">
              <Link
                href=""
                className="nav-link active text-light"
                aria-current="page"
              >
                <i className="fas fa-cloud-sun-rain"></i> Climatify
              </Link>
            </div>
            <div className="navbar-text text-light fs-4">
              <button
                className="btn btn-link text-light"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar-toggler-icon {
          color: white;
        }
      `}</style>
    </div>
  );
}
