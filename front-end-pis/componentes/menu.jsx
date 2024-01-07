import Link from "next/link";
import "@fortawesome/fontawesome-free/css/all.css";

export default function Menu() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <button
            className="navbar-toggler navbar-light"
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
                  href="/cuentas"
                  className="nav-link active text-light"
                  aria-current="page"
                >
                  <i className="fas fa-user-tie"></i> Cuentas
                </Link>
              </li>
            </ul>
            <div className="navbar-text text-light fs-4">
              <Link
                href="/clima"
                className="nav-link active text-light"
                aria-current="page"
              >
                <i className="fas fa-cloud-sun-rain"></i> Climatify
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
