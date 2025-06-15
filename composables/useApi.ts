export const useApi = async <T>(
  endpoint: string,
  options: any = {},
  retries = 0
) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiUrl || "http://localhost:3000";
  const { data: sessionData, refresh } = useAuth();
  try {
    return await useFetch<T>(`${baseURL}/api/v1/${endpoint}`, {
      server: false,
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${sessionData.value?.sessionToken}`,
      },
    });
  } catch (e: any) {
    console.error(e);
    if (e?.status === 403 || e?.status === 401) {
      console.log("Refreshing session...");
      try {
        if (retries > 3) {
          throw new Error("Max retries exceeded");
        }
        await refresh();
        return await useApi(endpoint, options, retries + 1);
      } catch (refreshError) {
        console.error("Failed to refresh session:", refreshError);
      }
    }
    console.error("Failed to fetch data:", e);
  }
};