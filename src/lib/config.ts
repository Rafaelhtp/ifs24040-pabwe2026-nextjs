/**
 * Base URL yang dipakai browser untuk memanggil API.
 * Path same-origin ini diteruskan ke https://open-api.delcom.org/api/v1 oleh `rewrites`
 * di next.config.ts, sehingga tidak ada request cross-origin (CORS).
 */
export const DELCOM_BASEURL = "/api-proxy";

export const APP_PORT = Number(process.env.APP_PORT || 3000);