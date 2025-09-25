# EdTech Platform

A comprehensive educational technology platform featuring video lessons, AI-powered voice labs, video chat with AI tutors, and a token-based access system.

## Features

### For Learners
- **Phone/OTP Authentication**: Secure login using phone number and SMS OTP
- **Video Lessons**: Free access to educational video content
- **Voice Labs**: AI-powered speaking practice with pronunciation feedback (requires tokens)
- **Video Chat**: One-on-one sessions with AI tutors (requires tokens)
- **Token System**: Purchase tokens via USSD simulation for premium features

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Token balances update in real-time
- **Session Management**: Track active learning sessions
- **USSD Simulation**: Realistic mobile money payment flow

## Project Structure

\`\`\`
edtech-platform/
├── client/                 # Next.js frontend
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── public/           # Static assets
└── server/               # Express.js backend
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    └── server.js         # Main server file
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd edtech-platform
   \`\`\`

2. **Install client dependencies**
   \`\`\`bash
   cd client
   npm install
   \`\`\`

3. **Install server dependencies**
   \`\`\`bash
   cd ../server
   npm install
   \`\`\`

4. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

### Development

1. **Start the backend server**
   \`\`\`bash
   cd server
   npm run dev
   \`\`\`
   Server runs on http://localhost:5000

2. **Start the frontend (in a new terminal)**
   \`\`\`bash
   cd client
   npm run dev
   \`\`\`
   Client runs on http://localhost:3000

### API Documentation

Visit http://localhost:5000/api/docs for complete API documentation.

## Key Components

### Authentication System
- Phone number registration
- SMS OTP verification (simulated)
- Session management with localStorage

### Token Economy
- Starting balance: 100 tokens
- Voice Labs: 10 tokens per session
- Video Chat: 15 tokens per session
- Recharge via USSD simulation

### Learning Features
- **Video Lessons**: Free educational content
- **Voice Labs**: AI conversation practice (placeholder for 11Labs integration)
- **Video Chat**: AI tutor sessions (placeholder for WebRTC integration)

## Future Integrations

### Planned API Integrations
- **11Labs**: Voice synthesis and recognition for voice labs
- **Africa's Talking**: SMS OTP and USSD payments
- **WebRTC**: Real-time video chat with AI agents

### Database Integration
Currently uses in-memory storage. Production deployment should integrate with:
- PostgreSQL or MongoDB for user data
- Redis for session management
- Cloud storage for video content

## Deployment

### Frontend (Vercel)
\`\`\`bash
cd client
npm run build
# Deploy to Vercel
\`\`\`

### Backend (Railway/Heroku)
\`\`\`bash
cd server
# Set environment variables
# Deploy to your preferred platform
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact the development team or create an issue in the repository.
