# 🛠️ Local Development Setup

## Prerequisites

- Node.js 18+
- Java JDK 11+ (for code execution)
- PostgreSQL (optional - Supabase can be used instead)

## Step 1: Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 2: Environment Variables

### Backend

Create `backend/.env`:
```
PORT=5000
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_ID=your_clerk_user_id
EXECUTION_TIMEOUT=5000
```

### Frontend

Create `frontend/.env`:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Step 3: Database Setup

1. Create a Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Copy connection strings to your `.env` files

## Step 4: Run Development Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## Step 5: Test the App

1. Navigate to `http://localhost:3000`
2. Sign up with Google via Clerk
3. Create your first Java quest in Admin Panel
4. Solve a quest and submit

## 📁 Project Structure

```
website/
├── backend/
│   ├── src/
│   │   └── index.js          # Express server & API routes
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── App.jsx           # Main app component
│   │   └── index.css         # Global styles
│   ├── vite.config.js
│   └── .env.example
├── database/
│   └── schema.sql            # Supabase schema
├── README.md
└── DEPLOYMENT.md
```

## 🧪 Testing Locally

### Create a Sample Quest

1. Go to Admin Panel (`/admin`)
2. Click "New Quest"
3. Add:
   - Title: "Hello World"
   - Description: "Print Hello World"
   - Difficulty: easy
   - XP Reward: 10
   - Test Case Input: (empty)
   - Test Case Output: "Hello World"

### Solve the Quest

1. Go to Quests (`/dashboard`)
2. Click on "Hello World"
3. Write Java code:
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```
4. Click "Run" to test
5. Click "Submit" to submit

## 🚀 Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The build files will be in `frontend/dist`

## 📚 Documentation

- [Clerk Docs](https://clerk.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

## 💡 Tips

- Use `npm run dev` for development (auto-reload enabled)
- Check browser console for frontend errors
- Check server console for backend errors
- Test Java code locally with `javac` and `java` before submitting
