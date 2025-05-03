# 🥙 Street-Food-Finder-Review-Website-Backend-Team-3A

A powerful backend API for **Street Food Finder**, a street food discovery and review platform.  
It supports user authentication, content creation, premium subscriptions, payments, reviews, and admin moderation — built for scalability and modularity.

📄 **View Full Documentation:** [Google Docs](https://docs.google.com/document/d/1Xat_GUQ4ImxRvMdViRr9GNuZjTzbq7yGKAgex9mYnrY/edit?usp=sharing)
**Vedio Documentation:** 
---

## 🚀 Tech Stack

- **Node.js + Express.js** – Backend Framework
- **PostgreSQL** – Relational Database
- **Prisma ORM** – Database Modeling & Querying
- **JWT** – Authentication
- **RESTful API** – Routing and Endpoint Management

---

## ✨ Features

- 🔐 User Registration, Login & Profile Management (JWT-based)
- 👑 Role-based Access Control (Admin / User / Premium User)
- 📝 Post Creation by Users
- ✅ Admin Approval for Posts
- 💎 Subscription System for Premium Badges
- 🌟 Review System for Posts
- 👤 "Get Me" Profile API
- 📊 Dashboard APIs for Admin & Users

---

## 📦 Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Th3At0nic/Street-Food-Finder-Backend.git
cd Street-Food-Finder

Project Setup 
1 Clone the Repository 
https://github.com/Th3At0nic/Street-Food-Finder-Backend.git

cd Street-Food-Finder

2 Install Dependencies
bun install 

3 Configure Environment
Create a .env file in root or to see more checkout the .env.example file . 

4.Database url
PORT=5000;

5 Run Prisma Migrations (Additional)
For the starter file you dont have to follow this 
bun prisma:migrate
bun prisma:generate 

6 Start the server 
bun dev


