import { useEffect, useState } from "react";

export default function TestApi() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/test-connection")
      .then((res) => res.json())
      .then((resData) => setData(resData))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h2>Laravel React Connection Test</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
