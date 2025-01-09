async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function generateRandomString(length) {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let random = "";
  for (let i = 0; i < length; i++) {
    random += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return random;
}

async function authorizeClient() {
  const clientId = document.getElementById("clientId").value;
  const redirectUri = document.getElementById("redirectUri").value;

  if (!clientId) {
    alert("Please enter a Client ID.");
    return;
  }

  if (!redirectUri) {
    alert("Please enter a Redirect URI.");
    return;
  }

  // Gera o code_verifier e o code_challenge
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Armazena o code_verifier no localStorage
  localStorage.setItem("pkce_code_verifier", codeVerifier);

  // Constrói a URL de autorização (inclui o redirect_uri)
  const url = `https://localhost:8089/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  // Redireciona para a URL de autorização
  window.location.href = url;
}