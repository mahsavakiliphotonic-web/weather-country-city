# 🌍 Global Insights: Country & Weather Explorer

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

A sleek, modern web application that provides real-time geographic data and current weather conditions for any country and city around the world. Built entirely with Vanilla JavaScript, HTML, and CSS (with a beautiful glassmorphism dark-mode aesthetic!).

**[🚀 View Live Project](https://mahsavakiliphotonic-web.github.io/weather-country-city/)**

## ✨ Features

- **Country Data Integration**: Instantly view the flag, capital, region, and population of any country.
- **Dynamic City Search**: Select a country and type in a specific city to get localized weather information. The app validates your searched city against your selected country to ensure perfect accuracy!
- **Real-Time Weather Updates**: Provides precise current temperature, weather conditions (with descriptive icons and text), and wind speeds.
- **Smart Fallback**: If you search for a country without specifying a city, the app intelligently defaults to providing the weather for the nation's capital.
- **Premium Glassmorphism UX**: Enjoy a first-class user experience featuring:
  - An animated, infinite-gradient background layer.
  - Blurred, frosted-glass user interface panels.
  - Subtle interactive hover states and fluid micro-animations.
  - A fully responsive CSS Grid layout designed for mobile and desktop.

## 📡 APIs Plumbed

This powerful application runs entirely on the client side using robust, zero-key public APIs:

1. **[RestCountries API](https://restcountries.com/)**: Used to fetch a comprehensive, selectable list of all global nations, alongside rich demographic data (flags, populations) and default coordinates.
2. **[Open-Meteo Free API](https://open-meteo.com/)**: Used to fetch hyper-local real-time weather information and its complementary **Geocoding API** for translating user-entered city names into exact latitude and longitude coordinates seamlessly.

## 🚀 Running Locally

If you'd like to test or tweak the code yourself, it is incredibly simple:

1. Clone or download this repository.
2. Open the directory in your preferred IDE (like VS Code).
3. Using an extension like **Live Server** or a terminal utility like `npx serve`, serve the directory.
4. Open the provided `localhost` URL in your browser.

*Zero API keys, build steps, or installations are required!*

## 🤝 Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page or submit a pull request if you want to add more features.

---
*Created as part of an exercise emphasizing incredibly high-quality UX and reliable third-party REST API integration.*
