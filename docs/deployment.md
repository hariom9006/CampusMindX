# CampusMind X: Production Deployment Guide

## 1. Production Architecture Overview
CampusMind X is architected for decoupled cloud deployment across standard platforms:
- **Frontend SPA**: Deployed to Vercel, Netlify, or Cloudflare Pages.
- **API Gateway (Node.js)**: Deployed to Render, Railway, AWS ECS, or Fly.io.
- **AI Microservice (FastAPI)**: Deployed to Render, Railway, AWS ECS, or Fly.io.
- **Database Persistence**: MongoDB Atlas (Managed Cloud Cluster M0/M10).

---

## 2. Production Environment Variables Reference

### 2.1 Client Application (`client/.env.production`)
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL pointing to deployed Express API Gateway | `https://api.campusmind.yourdomain.edu/api` |
| `VITE_AI_ENGINE_URL` | Direct AI URL (optional; calls usually routed via Gateway) | `https://ai.campusmind.yourdomain.edu` |

### 2.2 Express API Gateway (`server/.env`)
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Listening HTTP port | `5000` |
| `NODE_ENV` | Runtime environment mode | `production` |
| `MONGODB_URI` | MongoDB Atlas cluster connection URI | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/campusmind_prod?retryWrites=true&w=majority` |
| `JWT_SECRET` | Cryptographically secure random 256-bit string | `d9f8e4a1b2c3...64_hex_chars_minimum` |
| `CORS_ORIGIN` | Allowed frontend origin URL(s) (comma-separated if multiple)| `https://campusmind.vercel.app` |
| `AI_ENGINE_URL` | Internal or public URL of Python FastAPI microservice | `http://localhost:8000` or `https://ai.campusmind.internal:8000` |

### 2.3 Python FastAPI AI Engine (`ai-engine/.env`)
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | Listening HTTP port for Uvicorn | `8000` |
| `HOST` | Interface binding | `0.0.0.0` |

---

## 3. Step-by-Step Deployment Guide

### Step 1: MongoDB Atlas Setup
1. Create a free shared cluster (M0) on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a database user with read/write permissions.
3. Under **Network Access**, whitelist your hosting provider's IP range or `0.0.0.0/0` with secure user/password.
4. Obtain the connection string URI: `mongodb+srv://<username>:<password>@cluster.mongodb.net/campusmind_x`.

### Step 2: Deploy Python FastAPI AI Microservice (Render / Railway)
1. Set Root Directory to `ai-engine/`.
2. Build Command: `pip install -r requirements.txt`.
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Verify health endpoint: `GET https://<your-ai-service>.onrender.com/health`.

### Step 3: Deploy Express API Gateway (Render / Railway / Fly.io)
1. Set Root Directory to `server/`.
2. Build Command: `npm install`.
3. Start Command: `npm start`.
4. Configure Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-atlas-uri>`
   - `JWT_SECRET=<your-secure-jwt-secret>`
   - `CORS_ORIGIN=https://<your-frontend-domain>.vercel.app`
   - `AI_ENGINE_URL=https://<your-ai-service>.onrender.com`
5. On initial launch, the server automatically connects to MongoDB Atlas and auto-seeds the initial demo cohort.

### Step 4: Deploy Frontend (Vercel)
1. Connect Git repository to [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   - `VITE_API_URL=https://<your-backend-service>.onrender.com/api`
7. In Vercel Project Settings, add Single-Page Application (SPA) rewrite rule in `vercel.json` if needed:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 4. Security Checklist Before Launch
- [x] Ensure `.env` is listed in `.gitignore` across all subdirectories. Never commit real secrets.
- [x] Configure `CORS_ORIGIN` to explicitly restrict access to verified client domains in production.
- [x] Use HTTPS/TLS termination across all public endpoints.
- [x] Ensure MongoDB Atlas users have least-privilege role assignments.
- [x] Review error responses to verify no database internal stack traces leak to users (`NODE_ENV=production` suppresses stack traces).
