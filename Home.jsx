import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/students";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add / Update student
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, email, course };
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(API, payload);
      }
      setName(""); setEmail(""); setCourse("");
      fetchStudents(); // refresh table
    } catch (err) {
      console.error(err);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setCourse(student.course);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Student Management System</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="text" placeholder="Course" value={course} onChange={e=>setCourse(e.target.value)} required />
        <button type="submit">{editId ? "Update Student" : "Add Student"}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Course</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.course}</td>
               <td>
  <button className="edit" onClick={()=>handleEdit(student)}>Edit</button>
  <button className="delete" onClick={()=>handleDelete(student.id)}>Delete</button>
</td>

              </tr>
            ))
          ) : (
            <tr><td colnSpan="4" style={{ textAlign:"center" }}>No students found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
