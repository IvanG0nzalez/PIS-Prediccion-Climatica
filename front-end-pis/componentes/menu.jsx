"use client";
import { borrarSesion, getId, getToken } from "@/hooks/SessionUtil";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { obtener } from "@/hooks/Conexion";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Menu() {
  const router = useRouter();
  const token = getToken();
  const external = getId();

  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const openDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <div>
      <div className="drawer-icon" onClick={openDrawer}>
        <i className="fas fa-bars"></i>
      </div>

      <div className="drawer" style={{ left: drawerOpen ? "0" : "-250px" }}>
        <ul>
          <li className="app-name">
            <i className="fas fa-cloud-sun-rain fa-lg"></i>{" "}
            <span>Climatify</span>
          </li>

          <li>
            <button
              className="menu-item"
              onClick={() => router.push("/historial")}
            >
              <i className="fas fa-cloud"></i> Historial
            </button>
          </li>
          <li>
            <button
              className="menu-item"
              onClick={() => router.push("/prediccion")}
            >
              <i className="fas fa-clock-rotate-left"></i> Predicciones
            </button>
          </li>
          <li>
            <button
              className="menu-item"
              onClick={() => router.push("/sensor")}
            >
              <i className="fa-solid fa-microchip"></i> Sensores
            </button>
          </li>
          {usuarioData && usuarioData.rol.nombre === "Super-Administrador" && (
            <li>
              <button
                className="menu-item"
                onClick={() => router.push("/cuenta")}
              >
                <i className="fas fa-user-tie"></i> Cuentas
              </button>
            </li>
          )}
        </ul>
        <button className="menu-item logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>

      <style jsx>{`
        .drawer-icon {
          cursor: pointer;
          font-size: 24px;
          padding: 10px;
        }

        .drawer {
          width: 250px;
          height: 100vh;
          background-color: rgba(51, 51, 51, 0.8);
          color: #fff;
          position: fixed;
          top: 0;
          left: ${drawerOpen ? "0" : "-250px"};
          transition: left 0.1s ease-in-out;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
        }

        .drawer ul {
          list-style: none;
          padding: 20px;
        }

        .drawer ul li {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .drawer button.menu-item {
          text-decoration: none;
          color: #fff;
          font-color: #fff;
          font-size: 18px;
          display: block;
          background: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border-radius: 8px;
          border: 1px solid #fff;
          padding: 10px;
          width: 80%;
          box-sizing: border-box;
          text-align: center;
        }

        .drawer button.menu-item:hover {
          background-color: #333;
        }

        .drawer i {
          margin-right: 8px;
          color: #fff;
        }

        .drawer button.menu-item.logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          width: 80%;
          background-color: none;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          border-radius: 8px;
          box-sizing: border-box;
          text-align: center;
          position: absolute;
          bottom: 25px;
          left: 20px;
        }

        .drawer button.menu-item.logout-btn i {
          margin-right: 8px;
        }

        .drawer button.menu-item.logout-btn:hover {
          background-color: #c9302c;
        }

        .drawer ul li.app-name {
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .drawer ul li.app-name i {
          margin-right: 8px;
        }
      `}</style>
    </div>
  );
}
