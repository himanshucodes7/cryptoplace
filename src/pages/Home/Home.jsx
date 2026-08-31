import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext'
import { Link } from 'react-router-dom'

const Home = () => {
  const { allCoin, currency, loading, error } = useContext(CoinContext)
  const [displayCoin, setDisplayCoin] = useState([])
  const [input, setInput] = useState('')

  const inputHandler = (event) => {
    const value = event.target.value
    setInput(value)

    if (value.trim() === '') {
      setDisplayCoin(allCoin)
    }
  }

  const searchHandler = (event) => {
    event.preventDefault()

    const searchValue = input.trim().toLowerCase()
    if (!searchValue) {
      setDisplayCoin(allCoin)
      return
    }

    const coins = allCoin.filter((item) =>
      item.name.toLowerCase().includes(searchValue) ||
      item.symbol.toLowerCase().includes(searchValue)
    )

    setDisplayCoin(coins)
  }

  useEffect(() => {
    const sortedCoins = [...allCoin].sort((a, b) => {
      const rankA = a.market_cap_rank ?? Number.MAX_SAFE_INTEGER
      const rankB = b.market_cap_rank ?? Number.MAX_SAFE_INTEGER
      return rankA - rankB
    })

    setDisplayCoin(sortedCoins)
  }, [allCoin])

  return (
    <main className='home'>
      <section className='hero' id='home'>
        <span className='hero-badge'>Live cryptocurrency market data</span>
        <h1>Largest <br /> Crypto Marketplace</h1>
        <p>Track cryptocurrency prices, market trends and key market statistics in one place.</p>
        <form onSubmit={searchHandler}>
          <input onChange={inputHandler} list='coinlist' value={input} type='text' placeholder='Search crypto...' aria-label='Search cryptocurrency' />
          <datalist id='coinlist'>
            {allCoin.map((item) => <option key={item.id} value={item.name} />)}
          </datalist>
          <button type='submit'>Search</button>
        </form>
      </section>

      <section className='crypto-table' id='markets'>
        <div className='table-heading'>
          <div>
            <h2>Market Overview</h2>
            <span>{allCoin.length ? `${allCoin.length} assets tracked` : 'Cryptocurrency market data'}</span>
          </div>
        </div>

        <div className='table-layout table-header'>
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>

        {loading && (
          <div className='table-state'>
            <div className='table-spinner'></div>
            <p>Loading market data...</p>
          </div>
        )}

        {!loading && error && (
          <div className='table-state error-state'>
            <p>{error}</p>
            <button type='button' onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {!loading && !error && displayCoin.length === 0 && (
          <div className='table-state'>
            <p>No cryptocurrencies found. Try another search.</p>
          </div>
        )}

        {!loading && !error && displayCoin.slice(0, 10).map((item, index) => (
          <Link to={`/coin/${item.id}`} className='table-layout coin-row' key={item.id}>
            <p>{index + 1}</p>
            <div>
              <img src={item.image} alt={item.name} />
              <p>{item.name + " - " + item.symbol.toUpperCase()}</p>
            </div>
            <p>{currency.symbol} {item.current_price.toLocaleString()}</p>
            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
              {item.price_change_percentage_24h?.toFixed(2)}%
            </p>
            <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Home
