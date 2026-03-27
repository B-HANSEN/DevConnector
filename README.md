# DevConnector

A social network for developers built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- JWT-based authentication (register, login, logout)
- Developer profiles with skills, bio, work experience, education, and social links
- GitHub repository integration (displays latest repos on profile)
- Posts feed with likes and comments
- Gravatar avatar support

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
**Frontend:** React, Redux, React Router, Axios

## Getting Started

### Prerequisites

- Node.js v14+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. Clone the repo and install all dependencies (root + client):

```bash
npm install
```

2. Create `config/default.json` with your credentials (this file is gitignored):

```json
{
    "mongoURI": "your_mongodb_connection_string",
    "jwtSecret": "your_jwt_secret",
    "githubToken": "your_github_personal_access_token"
}
```

### Running the App

```bash
npm run dev        # start backend + frontend concurrently
npm run server     # backend only (port 5001)
npm run client     # frontend only (port 3000)
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/users` | Register new user | Public |
| POST | `/api/auth` | Login / get token | Public |
| GET | `/api/auth` | Get current user | Private |

### Profiles
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/profile` | Get all profiles | Public |
| GET | `/api/profile/me` | Get own profile | Private |
| GET | `/api/profile/user/:user_id` | Get profile by user ID | Public |
| POST | `/api/profile` | Create or update profile | Private |
| DELETE | `/api/profile` | Delete account & profile | Private |
| PUT | `/api/profile/experience` | Add experience | Private |
| DELETE | `/api/profile/experience/:exp_id` | Delete experience | Private |
| PUT | `/api/profile/education` | Add education | Private |
| DELETE | `/api/profile/education/:edu_id` | Delete education | Private |
| GET | `/api/profile/github/:username` | Get GitHub repos | Public |

### Posts
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/posts` | Get all posts | Private |
| POST | `/api/posts` | Create a post | Private |
| GET | `/api/posts/:id` | Get post by ID | Private |
| DELETE | `/api/posts/:id` | Delete a post | Private |
| PUT | `/api/posts/like/:id` | Like a post | Private |
| PUT | `/api/posts/unlike/:id` | Unlike a post | Private |
| POST | `/api/posts/comment/:id` | Add comment | Private |
| DELETE | `/api/posts/comment/:id/:comment_id` | Delete comment | Private |

## Deployment (Vercel)

Set the following environment variables in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GITHUB_TOKEN` | GitHub personal access token |

## Notes

- `config/default.json` and `config/production.json` are gitignored — never commit credentials
- The app uses the `config` package with `custom-environment-variables.json` to map env vars in production
- Port defaults to `5001` locally (port 5000 is reserved by macOS AirPlay Receiver)
