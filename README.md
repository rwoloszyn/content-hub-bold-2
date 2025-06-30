# ContentHub - AI-Powered Content Management Platform

A comprehensive content management and social media scheduling platform with AI-powered content generation.

## Features

- 🔐 **Authentication**: Email/password and OAuth (Google, Facebook, LinkedIn)
- 📝 **Content Management**: Create, edit, and organize content
- 📅 **Content Calendar**: Schedule posts across multiple platforms
- 🤖 **AI Generation**: Generate content using AI templates
- 📊 **Analytics**: Track performance across platforms
- 🔗 **Platform Integration**: Connect to social media accounts
- 📁 **Media Library**: Organize images and videos
- 🔄 **Notion Sync**: Sync content with Notion databases
- ⚙️ **Settings**: Comprehensive user and app settings

## OAuth Setup

To enable OAuth authentication, you'll need to set up applications with the following providers:

### Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add your domain to authorized origins
6. Add `http://localhost:5173/auth/callback/google` to authorized redirect URIs
7. Copy your Client ID to `VITE_GOOGLE_CLIENT_ID` in your `.env` file

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. In Facebook Login settings, add `http://localhost:5173/auth/callback/facebook` to Valid OAuth Redirect URIs
5. Copy your App ID to `VITE_FACEBOOK_APP_ID` in your `.env` file

### LinkedIn OAuth Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add Sign In with LinkedIn product
4. In Auth settings, add `http://localhost:5173/auth/callback/linkedin` to Authorized redirect URLs
5. Copy your Client ID to `VITE_LINKEDIN_CLIENT_ID` in your `.env` file

## Environment Variables

Copy `.env.example` to `.env` and fill in your OAuth credentials:

```bash
cp .env.example .env
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Demo Account

You can test the application with the demo account:
- Email: `demo@contenthub.com`
- Password: `password`

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Authentication**: Custom OAuth implementation
- **State Management**: React Hooks

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components
│   ├── Dashboard/      # Dashboard components
│   └── ...
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── config/             # Configuration files
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.