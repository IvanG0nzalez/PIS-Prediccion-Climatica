"use client";
import Menu from "@/componentes/menu";
import Link from "next/link";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, trigger } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import mensajes from "@/componentes/Mensajes";
import { enviar, obtener } from "@/hooks/Conexion";
import { getToken, estaSesion} from "@/hooks/SessionUtil";

export default function AgregarUsuario() {
  const router = useRouter();
  const token = getToken();
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState("");

  // Validaciones
  const validationSchema = Yup.object().shape({
    nombres: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Ingrese solo letras en el campo de nombres")
      .required("Ingrese los nombres del usuario"),
    apellidos: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Ingrese solo letras en el campo de apellidos")
      .required("Ingrese los apellidos del usuario"),
    cedula: Yup.string()
      .matches(
        /^[0-9]{10}$/,
        "Ingrese una cédula válida de 10 dígitos sin espacios ni guiones"
      )
      .required("Ingrese la cedula del usuario"),
    clave: Yup.string().required("Ingrese el clave del usuario"),
    nombre_usuario: Yup.string().required("Ingrese el nombre de usuario"),
    id_rol: Yup.string().required("Seleccione un rol"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState, setValue } = useForm(formOptions);
  let { errors } = formState;

  useEffect(() => {
    const obtenerRoles = async () => {
      const response = await obtener("admin/roles", token);
      setRoles(response.datos);
      console.log(response.datos);
    };

    obtenerRoles();
  });

  const sendData = async (data) => {
    console.log(data);
    var dato = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      cedula: data.cedula,
      clave: data.clave,
      nombre_usuario: data.nombre_usuario,
      id_rol: selectedRol,
    };

    console.log(dato);
    enviar("admin/usuarios/guardar", dato, token).then(() => {
      mensajes("Usuario guardado correctamente", "OK", "success");
      router.push("/cuenta");
    });
  };

  if (!estaSesion()) {
    router.push("/");
    return null;
  }

  return (
    <div className="row">
      <Menu></Menu>
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
                <label className="form-label">Nombres</label>
                <input
                  {...register("nombres")}
                  name="nombres"
                  id="nombres"
                  className={`form-control ${
                    errors.nombres ? "is-invalid" : ""
                  }`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.nombres?.message}
                </div>
              </div>
              <div className="form-outline form-white mb-4">
                <label className="form-label">Apellidos</label>
                <input
                  {...register("apellidos")}
                  name="apellidos"
                  id="apellidos"
                  className={`form-control ${
                    errors.apellidos ? "is-invalid" : ""
                  }`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.apellidos?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Cedula</label>
                <input
                  {...register("cedula")}
                  name="cedula"
                  id="cedula"
                  className={`form-control ${
                    errors.cedula ? "is-invalid" : ""
                  }`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.cedula?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Nombre Usuario</label>
                <input
                  {...register("nombre_usuario")}
                  name="nombre_usuario"
                  id="nombre_usuario"
                  className={`form-control ${
                    errors.nombre_usuario ? "is-invalid" : ""
                  }`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.nombre_usuario?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Clave</label>
                <input
                  {...register("clave")}
                  name="clave"
                  type="password"
                  id="clave"
                  className={`form-control ${errors.clave ? "is-invalid" : ""}`}
                />
                <div className="alert alert-danger invalid-feedback">
                  {errors.clave?.message}
                </div>
              </div>

              <div className="form-outline form-white mb-4">
                <label className="form-label">Rol</label>
                <select
                  {...register("id_rol", {
                    required: "Porfavor seleciona un rol",
                  })}
                  name="id_rol"
                  id="id_rol"
                  defaultValue=""
                  className={`form-control ${
                    errors.id_rol ? "is-invalid" : ""
                  }`}
                  onChange={(e) => {
                    setSelectedRol(e.target.value);
                    setValue("id_rol", e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Seleccione un rol
                  </option>
                  {roles.map((rol) => (
                    <option key={rol.nombre} value={rol.external_id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                <div className="alert alert-danger invalid-feedback">
                  {errors.id_rol?.message}
                </div>
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-success">
                  Agregar
                </button>
                <Link href="/cuenta" className="btn btn-danger">
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
