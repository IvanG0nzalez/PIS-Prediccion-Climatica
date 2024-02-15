import { enviar } from "./Conexion";
import { save, saveToken, getToken } from "./SessionUtil";

export async function inicio_sesion(datos) {
  const sesion = await enviar("inicio_sesion", datos);
  if (sesion && sesion.code === 200 && sesion.datos.token) {
    saveToken(sesion.datos.token);
    save("id", sesion.datos.external_id);
    save("user", sesion.datos.user);
  }
  return sesion;
}

