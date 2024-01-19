import Menu from "@/componentes/menu";
import ObtenerPrediccion from "@/componentes/obtenerPrediccion";
import Link from "next/link";

export default async function Prediccion() {
  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerPrediccion></ObtenerPrediccion>
      </div>
    </div>
  );
}