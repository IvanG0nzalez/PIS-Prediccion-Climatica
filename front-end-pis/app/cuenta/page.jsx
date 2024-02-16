"use client";
import Menu from "@/componentes/menu";
import ObtenerCuenta from "@/componentes/obtenerCuenta";
import { useRouter } from "next/navigation";
import { estaSesion } from "@/hooks/SessionUtil";

export default function Cuentas() {
  const router = useRouter();

  if (!estaSesion()) {
    router.push("/");
    return null;
  }

  return (
    <div className="row">
      <Menu></Menu>

      <ObtenerCuenta></ObtenerCuenta>
    </div>
  );
}
