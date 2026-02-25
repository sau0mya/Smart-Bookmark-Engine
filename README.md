# SmartMark – Smart Bookmark Engine

SmartMark is a full‑stack intelligent bookmark management platform built with the MERN stack. It allows users to securely save, organize, search, and analyze bookmarks using smart categorization, activity tracking, analytics dashboards, and data visualization.

---

## 🚀 Features

### 🔐 Authentication

* JWT-based authentication
* Secure login & registration
* Protected routes

### 📚 Bookmark Management

* Create, update, delete bookmarks
* Categorization & tagging
* Status tracking
* Smart organization

### 🔎 Smart Search & Filtering

* Keyword search
* Category filtering
* Sorting options
* Fast retrieval of saved resources

### 📊 Analytics Dashboard

* Bookmark statistics
* Activity insights
* Usage analytics
* Interactive charts & visualizations

### 🕘 Activity Tracking

* User action logging
* Bookmark history
* Timeline monitoring

### 🎨 Modern UI

* Responsive design
* Clean SaaS-style layout
* Centered content system
* Gradient sidebar & professional theme

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Recharts / Chart Library

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Tools

* Git & GitHub
* Postman
* VS Code

---

## 📁 Project Structure

```
SmartMark/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── layouts/
│   │   └── App.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

--

## 🔗 API Endpoints

### Auth Routes

```
POST   /api/auth/register
POST   /api/auth/login
```

### Bookmark Routes

```
GET    /api/bookmarks
POST   /api/bookmarks
PUT    /api/bookmarks/:id
DELETE /api/bookmarks/:id
```

### Analytics

```
GET    /api/analytics
```

### Activity Logs

```
GET    /api/activity
```

---



## 🧪 Testing

* Validate authentication flow
* CRUD operations testing
* API testing using Postman
* Responsive UI verification


## 📈 Future Improvements

* AI-based bookmark recommendation
* Browser extension
* Bookmark import/export
* Team collaboration
* Dark/Light theme toggle

---


## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**SmartMark – Smart Bookmark Engine**

Built as a full‑stack MERN project demonstrating authentication, analytics, activity tracking, and modern dashboard UI development.
