import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Menu() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark">
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
                  href="/autos"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-car"></i> Autos
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/ventas"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-cash-register"></i> Ventas
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  href="/compradors"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-user-tie"></i> Compradores
                </Link>
              </li>
            </ul>
            {/* Nuevo elemento en el lado derecho con un icono de auto */}
            <div className="navbar-text text-light fs-4">
              <i className="fas fa-car"></i> Climatifi
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
