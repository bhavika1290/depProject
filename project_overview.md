# IIT Ropar PhD Admission Portal - Project Overview

This document provides a comprehensive technical and functional breakdown of the PhD Admission Management System. It is designed to help you handle tough questions during your presentation.

---

## 1. Project Objective
The system is a multi-role web platform designed to digitize and streamline the PhD recruitment process at IIT Ropar. It automates the workflow from student application submission to faculty evaluation, interview scheduling, and final committee recommendations.

---

## 2. Tech Stack (The "MERN" Architecture)
The project is built using the **MERN** stack, which is the industry standard for modern full-stack JavaScript applications.

*   **Frontend (The "M" in MERN - for UI):** 
    *   **React.js**: A library for building component-based interfaces.
    *   **React Router**: Handles all navigation within the portal.
    *   **Context API**: Used for global authentication state management.
    *   **Axios**: For making secure API calls to the backend.
    *   **CSS3**: Custom premium styling with a focus on "Glassmorphism" and modern aesthetics.
*   **Backend (The "E" and "N"):** 
    *   **Node.js**: The JavaScript runtime.
    *   **Express.js**: The framework handling routing and API endpoints.
*   **Database (The "M"):** 
    *   **MongoDB**: A NoSQL document database (ideal for flexible data like student applications).
    *   **Mongoose**: An ODM (Object Data Modeling) library that provides a schema-based solution for application data.

---

## 3. System Architecture
The project follows a **Client-Server Architecture** with a clear separation of concerns:

### A. Backend Organization
*   **Modular Design**: The server is organized into specialized modules (`auth`, `admin`, `faculty`, `student`). Each module contains its own routes and sometimes dedicated logic.
*   **MVC Pattern (Model-View-Controller)**: 
    *   **Models**: Define the data structure (Mongoose Schemas).
    *   **Controllers**: Contain the "Brain" or business logic (e.g., how to calculate interview scores).
    *   **Routes**: Define the API endpoints (e.g., `POST /api/emails/send-custom`).
*   **Middleware**: Custom code that runs before reaching a controller (e.g., `protect` middleware checks if a user is logged in via JWT).

### B. Security & Data Flow
*   **Authentication**: Uses **JWT (JSON Web Tokens)**. When a user logs in, the server gives them a "seal" (token). The browser sends this token with every request to prove who they are.
*   **Authorization (RBAC)**: Role-Based Access Control. A student cannot access the "Templates" page; only an Admin can.
*   **Environment Variables**: Sensitive info like MongoDB URLs and Email Passwords are kept in a [.env](file:///c:/Users/pc/Desktop/iit-ropar-admissions-project/server/.env) file, never hardcoded in the script.

---

## 4. Key Implementation Highlights
During your presentation, emphasize these "Premium" features that we implemented:

### ✉️ Dynamic Email Engine (Nodemailer + Templates)
*   **Variable Substitution**: Our custom engine replaces placeholders like `{{name}}` and `{{interviewDate}}` with real candidate data just before sending.
*   **Nodemailer Integration**: Connected via Gmail SMTP with secure App Passwords.

### 📊 Excel/CSV Automation (`xlsx` Library)
*   **Data Export**: Admins can export shortlisted candidates to `.xlsx` files with a single click.
*   **Bulk Communication**: Admins can upload a CSV, and the system instantly parses it to send personalized emails to hundreds of students at once.

### 👨‍🏫 Faculty Selection Workflow
*   **Interview Scheduling**: Faculty can set specific dates/times which are then automatically synchronized with the database and used in emails.
*   **Recommendation Engine**: A dedicated interface for scoring and ranking candidates (Selected, Waitlisted, Rejected) which locks the data and sends it to the department committee.

---

## 5. Potential "Tough Questions" & Answers

**Q: Why use MongoDB instead of SQL (MySQL/Postgres)?**
> **A**: Ph.D. applications are complex and vary between departments. MongoDB's document-based structure allows us to store nested objects (like dynamic educational details and qualifying exams) more naturally without complex table joins.

**Q: How do you handle file uploads securely?**
> **A**: We use **Multer** on the backend to handle multipart/form-data. Files are renamed using unique timestamps to prevent overwriting and stored in a secure `/uploads` directory served statically by Express.

**Q: What happens if two faculty members edit the same application?**
> **A**: The system uses a centralized database where every `save()` operation updates the document. In a production environment, we could add "Optimistic Concurrency Control" using Mongoose versioning (`__v`).

**Q: Is the system scalable?**
> **A**: Yes. Because the frontend is a **Single Page Application (SPA)** and the backend is **Stateless (JWT-based)**, we can scale the backend horizontally across multiple servers easily.

---
