import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import { setAccessToken } from "./accessToken";

interface Props {}

const App: React.FC<Props> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredentials = async () => {
      const response = await fetch("http://localhost:4000/refresh_token", {
        method: "POST",
        credentials: "include",
      });
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
      setLoading(false);
    };
    fetchCredentials();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Routes />;
};
export default App;
