# DevStream - Notes Management API

A modern RESTful API for managing notes with automated CI/CD pipeline using Jenkins, Docker, and GitHub integration.

## 🚀 Features

- **RESTful API**: Full CRUD operations for notes
- **Automated Testing**: Jest test suite with coverage
- **CI/CD Pipeline**: Jenkins automation with Docker
- **GitHub Integration**: Webhook-based deployments
- **Containerized**: Docker-based deployment
- **Health Monitoring**: API health checks

## 🏗️ Architecture

```
devstream/
├── backend/           # Express.js API server
├── frontend/          # React frontend (future)
├── ci-cd/            # CI/CD configuration files
├── infra/            # Infrastructure as code
└── docs/             # Documentation
```

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Testing**: Jest, Supertest
- **Containerization**: Docker
- **CI/CD**: Jenkins
- **Version Control**: Git, GitHub

## 📋 Prerequisites

- Node.js 18+
- Docker
- Jenkins
- ngrok (for webhook tunneling)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd devstream
   ```

2. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Run tests**
   ```bash
   npm test
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build and run with Docker**
   ```bash
   docker build -t devstream-backend .
   docker run -p 3000:3000 devstream-backend
   ```

## 📚 API Documentation

### Endpoints

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /health` - Health check

### Example Usage

```bash
# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "My Note", "content": "Note content"}'

# Get all notes
curl http://localhost:3000/api/notes
```

## 🔧 CI/CD Pipeline

The Jenkins pipeline automatically:
1. Starts ngrok tunnel for webhook access
2. Updates GitHub webhook URL
3. Builds Docker image
4. Runs tests
5. Deploys to production

## 📝 License

MIT License - see LICENSE file for details

# Webhook Test - Sun Aug 24 16:10:55 IST 2025
