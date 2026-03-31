const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = process.env.GROK_API_KEY ? new OpenAI({
      apiKey: process.env.GROK_API_KEY
    }) : null;
  }

  async enhanceIntelligence(client, details) {
    console.log('🤖 Starting AI enhancement with OpenAI...');
    console.log('Client:', client ? client.name : 'NULL');
    console.log('Details present:', details ? 'Yes' : 'No');
    
    if (!this.openai) {
      throw new Error("OpenAI API key not configured");
    }

    const prompt = `
Analyze this SaaS company and return STRICT JSON:

{
  "summary": "...",
  "positioning": "leader | challenger | niche",
  "best_fit": "...",
  "strengths": ["..."],
  "weaknesses": ["..."],
  "risks": ["..."],
  "opportunities": ["..."],
  "differentiator_score": 1-10,
  "market_score": 1-10,
  "product_score": 1-10,
  "pricing_score": 1-10,
  "moat_score": 1-10,
  "tags": ["..."],
  "red_flags": ["..."],
  "key_takeaway": "...",
  "verdict": "Strong Buy | Buy | Consider | Cautious | Avoid"
}

Company:
Name: ${client.name}
Industry: ${client.industry}
Overview: ${client.overview}

Details:
Offerings: ${details.offerings?.join(", ") || "N/A"}
Capabilities: ${details.capabilities?.join(", ") || "N/A"}
Benefits: ${details.benefits?.join(", ") || "N/A"}
Differentiators: ${details.differentiators?.join(", ") || "N/A"}
Pricing: ${details.pricing || "N/A"}
`;

    try {
      console.log('🚀 Making API call to OpenAI...');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a senior SaaS investment analyst. Convert this company data into structured decision intelligence. Return only valid JSON, no explanations or markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      });

      const aiContent = response.choices[0].message.content;
      console.log('✅ OpenAI API response received');

      let aiIntelligence;
      try {
        aiIntelligence = JSON.parse(aiContent);
        console.log('✅ JSON parsed successfully');
      } catch {
        console.error("❌ Invalid JSON from OpenAI:", aiContent);
        throw new Error("AI returned invalid JSON");
      }
      
      return aiIntelligence;

    } catch (error) {
      console.error("❌ OPENAI ERROR:", error);
      throw new Error(`AI enhancement failed: ${error.message}`);
    }
  }
}

module.exports = new AIService();