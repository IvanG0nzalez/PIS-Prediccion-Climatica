export const save = (key, data) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, data);
  }
};

export const get = (key) => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem(key);
  }
};

export const saveToken = (key) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("token", key);
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("token");
  }
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    let user = sessionStorage.getItem("user");
    user = user ? JSON.parse(user) : null;
    return user;
  }
};

export const borrarSesion = () => {
  if (typeof window !== "undefined") {
    sessionStorage.clear();
  }
};

export const estaSesion = () => {
  if (typeof window !== "undefined") {
    var token = sessionStorage.getItem("token");
    return token && (token != "undefined" || token != null || token != "null");
  }
};

export const getId = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("id");
  }
  return null;
};

export const getRol = () => {
  if (typeof window !== "undefined") {
    return sessionStorage.getItem("rol");
  }
  return null;
};
