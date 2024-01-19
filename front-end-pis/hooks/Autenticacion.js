import { enviar } from "./Conexion";
import { save, saveToken, getToken } from "./SessionUtil";

export async function inicio_sesion(info) {
  const sesion = await enviar("admin/inicio_sesion", info);
  if (sesion && sesion.code === 200 && sesion.info.token) {
    saveToken(sesion.info.token);
    save("id", sesion.info.external_id);
    save("user", sesion.info.user);
    save("rol", sesion.info.id_rol);
  }
  return sesion;
}

