# Portfolio Dashboard - Setup Instructions

## API Error Fix

The chatbot API issue has been resolved by setting up a backend server. Here's what changed:

### What was fixed:
1. **Removed direct API calls from frontend** - Frontend was trying to call Anthropic API directly (causes CORS errors)
2. **Created backend API endpoint** - New `server.js` handles API requests securely
3. **Updated chatbot integration** - Frontend now calls backend on `http://localhost:3001/api/chat`

### To enable the chatbot:

1. **Get your Anthropic API key:**
   - Visit https://console.anthropic.com/
   - Create/copy your API key

2. **Set the environment variable:**
   ```bash
   export ANTHROPIC_API_KEY="your-api-key-here"
   ```

3. **Start the backend server:**
   ```bash
   node server.js
   ```

4. **Keep both servers running:**
   - Frontend: http://localhost:5173 (Vite dev server)
   - Backend: http://localhost:3001 (Node/Express API)

### Current Status:
✅ Backend server is running on port 3001
✅ Frontend is running on port 5173
⏳ Waiting for you to set ANTHROPIC_API_KEY

Once you set the API key, the chatbot will work!
