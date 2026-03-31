class IntelligenceService {
  generateDecisionIntelligence(client, details) {
    // Add null checks for client
    if (!client) {
      throw new Error('Client data is null');
    }

    const intelligence = {
      summary: this.generateSummary(client, details),
      positioning: this.determinePositioning(details),
      best_fit: this.identifyBestFit(details),
      strengths: this.extractStrengths(details),
      weaknesses: this.identifyWeaknesses(details),
      risks: this.assessRisks(details),
      opportunities: this.identifyOpportunities(details),
      differentiator_score: this.calculateDifferentiatorScore(details),
      market_score: this.calculateMarketScore(client, details),
      product_score: this.calculateProductScore(details),
      pricing_score: this.calculatePricingScore(details),
      moat_score: this.calculateMoatScore(details),
      tags: this.generateTags(details),
      red_flags: this.identifyRedFlags(details),
      key_takeaway: this.generateKeyTakeaway(client, details),
      verdict: this.generateVerdict(client, details)
    };

    return intelligence;
  }

  generateSummary(client, details) {
    const industry = client.industry || 'Unknown';
    const offeringCount = details.offerings?.length || 0;
    const differentiatorCount = details.differentiators?.length || 0;
    
    if (differentiatorCount >= 3) {
      return `${industry} platform with strong differentiation and ${offeringCount} core offerings`;
    } else if (offeringCount >= 3) {
      return `Comprehensive ${industry} solution with ${offeringCount} integrated offerings`;
    } else {
      return `Focused ${industry} SaaS with specialized capabilities`;
    }
  }

  determinePositioning(details) {
    const differentiatorStrength = details.differentiators?.length || 0;
    const capabilityBreadth = details.capabilities?.length || 0;
    const benefitQuality = this.analyzeBenefitQuality(details.benefits);

    if (differentiatorStrength >= 4 && benefitQuality >= 8) {
      return 'leader';
    } else if (differentiatorStrength >= 2 && capabilityBreadth >= 3) {
      return 'challenger';
    } else {
      return 'niche';
    }
  }

  identifyBestFit(details) {
    const capabilities = details.capabilities || [];
    const benefits = details.benefits || [];

    if (capabilities.some(c => c.toLowerCase().includes('enterprise')) || 
        benefits.some(b => b.toLowerCase().includes('scale'))) {
      return 'Enterprise organizations';
    } else if (capabilities.some(c => c.toLowerCase().includes('smb')) || 
               benefits.some(b => b.toLowerCase().includes('cost'))) {
      return 'Small to medium businesses';
    } else if (capabilities.some(c => c.toLowerCase().includes('startup'))) {
      return 'Startups and growing companies';
    } else {
      return 'Mid-market companies';
    }
  }

  extractStrengths(details) {
    const strengths = [];
    
    // Extract from benefits
    if (details.benefits) {
      details.benefits.forEach(benefit => {
        if (benefit.toLowerCase().includes('roi') || 
            benefit.toLowerCase().includes('increase') ||
            benefit.toLowerCase().includes('improve')) {
          strengths.push(benefit);
        }
      });
    }

    // Extract from differentiators
    if (details.differentiators) {
      details.differentiators.slice(0, 2).forEach(diff => {
        strengths.push(diff);
      });
    }

    return strengths.slice(0, 4);
  }

  identifyWeaknesses(details) {
    const weaknesses = [];
    
    const capabilityCount = details.capabilities?.length || 0;
    const offeringCount = details.offerings?.length || 0;
    
    if (capabilityCount < 2) {
      weaknesses.push('Limited feature set');
    }
    
    if (offeringCount < 2) {
      weaknesses.push('Narrow product scope');
    }

    if (!details.differentiators || details.differentiators.length === 0) {
      weaknesses.push('No clear differentiation');
    }

    if (details.pricing && details.pricing.toLowerCase().includes('high')) {
      weaknesses.push('Premium pricing may limit adoption');
    }

    return weaknesses;
  }

  assessRisks(details) {
    const risks = [];
    
    if (details.pricing) {
      if (details.pricing.toLowerCase().includes('high') || 
          details.pricing.toLowerCase().includes('premium')) {
        risks.push('High price point could slow market penetration');
      }
      if (details.pricing.toLowerCase().includes('custom')) {
        risks.push('Custom pricing may create sales complexity');
      }
    }

    if (!details.differentiators || details.differentiators.length < 2) {
      risks.push('Risk of commoditization due to limited differentiation');
    }

    if (details.capabilities && details.capabilities.length > 8) {
      risks.push('Complex feature set may impact user experience');
    }

    risks.push('Market saturation in core segment');
    risks.push('Competitive pressure from established players');

    return risks.slice(0, 4);
  }

  identifyOpportunities(details) {
    const opportunities = [];
    
    opportunities.push('International market expansion');
    
    if (details.capabilities && details.capabilities.some(c => 
        c.toLowerCase().includes('ai') || c.toLowerCase().includes('ml'))) {
      opportunities.push('AI/ML feature enhancement and upsell');
    }

    if (details.benefits && details.benefits.some(b => 
        b.toLowerCase().includes('integration'))) {
      opportunities.push('Platform ecosystem development');
    }

    opportunities.push('Strategic partnership opportunities');
    opportunities.push('Adjacent market segment expansion');

    return opportunities;
  }

  calculateDifferentiatorScore(details) {
    const count = details.differentiators?.length || 0;
    const quality = this.analyzeDifferentiatorQuality(details.differentiators);
    
    if (count >= 4 && quality >= 8) return 9;
    if (count >= 3 && quality >= 7) return 8;
    if (count >= 2 && quality >= 6) return 7;
    if (count >= 1 && quality >= 5) return 6;
    if (count >= 1) return 5;
    return 3;
  }

  calculateMarketScore(client, details) {
    let score = 5;
    
    if (!client || !client.industry) {
      return score; // Return default score if client or industry is null
    }
    
    const industry = client.industry.toLowerCase();
    if (industry.includes('ai') || industry.includes('analytics')) score += 2;
    if (industry.includes('enterprise') || industry.includes('b2b')) score += 1;
    
    if (details.benefits && details.benefits.length >= 3) score += 1;
    if (details.offerings && details.offerings.length >= 3) score += 1;
    
    return Math.min(10, score);
  }

  calculateProductScore(details) {
    const capabilityCount = details.capabilities?.length || 0;
    const benefitQuality = this.analyzeBenefitQuality(details.benefits);
    
    let score = 3;
    score += Math.min(capabilityCount * 0.5, 3);
    score += Math.min(benefitQuality * 0.3, 4);
    
    return Math.min(10, Math.round(score));
  }

  calculatePricingScore(details) {
    if (!details.pricing) return 5;
    
    const pricing = details.pricing.toLowerCase();
    
    if (pricing.includes('flexible') || pricing.includes('tiered')) return 8;
    if (pricing.includes('competitive') || pricing.includes('affordable')) return 7;
    if (pricing.includes('premium') || pricing.includes('high')) return 4;
    if (pricing.includes('custom')) return 6;
    
    return 5;
  }

  calculateMoatScore(details) {
    const differentiatorScore = this.calculateDifferentiatorScore(details);
    const productScore = this.calculateProductScore(details);
    
    // Moat is based on differentiation + product strength + switching costs
    let moatScore = (differentiatorScore * 0.4) + (productScore * 0.3);
    
    // Add points for integration capabilities
    if (details.capabilities && details.capabilities.some(c => 
        c.toLowerCase().includes('integration'))) {
      moatScore += 2;
    }
    
    return Math.min(10, Math.round(moatScore));
  }

  generateTags(details) {
    const tags = [];
    
    const differentiatorScore = this.calculateDifferentiatorScore(details);
    const productScore = this.calculateProductScore(details);
    const pricingScore = this.calculatePricingScore(details);
    
    if (differentiatorScore >= 8) tags.push('Highly Differentiated');
    if (productScore >= 8) tags.push('Product Leader');
    if (pricingScore >= 7) tags.push('Competitive Pricing');
    if (pricingScore <= 4) tags.push('Premium Pricing');
    
    if (details.capabilities && details.capabilities.some(c => 
        c.toLowerCase().includes('enterprise'))) {
      tags.push('Enterprise Ready');
    }
    
    if (details.offerings && details.offerings.length >= 4) {
      tags.push('Comprehensive Platform');
    }
    
    if (details.differentiators && details.differentiators.some(d => 
        d.toLowerCase().includes('ai'))) {
      tags.push('AI-Powered');
    }
    
    if (this.calculateMoatScore(details) >= 7) {
      tags.push('Strong Moat');
    }
    
    return tags.length > 0 ? tags : ['Emerging Solution'];
  }

  identifyRedFlags(details) {
    const redFlags = [];
    
    if (!details.differentiators || details.differentiators.length === 0) {
      redFlags.push('No clear competitive advantage');
    }
    
    if (details.capabilities && details.capabilities.length < 2) {
      redFlags.push('Limited feature completeness');
    }
    
    if (details.pricing && details.pricing.toLowerCase().includes('unclear')) {
      redFlags.push('Pricing strategy unclear');
    }
    
    if (!details.benefits || details.benefits.length < 2) {
      redFlags.push('Weak value proposition');
    }
    
    return redFlags;
  }

  generateKeyTakeaway(client, details) {
    const positioning = this.determinePositioning(details);
    const moatScore = this.calculateMoatScore(details);
    const differentiatorScore = this.calculateDifferentiatorScore(details);
    
    if (positioning === 'leader' && moatScore >= 8) {
      return `Market leader with strong competitive advantages in ${client.industry}`;
    } else if (differentiatorScore >= 7) {
      return `Strong differentiation potential with clear market opportunity`;
    } else if (positioning === 'challenger') {
      return `Growing challenger with room for market expansion`;
    } else {
      return `Niche player needing differentiation to scale`;
    }
  }

  generateVerdict(client, details) {
    const overallScore = (
      this.calculateDifferentiatorScore(details) +
      this.calculateMarketScore(client, details) +
      this.calculateProductScore(details) +
      this.calculatePricingScore(details) +
      this.calculateMoatScore(details)
    ) / 5;

    const redFlags = this.identifyRedFlags(details);
    
    if (overallScore >= 8 && redFlags.length === 0) {
      return 'Strong Buy - High potential with minimal risks';
    } else if (overallScore >= 7 && redFlags.length <= 1) {
      return 'Buy - Solid opportunity with manageable risks';
    } else if (overallScore >= 6) {
      return 'Consider - Promising but requires due diligence';
    } else if (overallScore >= 5) {
      return 'Cautious - Limited upside with notable concerns';
    } else {
      return 'Avoid - High risk with unclear competitive advantage';
    }
  }

  // Helper methods
  analyzeBenefitQuality(benefits) {
    if (!benefits || benefits.length === 0) return 0;
    
    let qualityScore = 0;
    benefits.forEach(benefit => {
      const lower = benefit.toLowerCase();
      if (lower.includes('roi') || lower.includes('revenue')) qualityScore += 3;
      else if (lower.includes('increase') || lower.includes('improve')) qualityScore += 2;
      else if (lower.includes('save') || lower.includes('reduce')) qualityScore += 2;
      else qualityScore += 1;
    });
    
    return Math.min(10, qualityScore);
  }

  analyzeDifferentiatorQuality(differentiators) {
    if (!differentiators || differentiators.length === 0) return 0;
    
    let qualityScore = 0;
    differentiators.forEach(diff => {
      const lower = diff.toLowerCase();
      if (lower.includes('proprietary') || lower.includes('patented')) qualityScore += 3;
      else if (lower.includes('unique') || lower.includes('exclusive')) qualityScore += 2;
      else if (lower.includes('first') || lower.includes('only')) qualityScore += 2;
      else qualityScore += 1;
    });
    
    return Math.min(10, qualityScore);
  }
}

module.exports = new IntelligenceService();
