// src/services/api.js
import axios from 'axios';

// Your API Key
const API_KEY = 'd54c4j1r01qg8reutcrgd54c4j1r01qg8reutcs0'; 
const BASE_URL = 'https://finnhub.io/api/v1';

// 1. Fetch Current Price (With Fix for Crypto Testing)
export const fetchStockDetails = async (symbol) => {
  // --- DEBUG FIX: FORCE PRICES FOR CRYPTO TESTING ---
  // Since the free API often fails for crypto, we hardcode these so you can test the Simulator
  if (symbol === 'BINANCE:BTCUSDT') {
    return { c: 97500, h: 98000, l: 96000, o: 96500, pc: 96000, dp: 1.5 }; 
  }
  if (symbol === 'BINANCE:ETHUSDT') {
    return { c: 3350, h: 3400, l: 3200, o: 3250, pc: 3250, dp: 2.1 }; 
  }
  // --------------------------------------------------

  try {
    const response = await axios.get(`${BASE_URL}/quote`, {
      params: {
        symbol: symbol,
        token: API_KEY
      }
    });
    // Finnhub returns { c: Current, h: High, l: Low, o: Open, pc: Previous Close, dp: Percent }
    return response.data; 
  } catch (error) {
    console.error("Error fetching stock details", error);
    return null;
  }
};

// 2. Search for Stocks (Autocomplete)
export const searchSymbols = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: query,
        token: API_KEY
      }
    });
    return response.data.result; // Returns array of matching stocks
  } catch (error) {
    console.error("Error searching symbols", error);
    return [];
  }
};

// 3. Fetch Historical Chart Data with Time Range
export const fetchHistoricalData = async (symbol, range = '1Y') => {
  try {
    const end = Math.floor(Date.now() / 1000);
    let start;
    let resolution;

    // Logic to determine start time and resolution
    switch (range) {
      case '1D':
        start = end - (24 * 60 * 60);
        resolution = '60'; // Hourly candles for 1 Day
        break;
      case '1W':
        start = end - (7 * 24 * 60 * 60);
        resolution = '60'; // Hourly candles for 1 Week
        break;
      case '1M':
        start = end - (30 * 24 * 60 * 60);
        resolution = 'D'; // Daily candles
        break;
      case '1Y':
      default:
        start = end - (365 * 24 * 60 * 60);
        resolution = 'D'; // Daily candles
        break;
    }

    const response = await axios.get(`${BASE_URL}/stock/candle`, {
      params: {
        symbol: symbol,
        resolution: resolution,
        from: start,
        to: end,
        token: API_KEY
      }
    });

    if (response.data.s === "ok" && response.data.t) {
      return response.data.t.map((timestamp, index) => ({
        time: new Date(timestamp * 1000).toLocaleDateString(),
        price: response.data.c[index]
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching candles", error);
    return [];
  }
};

// 4. Fetch Company News
export const fetchCompanyNews = async (symbol) => {
  try {
    const today = new Date().toISOString().split('T')[0]; 
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await axios.get(`${BASE_URL}/company-news`, {
      params: {
        symbol: symbol,
        from: weekAgo,
        to: today,
        token: API_KEY
      }
    });
    // Return the top 5 news items
    return response.data.slice(0, 5); 
  } catch (error) {
    console.error("Error fetching news", error);
    return [];
  }
};

// 5. Fetch Company Profile (Market Cap, PE, etc.)
export const fetchCompanyProfile = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}/stock/profile2`, {
      params: {
        symbol: symbol,
        token: API_KEY
      }
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching profile", error);
    return null;
  }
};