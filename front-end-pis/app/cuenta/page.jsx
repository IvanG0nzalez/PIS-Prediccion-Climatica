"use client";
import Menu from "@/componentes/menu";
import ObtenerCuenta from "@/componentes/obtenerCuenta";
import { useRouter } from "next/navigation";
import { estaSesion } from "@/hooks/SessionUtil";
import { useEffect } from "react";

export default function Cuentas() {
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

      <ObtenerCuenta></ObtenerCuenta>
    </div>
  );
}
