<?php
/**
 * Voyage Passport API Endpoint
 * Fetches real HubSpot data for Voyage Passport rewards
 *
 * Usage: api-voyage-passport.php?email=user@example.com
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// HubSpot API Configuration
$HUBSPOT_API_TOKEN = 'pat-na1-1389aa9c-6e1c-4574-9265-ec4a4425b8ad';
$CONTACTS_API_URL = 'https://api.hubapi.com/crm/v3/objects/contacts/search';

// Get email parameter
$email = isset($_GET['email']) ? trim($_GET['email']) : '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Email parameter is required'
    ]);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'error' => true,
        'message' => 'Invalid email format'
    ]);
    exit;
}

/**
 * Make cURL call to HubSpot API
 */
function hubspotApiCall($url, $token, $postData = null) {
    $curl = curl_init();

    $headers = [
        'accept: application/json',
        'authorization: Bearer ' . $token,
        'Content-Type: application/json'
    ];

    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_SSL_VERIFYPEER => true
    ];

    if ($postData) {
        $options[CURLOPT_POSTFIELDS] = json_encode($postData);
    }

    curl_setopt_array($curl, $options);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    if ($err) {
        return [
            'error' => true,
            'message' => 'cURL Error: ' . $err
        ];
    }

    $decoded = json_decode($response, true);

    if ($httpCode !== 200) {
        return [
            'error' => true,
            'message' => 'API Error: ' . ($decoded['message'] ?? 'Unknown error'),
            'status_code' => $httpCode
        ];
    }

    return $decoded;
}

/**
 * Get contact by email from HubSpot
 */
function getContactByEmail($email, $token) {
    $postData = [
        'filterGroups' => [
            [
                'filters' => [
                    [
                        'propertyName' => 'email',
                        'operator' => 'EQ',
                        'value' => $email
                    ]
                ]
            ]
        ],
        'properties' => [
            'email',
            'firstname',
            'lastname',
            'hs_lifetime_revenue',
            'lifetime_revenue',
            'num_associated_deals',
            'sub_type__c'
        ],
        'limit' => 1
    ];

    return hubspotApiCall('https://api.hubapi.com/crm/v3/objects/contacts/search', $token, $postData);
}

/**
 * Calculate tier info based on Voyage Points
 */
