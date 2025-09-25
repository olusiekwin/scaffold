# EdTech Platform - Client

React/Next.js frontend for the EdTech platform with video lessons, AI voice labs, and token-based access.

## Setup Instructions

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The client will run on http://localhost:3000

## Features

- **Authentication**: Phone number + OTP login
- **Learner Dashboard**: Video lessons, voice labs, video chat with AI
- **Token System**: Balance display and recharge functionality

## Project Structure

- `app/` - Next.js app router pages
- `components/` - Reusable React components
- `lib/` - Utility functions and API calls
- `public/` - Static assets

## Environment Variables

The client uses API routes that proxy to the backend server running on port 5000.
