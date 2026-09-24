# AI-Discover

> A curated platform for discovering, exploring, comparing, and saving AI tools and prompts.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20AI--Discover-111111?style=for-the-badge)](YOUR_LIVE_DEMO_URL)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-111111?style=for-the-badge&logo=github)](https://github.com/Sanskar9081/AI-Discover)
[![License](https://img.shields.io/badge/License-MIT-111111?style=for-the-badge)](#license)

---

## Live Demo

<div align="center">

### [Open AI-Discover](YOUR_LIVE_DEMO_URL)

**Discover → Explore → Filter → Evaluate → Compare → Save → Use**

</div>

> **Note:** Replace `YOUR_LIVE_DEMO_URL` with the actual deployed frontend URL before pushing the final README.

---

## About

AI-Discover is a modern AI discovery platform designed to help users find the right AI tools and prompts for their specific needs.

Instead of presenting hundreds of AI products as a simple collection of cards, AI-Discover focuses on **search, categorization, filtering, comparison, and structured information** so users can quickly evaluate tools and make informed decisions.

The platform includes both a user-facing discovery experience and an administrative system for managing the catalogue.

---

## Features

### AI Tool Discovery

- Browse AI tools across multiple categories
- Search tools by name, description, and relevant information
- Filter tools by category and pricing
- Explore recently added tools
- View detailed information about individual tools
- Visit the official website of a tool

### Prompt Library

- Discover useful AI prompts
- Browse prompts by category/use case
- Search the prompt library
- View complete prompt details
- Copy prompts quickly
- Associate prompts with relevant AI tools

### Tool Comparison

- Compare multiple AI tools
- View structured feature information
- Compare pricing and categories
- Make side-by-side evaluations

### Personalization

- Save favourite tools
- Save prompts
- View recently visited tools
- Persistent authenticated user sessions

### AI Assistant

AI-Discover includes an AI-powered assistant that can help users discover relevant AI tools based on what they are trying to accomplish.

The assistant uses the backend as a secure API layer so provider credentials are never exposed to the frontend.

### Authentication

- User registration
- User login
- Logout
- Persistent sessions
- Protected routes
- Role-based access control
- Admin-only functionality

Authentication uses secure HTTP-only cookies rather than storing authentication tokens in browser local storage.

### Admin Dashboard

Administrators can manage platform content including:

- AI tools
- Categories
- Prompts
- Featured content
- Advertisements
- Use cases
- Newsletter subscriptions
- Contact messages
- Bug reports
- Ad requests
- Platform settings
- Users

### Modern UI

The interface follows a **Swiss Modernism 2.0** inspired design system focused on:

- Strong typography
- Structured information hierarchy
- Asymmetric layouts
- Catalogue-style tool discovery
- Minimal visual noise
- Responsive design
- Light and dark themes
- Accessibility
- Restrained animations

The design intentionally avoids excessive gradients, glassmorphism, decorative 3D elements, and generic SaaS layouts.

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | UI development |
| TypeScript | Type safety |
| Vite | Frontend tooling |
| Tailwind CSS | Styling |
| shadcn/ui | Reusable UI components |
| React Query | Server state management |
| React Router | Client-side routing |
| Framer Motion | UI motion |
| Lucide React | Icons |
| Axios | API communication |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Helmet | HTTP security |
| express-rate-limit | API rate limiting |

## AI

| Technology | Purpose |
|---|---|
| Groq API | AI Assistant |
| Qwen | Assistant language model |

---

# Architecture

AI-Discover follows a separated frontend/backend architecture:

```text
AI-Discover
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
├── design-system/
│   └── MASTER.md
│
└── README.md
