const express = require('express');
const axios = require('axios');
const app = express();

const bscScanApiKey = 'V8V5MA59KP1Y94826TRXTQHXP16WRZK8KT';

const contractAddress = '0xA99600043E84181A9d4137aD1cefB8cfE9138674';

const geckoTerminalApiUrl = 'https://api.geckoterminal.com/api/v2/simple/networks/bsc/token_price';

const totalSupply = 28800000;

app.get('/api/total-supply', async (req, res) => {
  try {
    const response = await axios.get('https://api.bscscan.com/api', {
      params: {
        module: 'stats',
        action: 'tokensupply',
        contractaddress: contractAddress,
        apikey: bscScanApiKey,
      },
    });

    const totalSupply = response.data.result;
    res.json(Number((totalSupply / 10**6).toFixed(6)));
  } catch (error) {
    console.error('Error fetching total supply:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/token-price', async (req, res) => {
  try {
    const response = await axios.get(`${geckoTerminalApiUrl}/${contractAddress}`);
    
    console.log('GeckoTerminal API response:', response.data); // Log the entire response

    const tokenPrice = response.data?.data?.price ?? null;
    res.json(Number(tokenPrice));
  } catch (error) {
    console.error('Error fetching token price:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/circulatingsupply', async (req, res) => {
  try {
    res.json(totalSupply);
  } catch (error) {
    console.error('Error fetching circulating supply:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
