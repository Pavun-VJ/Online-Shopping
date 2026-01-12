// CreateAccount.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !email || !phone || !password) {
      return alert("Please fill all fields");
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/createAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        navigate("/login"); // ✅ correct flow
      } else {
        alert(data.message || "Failed to create account");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating account");
    }
    setIsLoading(false);
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h4 className="text-center mb-3">Create Account</h4>

        <input
          className="form-control mb-2 rounded-pill"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="form-control mb-2 rounded-pill"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="form-control mb-2 rounded-pill"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3 rounded-pill"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-danger w-100 rounded-pill"
          onClick={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Account"}
        </button>

        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
