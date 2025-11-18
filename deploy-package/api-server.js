/**
 * Simple Express server for Voyage Passport API
 * Proxies requests to HubSpot and calculates tier information
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 8080;

// HubSpot API Configuration
const HUBSPOT_API_TOKEN = 'pat-na1-1389aa9c-6e1c-4574-9265-ec4a4425b8ad';
const CONTACTS_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/search';

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// Tier configuration
const TIERS = [
  {
    name: 'Weekender',
    threshold: 0,
    points_label: 'First Stay',
    tier_number: 5,
    color: '#e5e5e5',
    signature_benefit: 'Personalized Welcome Ritual (curated to guest)',
    earn_back_percent: 1,
    max_credit_per_stay: 2500,
    reward: 'Earn 1% back in Voyage Bucks (up to $2,500 redeemable on your next stay)',
    message: 'Your journey with Cuvée begins with a personalized welcome experience and earning Voyage Bucks toward your next stay.',
    short_reveal: 'Your journey begins.'
  },
  {
    name: 'Explorer',
    threshold: 40000,
    points_label: '40,000+ Voyage Points',
    tier_number: 4,
    color: '#8d93af',
    signature_benefit: 'Travel Style Setup — guest preferences are remembered & auto-applied pre-arrival',
    earn_back_percent: 2,
    max_credit_per_stay: 5000,
    reward: 'Earn 2% back in Voyage Bucks (up to $5,000 redeemable on your next stay)',
    message: 'Your preferences are remembered and every stay becomes more seamless, earning you more Voyage Bucks.',
    short_reveal: 'The world is opening.'
  },
  {
    name: 'Voyager',
    threshold: 100000,
    points_label: '100,000+ Voyage Points',
    tier_number: 3,
    color: '#2c2f3f',
    signature_benefit: 'One Signature Experience Per Year',
    earn_back_percent: 3,
    max_credit_per_stay: 7500,
    reward: 'Earn 3% back in Voyage Bucks (up to $7,500 redeemable on your next stay)',
    message: 'Your travels are becoming a tradition — and traditions should grow with greater rewards.',
    short_reveal: 'Tradition takes shape.'
  },
  {
    name: 'Jetsetter',
    threshold: 250000,
    points_label: '250,000+ Voyage Points',
    tier_number: 2,
    color: '#77664c',
    signature_benefit: 'Signature Experience Every Stay',
    earn_back_percent: 4,
    max_credit_per_stay: 10000,
    reward: 'Earn 4% back in Voyage Bucks (up to $10,000 redeemable on your next stay)',
    message: 'Every stay includes a curated signature moment crafted just for you and exceptional rewards.',
    short_reveal: 'More time awaits.'
  },
  {
    name: 'Cuvée Circle',
    threshold: 500000,
    points_label: '500,000+ Voyage Points',
    tier_number: 1,
    color: '#bda048',
    signature_benefit: 'One Complimentary Night Per Year + First Access to New Villas + Peak Week Soft Holds',
    earn_back_percent: 5,
    max_credit_per_stay: 15000,
    reward: 'Earn 5% back in Voyage Bucks (up to $15,000 redeemable on your next stay)',
    message: 'You\'ve arrived. This is the tier reserved for our most devoted travelers.',
    short_reveal: 'Welcome to The Circle.',
    circle_access: [
      'One Complimentary Night Per Year',
      'First Access to New Villas',
      'Peak Week Soft Holds',
      'Private Invitations to exclusive events'
    ],
    is_legacy: true,
    invite_only: true
  }
];

/**
 * Calculate tier info based on Voyage Points
 */
function getTierInfo(voyagePoints) {
  let currentTier = null;
  let currentIndex = null;

  // Find current tier
  TIERS.forEach((tier, index) => {
    if (voyagePoints >= tier.threshold) {
      currentTier = { ...tier, level: index + 1 };
      currentIndex = index;
    }
  });

  // If no tier found
  if (!currentTier) {
    const firstTier = TIERS[0];
    return {
      current_tier: null,
      next_tier: firstTier,
      progress_percentage: 0,
      points_to_next_tier: Math.max(firstTier.threshold - voyagePoints, 0),
      voyage_points: voyagePoints,
      is_circle: false
    };
  }

  // Find next tier
  let nextTier = null;
  if (currentIndex !== null && TIERS[currentIndex + 1]) {
    nextTier = { ...TIERS[currentIndex + 1], level: currentIndex + 2 };
  }

  // Calculate progress
  let progressPercentage = 100;
  let pointsToNextTier = 0;
  const isCircle = currentTier.is_legacy || false;

  if (nextTier) {
    const tierRange = nextTier.threshold - currentTier.threshold;
    const progressInRange = voyagePoints - currentTier.threshold;
    progressPercentage = (progressInRange / tierRange) * 100;
    pointsToNextTier = nextTier.threshold - voyagePoints;
  }

  return {
    current_tier: currentTier,
    next_tier: nextTier,
    progress_percentage: Math.min(progressPercentage, 100),
    points_to_next_tier: Math.max(pointsToNextTier, 0),
    voyage_points: voyagePoints,
    is_circle: isCircle
  };
}

/**
 * Get contact by email from HubSpot
 */
async function getContactByEmail(email) {
  try {
    const response = await axios.post(
      CONTACTS_API_URL,
      {
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'email',
                operator: 'EQ',
                value: email
              }
            ]
          }
        ],
        properties: [
          'email',
          'firstname',
          'lastname',
          'hs_lifetime_revenue',
          'lifetime_revenue',
          'num_associated_deals',
          'sub_type__c'
        ],
        limit: 1
      },
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${HUBSPOT_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`HubSpot API Error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * API Endpoint: Get Voyage Passport data
 */
app.get('/api-voyage-passport.php', async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({
        error: true,
        message: 'Email parameter is required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email format'
      });
    }

    // Fetch from HubSpot
    const hubspotData = await getContactByEmail(email);

    // Check if contact found
    if (!hubspotData.results || hubspotData.results.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Contact not found in HubSpot',
        email
      });
    }

    const contact = hubspotData.results[0];
    const properties = contact.properties || {};

    // Extract data
    const voyagePoints = parseFloat(properties.hs_lifetime_revenue || properties.lifetime_revenue || 0);
    const stayCount = parseInt(properties.num_associated_deals || 0);
    const tierStatus = properties.sub_type__c || null;

    // Calculate tier info
    const tierInfo = getTierInfo(voyagePoints);

    // Build response
    const result = {
      success: true,
      email,
      contact_id: contact.id,
      name: {
        first: properties.firstname || '',
        last: properties.lastname || ''
      },
      voyage_points: voyagePoints,
      stay_count: stayCount,
      tier_status_hubspot: tierStatus,
      tier_info: tierInfo,
      raw_hubspot_data: properties
    };

    res.json(result);

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Voyage Passport API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Voyage Passport API running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api-voyage-passport.php?email=test@example.com`);
});
