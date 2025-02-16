# InfluencerVerifier

A powerful platform for verifying health influencers' claims using AI-powered analysis. This tool helps bring clarity and credibility to online health information by automatically analyzing content from health influencers and verifying their claims against trusted scientific journals.

## Features

- Influencer Discovery and Analysis
- Health Claims Extraction and Categorization
- Scientific Verification Against Trusted Journals
- Trust Score Generation
- Interactive Dashboard with Leaderboard
- Detailed Influencer Profiles

## Tech Stack

- Frontend: React with TypeScript
- Backend: Node.js with Express
- AI Integration: Perplexity API
- Styling: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend directory:
     ```bash
     cp backend/.env.example backend/.env
     ```
   - Update the `.env` file with your credentials:
     - `PERPLEXITY_API_KEY`: Get from [Perplexity AI](https://www.perplexity.ai/)
     - `MONGODB_URI`: Get from MongoDB Atlas
   
   ⚠️ **SECURITY NOTE**: 
   - Never commit the `.env` file to version control
   - Keep your API keys and database credentials secure
   - Regularly rotate your API keys and credentials
   - Use environment-specific `.env` files for different deployments

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Node.js backend server
  - `/src/services` - Core business logic
  - `/src/models` - Database models
  - `/src/routes` - API routes
- `/shared` - Shared types and utilities

## Security Best Practices

1. Environment Variables:
   - Use `.env` files for configuration
   - Never commit sensitive data to version control
   - Use different credentials for development and production

2. API Keys:
   - Keep API keys secure and private
   - Use environment variables for all sensitive data
   - Implement rate limiting and request validation

3. Database:
   - Use strong passwords
   - Restrict database access to necessary IPs
   - Regular security audits and updates

## Contributing

1. Create a new branch for your feature
2. Ensure no sensitive data is included in commits
3. Submit a pull request with a clear description

## License

This project is licensed under the MIT License - see the LICENSE file for details. 