
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sample student data
let students = [
  {
    id: 1,
    name: "Arun Kumar",
    age: 20,
    email: "arun@gmail.com",
    course: "AI & DS"
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 21,
    email: "priya@gmail.com",
    course: "CSE"
  }
];

let nextId = 3;

// Q1: GET - Retrieve all students
app.get("/api/students", (req, res) => {
  try {
    return res.status(200).json({
      message: "Students retrieved successfully",
      data: students
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// Q2: POST - Register a new student
app.post("/api/students", (req, res) => {
  const { name, age, email, course } = req.body;

  // Validate input
  if (!name || !age || !email || !course) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  if (!Number.isInteger(Number(age)) || Number(age) <= 0) {
    return res.status(400).json({
      message: "Age must be a positive integer"
    });
  }

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!validEmail.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address"
    });
  }

  // Prevent duplicate email addresses
  const exists = students.some(
    student => student.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({
      message: "A student with this email already exists"
    });
  }

  const newStudent = {
    id: nextId++,
    name: name.trim(),
    age: Number(age),
    email: email.trim(),
    course: course.trim()
  };

  students.push(newStudent);

  return res.status(201).json({
    message: "Student registered successfully",
    data: newStudent
  });
});

// Handle invalid API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API endpoint not found"
  });
});

// Handle malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body"
    });
  }

  return res.status(500).json({
    message: "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
