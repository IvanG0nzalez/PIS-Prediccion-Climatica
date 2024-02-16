"use client";
import Menu from "@/componentes/menu";
import ObtenerPrediccion from "@/componentes/obtenerPrediccion";
import { useRouter } from "next/navigation";
import { estaSesion } from "@/hooks/SessionUtil";

export default function Prediccion() {
  const router = useRouter();

  if (!estaSesion()) {
    router.push("/");
    return null;
  }

  return (
    <div className="row">
      <Menu></Menu>
      <div className="container-fluid" style={{ margin: "1%" }}>
        <ObtenerPrediccion></ObtenerPrediccion>
      </div>
    </div>
  );
}