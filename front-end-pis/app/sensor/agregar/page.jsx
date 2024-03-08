"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";
import { enviar } from "@/hooks/Conexion";
import { getToken, estaSesion } from "@/hooks/SessionUtil";

export default function AgregarSensor() {
  const router = useRouter();
  const token = getToken();

  // Validaciones
  const validationSchema = Yup.object().shape({
    alias: Yup.string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "Ingrese solo letras, números y espacios en el campo de alias"
      )
      .required("Ingrese el alias del sensor"),
    ip: Yup.string()
      .required("Ingrese la IP del sensor")
      // IP TIPO C (?)
      .matches(
        /^(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,
        "Ingrese una dirección IP válida de Clase C"
      ),
    tipo_sensor: Yup.string().required("Seleccione el tipo de medición de sensor"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  let { errors } = formState;

  useEffect(() => {}, []);

  const sendData = async (data) => {
    console.log(data);
    var dato = {
      alias: data.alias,
      ip: data.ip,
      tipo_sensor: data.tipo_sensor,
    };

    console.log(dato);
    enviar("admin/sensores/guardar", dato, token).then(() => {
      mensajes("Sensor guardado correctamente", "OK", "success");
      router.push("/sensor");
    });
  };

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
      <Menu />
      <div className="container-fluid" style={{ margin: "1%" }}>
        <div
          style={{
            maxWidth: "600px",
            margin: "auto",
            border: "2px solid black",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <form onSubmit={handleSubmit(sendData)}>
            <div>
              <div className="form-outline form-white mb-4">
                <label className="form-label">Alias</label>
                <input
                  {...register("alias")}
                  name="alias"
                  id="alias"
                  className={`form-control ${errors.alias ? "is-invalid" : ""}`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.alias?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">IP del sensor</label>
                <input
                  {...register("ip")}
                  name="ip"
                  id="ip"
                  className={`form-control ${errors.ip ? "is-invalid" : ""}`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.ip?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Tipo de Medicion</label>
                <select
                  {...register("tipo_medicion", {
                    required: "Seleccione el tipo de sensor",
                  })}
                  name="tipo_medicion"
                  id="tipo_medicion"
                  defaultValue=""
                  className={`form-control ${
                    errors.tipo_medicion ? "is-invalid" : ""
                  }`}
                >
                  <option value="" disabled>
                    Seleccione el tipo de sensor
                  </option>
                  <option value="Temperatura">Temperatura</option>
                  <option value="Humedad">Humedad</option>
                  <option value="Atmosférica">Atmosférica</option>
                </select>
                <div className="alert alert-danger invalid-feedback">
                  {errors.tipo_medicion?.message}
                </div>
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-success">
                  Guardar cambios
                </button>
                <Link href="/sensor" className="btn btn-danger">
                  Volver
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
