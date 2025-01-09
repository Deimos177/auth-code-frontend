(async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    document.getElementById("output").innerText =
      "No authorization code received in callback.";
    return;
  }

  const tokenUrl = new URL("https://localhost:8089/api/oauth/token");
  const clientId = "6c05dd91-d223-4aa1-8fde-57ff06679c10";
  const redirectUri = "http://localhost:8081/callback";
  const codeVerifier = localStorage.getItem("pkce_code_verifier");

  if (!codeVerifier) {
    console.error("Missing code_verifier in localStorage.");
    document.getElementById("output").innerText = "Missing code_verifier.";
    return;
  }

  console.log("Authorization Code:", code);
  console.log("Retrieved code_verifier:", codeVerifier);

  try {
    tokenUrl.searchParams.append("code_verifier", codeVerifier);

    const response = await fetch(`${tokenUrl}?${tokenUrl.searchParams}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching token:", errorText);
      document.getElementById("output").innerHTML = `
                  <p>Error fetching token:</p>
                  <pre>HTTP ${response.status}: ${errorText}</pre>`;
      return;
    }

    const data = await response.json();
    console.log("Access Token:", data);
    document.getElementById("output").innerHTML = `<pre>${JSON.stringify(
      data,
      null,
      2
    )}</pre>`;
  } catch (error) {
    console.error("Request failed:", error.message);
    document.getElementById("output").innerText = `Error: ${error.message}`;
  }
})();