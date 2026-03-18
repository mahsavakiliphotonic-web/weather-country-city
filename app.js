const DOM = {
    countrySelect: document.getElementById('countrySelect'),
    cityInput: document.getElementById('cityInput'),
    searchBtn: document.getElementById('searchBtn'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    errorText: document.getElementById('errorText'),
    resultsContent: document.getElementById('resultsContent'),
    
    // Country Data
    countryFlag: document.getElementById('countryFlag'),
    countryName: document.getElementById('countryName'),
    countryCapital: document.getElementById('countryCapital'),
    countryRegion: document.getElementById('countryRegion'),
    countryPopulation: document.getElementById('countryPopulation'),
    
    // Weather Data
    weatherIcon: document.getElementById('weatherIcon'),
    weatherTemp: document.getElementById('weatherTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    windSpeed: document.getElementById('windSpeed'),
    localTime: document.getElementById('localTime')
};

// State
let countriesData = [];

// Initialize app
async function init() {
    try {
        await fetchCountries();
        setupEventListeners();
    } catch (error) {
        showError('Failed to load countries. Please try again later.');
    }
}

async function fetchCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,latlng,cca3,cca2');
    if (!response.ok) throw new Error('API fetch failed');
    
    countriesData = await response.json();
    
    // Sort alphabetically
    countriesData.sort((a, b) => a.name.common.localeCompare(b.name.common));
    
    // Populate select
    DOM.countrySelect.innerHTML = '<option value="">Select a country...</option>';
    countriesData.forEach(country => {
        const option = document.createElement('option');
        option.value = country.cca3; // Unique ID
        option.textContent = country.name.common;
        DOM.countrySelect.appendChild(option);
    });
}

function setupEventListeners() {
    DOM.searchBtn.addEventListener('click', handleSearch);
    DOM.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
}

async function handleSearch() {
    const selectedCca3 = DOM.countrySelect.value;
    const cityName = DOM.cityInput.value.trim();
    
    if (!selectedCca3) {
        showError('Please select a country first.');
        return;
    }
    
    const countryInfo = countriesData.find(c => c.cca3 === selectedCca3);
    
    // Show Loading
    DOM.resultsContent.classList.add('hidden');
    DOM.error.classList.add('hidden');
    DOM.loading.classList.remove('hidden');
    
    try {
        await fetchAndDisplayData(countryInfo, cityName);
    } catch (err) {
        showError(err.message || 'Could not fetch data. Please try again.');
        console.error(err);
    } finally {
        DOM.loading.classList.add('hidden');
    }
}

async function fetchAndDisplayData(country, cityName) {
    let lat, lng;
    let actualLocationName = '';
    
    if (cityName) {
        // Geocode the city
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`);
        if (!geoRes.ok) throw new Error('Geocoding API failed');
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error(`City "${cityName}" not found.`);
        }
        
        // Try to find a match for the selected country, else fallback to first result
        const match = geoData.results.find(res => res.country_code === country.cca2) || geoData.results[0];
        
        if (match.country_code && match.country_code !== country.cca2) {
             throw new Error(`City "${cityName}" not found in ${country.name.common}.`);
        }
        
        lat = match.latitude;
        lng = match.longitude;
        actualLocationName = match.name;
    } else {
        // Prefer capital coordinates if possible, else country latlng
        if (country.latlng && country.latlng.length === 2) {
            [lat, lng] = country.latlng;
            actualLocationName = country.capital && country.capital.length ? country.capital[0] : country.name.common;
        } else {
            throw new Error('No coordinates available for this country');
        }
    }
    
    // Request current weather
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&timezone=auto`);
    
    if (!weatherRes.ok) throw new Error('Weather API failed');
    const weatherData = await weatherRes.json();
    
    updateUI(country, weatherData.current_weather, actualLocationName);
}

function updateUI(country, weather, actualLocationName) {
    // Populate Country Info
    DOM.countryFlag.src = country.flags.svg || country.flags.png;
    DOM.countryFlag.alt = `Flag of ${country.name.common}`;
    DOM.countryName.textContent = country.name.common;
    DOM.countryCapital.textContent = country.capital && country.capital.length ? country.capital[0] : 'N/A';
    DOM.countryRegion.textContent = country.region;
    DOM.countryPopulation.textContent = country.population.toLocaleString();
    
    // Populate Weather Info
    document.querySelector('.weather-data .panel-header h2').innerHTML = `<i class="fa-solid fa-cloud-sun"></i> Weather in ${actualLocationName}`;
    DOM.weatherTemp.textContent = Math.round(weather.temperature);
    DOM.windSpeed.textContent = weather.windspeed;
    
    const { icon, description } = getWeatherAttributes(weather.weathercode, weather.temperature);
    DOM.weatherIcon.className = `fa-solid ${icon} weather-icon-large`;
    DOM.weatherDesc.textContent = description;
    
    // Convert current time
    const date = new Date();
    // Assuming timezone offset from local machine for now, since API doesn't always provide simple local time string natively in the way we want without complex manipulation
    // We just show a formatted time string
    DOM.localTime.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Trigger animations by reflowing
    DOM.resultsContent.classList.remove('hidden');
    
    const panels = document.querySelectorAll('.glass-panel');
    panels.forEach(p => {
        p.style.animation = 'none';
        p.offsetHeight; /* trigger reflow */
        p.style.animation = null; 
    });
}

function getWeatherAttributes(code, temp) {
    // WMO Weather interpretation codes
    let icon = 'fa-cloud';
    let description = 'Unknown';
    
    if (code === 0) {
        icon = 'fa-sun';
        description = 'Clear Sky';
    } else if (code === 1 || code === 2 || code === 3) {
        icon = code === 3 ? 'fa-cloud' : 'fa-cloud-sun';
        description = code === 3 ? 'Overcast' : 'Partly Cloudy';
    } else if (code >= 45 && code <= 48) {
        icon = 'fa-smog';
        description = 'Fog';
    } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
        icon = temp < 0 ? 'fa-cloud-meatball' : 'fa-cloud-rain'; // simplified freezing vs rain
        description = 'Rain / Drizzle';
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        icon = 'fa-snowflake';
        description = 'Snow';
    } else if (code >= 95 && code <= 99) {
        icon = 'fa-cloud-bolt';
        description = 'Thunderstorm';
    }
    
    return { icon, description };
}

function showError(msg) {
    DOM.errorText.textContent = msg;
    DOM.error.classList.remove('hidden');
    DOM.resultsContent.classList.add('hidden');
    DOM.loading.classList.add('hidden');
}

// Start
init();
