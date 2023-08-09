import axios from 'axios';

const apiKey = '1e52cb7b5a93a86d54181d1fa5724454';

const getWeatherData = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    );

    const data = res.data;
    const temp = (data.main.temp - 273.15).toFixed(0);
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
    const name = data.name;

    return {
      temp,
      iconUrl,
      name,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

export default getWeatherData;
