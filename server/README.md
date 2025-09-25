# EdTech Platform - Server

Node.js/Express backend API for the EdTech platform.

## Setup Instructions

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login

### Tokens
- `GET /api/tokens/balance/:phoneNumber` - Get token balance
- `POST /api/tokens/recharge` - Recharge tokens (USSD simulation)
- `POST /api/tokens/deduct` - Deduct tokens for lab access

### Labs
- `POST /api/labs/voice` - Start voice lab session
- `POST /api/labs/video` - Start video chat session

## Future Integrations

- **11Labs**: Voice synthesis and recognition for voice labs
- **Africa's Talking**: SMS OTP and USSD for token recharge
- **WebRTC**: Real-time video chat with AI agents

All endpoints currently return placeholder responses for development.
