import React, { useState } from "react";
import axios from "axios";

function Demo() {
  const [greeting, setGreeting] = useState("");
  const [postResponse, setPostResponse] = useState("");

  const fetchGreeting = async () => {
    try {
      const res = await axios.get("/api/hello");
      setGreeting(res.data.greeting);
    } catch (err) {
      console.error(err);
    }
  };

  const sendData = async () => {
    try {
      const res = await axios.post("/api/data", { name: "Yash", age: 22 });
      setPostResponse(res.data.message + " | " + JSON.stringify(res.data.your_data));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={fetchGreeting}>Get Greeting</button>
      <p>{greeting}</p>

      <button onClick={sendData}>Send Data</button>
      <p>{postResponse}</p>
    </div>
  );
}

export default Demo;
