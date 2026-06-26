/**
 * Netlify Function: GitHub OAuth proxy for Decap CMS
 *
 * Handles two routes (both map here via netlify.toml redirects):
 *   GET /api/auth          — redirects browser to GitHub OAuth authorize URL
 *   GET /api/auth/callback — exchanges code for token, posts result to Decap CMS opener window
 *
 * Required environment variables (set in Netlify dashboard, never in code):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";
const SCOPE = "repo,user";

function validateEnv() {
  const missing = [];
  if (!process.env.GITHUB_CLIENT_ID) missing.push("GITHUB_CLIENT_ID");
  if (!process.env.GITHUB_CLIENT_SECRET) missing.push("GITHUB_CLIENT_SECRET");
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

function buildAuthorizeRedirect() {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: SCOPE,
  });
  return {
    statusCode: 302,
    headers: {
      Location: `${GITHUB_AUTHORIZE_URL}?${params.toString()}`,
      "Cache-Control": "no-store",
    },
    body: "",
  };
}

async function handleCallback(code) {
  if (!code) {
    return {
      statusCode: 400,
      body: "Missing code parameter in OAuth callback.",
    };
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  if (!tokenResponse.ok) {
    console.error(
      JSON.stringify({
        service: "auth-function",
        event: "token_exchange_http_error",
        status: tokenResponse.status,
        timestamp: new Date().toISOString(),
      })
    );
    return {
      statusCode: 502,
      body: "Failed to exchange code for token with GitHub.",
    };
  }

  const data = await tokenResponse.json();

  if (data.error) {
    console.error(
      JSON.stringify({
        service: "auth-function",
        event: "token_exchange_oauth_error",
        error: data.error,
        timestamp: new Date().toISOString(),
      })
    );
    return {
      statusCode: 401,
      body: `GitHub OAuth error: ${data.error_description || data.error}`,
    };
  }

  const token = data.access_token;
  const provider = "github";

  // Decap CMS expects this exact postMessage handshake from the popup window.
  const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function() {
        function recieveMessage(e) {
          console.log('recieveMessage %o', e);
          window.opener.postMessage(
            'authorization:${provider}:success:${JSON.stringify({ token: "__TOKEN__", provider: "${provider}" }).replace("__TOKEN__", token)}',
            e.origin
          );
        }
        window.addEventListener("message", recieveMessage, false);
        window.opener.postMessage("authorizing:${provider}", "*");
      })();
    <\/script>
  </body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: html,
  };
}

export const handler = async (event) => {
  try {
    validateEnv();
  } catch (err) {
    console.error(
      JSON.stringify({
        service: "auth-function",
        event: "env_validation_error",
        message: err.message,
        timestamp: new Date().toISOString(),
      })
    );
    return {
      statusCode: 500,
      body: `Server misconfiguration: ${err.message}`,
    };
  }

  const path = event.path || "";
  const isCallback = path.endsWith("/callback");
  const code = event.queryStringParameters?.code;

  console.log(
    JSON.stringify({
      service: "auth-function",
      event: isCallback ? "oauth_callback" : "oauth_initiate",
      hasCode: Boolean(code),
      timestamp: new Date().toISOString(),
    })
  );

  if (isCallback) {
    return handleCallback(code);
  }

  return buildAuthorizeRedirect();
};
