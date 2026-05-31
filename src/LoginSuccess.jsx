import { useState, useEffect } from "react";
import { useAuth } from "../utils/auth";

export default function LoginSuccess() {
  const user = useAuth();
  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    if (user) {
      setAvatarSrc(
        user.avatar || "https://via.placeholder.com/100"
      );
          }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login Success</h2>

      <p>Email: {user.email}</p>
      <p>Name: {user.name}</p>

      {user.googleId && <p>Google ID: {user.googleId}</p>}

      <img
        src={avatarSrc}
        alt="profile"
        width={100}
        onError={() => {
          setAvatarSrc("https://via.placeholder.com/100");
        }}
      />
      <div>
      <a href="/prediction">prediction</a>
      </div>
    </div>
  );
}