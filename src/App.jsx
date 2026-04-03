import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import ConfigPanel from "./components/ConfigPanel";

const TOKEN_KEY = "cpa-google-token";
const USER_KEY = "cpa-google-user";

async function fetchUserInfo(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("userinfo failed");
  return res.json();
}

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const s = sessionStorage.getItem(USER_KEY);
    return s ? JSON.parse(s) : null;
  });
  // null = normal | "expired" = show re-login banner
  const [authState, setAuthState] = useState("normal");

  // Fetch user info when we have a token but no profile yet
  useEffect(() => {
    if (token && !user) {
      fetchUserInfo(token)
        .then((info) => {
          setUser(info);
          sessionStorage.setItem(USER_KEY, JSON.stringify(info));
        })
        .catch(() => clearSession());
    }
  }, [token]);

  const clearSession = () => {
    setToken(null);
    setUser(null);
    setAuthState("normal");
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const handleLogin = ({ access_token }) => {
    setToken(access_token);
    setAuthState("normal");
    sessionStorage.setItem(TOKEN_KEY, access_token);
  };

  const handleAuthExpired = () => {
    // Don't nuke the session — just show a re-login prompt so the user
    // can re-authenticate without losing the current step/data in memory.
    clearSession();
    setAuthState("expired");
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} expired={authState === "expired"} />;
  }

  return (
    <ConfigPanel
      token={token}
      user={user}
      onLogout={clearSession}
      onAuthExpired={handleAuthExpired}
    />
  );
}
