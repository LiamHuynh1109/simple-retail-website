
```javascript
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Cache variables
let cardCache = null;
let cacheExpireTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

let accessToken = null;
let tokenExpireTime = null;

// ==========================================
// STEP 1: Get TCGPlayer Access Token
// ==========================================
async function getTCGPlayerToken() {
    try {
        // Check if token still valid
        if (accessToken && Date.now() < tokenExpireTime) {
            return accessToken;
        }

        const response = await axios.post('https://api.tcgplayer.com/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.TCGPLAYER_PUBLIC_KEY,
                client_secret: process.env.TCGPLAYER_PRIVATE_KEY
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        accessToken = response.data.access_token;
        tokenExpireTime = Date.now() + (response.data.expires_in * 1000) - 60000;
        
        console.log('✅ TCGPlayer token obtained');
        return accessToken;
    } catch (error) {
        console.error('❌ Failed to get TCGPlayer token:', error.message);
        throw error;
    }
}

// ==========================================
// STEP 2: Fetch Riftbound Cards
// ==========================================
async function fetchRiftboundCards() {
    try {
        const gistUrl = 'https://gist.githubusercontent.com/OwenMelbz/e04dadf641cc9b81cb882b4612343112/raw/riftbound.json';
        const response = await axios.get(gistUrl);
        console.log(`✅ Fetched ${response.data.length} Riftbound cards`);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to fetch Riftbound cards:', error.message);
        throw error;
    }
}

// ==========================================
// STEP 3: Search TCGPlayer for Pricing
// ==========================================
async function getTCGPlayerPrice(cardName) {
    try {
        const token = await getTCGPlayerToken();
        
        // Search for the card on TCGPlayer
        const response = await axios.get(
            'https://api.tcgplayer.com/v1.32.0/catalog/products',
            {
                headers: {
                    'Authorization': `bearer ${token}`
                },
                params: {
                    q: cardName,           // Search query
                    categoryId: 1,         // Pokemon (1 = Pokemon, 2 = Magic, 3 = Yu-Gi-Oh, etc.)
                    limit: 1,              // Get top result only
                    sortBy: 'popularity'
                }
            }
        );

        if (response.data.results && response.data.results.length > 0) {
            const card = response.data.results[0];
            return {
                price: card.lowestListingPrice || card.marketPrice || null,
                productId: card.productId,
                url: `https://www.tcgplayer.com/product/${card.productId}`,
                quantity: generateRandomQuantity()
            };
        }

        return null;
    } catch (error) {
        console.error(`❌ Failed to get price for ${cardName}:`, error.message);
        return null;
    }
}

// ==========================================
// STEP 4: Generate Random Quantity
// ==========================================
function generateRandomQuantity() {
    // Random quantity between 1-50 in stock
    return Math.floor(Math.random() * 50) + 1;
}

// ==========================================
// STEP 5: Combine Riftbound + TCGPlayer Data
// ==========================================
async function fetchCombinedCardData() {
    try {
        // Check cache
        if (cardCache && Date.now() < cacheExpireTime) {
            console.log('📦 Using cached card data');
            return cardCache;
        }

        console.log('🔄 Fetching fresh card data...');

        // Fetch Riftbound data
        const riftboundCards = await fetchRiftboundCards();

        // Fetch prices for each card from TCGPlayer
        const combinedCards = await Promise.all(
            riftboundCards.map(async (card) => {
                // Get price from TCGPlayer
                const tcgPlayerData = await getTCGPlayerPrice(card.name);

                return {
                    // Riftbound data
                    id: card.id,
                    name: card.name,
                    cardType: card.cardType?.[0]?.label || 'Card',
                    rarity: card.rarity?.label || 'Unknown',
                    rarityId: card.rarity?.id,
                    energy: card.energy || 0,
                    power: card.power || 0,
                    health: card.health || 0,
                    set: card.setName || 'Unknown Set',
                    domains: card.domains?.map(d => d.label) || [],
                    image: card.cardImage?.url,
                    text: stripHtml(card.text),
                    illustrator: card.illustrator?.[0] || 'Unknown',
                    
                    // TCGPlayer pricing data
                    price: tcgPlayerData?.price || getDefaultPrice(card.rarity?.id),
                    quantity: tcgPlayerData?.quantity || generateRandomQuantity(),
                    tcgplayerId: tcgPlayerData?.productId,
                    tcgplayerUrl: tcgPlayerData?.url,
                    
                    // Calculated fields
                    category: card.rarity?.id || 'common',
                    emoji: getEmojiForRarity(card.rarity?.id),
                    description: stripHtml(card.text) || card.cardType?.[0]?.label || 'Riftbound Card'
                };
            })
        );

        // Cache the results
        cardCache = combinedCards;
        cacheExpireTime = Date.now() + CACHE_DURATION;

        console.log(`✅ Combined ${combinedCards.length} cards with pricing`);
        return combinedCards;
    } catch (error) {
        console.error('❌ Error combining card data:', error);
        throw error;
    }
}

// ==========================================
// STEP 6: Helper Functions
// ==========================================

function getDefaultPrice(rarity) {
    const prices = {
        'common': 1.99,
        'uncommon': 4.99,
        'rare': 12.99,
        'epic': 24.99,
        'legendary': 49.99
    };
    return prices[rarity] || 9.99;
}

function getEmojiForRarity(rarity) {
    const emojis = {
        'common': '⚪',
        'uncommon': '🟢',
        'rare': '🔵',
        'epic': '🟣',
        'legendary': '🟡'
    };
    return emojis[rarity] || '🎴';
}

function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').substring(0, 150);
}

// ==========================================
// STEP 7: API Routes
// ==========================================

// Route: Get all cards with pricing
app.get('/api/cards', async (req, res) => {
    try {
        const cards = await fetchCombinedCardData();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

// Route: Get single card
app.get('/api/cards/:cardId', async (req, res) => {
    try {
        const cards = await fetchCombinedCardData();
        const card = cards.find(c => c.id === req.params.cardId);
        
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch card' });
    }
});

// Route: Search cards
app.get('/api/search', async (req, res) => {
    try {
        const { query, rarity, type } = req.query;
        const cards = await fetchCombinedCardData();

        let filtered = cards.filter(card => {
            const matchesQuery = !query || 
                card.name.toLowerCase().includes(query.toLowerCase()) ||
                card.description.toLowerCase().includes(query.toLowerCase());
            
            const matchesRarity = !rarity || card.rarityId === rarity;
            const matchesType = !type || card.cardType === type;

            return matchesQuery && matchesRarity && matchesType;
        });

        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Route: Get cards by set
app.get('/api/sets/:setName', async (req, res) => {
    try {
        const cards = await fetchCombinedCardData();
        const filtered = cards.filter(c => c.set === req.params.setName);
        res.json(filtered);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch set' });
    }
});

// Route: Get available sets
app.get('/api/sets', async (req, res) => {
    try {
        const cards = await fetchCombinedCardData();
        const sets = [...new Set(cards.map(c => c.set))];
        res.json(sets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sets' });
    }
});

// Route: Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Endpoints:`);
    console.log(`   GET  /api/cards              - Get all cards`);
    console.log(`   GET  /api/cards/:cardId      - Get single card`);
    console.log(`   GET  /api/search             - Search cards`);
    console.log(`   GET  /api/sets               - Get all sets`);
    console.log(`   GET  /api/sets/:setName      - Get cards by set`);
});

module.exports = app;
