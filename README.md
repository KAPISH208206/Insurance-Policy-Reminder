# Insurance Policy Reminder - Insurify Pro

A full-stack insurance policy management and reminder application with WhatsApp notifications.

![Insurify Pro](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Features

- **Admin Dashboard**: Overview of clients, policies, and upcoming expiries
- **Client Management**: Add, edit, and delete client records
- **Policy Management**: Track insurance policies with expiry dates and premium amounts
- **Automated Reminders**: WhatsApp notifications at 30, 20, 10, 5, 1, and 0 days before policy expiry
- **AI Assistant**: Built-in support chatbot for help with app features
- **Visual Analytics**: Charts showing policy expiry trends

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Twilio Account** (optional, for WhatsApp reminders)
- **Gemini API Key** (optional, for AI assistant)

## 🔧 Installation & Setup

### Step 1: Clone and Setup Frontend

```bash
cd Insurance-Policy-Reminder
npm install
```

### Step 2: Configure Frontend Environment

Edit the `.env` file in the root folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Step 3: Setup Backend

```bash
cd backend
npm install
```

### Step 4: Configure Backend Environment

Edit the `backend/.env` file:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/insurance_db

# JWT Secret (change this to a secure random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Server Port
PORT=5000

# Twilio Configuration (optional - for WhatsApp reminders)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

### Step 5: Start MongoDB

Make sure MongoDB is running locally:

```bash
# On Windows (if installed as service)
net start MongoDB

# Or run mongod directly
mongod
```

### Step 6: Run the Application

**Terminal 1 - Start Backend:**

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🌐 Accessing the App

1. Open your browser and go to `http://localhost:3000`
2. **First Time Setup**: Register a new admin account (first registration becomes superadmin)
3. Login with your credentials
4. Start adding clients and policies!

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/login` | Admin login |
| POST | `/admin/register` | Register new admin |
| GET | `/clients` | Get all clients |
| POST | `/clients` | Add new client |
| PUT | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Delete client |
| GET | `/policies/upcoming` | Get upcoming policy expiries |
| POST | `/policies` | Add new policy |
| PUT | `/policies/:id` | Update policy |
| DELETE | `/policies/:id` | Delete policy |
| POST | `/policies/trigger-reminders` | Manually trigger reminder job |
| GET | `/api/health` | Health check |

## ⏰ Automated Reminders

The application automatically sends WhatsApp reminders at:
- 30 days before expiry
- 20 days before expiry
- 10 days before expiry
- 5 days before expiry
- 1 day before expiry
- Day of expiry

Reminders are sent daily at **9:00 AM IST**.

## 🛠️ Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- TailwindCSS
- Recharts (for analytics)
- Google Gemini AI

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Twilio (WhatsApp)
- node-cron (scheduling)

## 📁 Project Structure

```
Insurance-Policy-Reminder/
├── App.tsx                 # Main React component
├── index.tsx               # React entry point
├── index.html              # HTML template
├── components/             # React components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Layout.tsx
│   ├── ClientManagement.tsx
│   ├── PolicyManagement.tsx
│   └── GeminiAssistant.tsx
├── services/               # Frontend services
│   ├── api.ts
│   ├── geminiService.ts
│   └── chatbotRules.ts
├── types.ts                # TypeScript interfaces
├── backend/                # Express backend
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── cron/
│   └── utils/
├── .env                    # Frontend environment
└── package.json
```

## 🔒 Security Notes

- Never commit `.env` files to version control
- Change the default `JWT_SECRET` in production
- Use MongoDB Atlas with proper authentication for production
- Secure your Twilio credentials

## 📝 License

MIT License

---

Made with ❤️ for Insurance Management
