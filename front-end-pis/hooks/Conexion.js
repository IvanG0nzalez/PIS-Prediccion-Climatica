let URL = "http://localhost:3000/api/";
export function url_api() {
  return URL;
}

export async function obtener(recurso, token) {
  const headers = {
    "Content-type": "application/json",
    token: token,
  };
  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}

export async function actualizar(recurso, data, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    token: token,
  };

  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return responseData;
}

export async function enviar(recurso, data, token) {
  const headers = {
    Accept: "application/json",
    "Content-type": "application/json",
    token: token,
  };

  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return responseData;
}
