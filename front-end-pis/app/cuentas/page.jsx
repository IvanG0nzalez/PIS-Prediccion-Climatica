import Menu from "@/componentes/menu";
import ObtenerCuenta from "@/componentes/obtenerCuenta";
import Link from "next/link";

export default async function Cuentas() {
  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid">
        <ObtenerCuenta></ObtenerCuenta>
      </div>
    </div>
  );
}
