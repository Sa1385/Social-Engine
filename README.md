# 🚀 Social Engine API

A Node.js + Express.js + MongoDB backend for a social platform where users can register, log in, create posts, comment, and interact — designed for scalability and RESTful integration.

---

## 🧩 Features

- **User Registration and Authentication** (JWT-based)
- **Create, Read, Update, and Delete Posts**
- **Add and View Comments**
- **Real-time Notifications** (API-based)
- **MongoDB Atlas Integration**
- **Secure Password Hashing** with bcrypt

---

## ⚙️ Tech Stack

| Category        | Technologies                 |
|-----------------|-----------------------------|
| Backend         | Node.js, Express.js          |
| Database        | MongoDB Atlas                |
| Authentication  | JWT (JSON Web Token)         |
| Security        | bcrypt, Helmet               |
| Environment     | dotenv                       |
| Testing Tool    | Postman                      |

---

## 📁 Project Structure

```
Social-Engine/
│
├── index.js               # Entry point
├── config/
│   └── db.js              # Database connection setup
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/
│   ├── auth.js
│   ├── posts.js
│   └── comments.js
├── middleware/
│   └── authMiddleware.js
└── .env                   # Environment variables
```

---

## ⚙️ Environment Variables

Create a `.env` file in your project root and add the following:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

---

## 💻 Run Locally

To run the backend server on your local machine:

### 🪜 Steps

1. **Clone the repository**
    ```sh
    git clone https://github.com/your-username/Social-Engine.git
    ```

2. **Navigate to the project directory**
    ```sh
    cd Social-Engine
    ```

3. **Install dependencies**
    ```sh
    npm install
    ```

4. **Start the development server**
    ```sh
    npm start
    ```

Server will start at 👉 [http://localhost:5000](http://localhost:5000)

---

## 🧠 Testing with Postman

- Import the provided Postman collection (`Social-Engine.postman_collection.json`)
- Set the base URL to `http://localhost:5000`
- Run these API endpoints:
    - `POST /api/auth/register`
    - `POST /api/auth/login`
    - `POST /api/posts`
    - `GET /api/posts`
    - `POST /api/comments`
- Copy the JWT token from **Login Response** and paste it into the Authorization header as:
    ```
    Bearer <your_token>
    ```

---

## ☁️ Deploying on Render

1. Push your project to GitHub.
2. Go to Render → **New Web Service**.
3. Connect your GitHub repo and configure:
    - **Build Command:** `npm install`
    - **Start Command:** `npm start`
    - **Environment Variables:** Add all from `.env`
4. Click **Deploy 🚀**
5. Check logs — you’ll see `Server running on port 5000` once deployed successfully.

---

## 🔐 Common Errors

| Error               | Fix                                         |
|---------------------|---------------------------------------------|
| JWT not configured! | Add `JWT_SECRET` in `.env`                  |
| MongoNetworkError   | Check your MongoDB Atlas IP Whitelist       |
| app crashed         | Ensure environment variables are set on Render |

---

## 🧾 API Endpoints Overview

| Method | Endpoint                 | Description              |
|--------|--------------------------|--------------------------|
| POST   | /api/auth/register       | Register a new user      |
| POST   | /api/auth/login          | Log in and get JWT       |
| GET    | /api/posts               | Get all posts            |
| POST   | /api/posts               | Create a new post        |
| GET    | /api/comments/:postId    | Get comments for a post  |
| POST   | /api/comments/:postId    | Add a comment            |

---

## 🧑‍💻 Author

**L Saini Patro**  
📍 Bengaluru, India  
📧 [your-email@example.com](mailto:your-email@example.com)  
🌐 [GitHub Profile](https://github.com/Sa1385)  

---

## ⭐ Support

If you like this project, don’t forget to star ⭐ the repository on GitHub!
