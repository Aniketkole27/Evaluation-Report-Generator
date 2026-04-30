# 🚀 AI Student Assessment Platform

An AI-powered web application for conducting **online exams** and **technical interviews** to evaluate student performance and behavior.

---

## 📌 Features

### 📝 1. AI-Based Objective Exam

* Teachers provide syllabus
* AI generates MCQ questions
* Auto evaluation & scoring
* Basic anti-cheat (tab switch detection)

### 🎤 2. AI Interview System

* Adaptive technical questions
* Scenario-based evaluation
* AI analyzes student responses
* Generates feedback & score

---

## 👥 User Roles

### 👑 Principal

* Manage teachers
* View all student performance
* Track overall analytics

### 👨‍🏫 Teacher

* Create exam sessions
* Share session link with students
* Monitor live participation
* View student results

### 🎓 Student

* Join via session link
* Attempt exam + interview
* No login required

---

## 🏗️ Tech Stack

### Frontend

* React
* Tailwind CSS
* TypeScript

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Prisma ORM

### AI Integration

* OpenAI API

---

## 📁 Project Structure

```bash
/client   → React frontend  
/server   → Node backend  
/docs     → Documentation  
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Aniketkole27/Evaluation-Report-Generator.git
cd ai-student-platform
```

### 2. Setup Backend

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` file in `/server`:

```env
DATABASE_URL=your_postgresql_url
OPENAI_API_KEY=your_api_key
JWT_SECRET=your_secret
```

---

## 🚀 Running the App

* Frontend: http://localhost:5173
* Backend: http://localhost:8000

---

## 📊 Future Improvements

* Voice-based interview
* Emotion detection (camera)
* Advanced analytics dashboard

---


