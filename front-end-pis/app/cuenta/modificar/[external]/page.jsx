"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/hooks/SessionUtil";
import mensajes from "@/componentes/Mensajes";
import { obtener, actualizar } from "@/hooks/Conexion";

export default function ModificarUsuario() {
  const router = useRouter();
  const token = getToken();
  const { external } = useParams();
  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    const infoUsuario = async () => {
      const response = await obtener(
        "admin/usuarios/obtener/" + external,
        token
      );

      if (response.code === 200) {
        const usuarioData = response.datos;

        setUsuario(usuarioData);
        reset({
          nombres: usuarioData.nombres,
          apellidos: usuarioData.apellidos,
          nombre_usuario: usuarioData.cuenta.nombre_usuario,
        });

        console.log(usuarioData);
      } else {
        console.error("Error al obtener usuario");
      }
    };

    infoUsuario();
  }, []);

  // Validations
  const validationSchema = Yup.object().shape({
    nombres: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Ingrese solo letras en el campo de nombres")
      .required("Ingrese los nombres del usuario"),
    apellidos: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Ingrese solo letras en el campo de apellidos")
      .required("Ingrese los apellidos del usuario"),
    nombre_usuario: Yup.string().required("Ingrese el nombre de usuario"),
    clave: Yup.string().required("Ingrese la contraseña"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  const { errors } = formState;

  const sendData = (formData) => {
    var datos = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      nombre_usuario: formData.nombre_usuario,
      clave: formData.clave,
    };
    console.log(datos);

    actualizar("admin/usuarios/modificar/" + external, datos, token).then(
      () => {
        mensajes("Usuario Modificado correctamente", "OK", "success");
        router.push("/cuenta");
      }
    );
  };

  return (
    <div>
      <Menu />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card">
              <div className="card-body p-5 text-center">
                <h2 className="mb-4">Modificar Usuario</h2>
                <form onSubmit={handleSubmit(sendData)}>
                  <div className="mb-4">
                    <label className="form-label">Nombres</label>
                    <input
                      {...register("nombres")}
                      name="nombres"
                      id="nombres"
                      className={`form-control ${
                        errors.nombres ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.nombres?.message}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Apellidos</label>
                    <input
                      {...register("apellidos")}
                      name="apellidos"
                      id="apellidos"
                      className={`form-control ${
                        errors.apellidos ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.apellidos?.message}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Usuario</label>
                    <input
                      {...register("nombre_usuario")}
                      name="nombre_usuario"
                      id="nombre_usuario"
                      className={`form-control ${
                        errors.nombre_usuario ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.nombre_usuario?.message}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Clave</label>
                    <input
                      {...register("clave")}
                      name="clave"
                      id="clave"
                      // type=""
                      className={`form-control ${
                        errors.clave ? "is-invalid" : ""
                      }`}
                    />
                    <div className="invalid-feedback">
                      {errors.clave?.message}
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-success">
                      Guardar cambios
                    </button>
                    <Link href="/cuenta" className="btn btn-danger">
                      Volver
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
