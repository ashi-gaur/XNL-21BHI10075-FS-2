import { useState } from "react";
import axios from "axios";

const AddExercise = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/exercises",
        { name, duration },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAdd(res.data);
      setName("");
      setDuration("");
    } catch (error) {
      alert("Error adding exercise!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
      <input type="text" placeholder="Exercise Name" value={name} onChange={(e) => setName(e.target.value)} className="p-2 border rounded" required />
      <input type="number" placeholder="Duration (mins)" value={duration} onChange={(e) => setDuration(e.target.value)} className="p-2 border rounded" required />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Exercise</button>
    </form>
  );
};

export default AddExercise;
