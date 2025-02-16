# InfluencerVerifier

A powerful platform for verifying health influencers' claims using AI-powered analysis. This tool helps bring clarity and credibility to online health information by automatically analyzing content from health influencers and verifying their claims against trusted scientific journals.

## Features

- **Influencer Discovery and Analysis**
  - Automated influencer profile analysis
  - Trust score calculation based on claim accuracy
  - Follower and revenue metrics tracking

- **Health Claims Extraction and Categorization**
  - Natural language processing for claim extraction
  - Automatic categorization (Nutrition, Exercise, Mental Health, etc.)
  - Historical claim tracking and analysis

- **Scientific Verification Against Trusted Journals**
  - Integration with major scientific databases
  - Real-time claim verification
  - Evidence-based scoring system

- **Trust Score Generation**
  - Weighted scoring algorithm
  - Multiple verification factors
  - Transparent scoring breakdown

- **Interactive Dashboard with Leaderboard**
  - Real-time trust score updates
  - Filtering and sorting capabilities
  - Detailed performance metrics

- **Detailed Influencer Profiles**
  - Comprehensive claim history
  - Scientific reference tracking
  - Revenue and impact analysis

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Headless UI components

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- Rate limiting and security middleware
- Perplexity AI integration

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- Perplexity AI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/P3st83/InfluencerVerifier.git
   cd InfluencerVerifier
   ```

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

```
InfluencerVerifier/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main application component
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.ts     # Vite configuration
├── backend/                # Node.js backend server
│   ├── src/
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json      # TypeScript configuration
└── package.json           # Root package.json
```

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Main development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `release/*`: Release preparation

### Branch Protection Rules
1. `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - No direct pushes
   - No force pushes

2. `develop` branch:
   - Require one reviewer
   - Require status checks
   - Allow force pushes with lease

### Code Review Guidelines
1. Review for:
   - Code quality and style
   - Security considerations
   - Performance implications
   - Test coverage

2. Pull Request Template:
   ```markdown
   ## Description
   [Description of changes]

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] Manual testing

   ## Security Considerations
   [Security implications]
   ```

## API Documentation

### Endpoints

#### GET /api/influencers
- Returns list of analyzed influencers
- Sorted by trust score
- Includes basic metrics

#### POST /api/analyze-influencer
- Analyzes a specific influencer
- Parameters:
  ```typescript
  {
    influencerName: string;
    timeRange: string;
    claimsToAnalyze: number;
  }
  ```

#### POST /api/verify-claims
- Verifies health claims against scientific sources
- Parameters:
  ```typescript
  {
    claims: string[];
    journals: string[];
  }
  ```

## Security Best Practices

1. Environment Variables:
   - Use `.env` files for configuration
   - Never commit sensitive data
   - Use different credentials per environment

2. API Keys:
   - Keep API keys secure and private
   - Use environment variables
   - Implement rate limiting
   - Regular key rotation

3. Database:
   - Strong passwords
   - IP whitelisting
   - Regular security audits
   - Encrypted connections

4. Frontend:
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Secure cookie handling

## Contributing

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation
- Keep commits atomic
- Use meaningful commit messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Perplexity AI](https://www.perplexity.ai/) for AI capabilities
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for frontend framework 