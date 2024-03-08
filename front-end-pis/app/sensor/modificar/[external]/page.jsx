"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import mensajes from "@/componentes/Mensajes";
import { getToken, estaSesion } from "@/hooks/SessionUtil";
import { obtener, actualizar } from "@/hooks/Conexion";
import React, { useState } from 'react';

export default function AgregarSensor() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();
  const [sensorData, setSensorData] = useState({});
  const [tipoMedicionSeleccionada, setTipoMedicionSeleccionada] = useState("");

  // Validaciones
  const validationSchema = Yup.object().shape({
    alias: Yup.string()
      .required("Ingrese el alias del sensor")
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        "Ingrese solo letras, números y espacios en el campo de alias"
      ),

    ip: Yup.string()
      .required("Ingrese la dirección IP del sensor")
      .matches(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/,
        "Ingrese una dirección IP válida de tipo IPv4"
      ),
    tipo_medicion: Yup.string().required("Seleccione el tipo de medición de sensor"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  let { errors } = formState;

  useEffect(() => {
    const infoSensor = async () => {
      const response = await obtener(
        "admin/sensores/obtener/" + external,
        token
      );

      if (response.code === 200) {
        const sensorInfo = response.datos;
        setSensorData(sensorInfo);
        setTipoMedicionSeleccionada(sensorInfo.tipo_medicion);
      } else {
        console.error("Error al obtener sensor");
      }
    };
    infoSensor();
  });

  useEffect(() => {
    if (Object.keys(sensorData).length > 0 && tipoMedicionSeleccionada !== "") {
      reset({
        alias: sensorData.alias,
        ip: sensorData.ip,
        tipo_medicion: tipoMedicionSeleccionada,
      });
    }
  }, [sensorData, tipoMedicionSeleccionada, reset]);

  if (!estaSesion()) {
    router.push("/");
    return null;
  }

  const sendData = async (data) => {
    console.log("data", data);
    var dato = {
      alias: data.alias,
      ip: data.ip,
      tipo_medicion: data.tipo_medicion,
    };

    console.log("dato", dato);
    actualizar("admin/sensores/modificar/" + external, dato, token).then(() => {
      mensajes("Información del sensor modificada correctamente", "OK", "success");
      router.push("/sensor");
    });
  };

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
                  value={tipoMedicionSeleccionada}
                  onChange={(e) => setTipoMedicionSeleccionada(e.target.value)}
                  className={`form-control ${errors.tipo_medicion ? "is-invalid" : ""
                    }`}
                >
                  <option value="" disabled>
                    Seleccione el tipo de sensor
                  </option>
                  <option value="Temperatura">Temperatura</option>
                  <option value="Humedad">Humedad</option>
                  <option value="Atmosferica">Atmosférica</option>
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
