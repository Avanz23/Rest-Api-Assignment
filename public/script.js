
const API_URL = "/api/students";

const tableBody = document.getElementById("studentTable");
const listMessage = document.getElementById("listMessage");
const formMessage = document.getElementById("formMessage");
const studentForm = document.getElementById("studentForm");

// Q1: GET request to retrieve students
async function loadStudents() {
  listMessage.textContent = "Loading students...";
  listMessage.className = "";
  tableBody.replaceChildren();

  try {
    const response = await fetch(API_URL);

    if (response.status === 200) {
      const result = await response.json();

      result.data.forEach(student => {
        const row = document.createElement("tr");

        [
          student.id,
          student.name,
          student.age,
          student.email,
          student.course
        ].forEach(value => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });

        tableBody.appendChild(row);
      });

      listMessage.textContent =
        `Retrieved ${result.data.length} student(s) successfully.`;
      listMessage.className = "success";
    } else if (response.status === 404) {
      listMessage.textContent = "Student API endpoint not found.";
      listMessage.className = "error";
    } else {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (error) {
    listMessage.textContent =
      "Unable to retrieve students. Check your server connection.";
    listMessage.className = "error";

    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Failed to load student data.";
    row.appendChild(cell);
    tableBody.appendChild(row);

    console.error(error);
  }
}

// Load students when the button is clicked
document.getElementById("loadBtn").addEventListener("click", loadStudents);

// Q2: POST request to register a student
studentForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  formMessage.textContent = "Registering student...";
  formMessage.className = "";

  const student = {
    name: document.getElementById("name").value.trim(),
    age: Number(document.getElementById("age").value),
    email: document.getElementById("email").value.trim(),
    course: document.getElementById("course").value.trim()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(student)
    });

    const result = await response.json();

    if (response.status === 201) {
      formMessage.textContent = result.message;
      formMessage.className = "success";

      studentForm.reset();

      // Refresh the table after successful registration
      await loadStudents();
    } else if (response.status === 400) {
      formMessage.textContent = result.message;
      formMessage.className = "error";
    } else if (response.status === 409) {
      formMessage.textContent = result.message;
      formMessage.className = "error";
    } else {
      formMessage.textContent =
        result.message || `Request failed: ${response.status}`;
      formMessage.className = "error";
    }
  } catch (error) {
    formMessage.textContent =
      "Unable to register student. Check your server connection.";
    formMessage.className = "error";

    console.error(error);
  }
});

// Automatically retrieve students when the page opens
loadStudents();
