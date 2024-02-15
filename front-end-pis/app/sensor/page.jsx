"use client";
import Menu from "@/componentes/menu";
import ObtenerSensor from "@/componentes/obtenerSensor";
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
        <ObtenerSensor></ObtenerSensor>
      </div>
    </div>
  );
}
