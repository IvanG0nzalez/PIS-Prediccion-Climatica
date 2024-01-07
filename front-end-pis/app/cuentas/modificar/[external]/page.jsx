"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";

export default function ModificarUsuario() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();
  const [cuentaData, setCuentaData] = useState({});

  useEffect(() => {}, []);

  // Validaciones
  const validationSchema = Yup.object().shape({
    marca: Yup.string().required("Ingrese la marca del auto"),
    modelo: Yup.string().required("Ingrese el modelo del auto"),
    precio: Yup.string().required("Ingrese el valor del auto"),
    anio: Yup.string().required("Ingrese el año del auto"),
    color: Yup.string().required("Seleccione un color"),
    estado: Yup.string().required("Seleccione un estado"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset, setValue, watch } =
    useForm(formOptions);
  let { errors } = formState;

  const estadoValue = watch("estado");

  const sendData = (formData) => {
    var dato = {
      nombres: formData.marca,
      apellidos: formData.modelo,
      cedula: formData.precio,
      clave: formData.anio,
      estado: formData.estado === "Disponible", // Convertir a booleano
      color: selectedColor,
    };
  };

  return (
    <div>
      <div className="col-12 col-md-8 col-lg-6 col-xl-5">
        <div
          className="card"
          style={{
            border: "1px solid rgba(0, 0, 0, 0.8)",
            borderRadius: "1rem",
            backgroundColor: "rgba(250, 250, 250, 0.2)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          <div className="card-body p-5 text-center">
            <form onSubmit={handleSubmit(sendData)}>
              <div className="mb-md-5 mt-md-4 pb-5">
                <h2 className="fw-bold mb-2 text-uppercase">
                  Inicio de Sesión
                </h2>
                <p className="text-dark-50 mb-5">
                  Ingrese su usuario y contraseña
                </p>

                <div className="form-outline form-white mb-4">
                  <label className="form-label">Usuario</label>
                  <input
                    {...register("usuario")}
                    name="usuario"
                    id="usuario"
                    className={`form-control ${
                      errors.usuario ? "is-invalid" : ""
                    }`}
                  />

                  <div className="alert alert-danger invalid-feedback">
                    {errors.usuario?.message}
                  </div>
                </div>

                <div className="form-outline form-white mb-4">
                  <label className="form-label">Contraseña</label>
                  <div className="input-group">
                    <input
                      {...register("clave")}
                      name="clave"
                      type={showPassword ? "text" : "password"}
                      id="clave"
                      className={`form-control ${
                        errors.clave ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                  <div className="form-check mt-2 d-flex align-items-center">
                    <input
                      type="checkbox"
                      onChange={() => setShowPassword(!showPassword)}
                      id="mostrarContrasena"
                      className="form-check-input"
                      style={{
                        cursor: "pointer",
                        marginRight: "6px",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.8)",
                      }}
                    />
                    <label
                      style={{
                        fontSize: "12px",
                        color: "gray",
                        marginTop: "5px",
                      }}
                    >
                      Mostrar contraseña
                    </label>
                  </div>

                  <div className="alert alert-danger invalid-feedback">
                    {errors.clave?.message}
                  </div>
                </div>

                <button
                  className="btn btn-outline-dark btn-lg px-5"
                  type="submit"
                >
                  Acceder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* //TODO HACER VISTA PARA MODIFICAR */}
    </div>
  );
}
