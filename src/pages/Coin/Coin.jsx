import React, { useContext, useEffect, useState } from 'react'
import './Coin.css'
import { useParams } from 'react-router-dom'
import { CoinContext } from '../../context/CoinContext';
import LineChart from '../../components/LineChart/LineChart';

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState();
  const [historicalData, setHistoricalData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currency, API_KEY } = useContext(CoinContext);

  useEffect(() => {
    const fetchCoinData = async () => {
      setLoading(true);
      setError('');

      try {
        const options = {
          method: 'GET',
          headers: { accept: 'application/json', 'x-cg-demo-api-key': API_KEY }
        };

        const [coinResponse, chartResponse] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options),
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`, options)
        ]);

        if (!coinResponse.ok || !chartResponse.ok) {
          throw new Error('Unable to load cryptocurrency data');
        }

        const [coin, chart] = await Promise.all([
          coinResponse.json(),
          chartResponse.json()
        ]);

        setCoinData(coin);
        setHistoricalData(chart);
      } catch (err) {
        console.error(err);
        setCoinData(undefined);
        setHistoricalData(undefined);
        setError('Unable to load this cryptocurrency. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId, currency, API_KEY]);

  if (loading) {
    return (
      <div className='spinner' aria-label='Loading cryptocurrency data'>
        <div className='spin'></div>
      </div>
    )
  }

  if (error || !coinData || !historicalData) {
    return (
      <div className='coin-error'>
        <h2>Something went wrong</h2>
        <p>{error || 'Cryptocurrency data is unavailable.'}</p>
        <button type='button' onClick={() => window.location.reload()}>Try again</button>
      </div>
    )
  }

  return (
    <main className='coin'>
      <div className='coin-name'>
        <img src={coinData.image.large} alt={coinData.name} />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className='coin-chart'>
        <LineChart historicalData={historicalData} />
      </div>

      <div className='coin-info'>
        <ul>
          <li>Crypto Market Rank</li>
          <li>{coinData.market_cap_rank}</li>
        </ul>
        <ul>
          <li>Current Price</li>
          <li>{currency.symbol} {coinData.market_data.current_price[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>Market cap</li>
          <li>{currency.symbol} {coinData.market_data.market_cap[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour high</li>
          <li>{currency.symbol} {coinData.market_data.high_24h[currency.name].toLocaleString()}</li>
        </ul>
        <ul>
          <li>24 Hour low</li>
          <li>{currency.symbol} {coinData.market_data.low_24h[currency.name].toLocaleString()}</li>
        </ul>
      </div>
    </main>
  )
}

export default Coin
