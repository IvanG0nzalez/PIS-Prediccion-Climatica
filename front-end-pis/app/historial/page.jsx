import Menu from "@/componentes/menu";
import ObtenerHistorial from "@/componentes/obtenerHistorial";
import Link from "next/link";

export default async function Historial() {
  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerHistorial></ObtenerHistorial>
      </div>
    </div>
  );
}
