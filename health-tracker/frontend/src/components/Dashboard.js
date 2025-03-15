import { useEffect, useState } from "react";
import axios from "axios";
import AddExercise from "./AddExercise";

const Dashboard = () => {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/exercises", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(res.data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleAdd = (exercise) => {
    setExercises([...exercises, exercise]);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(exercises.filter((exercise) => exercise.id !== id));
    } catch (error) {
      alert("Failed to delete exercise.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Exercise List</h2>
      <AddExercise onAdd={handleAdd} />
      <ul className="mt-4">
        {exercises.map((exercise) => (
          <li key={exercise.id} className="flex justify-between items-center p-2 border rounded mt-2">
            {exercise.name} - {exercise.duration} mins
            <button onClick={() => handleDelete(exercise.id)} className="bg-red-500 text-white p-2 rounded">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
