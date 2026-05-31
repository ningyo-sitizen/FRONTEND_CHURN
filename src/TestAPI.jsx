import { useState } from "react";
import axios from "axios";

export default function TestAPI() {
  const [data, setData] = useState(null);
  const user = useAuth();

  const handleTest = async () => {
    try {
      const res = await axios.get("http://localhost:5000/test-python");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Test API</h2>

      <button onClick={handleTest}>
        Hit API
      </button>

      <pre>
        {data ? JSON.stringify(data, null, 2) : "Belum ada data"}
      </pre>
    </div>
  );
}