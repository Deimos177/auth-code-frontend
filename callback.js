(async function handleCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (!code) {
      document.getElementById('output').innerText = 'No code received in callback.';
      return;
  }

  const tokenUrl = `https://localhost:8089/api/oauth/token`;
  const clientId = '6c05dd91-d223-4aa1-8fde-57ff06679c10';
  const clientSecret = '226d0d7b-17f1-48f8-8a4d-43d36f55077a';
  const redirectUri = 'http://localhost:8081/callback';

  try {
      const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              redirect_uri: redirectUri,
              grant_type: 'authorization_code'
          })
      });

      if (!response.ok) {
          console.error(`Error fetching token: HTTP ${response.status}`);
          const errorText = await response.text();
          document.getElementById('output').innerHTML = `
              <p>Error fetching token:</p>
              <pre>HTTP ${response.status}: ${errorText}</pre>`;
          return;
      }

      // Tenta converter a resposta em JSON
      let data;
      try {
          data = await response.json();
      } catch (jsonError) {
          const errorHtml = await response.text(); // Lida com respostas HTML
          console.error(`Error parsing JSON, raw response:`, errorHtml);
          document.getElementById('output').innerHTML = `
              <p>Error parsing JSON:</p>
              <pre>${errorHtml}</pre>`;
          return;
      }

      console.log('Access Token:', data);
      document.getElementById('output').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (error) {
      console.error('Request failed:', error.message);
      document.getElementById('output').innerText = `Error: ${error.message}`;
  }
})();