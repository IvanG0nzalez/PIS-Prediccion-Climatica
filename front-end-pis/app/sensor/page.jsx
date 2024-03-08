"use client";
import Menu from "@/componentes/menu";
import ObtenerSensor from "@/componentes/obtenerSensor";
import { useRouter } from "next/navigation";
import { estaSesion } from "@/hooks/SessionUtil";
import { useEffect } from "react";

export default function Historial() {
  const router = useRouter();

  useEffect(() => {
    if (!estaSesion()) {
      router.push('/');
    }
  }, [router]);

  if (!estaSesion()) {
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
