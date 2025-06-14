# InfluencerVerifier - Health Claims Verification Platform

## Overview
InfluencerVerifier is a sophisticated platform designed to verify health claims made by social media influencers using AI-powered analysis. The application helps users distinguish between evidence-based health information and potentially misleading claims by automatically analyzing content from health influencers and cross-referencing their statements with trusted scientific journals.

## Purpose
In today's digital landscape, health influencers have significant impact on public health decisions, yet there's often limited accountability for the accuracy of their claims. InfluencerVerifier addresses this gap by providing:
- Objective analysis of influencer health claims
- Scientific verification against peer-reviewed research
- Transparency through trust scores and evidence-based ratings
- A centralized database of verified health information

## Core Features

### Influencer Discovery and Analysis
- Automated profile analysis of health influencers
- Content extraction and claim identification
- Trust score calculation based on scientific accuracy
- Tracking of follower metrics and potential reach/impact

### Health Claims Extraction and Categorization
- Natural language processing to identify specific health claims
- Automatic categorization by topic (Nutrition, Exercise, Mental Health, etc.)
- Historical tracking of claims and consistency analysis
- Identification of potential misinformation patterns

### Scientific Verification Against Trusted Journals
- Integration with major scientific databases and journals
- Real-time claim verification against peer-reviewed research
- Evidence strength assessment and confidence scoring
- Citation linking to original research sources

### Trust Score Generation
- Comprehensive scoring algorithm considering multiple factors:
  - Claim accuracy percentage
  - Scientific evidence strength
  - Consistency over time
  - Corrections/retractions history
  - Qualification relevance to health topics discussed
- Transparent breakdown of scoring components

### Interactive Dashboard with Leaderboard
- Real-time trust score updates
- Filtering by health category, platform, and audience size
- Comparative analysis between similar influencers
- Trending topics and claim verification statistics

### Detailed Influencer Profiles
- Comprehensive claim history with verification status
- Scientific reference tracking and evidence quality assessment
- Audience reach and potential public health impact metrics
- Qualification verification and expertise assessment

## Technical Architecture

### Frontend
- React 18 with TypeScript for type safety
- Tailwind CSS for responsive and modern UI
- React Router for navigation
- Axios for API requests
- Headless UI components for accessibility

### Backend
- Node.js with Express framework
- TypeScript for enhanced code quality
- MongoDB with Mongoose for flexible data modeling
- Rate limiting and security middleware
- Perplexity AI integration for advanced content analysis

## Complete Technology Stack

### Frontend Technologies
- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Static type-checking for JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React Router v7**: Declarative routing for React applications
- **Axios**: Promise-based HTTP client
- **Headless UI**: Unstyled, accessible UI components
- **Vite**: Next-generation frontend build tool
- **ESLint**: Static code analysis tool
- **React Query**: Data fetching library
- **React Hook Form**: Form validation library
- **Recharts**: Composable charting library for React
- **date-fns**: Modern JavaScript date utility library

### Backend Technologies
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **TypeScript**: Type safety for JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling tool
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing middleware
- **express-rate-limit**: Rate limiting middleware
- **ts-node-dev**: TypeScript execution and development tool
- **Perplexity AI API**: AI-powered content analysis
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing library

### Development & DevOps Tools
- **Git**: Version control system
- **npm**: Package manager
- **concurrently**: Run multiple commands concurrently
- **ESLint**: JavaScript linting utility
- **Prettier**: Code formatter
- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library
- **Render**: Cloud application hosting platform
- **GitHub Actions**: CI/CD workflow automation
- **MongoDB Atlas**: Cloud database service

### APIs and External Services
- **Perplexity AI API**: For advanced natural language processing
- **PubMed API**: For scientific journal access
- **Google Scholar API**: For academic research access
- **Social Media Platform APIs**: For influencer content retrieval
- **Cloudinary**: For media asset management

### Security Tools
- **Helmet**: HTTP header security
- **express-rate-limit**: Request rate limiting
- **CORS**: Cross-Origin Resource Sharing configuration
- **Content Security Policy**: Browser-based security
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

### Key Workflows
1. **Influencer Analysis Process**:
   - User submits influencer name/handle
   - System retrieves and analyzes recent content
   - AI extracts health claims and categorizes them
   - Claims are verified against scientific databases
   - Trust score is calculated and displayed

2. **Claim Verification Process**:
   - Health claim is isolated and normalized
   - Relevant scientific literature is searched
   - Evidence strength is assessed
   - Verification result is determined
   - Results are stored and contribute to trust score

3. **User Experience Flow**:
   - Browse leaderboard of verified influencers
   - Search for specific influencers
   - View detailed verification reports
   - Compare influencers within categories
   - Access original scientific sources

## Value Proposition
InfluencerVerifier empowers users to:
- Make informed decisions about health information
- Identify reliable health influencers
- Access evidence-based health content
- Understand the scientific basis (or lack thereof) behind popular health claims
- Contribute to a healthier information ecosystem

## Target Audience
- Health-conscious consumers seeking reliable information
- Healthcare professionals monitoring online health trends
- Researchers studying misinformation in health communications
- Media organizations fact-checking health content
- Brands seeking partnerships with credible health influencers

## Future Development Roadmap
- Browser extension for real-time claim verification
- API access for third-party integration
- Machine learning improvements for claim extraction accuracy
- Expanded journal database coverage
- Community contribution features for collaborative verification 