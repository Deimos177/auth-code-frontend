function authorizeClient() {
  const clientId = document.getElementById('clientId').value;

  if (!clientId) {
      alert('Please enter a Client ID.');
      return;
  }

  const url = `https://localhost:8089/api/oauth/authorize?client_id=${clientId}&response_type=code`;
  window.location.href = url;
}