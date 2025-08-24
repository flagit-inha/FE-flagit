export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };
  let res = await fetch(url, options);

  if (res.status === 401) {
    // access_token 만료 → refresh로 재발급 시도
    const refreshToken = localStorage.getItem("refresh_token");
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const refreshRes = await fetch(`${apiBaseUrl}/users/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    const refreshData = await refreshRes.json();
    if (refreshRes.ok && refreshData.access_token) {
      localStorage.setItem("token", refreshData.access_token);
      options.headers["Authorization"] = `Bearer ${refreshData.access_token}`;
      res = await fetch(url, options);
    } else {
      window.location.href = "/users/login";
      return null;
    }
  }
  return res;
}