function getTierInfo($voyagePoints, $tierFromHubspot = null) {
    $tiers = [
        [
            'name' => 'Weekender',
            'threshold' => 0,
            'points_label' => 'First Stay',
            'tier_number' => 5,
            'color' => '#e5e5e5',
            'signature_benefit' => 'Personalized Welcome Ritual (curated to guest)',
            'earn_back_percent' => 1,
            'max_credit_per_stay' => 2500,
            'reward' => 'Earn 1% back in Voyage Bucks (up to $2,500 redeemable on your next stay)',
            'message' => 'Your journey with Cuvée begins with a personalized welcome experience and earning Voyage Bucks toward your next stay.',
            'short_reveal' => 'Your journey begins.'
        ],
        [
            'name' => 'Explorer',
            'threshold' => 40000,
            'points_label' => '40,000+ Voyage Points',
            'tier_number' => 4,
            'color' => '#8d93af',
            'signature_benefit' => 'Travel Style Setup — guest preferences are remembered & auto-applied pre-arrival',
            'earn_back_percent' => 2,
            'max_credit_per_stay' => 5000,
            'reward' => 'Earn 2% back in Voyage Bucks (up to $5,000 redeemable on your next stay)',
            'message' => 'Your preferences are remembered and every stay becomes more seamless, earning you more Voyage Bucks.',
            'short_reveal' => 'The world is opening.'
        ],
        [
            'name' => 'Voyager',
            'threshold' => 100000,
            'points_label' => '100,000+ Voyage Points',
            'tier_number' => 3,
            'color' => '#2c2f3f',
            'signature_benefit' => 'One Signature Experience Per Year',
            'earn_back_percent' => 3,
            'max_credit_per_stay' => 7500,
            'reward' => 'Earn 3% back in Voyage Bucks (up to $7,500 redeemable on your next stay)',
            'message' => 'Your travels are becoming a tradition — and traditions should grow with greater rewards.',
            'short_reveal' => 'Tradition takes shape.'
        ],
        [
            'name' => 'Jetsetter',
            'threshold' => 250000,
            'points_label' => '250,000+ Voyage Points',
            'tier_number' => 2,
            'color' => '#77664c',
            'signature_benefit' => 'Signature Experience Every Stay',
            'earn_back_percent' => 4,
            'max_credit_per_stay' => 10000,
            'reward' => 'Earn 4% back in Voyage Bucks (up to $10,000 redeemable on your next stay)',
            'message' => 'Every stay includes a curated signature moment crafted just for you and exceptional rewards.',
            'short_reveal' => 'More time awaits.'
        ],
        [
            'name' => 'Cuvée Circle',
            'threshold' => 500000,
            'points_label' => '500,000+ Voyage Points',
            'tier_number' => 1,
            'color' => '#bda048',
            'signature_benefit' => 'One Complimentary Night Per Year + First Access to New Villas + Peak Week Soft Holds',
            'earn_back_percent' => 5,
            'max_credit_per_stay' => 15000,
            'reward' => 'Earn 5% back in Voyage Bucks (up to $15,000 redeemable on your next stay)',
            'message' => 'You\'ve arrived. This is the tier reserved for our most devoted travelers.',
            'short_reveal' => 'Welcome to The Circle.',
            'circle_access' => [
                'One Complimentary Night Per Year',
                'First Access to New Villas',
                'Peak Week Soft Holds',
                'Private Invitations to exclusive events'
            ],
            'is_legacy' => true,
            'invite_only' => true
        ]
    ];

    // Find current tier based on points
    $currentTier = null;
    $currentIndex = null;

    foreach ($tiers as $index => $tier) {
        if ($voyagePoints >= $tier['threshold']) {
            $currentTier = $tier;
            $currentTier['level'] = $index + 1;
            $currentIndex = $index;
        }
    }

    // If no tier found, user hasn't reached first tier yet
    if (!$currentTier) {
        $firstTier = $tiers[0];
        $pointsToNext = $firstTier['threshold'] - $voyagePoints;

        return [
            'current_tier' => null,
            'next_tier' => $firstTier,
            'progress_percentage' => 0,
            'points_to_next_tier' => max($pointsToNext, 0),
            'voyage_points' => $voyagePoints,
            'is_circle' => false
        ];
    }

    // Find next tier
    $nextTier = null;
    if ($currentIndex !== null && isset($tiers[$currentIndex + 1])) {
        $nextTier = $tiers[$currentIndex + 1];
        $nextTier['level'] = $currentIndex + 2;
    }

    // Calculate progress to next tier
    $progressPercentage = 100;
    $pointsToNextTier = 0;
    $isCircle = false;

    if ($nextTier) {
        $tierRange = $nextTier['threshold'] - $currentTier['threshold'];
        $progressInRange = $voyagePoints - $currentTier['threshold'];
        $progressPercentage = ($progressInRange / $tierRange) * 100;
        $pointsToNextTier = $nextTier['threshold'] - $voyagePoints;
    } else {
        // User is at highest tier (The Cuvée Circle)
        $isCircle = true;
    }

    return [
        'current_tier' => $currentTier,
        'next_tier' => $nextTier,
        'progress_percentage' => min($progressPercentage, 100),
        'points_to_next_tier' => max($pointsToNextTier, 0),
        'voyage_points' => $voyagePoints,
        'is_circle' => $isCircle
    ];
}

// Fetch contact data from HubSpot
$response = getContactByEmail($email, $HUBSPOT_API_TOKEN);

if (isset($response['error']) && $response['error']) {
    http_response_code(500);
    echo json_encode($response);
    exit;
}

// Check if contact was found
if (!isset($response['results']) || empty($response['results'])) {
    http_response_code(404);
    echo json_encode([
        'error' => true,
        'message' => 'Contact not found in HubSpot',
        'email' => $email
    ]);
    exit;
}

$contact = $response['results'][0];
$properties = $contact['properties'] ?? [];

// Extract voyage points (lifetime revenue)
$voyagePoints = 0;
if (isset($properties['hs_lifetime_revenue'])) {
    $voyagePoints = (float) $properties['hs_lifetime_revenue'];
} elseif (isset($properties['lifetime_revenue'])) {
    $voyagePoints = (float) $properties['lifetime_revenue'];
}

// Extract tier status from HubSpot (if set)
$tierStatus = $properties['sub_type__c'] ?? null;

// Get stay count
$stayCount = 0;
if (isset($properties['num_associated_deals'])) {
    $stayCount = (int) $properties['num_associated_deals'];
}

// Calculate tier info
$tierInfo = getTierInfo($voyagePoints, $tierStatus);

// Build response
$result = [
    'success' => true,
    'email' => $email,
    'contact_id' => $contact['id'],
    'name' => [
        'first' => $properties['firstname'] ?? '',
        'last' => $properties['lastname'] ?? ''
    ],
    'voyage_points' => $voyagePoints,
    'stay_count' => $stayCount,
    'tier_status_hubspot' => $tierStatus,
    'tier_info' => $tierInfo,
    'raw_hubspot_data' => $properties // Include for debugging
];

echo json_encode($result, JSON_PRETTY_PRINT);
