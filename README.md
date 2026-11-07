# Volvox: AI Research Assistant (Frontend)

A Next.js 15 frontend for **Volvox**, an AI research assistant. Upload research documents or paste a YouTube link, chat with an AI grounded in that content, and get summaries, with chat history saved per session.

**Live demo:** [add your Vercel URL]
**Backend repo:** [add link] (FastAPI, LangChain, FAISS, Gemini, MongoDB)

![Chat view](docs/screenshots/03-chat-response.png)

## Features

- **Chat with your research:** ask questions and get answers grounded in your uploaded documents, with a toggle for web search
- **Saved chat history:** recent chats appear in the sidebar and reopen where you left off
- **Research library:** upload, search by title or date range, open, download, edit and delete documents
- **Summaries:** summarize one or several documents at once, or paste a YouTube link for a transcript summary
- **Auth:** email and password sign-in with JWT, plus Google sign-in
- **Light and dark themes**
- **Installable PWA**

## Screenshots

| Sign in | New chat |
| --- | --- |
| ![Sign in](docs/screenshots/01-login.png) | ![New chat](docs/screenshots/02-new-chat.png) |

| Research library | Summarize |
| --- | --- |
| ![Research library](docs/screenshots/04-research-library.png) | ![Summarize](docs/screenshots/05-summarize.png) |

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 15 (App Router), React, TypeScript |
| UI | HeroUI, Tailwind CSS |
| State | Zustand |
| Auth | JWT against the FastAPI backend |
| Deployment | Vercel |

## How It Fits Together

```
Browser (Next.js 15, PWA)
        |  REST + JWT
        v
FastAPI backend --> MongoDB + GridFS (documents, chat history)
                --> FAISS (vector search)
                --> Gemini (embeddings + answers)
```

The frontend only talks to the backend API. Retrieval and generation happen server-side, so no model keys ever reach the browser.

## Getting Started

```bash
git clone [add repo url]
cd [repo folder]
npm install
cp .env.example .env.local   # then set the backend API URL
npm run dev
```

Open http://localhost:3000. You will need the backend running (see the backend repo) or a deployed API URL in your env file.

## What I Built

I built the whole frontend: the auth screens, chat interface with session history, document manager with search and filters, the summarizer, theming, and the PWA setup. I also built the FastAPI backend it runs on.

## Author

**Sher Muhammad Iqbal**: [Portfolio](https://shermuhammad.vercel.app) · [LinkedIn](https://www.linkedin.com/in/sher-muhammad-448588290)
