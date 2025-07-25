const express = require('express');
const cors = require('cors');
const yf = require('yahoo-finance2').default;
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const app = express();
app.use(cors());
const portfolioDataPath = path.join(__dirname, 'portfolio_data.json');
async function fetchCmp(ticker) {
  try {
    const stock = await yf.quote(ticker);
    return stock.regularMarketPrice || 0;
  } catch (error) {
    console.error(`Error fetching CMP for ${ticker}:`, error);
    return 0;
  }
}
async function fetchPeAndEarnings(ticker) {
  try {
    const url = `https://www.google.com/finance/quote/${ticker}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const peRatio = $('div[data-field="peRatio"]').text();
    const earnings = $('div[data-field="eps"]').text();
    return [parseFloat(peRatio) || 0, parseFloat(earnings) || 0];
  } catch (error) {
    console.error(`Error fetching P/E and earnings for ${ticker}:`, error);
    return [0, 0];
  }
}
async function updatePortfolio() {
  try {
    const portfolio = JSON.parse(await fs.readFile(portfolioDataPath, 'utf8'));
    let totalInvestment = 0;
    const sectors = {};

    for (const stock of portfolio.stocks) {
      stock.cmp = await fetchCmp(stock.name);
      const [pe, earnings] = await fetchPeAndEarnings(stock.name);
      stock.pe_ratio = pe;
      stock.earnings = earnings;

      const investment = stock.purchase_price * stock.quantity;
      stock.investment = investment;
      stock.present_value = stock.cmp * stock.quantity;
      stock.gain_loss = stock.present_value - investment;

      totalInvestment += investment;

      const sector = stock.sector;
      if (!sectors[sector]) {
        sectors[sector] = { investment: 0, present_value: 0, stocks: [] };
      }
      sectors[sector].investment += investment;
      sectors[sector].present_value += stock.present_value;
      sectors[sector].stocks.push(stock.name);
    }

    for (const stock of portfolio.stocks) {
      stock.portfolio_percentage = totalInvestment > 0 ? (stock.investment / totalInvestment) * 100 : 0;
    }
    for (const sector in sectors) {
      sectors[sector].gain_loss = sectors[sector].present_value - sectors[sector].investment;
    }
    portfolio.sectors = sectors;
    portfolio.last_updated = new Date().toISOString();
    await fs.writeFile(portfolioDataPath, JSON.stringify(portfolio, null, 2));
    return portfolio;
  } catch (error) {
    console.error('Error updating portfolio:', error);
  }
}
app.get('/api/portfolio', async (req, res) => {
  try {
    const portfolio = await fs.readFile(portfolioDataPath, 'utf8');
    res.json(JSON.parse(portfolio));
  } catch (error) {
    console.error('Error serving portfolio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
function startAutoRefresh() {
  setInterval(async () => {
    console.log('Updating portfolio...');
    await updatePortfolio();
  }, 15000);
}
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAutoRefresh();
});