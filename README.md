# 🧠 Social Engine API

A RESTful backend API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** for a social networking platform.  
It includes authentication (JWT), post & comment management, tag handling, notifications, and WebSocket (Socket.io) integration.

---

## 🚀 Features

- 🔐 **User Authentication** – Register, Login using JWT  
- 🏷️ **Tag Management** – Create and fetch tags  
- 📝 **Post System** – Create, view, and upvote/downvote posts  
- 💬 **Comment System** – Nested replies for each post  
- 🔔 **Real-time Notifications** – Implemented with Socket.io  
- 🗄️ **MongoDB Atlas** – Hosted cloud database  
- ☁️ **Render Deployment Ready**

---

## 🧩 Tech Stack

- **Backend Framework:** Express.js  
- **Database:** MongoDB Atlas (Mongoose ODM)  
- **Authentication:** JWT (JSON Web Tokens)  
- **Realtime:** Socket.io  
- **Environment Management:** dotenv  
- **Deployed On:** Render

---


---

## ⚙️ Environment Variables

Create a `.env` file in the project root for local development:

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key

---

---
🧰 Run Locally

To run the backend server on your local machine:

Steps:

Clone the repository

git clone https://github.com/your-username/Social-Engine.git


Navigate to the project directory

cd Social-Engine


Install dependencies

npm install


Start the server

npm start


The backend server will run at http://localhost:5000


---

