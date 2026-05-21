export async function addDomainToVercel(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const authToken = process.env.VERCEL_AUTH_TOKEN;

  if (!projectId || !authToken) {
    console.error("[VERCEL_API] Missing VERCEL_PROJECT_ID or VERCEL_AUTH_TOKEN");
    return { success: false, error: "Server configuration missing" };
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[VERCEL_API_ERROR]", data);
      return { success: false, error: data.error?.message || "Failed to add domain to Vercel" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("[VERCEL_FETCH_ERROR]", error);
    return { success: false, error: "Network error calling Vercel API" };
  }
}

export async function removeDomainFromVercel(domain: string) {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const authToken = process.env.VERCEL_AUTH_TOKEN;

  if (!projectId || !authToken) return { success: false };

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    return { success: response.ok };
  } catch (error) {
    console.error("[VERCEL_DELETE_ERROR]", error);
    return { success: false };
  }
}
