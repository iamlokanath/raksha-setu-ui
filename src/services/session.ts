let accessToken = "";
let refreshToken = "";

export function getAccess() {
  return accessToken;
}

export function getRefresh() {
  return refreshToken;
}

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
}

export function clearTokens() {
  accessToken = "";
  refreshToken = "";
}
