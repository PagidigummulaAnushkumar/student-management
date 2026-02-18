export function setToken(token: string) {
  localStorage.setItem("sms_token", token);
}

export function getToken() {
  return localStorage.getItem("sms_token");
}

export function logout() {
  localStorage.removeItem("sms_token");
}
