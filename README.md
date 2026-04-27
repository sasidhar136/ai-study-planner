# 🧠 AI Study Planner

![AI Study Planner Hero](./assets/hero.png)

## 🚀 Elevate Your Learning with AI

**AI Study Planner** is a cutting-edge, full-stack application designed to revolutionize how students manage their time and master new subjects. By leveraging artificial intelligence, it creates personalized, dynamic study schedules that adapt to your progress and goals.

---

## ✨ Key Features

- 🤖 **AI-Powered Scheduling**: Automatically generate optimized study plans based on subject complexity and your availability.
- 📊 **Progress Analytics**: Visualize your learning journey with detailed charts and achievement milestones.
- 🔐 **Secure Authentication**: Robust user management using JWT-based authentication and secure password hashing.
- ⚡ **Real-time Updates**: Experience a seamless, responsive interface built with modern web technologies.
- 🛠️ **Developer Friendly**: Modular architecture with clean code principles, fully typed with TypeScript.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Modern CSS / Flexbox / Grid
- **State Management**: React Hooks & Context API

### Backend
- **Server**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL (Support for relational data modeling)
- **Security**: JWT & Bcrypt

---

## 📁 Project Structure

```bash
AI Study Planner/
├── backend/          # Express.js server & Prisma ORM
│   ├── prisma/      # Database schema & migrations
│   └── src/         # API routes, controllers, and logic
├── frontend/         # React.js application (Vite)
│   ├── public/      # Static assets
│   └── src/         # Components, hooks, and pages
└── assets/           # Project images & documentation assets
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL instance

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sasidhar136/ai-study-planner.git
   cd ai-study-planner
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file and add your DATABASE_URL
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to help make this the best AI study tool on the web.

---

Created with ❤️ by [sasidhar136](https://github.com/sasidhar136)
