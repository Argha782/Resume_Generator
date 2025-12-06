# Resume Generator
*AI‑Powered Resume Builder*

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Running Locally](#running-locally)
5. [Project Structure](#project-structure)
6. [Usage](#usage)
7. [Configuration & Environment Variables](#configuration--environment-variables)
8. [Docker & Docker Compose](#docker--docker-compose)
9. [AWS EC2 Deployment](#aws-ec2-deployment)
10. [Contributing](#contributing)
11. [License](#license)
12. [Acknowledgments](#acknowledgments)

---

## Project Overview
Resume Generator is a full‑stack web application built to help users generate professional resumes using AI assistance. The user inputs key information (skills, experience, education, etc.), and the app helps craft, optimize, and export a professional resume.

---

## Features
- User input form for personal details, education, work experience, skills, and achievements.
- AI‑assisted content generation (bullet points, summaries, keyword optimization).
- Multiple resume templates for preview and download (PDF/Docx).
- Responsive UI for all devices.
- Authentication (optional/expandable) for saving profiles.
- Easily deployable full‑stack app (now containerized with Docker).

---

## Tech Stack
- **Frontend**: React (JavaScript)
- **Backend**: Node.js + Express
- **Database**: MongoDB (or other database)
- **AI Integration**: OpenAI or similar API for text generation
- **Deployment**: Docker, Docker Compose, and AWS EC2 (documented below)

---

## Getting Started

### Prerequisites
- Node.js (>=14) — only needed for local development
- npm or yarn
- Docker & Docker Compose (for containerized run)
- MongoDB connection string (or a running MongoDB container)
- AI API key (if using an external AI service)

### Installation
```bash
git clone https://github.com/Argha782/Resume_Generator.git
cd Resume_Generator
```

#### Install dependencies for the server
```bash
cd server
npm install
```

#### Install dependencies for the client
```bash
cd ../client
npm install
```

### Running Locally (development)
Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend:
```bash
cd ../client
npm start
```

Visit http://localhost:3000

---

## Project Structure
```
/Resume_Generator
│
├── server/                # Backend folder
│   ├── controllers/       # API logic
│   ├── routes/            # Express routes
│   ├── models/            # DB schemas
│   ├── services/          # External APIs (AI, email, etc)
│   ├── config/            # Environment, middleware
│   └── app.js             # Main server file
│
├── client/                # Frontend folder
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Views/screens
│   │   ├── context/       # Auth or global context
│   │   ├── utils/         # Helpers
│   │   └── App.js
│   └── public/
│
└── README.md              # This file
```

---

## Usage
1. Open the app in your browser.
2. Fill in your details such as personal info, work experience, and skills.
3. Use the “Generate Resume” button to let the AI refine your content.
4. Choose a resume template.
5. Preview and download your resume as a PDF.

---

## Configuration & Environment Variables
Create a `.env` file in the `server/` directory and configure the following:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_provider_api_key
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

Add `.env` to `.gitignore` to prevent committing sensitive data.

---

## Docker & Docker Compose
This project has been containerized for easier deployment. The repository includes Dockerfiles for the client and server and a docker-compose.yml to run both services together.

High-level steps (full examples below):
- Build the images (or let docker-compose build them)
- Start services with docker-compose

Example Docker commands:

Build images individually:
```bash
# From repo root
docker build -t resume-generator-server ./server
docker build -t resume-generator-client ./client
```

Run with docker-compose (recommended):
```bash
# From repo root
docker-compose up -d --build
```

Sample docker-compose.yml (reference)
```yaml
version: '3.8'
services:
  server:
    build: ./server
    restart: unless-stopped
    env_file:
      - ./server/.env
    ports:
      - '5000:5000'
    depends_on:
      - mongo

  client:
    build: ./client
    restart: unless-stopped
    ports:
      - '80:3000' # maps container 3000 (React) to host 80 so site is available on port 80

  mongo:
    image: mongo:6
    restart: unless-stopped
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
```

Notes:
- The client is mapped to host port 80 so it can be served directly at http://<host-ip>/.
- The server exposes port 5000; adjust firewall/Security Group rules if deploying to a cloud VM.
- Use env_file or pass environment variables through docker-compose for secrets. Never commit .env to the repo.

If you prefer a production front-facing web server (recommended for SSL and routing), add an Nginx or Traefik reverse proxy in front of the client and API and handle TLS there.

---

## AWS EC2 Deployment
You can host the containerized app on an AWS EC2 instance. The following are concise steps to get the app running on a Linux (Ubuntu) EC2 instance.

1. Provision an EC2 instance
   - Choose an instance type (t3.micro / t2.micro for small demos).
   - Use Ubuntu LTS AMI.
   - Create or reuse a key pair for SSH.
   - Configure Security Group to allow inbound:
     - TCP 22 (SSH)
     - TCP 80 (HTTP)
     - TCP 443 (HTTPS) if you plan to enable TLS
     - TCP 5000 only if you need direct API access from outside (optional)

2. SSH into the instance
```bash
ssh -i /path/to/key.pem ubuntu@<EC2_PUBLIC_IP>
```

3. Install Docker and Docker Compose (Ubuntu example)
```bash
# Update
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable --now docker

# Install docker-compose (plugin or standalone)
sudo apt install -y docker-compose-plugin
# or for standalone binary (replace with latest version as needed)
# sudo curl -L "https://github.com/docker/compose/releases/download/<version>/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose

# Add your user to docker group (optional):
sudo usermod -aG docker ubuntu
```

4. Clone the repo on the server
```bash
git clone https://github.com/Argha782/Resume_Generator.git
cd Resume_Generator
```

5. Create the `.env` file(s) on the server under `server/` and configure secrets (MONGO_URI, AI_API_KEY, etc.).

6. Start the stack with docker-compose
```bash
# From repo root on EC2
docker compose up -d --build
# or if using the standalone binary: docker-compose up -d --build
```

7. Visit http://<EC2_PUBLIC_IP>/ to see the running app.

Production considerations:
- Use a reverse proxy (Nginx, Traefik) for TLS termination and to route API calls to the server container.
- Use AWS managed services for production-grade databases (e.g., Amazon DocumentDB or MongoDB Atlas) rather than running MongoDB on the same EC2 instance.
- Configure HTTPS using Let's Encrypt (certbot) or with a proxy that supports automated certificates (Traefik).
- Use AWS Security Groups and IAM best practices to secure access.

---

## Contributing
Contributions are welcome!

1. Fork the repo
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
- Thanks to OpenAI for enabling text generation.
- Thanks to all open‑source tools and libraries used.
- Inspired by professional resume‑building platforms.
