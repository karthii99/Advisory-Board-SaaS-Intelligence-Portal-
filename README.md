# SaaS Intelligence Decision-Support System

A production-grade backend API that transforms raw SaaS data into structured, decision-ready intelligence for advisory board members evaluating partnerships, investments, and GTM strategies.

## 🎯 Core Objective

Enable users to answer critical questions in under 30 seconds:
- Should we partner with this company?
- Is this SaaS differentiated or commoditized?
- What are the risks and opportunities?
- Where does it stand in the market?

## 🏗️ Architecture

```
src/
├── controllers/     # HTTP request handling
├── services/        # Business logic & intelligence engine
├── db/             # Database connection & schema
├── routes/         # API routing
├── middleware/     # Security & error handling
└── server.js       # Express server entry point
```

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up database**
   ```bash
   # Run the schema.sql file in your PostgreSQL database
   psql -d your_database < src/db/schema.sql
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Seed sample data**
   ```bash
   curl -X POST http://localhost:3000/api/clients/seed
   ```

## 📊 API Endpoints

### Health Check
```
GET /api/clients/health
```

### Get All Clients
```
GET /api/clients
```

### Get Client with Intelligence
```
GET /api/clients/:id
```

### Seed Sample Data
```
POST /api/clients/seed
```

### AI Enhancement (Optional)
```
POST /api/clients/ai-intelligence/:id
```

## 🧠 Intelligence Engine

The system transforms raw SaaS data into structured intelligence:

```json
{
  "summary": "AI Marketing Platform with strong differentiation",
  "positioning": "leader",
  "best_fit": "Enterprise organizations",
  "strengths": ["40% increase in conversion rates"],
  "weaknesses": ["Premium pricing may limit adoption"],
  "risks": ["High price point could slow penetration"],
  "opportunities": ["International market expansion"],
  "differentiator_score": 9,
  "market_score": 8,
  "product_score": 8,
  "pricing_score": 4,
  "moat_score": 8,
  "tags": ["Highly Differentiated", "Enterprise Ready"],
  "red_flags": [],
  "key_takeaway": "Market leader with strong competitive advantages",
  "verdict": "Strong Buy - High potential with minimal risks"
}
```

## 🔧 Intelligence Logic

### Decision Heuristics
- **Strong differentiators** → High moat_score
- **High pricing** → Increased risk + lower pricing_score  
- **ROI-focused benefits** → Higher product_score
- **Generic features** → Commoditization risk

### Scoring System
- **Differentiator Score** (1-10): Based on uniqueness and competitive advantage
- **Market Score** (1-10): Industry trends and market potential
- **Product Score** (1-10): Capability breadth and benefit quality
- **Pricing Score** (1-10): Competitiveness and accessibility
- **Moat Score** (1-10): Overall defensibility

### Positioning Algorithm
- **Leader**: Strong differentiation + high benefit quality
- **Challenger**: Moderate differentiation + broad capabilities
- **Niche**: Limited differentiation or narrow focus

## 🗄️ Data Models

### Clients
- `id`: Primary key
- `name`: Company name
- `industry`: Industry sector
- `overview`: Business description

### Client Details
- `offerings`: Product/service offerings array
- `capabilities`: Technical capabilities array
- `benefits`: Customer benefits array
- `differentiators`: Competitive advantages array
- `pricing`: Pricing strategy text

## 🔒 Security Features

- **Rate limiting**: Configurable limits per endpoint
- **CORS protection**: Cross-origin request security
- **Helmet**: Security headers and protections
- **Input validation**: Request data validation
- **Error handling**: Secure error responses

## 📦 Dependencies

- **Express**: Web framework
- **PostgreSQL**: Primary database
- **OpenAI**: Optional AI enhancement
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API protection

## 🚀 Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   ```

2. **Database Migration**
   ```bash
   # Run schema in production database
   ```

3. **Process Management**
   ```bash
   # Use PM2 or similar for process management
   npm install -g pm2
   pm2 start src/server.js --name saas-intelligence
   ```

## 📈 Performance Considerations

- **Database Indexing**: Optimized queries on industry and client_id
- **Connection Pooling**: 20 max connections with 30s timeout
- **Rate Limiting**: Prevents abuse and ensures stability
- **Error Handling**: Comprehensive error management

## 🤖 AI Enhancement (Optional)

Configure OpenAI API key to enable AI-powered intelligence enhancement:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

The AI service enhances rule-based intelligence with natural language processing and advanced reasoning.

## 📝 Development

```bash
# Development mode with hot reload
npm run dev

# Run tests
npm test

# Production build
npm start
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Built for SaaS decision intelligence. Transforming data into strategic insights.**
