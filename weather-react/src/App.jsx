import { React, useEffect, useState } from 'react'
import './App.css'
import Main from './components/Main'
import Search from './components/Search'
import fetchRequest from './services/request'

const App = () => {
  const [currentCity, setCurrentCity] = useState(
    JSON.parse(localStorage.getItem('currentCity')) || 'Псков'
  )
  const [weatherData, setWeatherData] = useState({})
  const [forecastData, setForecastData] = useState([])
  const [favoriteCities, setFavoriteCities] = useState(
    JSON.parse(localStorage.getItem('favoriteCities')) || []
  )
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(true)

  const getData = (city, weather, forecast) => {
    setCurrentCity(city)
    localStorage.setItem('currentCity', JSON.stringify(city))
    setWeatherData(weather)
    setForecastData(forecast)
  }

  const requestCity = async (city) => {
    setIsLoaded(false)
    const response = await fetchRequest(city)
    setIsLoaded(true)
    if (response.weather && response.forecast) {
      const {
        weather,
        forecast,
        weather: { cityName },
      } = response
      getData(cityName, weather, forecast)
    } else {
      handleError(response)
    }
  }

  useEffect(() => {
    requestCity(currentCity)
  }, [])

  const getFavoriteCities = (city) => {
    let newFavoriteCities = []
    if (favoriteCities.includes(city)) {
      newFavoriteCities = favoriteCities.filter((item) => item !== city)
    } else {
      newFavoriteCities = [...favoriteCities, currentCity]
    }
    setFavoriteCities(newFavoriteCities)
    localStorage.setItem('favoriteCities', JSON.stringify(newFavoriteCities))
  }

  const clearFavoriteCities = () => {
    setFavoriteCities([])
    localStorage.removeItem('favoriteCities')
  }

  const handleError = (error) => {
    setError(error)
  }

  useEffect(() => {
    setTimeout(() => {
      setError(null)
    }, 10000)
  }, [error])

  return (
    <div className='wrapper'>
      <div className='container'>
        <Search requestCity={requestCity} handleError={handleError} />
        <Main
          weatherData={weatherData}
          forecastData={forecastData}
          currentCity={currentCity}
          getFavoriteCities={getFavoriteCities}
          favoriteCities={favoriteCities}
          handleError={handleError}
          error={error}
          isLoaded={isLoaded}
          clearFavoriteCities={clearFavoriteCities}
          requestCity={requestCity}
        />
      </div>
    </div>
  )
}

export default App
