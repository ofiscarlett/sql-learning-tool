# SQL Learning Tool

An interactive web-based platform for learning and practicing SQL.  
Students can log in, attempt SQL exercises, view ER diagrams, and get instant feedback by comparing their queries against teacher-provided solutions.  
Teachers can create questions, manage students, and review results.

---

## ✨ Features

### For Students
- **SQL Query Execution** — Write and run SQL queries in the browser against a preloaded database.
- **Question Types** — Multiple Choice (MCQ), Multi-select, and Fill-in-the-blank SQL.
- **ER Diagrams** — Visual database schema reference for each exercise.
- **Instant Feedback** — Compare your query output with the correct answer.
- **Score Tracking** — View your final score after completing the quiz.
- **Answer Review** — Check your submitted answers with explanations.

### For Teachers
- **Student Management** — Create student accounts with secure password hashing.
- **Question Management** — Add/update/delete questions with options and correct answers.
- **Custom Database Schema** — Define the schema students will run queries against.
- **Result Review** — View student performance.

---

## 🛠 Tech Stack

**Frontend:**
- React
- TypeScript
- Tailwind CSS
- Axios (API calls)

**Backend:**
- Node.js
- Express
- PostgreSQL
- bcrypt (password hashing)
- JSON Web Token (JWT) for authentication
- CORS support

---

## 📂 Project Structure
sql-learning-tool/
│
├── backend/
│ ├── src/
│ │ ├── db/ # PostgreSQL connection & schema
│ │ ├── routes/ # Express API routes
│ │ ├── controllers/ # Business logic
│ │ ├── middleware/ # Auth & validation
│ │ └── utils/ # Helper functions
│ ├── package.json
│ └── .env # DB credentials & JWT secret
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ ├── hooks/ # Custom React hooks
│ │ ├── services/ # API calls
│ │ └── styles/ # Tailwind config & styles
│ ├── package.json
│ └── .env # API URL config
│
└── README.md
---

##  Installation & Setup

### 1 Clone the Repository
```bash
git clone https://github.com/your-username/sql-learning-tool.git
cd sql-learning-tool
```
### 2 Backend Setup and start
```bash
cd backend
npm install
npm run dev
```
Create a .env file
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/sql_learning
JWT_SECRET=your_jwt_secret

### 3 Frontend Setup and start
```bash
cd ../frontend
npm install
npm start
```
Create a .env file
