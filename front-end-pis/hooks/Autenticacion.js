import {
  enviar,
  crearAuto,
  actualizarAuto,
  crearComprador,
  crearVenta,
  actualizarVenta,
} from "./Conexion";
import { save, saveToken, getToken } from "./SessionUtil";

export async function inicio_sesion(data) {
  const sesion = await enviar("admin/inicio_sesion", data);
  if (sesion && sesion.code === 200 && sesion.data.token) {
    saveToken(sesion.data.token);
    save("id", sesion.data.external_id);
    save("user", sesion.data.nombre_usuario);
    save("rol", sesion.data.rol);
  }
  return sesion;
}

export async function guardarAuto(data) {
  const token = getToken();
  const response = await crearAuto("admin/auto/save", data, token);
  return response;
}

export async function modificarAuto(data, external) {
  const token = getToken();
  const response = await actualizarAuto(
    "admin/auto/modificar/" + external,
    data,
    token
  );
  return response;
}

export async function modificarVenta(data, external) {
  const token = getToken();
  const response = await actualizarVenta(
    "admin/venta/modificar/" + external,
    data,
    token
  );
  return response;
}

export async function guardarVenta(data) {
  const token = getToken();
  const response = await crearVenta("/admin/venta/save", data, token);
  return response;
}

export async function guardarComprador(data) {
  const token = getToken();
  const response = await crearComprador("admin/comprador/save", data, token);
  return response;
}
