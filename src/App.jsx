import { useState, useEffect } from "react";
import LoginScreen from "./components/LoginScreen";
import ConfigPanel from "./components/ConfigPanel";

const TOKEN_KEY = "cpa-google-token";
const USER_KEY = "cpa-google-user";

// Fetch basic profile info using the access token
async function fetchUserInfo(accessToken) {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Could not fetch user info");
  return res.json();
}

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  // When a token arrives but we have no user info yet, fetch it
  useEffect(() => {
    if (token && !user) {
      fetchUserInfo(token)
        .then((info) => {
          setUser(info);
          sessionStorage.setItem(USER_KEY, JSON.stringify(info));
        })
        .catch(() => {
          // Token invalid or expired — force re-login
          handleLogout();
        });
    }
  }, [token]);

  const handleLogin = (tokenResponse) => {
    const { access_token } = tokenResponse;
    setToken(access_token);
    sessionStorage.setItem(TOKEN_KEY, access_token);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  if (!token) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <ConfigPanel token={token} user={user} onLogout={handleLogout} />;
}
