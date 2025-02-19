# MatchWorks Website

MatchWorks is an AI-powered job application assistant designed to help job seekers streamline their job search, improve their resumes, practice interviews, and generate career roadmaps.

## Tech Stack

- **Client:** React.js, Tailwind CSS, Shadcn
- **Server:** Node.js, Express.js
- **Database:** MongoDB
- **CI/CD:** Docker, GitHub Actions

## Features

- **User Authentication:** Secure login, registration, and AI-assisted profile generation.  
- **User Profile Management:** Manage personal information and uploaded resumes.  
- **Job Searching and Filtering:** Search and filter jobs by level, work type, location, and industry.
- **Job Recommendation:** Suggest jobs based on user's skills, positions, and interests.
- **Resume Builder:** Upload resumes for AI analysis, feedback, and improvement suggestions.  
- **Virtual Interview Practice:** AI-generated mock interviews with real-time feedback.  
- **Roadmap Generator:** Personalized career roadmaps with skill tracking and learning resources.  

## Quick Start

> Follow these steps to set up the project locally on your machine.

Clone the repository

```bash
git clone https://github.com/tom474/matchworks_website.git
```

Navigate to the project directory

```bash
cd matchworks_website
```

Create `.env` file in `server` and set up environment variables

```
SERVER_PORT=8080

MONGO_URI=your_mongo_uri

ACCESS_TOKEN_SECRET=mw_access_token_secret
ACCESS_TOKEN_LIFE=30m
REFRESH_TOKEN_SECRET=mw_refresh_token_secret
REFRESH_TOKEN_LIFE=30d

GEMINI_API_KEY=your_gemini_api_key
```

### Server Setup

From the project's root directory, navigate to `server`

```bash
cd server
```

Install dependencies

```bash
npm install
```

Start the server
```bash
npm run dev
```

### Client Setup

From the project's root directory, navigate to `client`

```bash
cd client
```

Install dependencies

```bash
npm install
```

Start the client
```bash
npm run dev
```

## Live Demo

> Use the client demo link to access the website

- [Client Demo](https://matchworks-client.k-clowd.top)

- [Server Demo](https://matchworks-server.k-clowd.top)

## Documentation

- [Client Documentation](https://matchworks-client-storybook.k-clowd.top)

- [Server Documentation](https://documenter.getpostman.com/view/27360970/2sAYBbepYm#1021f2c3-5af9-424a-9ed1-1e95926c82b6)
