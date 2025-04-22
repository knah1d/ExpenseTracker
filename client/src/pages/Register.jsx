import { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", formData);
      alert("Registered successfully!");
    } catch (err) {
      alert("Error registering");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4 bg-white shadow rounded">
      <input type="text" placeholder="Name" className="input" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <input type="email" placeholder="Email" className="input" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="password" placeholder="Password" className="input" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
      <button className="bg-blue-500 text-white py-2 px-4 rounded">Register</button>
    </form>
  );
};

export default Register;
