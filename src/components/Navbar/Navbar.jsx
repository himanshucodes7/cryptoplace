import React, { useContext } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import { CoinContext } from '../../context/CoinContext'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { setCurrency, currency } = useContext(CoinContext)
  const navigate = useNavigate()
  const location = useLocation()

  const currencyHandler = (event) => {
    const value = event.target.value

    if (value === 'eur') {
      setCurrency({ name: 'eur', symbol: '€' })
    } else if (value === 'inr') {
      setCurrency({ name: 'inr', symbol: '₹' })
    } else {
      setCurrency({ name: 'usd', symbol: '$' })
    }
  }

  const isHomeActive = location.pathname === '/' && (location.hash === '' || location.hash === '#home' || location.hash !== '#markets')
  const isMarketsActive = location.pathname === '/' && location.hash === '#markets'

  const homeHandler = (event) => {
    event.preventDefault()

    const scrollToHome = () => {
      const section = document.getElementById('home')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    if (location.pathname !== '/') {
      navigate('/#home')
      setTimeout(scrollToHome, 150)
      return
    }

    navigate('/#home')
    setTimeout(scrollToHome, 50)
  }

  const marketsHandler = (event) => {
    event.preventDefault()

    const scrollToMarkets = () => {
      const section = document.getElementById('markets')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    if (location.pathname !== '/') {
      navigate('/#markets')
      setTimeout(scrollToMarkets, 150)
      return
    }

    navigate('/#markets')
    setTimeout(scrollToMarkets, 50)
  }

  return (
    <header className='navbar'>
      <NavLink to='/' className='brand' aria-label='CryptoPlace home'>
        <img src={logo} alt='CryptoPlace' className='logo' />
      </NavLink>

      <nav aria-label='Primary navigation'>
        <ul>
          <li>
            <a
              href='/#home'
              className={isHomeActive ? 'active' : ''}
              onClick={homeHandler}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href='/#markets'
              className={isMarketsActive ? 'active' : ''}
              onClick={marketsHandler}
            >
              Markets
            </a>
          </li>
        </ul>
      </nav>

      <div className='nav-right'>
        <select
          onChange={currencyHandler}
          value={currency.name}
          aria-label='Select currency'
        >
          <option value='usd'>USD</option>
          <option value='eur'>EUR</option>
          <option value='inr'>INR</option>
        </select>
      </div>
    </header>
  )
}

export default Navbar
