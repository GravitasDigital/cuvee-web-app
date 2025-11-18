/**
 * Simple Express server for Voyage Passport API
 * Proxies requests to HubSpot and calculates tier information
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

const app = express();
const PORT = process.env.PORT || 8080;

// HubSpot API Configuration
const HUBSPOT_API_TOKEN = process.env.HUBSPOT_API_TOKEN;
const CONTACTS_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/search';
const DEALS_API_URL = 'https://api.hubapi.com/crm/v3/objects/deals/search';

// Validate required environment variables
if (!HUBSPOT_API_TOKEN) {
  console.error('ERROR: HUBSPOT_API_TOKEN environment variable is required');
  console.error('Please set it in your .env file or environment');
  process.exit(1);
}

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory (production build)
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

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
 * Get deals associated with a contact from HubSpot
 */
async function getDealsForContact(contactId) {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}/associations/deals`,
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${HUBSPOT_API_TOKEN}`
        }
      }
    );

    const dealIds = response.data.results?.map(r => r.id) || [];

    if (dealIds.length === 0) {
      return [];
    }

    // Fetch deal details
    const dealsPromises = dealIds.map(dealId =>
      axios.get(
        `https://api.hubapi.com/crm/v3/objects/deals/${dealId}`,
        {
          params: {
            properties: [
              'dealname',
              'amount',
              'dealstage',
              'closedate',
              'property_name',
              'check_in',
              'check_out',
              'checkin',
              'checkout',
              'check_in_date',
              'check_out_date',
              'arrival_date',
              'departure_date',
              'confirmation_number',
              'createdate',
              'hs_lastmodifieddate'
            ]
          },
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${HUBSPOT_API_TOKEN}`
          }
        }
      )
    );

    const dealsResponses = await Promise.all(dealsPromises);
    return dealsResponses.map(r => r.data);
  } catch (error) {
    console.error('Error fetching deals:', error.response?.data || error.message);
    throw new Error(`HubSpot Deals API Error: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Determine reservation status based on dates
 */
function getReservationStatus(checkIn, checkOut) {
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (now >= checkInDate && now <= checkOutDate) {
    return 'current';
  } else if (now < checkInDate) {
    return 'upcoming';
  } else {
    return 'past';
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

/**
 * Get WordPress destination page featured image by location
 */
async function getDestinationFeaturedImage(location) {
  try {
    if (!location) return null;

    // Map location to destination slug
    const destinationSlug = getDestinationSlug(location);
    if (!destinationSlug) return null;

    // Search for destination page in WordPress
    const wpUrl = 'https://cuvee.com/luxury/wp-json/wp/v2/pages';

    const response = await axios.get(wpUrl, {
      params: {
        slug: destinationSlug,
        per_page: 1,
        _embed: true
      }
    });

    if (response.data && response.data.length > 0) {
      const page = response.data[0];

      // Get featured image from embedded media
      if (page._embedded && page._embedded['wp:featuredmedia']) {
        const media = page._embedded['wp:featuredmedia'][0];

        if (media.media_details && media.media_details.sizes && media.media_details.sizes.full) {
          return media.media_details.sizes.full.source_url;
        }

        if (media.source_url) {
          return media.source_url;
        }
      }

      if (page.featured_media) {
        const mediaResponse = await axios.get(`https://cuvee.com/luxury/wp-json/wp/v2/media/${page.featured_media}`);
        if (mediaResponse.data && mediaResponse.data.source_url) {
          return mediaResponse.data.source_url;
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching destination image for ${location}:`, error.message);
    return null;
  }
}

/**
 * Get WordPress property by name and fetch featured image
 */
async function getPropertyFeaturedImage(propertyName, location = '') {
  try {
    // Search for property in WordPress by title
    const wpUrl = 'https://cuvee.com/luxury/wp-json/wp/v2/properties';

    const response = await axios.get(wpUrl, {
      params: {
        search: propertyName,
        per_page: 1,
        _embed: true  // Include featured media in response
      }
    });

    if (response.data && response.data.length > 0) {
      const property = response.data[0];

      // Get featured image from embedded media
      if (property._embedded && property._embedded['wp:featuredmedia']) {
        const media = property._embedded['wp:featuredmedia'][0];

        // Return the full size image URL
        if (media.media_details && media.media_details.sizes && media.media_details.sizes.full) {
          return media.media_details.sizes.full.source_url;
        }

        // Fallback to source_url
        if (media.source_url) {
          return media.source_url;
        }
      }

      // Fallback: Try getting featured_media ID and fetch separately
      if (property.featured_media) {
        const mediaResponse = await axios.get(`https://cuvee.com/luxury/wp-json/wp/v2/media/${property.featured_media}`);
        if (mediaResponse.data && mediaResponse.data.source_url) {
          return mediaResponse.data.source_url;
        }
      }
    }

    // If property not found, try to get destination image as fallback
    if (location) {
      const destinationImage = await getDestinationFeaturedImage(location);
      if (destinationImage) {
        return destinationImage;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error fetching featured image for ${propertyName}:`, error.message);
    return null;
  }
}

/**
 * API Endpoint: Get Reservations (Deals) for a contact
 */
app.get('/api/reservations', async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email
    if (!email) {
      return res.status(400).json({
        error: true,
        message: 'Email parameter is required'
      });
    }

    // Get contact from HubSpot
    const hubspotData = await getContactByEmail(email);

    if (!hubspotData.results || hubspotData.results.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Contact not found in HubSpot',
        email
      });
    }

    const contact = hubspotData.results[0];
    const contactId = contact.id;

    // Get deals for this contact
    const deals = await getDealsForContact(contactId);

    // Transform deals into reservations
    const reservationsPromises = deals.map(async (deal, index) => {
      const props = deal.properties || {};

      // Parse dealname format: "Last Name, Property Name, Dates" or "Property Name, Location, Dates"
      let propertyName = 'Unnamed Property';
      let location = '';

      if (props.dealname) {
        const parts = props.dealname.split(',').map(p => p.trim());
        // Second part is usually the property name (format: "LastName, PropertyName, Dates")
        if (parts.length >= 2 && parts[1]) {
          propertyName = parts[1];
        } else if (parts.length >= 1 && parts[0]) {
          propertyName = parts[0];
        }
        // Third part could be location if it exists and isn't a date
        if (parts.length >= 3 && parts[2] && !parts[2].match(/\d{1,2}\/\d{1,2}\/\d{2,4}/)) {
          location = parts[2];
        }
      }

      // Use property_name field if available, otherwise use parsed name
      if (props.property_name) {
        propertyName = props.property_name;
      }

      // Try multiple field names for check-in/check-out dates
      let checkIn = props.check_in || props.checkin || props.check_in_date || props.arrival_date || '';
      let checkOut = props.check_out || props.checkout || props.check_out_date || props.departure_date || '';

      // If no dates found, try to parse from dealname (e.g., "Property, Location, 7/29/24 - 8/5/24")
      if (!checkIn && !checkOut && props.dealname) {
        const dateMatch = props.dealname.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/);
        if (dateMatch) {
          checkIn = dateMatch[1];
          checkOut = dateMatch[2];
        }
      }

      const status = checkIn && checkOut ? getReservationStatus(checkIn, checkOut) : 'upcoming';

      // Fetch featured image from WordPress (property first, then destination fallback)
      const featuredImage = await getPropertyFeaturedImage(propertyName, location);

      // Fallback to Unsplash if no WordPress image found
      const image = featuredImage || `https://images.unsplash.com/photo-${1605540436563 + index}?q=80&w=2070&auto=format&fit=crop`;

      return {
        id: deal.id,
        status,
        propertyName,
        location,
        address: '',
        startDate: checkIn ? new Date(checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        endDate: checkOut ? new Date(checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
        checkInTime: '4:00 PM', // Default, could be customized
        checkOutTime: '11:00 AM', // Default, could be customized
        image,
        bedrooms: 0, // Would need to be fetched from property data
        bathrooms: 0,
        maxGuests: 0,
        amount: parseFloat(props.amount || 0),
        confirmationNumber: props.confirmation_number || '',
        dealStage: props.dealstage || '',
        rawData: props
      };
    });

    // Wait for all property image fetches to complete
    const reservations = await Promise.all(reservationsPromises);

    // Sort by date - current first, then upcoming, then past
    reservations.sort((a, b) => {
      const statusOrder = { current: 0, upcoming: 1, past: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    res.json({
      success: true,
      email,
      contactId,
      reservations
    });

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Internal server error'
    });
  }
});

/**
 * Map property location to destination URL slug
 */
function getDestinationSlug(location) {
  // Normalize location string
  const normalized = location.toLowerCase().trim();

  // Common destination mappings
  const mappings = {
    'aspen': 'aspen-colorado',
    'aspen, colorado': 'aspen-colorado',
    'aspen, co': 'aspen-colorado',
    'los cabos': 'mexico-los-cabos-luxury-rentals',
    'cabo': 'mexico-los-cabos-luxury-rentals',
    'cabo san lucas': 'mexico-los-cabos-luxury-rentals',
    'san jose del cabo': 'mexico-los-cabos-luxury-rentals',
    'jackson hole': 'jackson-hole-wyoming',
    'jackson hole, wyoming': 'jackson-hole-wyoming',
    'jackson hole, wy': 'jackson-hole-wyoming',
    'park city': 'park-city-utah',
    'park city, utah': 'park-city-utah',
    'park city, ut': 'park-city-utah',
    'scottsdale': 'scottsdale-arizona',
    'scottsdale, arizona': 'scottsdale-arizona',
    'scottsdale, az': 'scottsdale-arizona',
    'big sky': 'big-sky-montana',
    'big sky, montana': 'big-sky-montana',
    'big sky, mt': 'big-sky-montana',
    'lake tahoe': 'lake-tahoe-california',
    'tahoe': 'lake-tahoe-california',
    'steamboat springs': 'steamboat-springs-colorado',
    'steamboat': 'steamboat-springs-colorado',
    'telluride': 'telluride-colorado',
    'telluride, colorado': 'telluride-colorado',
    'vail': 'vail-colorado',
    'vail, colorado': 'vail-colorado',
    'breckenridge': 'breckenridge-colorado',
    'breckenridge, colorado': 'breckenridge-colorado',
  };

  return mappings[normalized] || null;
}

/**
 * Scrape experiences from destination page
 */
async function scrapeDestinationExperiences(destinationSlug) {
  try {
    const url = `https://cuvee.com/luxury/destinations/${destinationSlug}/`;
    console.log(`Scraping experiences from: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const experiences = [];

    // Find all experience cards using Elementor classes
    $('.elementor-icon-box-wrapper').each((index, element) => {
      const $card = $(element);

      // Extract title
      const title = $card.find('.elementor-icon-box-title').text().trim();

      // Extract description
      const description = $card.find('.elementor-icon-box-description').text().trim();

      // Extract image (might be in icon or background)
      let image = '';
      const $icon = $card.find('.elementor-icon');
      if ($icon.length) {
        const bgImage = $icon.css('background-image');
        if (bgImage && bgImage !== 'none') {
          // Extract URL from background-image: url("...")
          const match = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
          if (match) {
            image = match[1];
          }
        }
        // Try img tag
        const $img = $icon.find('img');
        if ($img.length) {
          image = $img.attr('src') || '';
        }
      }

      // Try to find image in parent elements or siblings
      if (!image) {
        const $parent = $card.parent();
        const $section = $parent.closest('.elementor-element');
        const bgImageStyle = $section.find('[style*="background-image"]').first().attr('style');
        if (bgImageStyle) {
          const match = bgImageStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
          if (match) {
            image = match[1];
          }
        }
      }

      if (title || description) {
        experiences.push({
          title: title || 'Untitled Experience',
          description: description || '',
          image: image || ''
        });
      }
    });

    console.log(`Found ${experiences.length} experiences`);
    return experiences;

  } catch (error) {
    console.error('Error scraping destination page:', error.message);
    return [];
  }
}

/**
 * API Endpoint: Get Destination-Specific Experiences
 * Scrapes the Cuvée website destination page for experiences
 */
app.get('/api/property-experiences', async (req, res) => {
  try {
    const { propertyName } = req.query;

    if (!propertyName) {
      return res.status(400).json({
        error: true,
        message: 'Property name parameter is required'
      });
    }

    // First, we need to get the location from the property
    // For now, we'll try to extract it from propertyName
    // In production, this should come from HubSpot deal data

    // Try to extract location from property name (e.g., "Casa Hermosa" -> look up location)
    // For demo, we'll use a simple fallback
    let location = req.query.location || '';

    if (!location) {
      // Could query HubSpot here to get the actual location
      // For now, return empty
      return res.json({
        success: true,
        experiences: [],
        message: 'Location data needed to fetch experiences'
      });
    }

    // Map location to destination slug
    const destinationSlug = getDestinationSlug(location);

    if (!destinationSlug) {
      return res.json({
        success: true,
        experiences: [],
        message: `No destination mapping found for location: ${location}`
      });
    }

    // Scrape experiences from destination page
    const experiences = await scrapeDestinationExperiences(destinationSlug);

    return res.json({
      success: true,
      experiences,
      destination: destinationSlug,
      location
    });

  } catch (error) {
    console.error('Property Experiences API Error:', error.message);
    res.json({
      success: true,
      experiences: []
    });
  }
});

/**
 * API Endpoint: Get Local Recommendations based on location
 * Uses Google Places API to find restaurants and activities
 * NOTE: This endpoint is being phased out in favor of property-experiences
 */
app.get('/api/recommendations', async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        error: true,
        message: 'Location parameter is required'
      });
    }

    // Google Places API key (you'll need to add this)
    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

    if (!GOOGLE_PLACES_API_KEY) {
      // Return empty recommendations if no API key
      return res.json({
        success: true,
        recommendations: []
      });
    }

    // First, geocode the location to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`;
    const geocodeResponse = await axios.get(geocodeUrl);

    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

    // Search for restaurants
    const restaurantsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&rankby=prominence&key=${GOOGLE_PLACES_API_KEY}`;
    const restaurantsResponse = await axios.get(restaurantsUrl);

    // Search for points of interest (tourist attractions)
    const attractionsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=tourist_attraction&rankby=prominence&key=${GOOGLE_PLACES_API_KEY}`;
    const attractionsResponse = await axios.get(attractionsUrl);

    // Helper function to calculate distance
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 3959; // Radius of Earth in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Format recommendations
    const recommendations = [];

    // Dining category
    if (restaurantsResponse.data.results && restaurantsResponse.data.results.length > 0) {
      const diningItems = restaurantsResponse.data.results.slice(0, 5).map(place => {
        const distance = calculateDistance(
          lat, lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        return {
          name: place.name,
          description: place.types?.join(', ').replace(/_/g, ' ') || 'Restaurant',
          distance: `${distance.toFixed(1)} mi`
        };
      });

      recommendations.push({
        category: 'Dining',
        items: diningItems
      });
    }

    // Activities category
    if (attractionsResponse.data.results && attractionsResponse.data.results.length > 0) {
      const activityItems = attractionsResponse.data.results.slice(0, 5).map(place => {
        const distance = calculateDistance(
          lat, lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        return {
          name: place.name,
          description: place.types?.join(', ').replace(/_/g, ' ') || 'Point of interest',
          distance: `${distance.toFixed(1)} mi`
        };
      });

      recommendations.push({
        category: 'Activities',
        items: activityItems
      });
    }

    res.json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Recommendations API Error:', error.message);
    // Return empty recommendations on error
    res.json({
      success: true,
      recommendations: []
    });
  }
});

/**
 * API Endpoint: Get Featured Offers from WordPress
 */
app.get('/api/featured-offers', async (req, res) => {
  try {
    // Fetch from WordPress REST API with _embed to get featured media
    const wpUrl = 'https://cuvee.com/luxury/wp-json/wp/v2/featured-offers';

    const response = await axios.get(wpUrl, {
      params: {
        per_page: 10,
        orderby: 'date',
        order: 'desc',
        _embed: true
      }
    });

    // Map offers and fetch featured images
    const offersPromises = response.data.map(async (offer) => {
      // Extract ACF fields (they'll be in offer.acf if ACF REST API is enabled)
      const acf = offer.acf || {};

      // Get featured image URL - try _embedded first, then fetch directly
      let featuredImageUrl = '';

      // Try _embedded first
      if (offer._embedded && offer._embedded['wp:featuredmedia']) {
        const media = offer._embedded['wp:featuredmedia'][0];
        if (media && media.source_url) {
          featuredImageUrl = media.source_url;
        }
      }

      // If _embedded failed or returned error, fetch media directly
      if (!featuredImageUrl && offer.featured_media) {
        try {
          const mediaResponse = await axios.get(`https://cuvee.com/luxury/wp-json/wp/v2/media/${offer.featured_media}`);
          if (mediaResponse.data && mediaResponse.data.source_url) {
            featuredImageUrl = mediaResponse.data.source_url;
          }
        } catch (error) {
          console.error(`Error fetching media ${offer.featured_media}:`, error.message);
        }
      }

      return {
        id: offer.id,
        title: offer.title?.rendered || '',
        content: offer.content?.rendered || '',
        featuredImage: featuredImageUrl,
        // ACF fields
        offerTitle: acf.offer_title || offer.title?.rendered,
        offerSubtitle: acf.offer_subtitle || '',
        offerType: acf.offer_type || '',
        offerLink: acf.offer_link || ''
      };
    });

    const offers = await Promise.all(offersPromises);

    res.json({
      success: true,
      offers
    });

  } catch (error) {
    console.error('WordPress API Error:', error.message);
    res.status(500).json({
      error: true,
      message: error.message || 'Failed to fetch offers from WordPress'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Voyage Passport API is running' });
});

// Serve index.html for all other routes (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Voyage Passport API running on http://localhost:${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api-voyage-passport.php?email=test@example.com`);
  console.log(`📡 Reservations endpoint: http://localhost:${PORT}/api/reservations?email=test@example.com`);
  console.log(`📡 Featured Offers endpoint: http://localhost:${PORT}/api/featured-offers`);
  console.log(`📡 Recommendations endpoint: http://localhost:${PORT}/api/recommendations?location=Aspen,Colorado`);
  console.log(`\n⚠️  Note: Google Places API requires GOOGLE_PLACES_API_KEY environment variable`);
});
