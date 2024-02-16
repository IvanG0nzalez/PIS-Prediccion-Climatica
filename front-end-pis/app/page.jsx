"use client";
import * as Yup from "yup";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { inicio_sesion } from "@/hooks/Autenticacion";
import { estaSesion } from "@/hooks/SessionUtil";
import mensajes from "@/componentes/Mensajes";
import { useRouter } from "next/navigation";
export default function Home() {
  //router
  const router = useRouter();
  //validaciones
  const validationShema = Yup.object().shape({
    usuario: Yup.string().required("Ingrese su usuario"),
    clave: Yup.string().required("Ingrese su clave"),
  });

  const formOptions = { resolver: yupResolver(validationShema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  let { errors } = formState;

  const sendData = (data) => {
    var data = {
      nombre_usuario: data.usuario,
      clave: data.clave,
    };
    inicio_sesion(data).then((datos) => {
      console.log(datos);
      if (!estaSesion()) {
        mensajes(
          "Error al iniciar sesión",
          "Credenciales incorrectas",
          "error"
        );
      } else {
        mensajes("Has ingresado al sistema!", "Bienvenido", "success");
        router.push("/historial");
      }
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: 'url("./fondo.png")',
        backgroundSize: "contain",
        backgroundPosition: "center",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
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

                        {errors.clave && (
                          <div className="alert alert-danger mt-2">
                            {errors.clave.message}
                          </div>
                        )}

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
          </div>
        </div>
      </section>
    </div>
  );
}
