"use client";
import Menu from "@/componentes/menu";
import ObtenerHistorial from "@/componentes/obtenerHistorial";
import { useRouter } from "next/navigation";
import { estaSesion } from "@/hooks/SessionUtil";

export default function Historial() {
  const router = useRouter();

  if (!estaSesion()) {
    router.push("/");
    return null;
  }

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerHistorial></ObtenerHistorial>
      </div>
    </div>
  );
}
