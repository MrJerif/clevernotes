# CleverNotes - A Smarter Way to Take Notes 📝🚀

This README file was created in CleverNotes! ✨

## 🏆 Overview

CleverNotes is an AI-powered note-taking SaaS platform designed to enhance productivity and organization. Whether you're a student, professional, or researcher, CleverNotes helps you capture, organize, and retrieve information effortlessly. With AI-driven insights and sharing features, managing your notes has never been easier!

### ✨ Key Features

- 📝 Effortless Note Creation: Quickly create notes, README files, and more.

- 📂 Organized Storage: Structure notes with folders and sub-notes for easy retrieval.

- 🔍 Powerful Search: Find notes instantly with an advanced search functionality.

- 🤖 AI-Powered Insights: Ask questions about your notes and receive intelligent answers.

- 🌐 Web-Based AI Assistance: Explore broader knowledge using AI that searches both your notes and the web.

- 📤 Collaboration & Sharing: Share notes and folders with colleagues, friends, or clients via unique links.

- 📄 Multiple Export Formats: Download notes as PDF or Markdown for offline access.

- 🖼️ File Upload & Storage: Upload and store images, files, and videos effortlessly.

- 📊 Multi-File Analysis: AI synthesizes insights across multiple selected files.

- 🔒 Secure & Reliable: Seamless authentication, file storage, and secure payment handling.

Additional Features

Real-time database 🔗

Light and Dark mode 🌓

Infinite children documents 🌲

Trash can & soft delete 🗑️

File upload

File deletion

File replacement

Icons for each document (changes in real-time) 🌠

Expandable sidebar ➡️🔀⬅️

Full mobile responsiveness 📱

Fully collapsable sidebar ↕️

Landing page 🛬

Cover image of each document 🖼️

Recover deleted files 🔄📄

🛠️ Tech Stack

## CleverNotes leverages a modern tech stack to ensure speed, scalability, and security.

### Frontend

- ⚡ Framework: Next.js (TypeScript)

- 🎨 UI Library: ShadCN (Component Library)

- 🎨 Styling: Tailwind CSS, Framer Motion, Aceternity UI

- 📦 State Management: Zustand

- 📂 File Upload: EdgeStore

- 📝 Editor: BlockNote (Text Editor)

- 😊 Emoji Support: emoji-picker-react

- 🖊️ React Libraries:

### Backend & Database

- 🗄️ Convex: Backend & Database

- 🧠 LangChain: AI-powered document analysis

- 🤖 Gemini API: AI assistant for note insights

- 🚀 Vercel AI SDK: AI model integrations

- 📑 PDF Parsing: pdf-parse for extracting content from documents

### 🔑 Authentication & 💳 Payments

- 🔐 Authentication: Clerk

- 💰 Payments: PayPal

## 🚀 Installation & Setup

Follow these steps to set up and run CleverNotes locally:

### 1️⃣ Clone the Repository

```
git clone https://github.com/mrjerif/clevernotes.git
cd clevernotes

```

### 2️⃣ Install Dependencies

```
npm install

```

### 3️⃣ Set Up Environment Variables

Create a .env.local file and add the necessary environment variables:

```
CONVEX_DEPLOYMENT=<your_project>
NEXT_PUBLIC_CONVEX_URL=<convex_url>
CLERK_SECRET_KEY=<secret_key>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_api_key>
NEXT_PUBLIC_PAYPAL_CLIENT_ID=<your_stripe_secret_key>
EDGE_STORE_ACCESS_KEY=<your_edge_store_access_key>
EDGE_STORE_SECRET_KEY=<your_edge_store_secret_key>
GEMINI_API_KEY=<your_gemini_api_key>

```

### 4️⃣ Run the Development Server

```
npm run dev

```

### 5️⃣ Start Convex Backend

```
npx convex dev

```

### 6️⃣ Deploy to Vercel

```
vercel

```

## 🤝 Contribution

We welcome contributions! If you’d like to improve CleverNotes, feel free to fork the repository, make your changes, and submit a pull request.

🚀 Happy Note-Taking with CleverNotes! 📝✨

