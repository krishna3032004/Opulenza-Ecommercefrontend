# Opulenza — E-Commerce App

A fully functional e-commerce web application built with Next.js frontend and Java Spring Boot backend.

**Live Demo:** [Opulenza Shopping App](https://Opulenza-psi.vercel.app/)

---

## Repositories

| Part | Repo |
|------|------|
| Frontend (Next.js) | [Opulenza-app-using-next.js](https://github.com/krishna3032004/Opulenza-app-using-next.js-) |
| Backend (Java Spring Boot) | [Opulenza-Java_backend](https://github.com/krishna3032004/Opulenza-Java_backend) |

---

## Features

- **Authentication** — Email/password with OTP verification, Google OAuth, GitHub OAuth, forgot password flow
- **User Profile** — Edit username, gender; view order history, wishlist, notifications; logout
- **Product Browsing** — Browse by category (T-shirts, Watches, Bags), featured products on home page
- **Shopping Cart** — Add/remove products, adjust quantities
- **Buy Now** — Single item direct checkout
- **Payment** — Razorpay integration with signature verification
- **Reviews** — Leave reviews on purchased products; review links sent via email
- **Chatbot** — Gemini AI powered assistant

---

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React**
- **Tailwind CSS**
- **Razorpay JS SDK** (checkout on client)
- **Gemini API** (chatbot)

### Backend
- **Java 17 + Spring Boot 3.2**
- **Spring Security + JWT** (replaces NextAuth)
- **Spring Data MongoDB** (Atlas)
- **JavaMailSender** (OTP emails via Gmail)
- **OkHttp** (Razorpay REST API calls)

---

## Getting Started

### 1. Clone both repos

```bash
git clone https://github.com/krishna3032004/Opulenza-app-using-next.js-.git
git clone https://github.com/krishna3032004/Opulenza-Java_backend.git
```

### 2. Start Java Backend

```bash
cd Opulenza-Java_backend

# Create .env file with your credentials (see below)

# Windows PowerShell
Get-Content .env | ForEach-Object {
  $name, $value = $_ -split '=', 2
  [System.Environment]::SetEnvironmentVariable($name, $value)
}
mvn spring-boot:run
```

Backend runs at: `http://localhost:8080`

### 3. Start Next.js Frontend

```bash
cd Opulenza-app-using-next.js-
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## Environment Variables

### Frontend — `.env.local`

```bash
NEXT_PUBLIC_JAVA_API_URL=http://localhost:8080
NEXT_PUBLIC_KEY_ID=<your_razorpay_key_id>
NEXT_PUBLIC_GEMINI_API_KEY=<your_gemini_api_key>
NEXT_PUBLIC_URL2=http://localhost:3000/
```

### Backend — `.env`

```bash
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_jwt_secret_key>
EMAIL_USER=<your_gmail_address>
EMAIL_PASS=<your_gmail_app_password>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
```

> **Note:** Never commit `.env` or `.env.local` to GitHub.

---

## How to Use

1. **Signup/Login** — Register with email (OTP verification), or use Google/GitHub OAuth
2. **Browse Products** — Explore categories or check featured items on home page
3. **Add to Cart / Buy Now** — Add multiple items to cart or buy a single item directly
4. **Checkout** — Fill in delivery address and proceed to payment
5. **Payment** — Complete purchase via Razorpay (test card: `4111 1111 1111 1111`, OTP: `1234`)
6. **Profile** — View orders, manage wishlist, edit profile info
7. **Reviews** — After purchase, review link is sent to your email
8. **Chatbot** — Use the Gemini-powered assistant for help

---

## Deployment

| Part | Platform |
|------|----------|
| Frontend | Vercel |
| Backend | Any Java-capable host (Railway, Render, AWS EC2) |
| Database | MongoDB Atlas |