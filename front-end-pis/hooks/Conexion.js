let URL = "http://localhost:3000/api/";
export function url_api() {
  return URL;
}

export async function obtener(recurso) {
  const response = await fetch(URL + recurso);
  return await response.json();
}

export async function enviar(recurso, data) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  return responseData;
}

export async function obtenerClimatify(recurso, token) {
  const headers = {
    "Content-type": "application/json",
    "token-key": token,
  };
  const response = await fetch(URL + recurso, {
    cache: "no-store",
    method: "GET",
    headers: headers,
  });
  const responseData = await response.json();
  return responseData;
}





