/**
 * WeatherGPT — AI-Powered Weather Intelligence Platform
 * Vanilla JavaScript (ES6+) Implementation
 * 
 * Architecture:
 * - Configuration & State Management
 * - API & Data Fetching Layer (Backend API with automatic Demo Data fallback)
 * - Weather Analysis & Calculation Engine
 * - AI Response Generator (generateWeatherResponse)
 * - UI Rendering Modules
 * - Storage & Preferences
 * - Event Handlers & Atmospheric FX
 */

// ==========================================================================
// 1. CONFIGURATION & STATE MANAGEMENT
// ==========================================================================
const CONFIG = {
    API_BASE_URL: "http://localhost:8000/api",
    DEFAULT_CITY: "Chennai",
    STORAGE_FAVORITES_KEY: "weathergpt_favorites",
    STORAGE_THEME_KEY: "weathergpt_theme",
    STORAGE_LAST_CITY_KEY: "weathergpt_last_city"
};

// Global App State
const AppState = {
    currentCity: CONFIG.DEFAULT_CITY,
    currentWeatherData: null,
    isLiveApi: false,
    theme: localStorage.getItem(CONFIG.STORAGE_THEME_KEY) || "dark",
    favorites: JSON.parse(localStorage.getItem(CONFIG.STORAGE_FAVORITES_KEY)) || ["Chennai", "Bengaluru", "London", "New York"],
    activeActivity: "running"
};

// ==========================================================================
// 2. REALISTIC MOCK & DEMO DATASET ENGINE
// ==========================================================================
const MOCK_WEATHER_DATABASE = {
    "chennai": {
        city: "Chennai",
        country: "India",
        temp: 32,
        feelsLike: 36,
        condition: "Clear sky",
        icon: "clear",
        humidity: 72,
        windSpeed: 14,
        windDir: "SSW",
        pressure: 1012,
        visibility: 8,
        uvIndex: 7,
        rainProb: 10,
        tempMax: 34,
        tempMin: 26,
        hourly: [
            { time: "10 AM", icon: "clear", temp: 31, rainProb: 10 },
            { time: "11 AM", icon: "clear", temp: 32, rainProb: 8 },
            { time: "12 PM", icon: "cloudy", temp: 33, rainProb: 12 },
            { time: "1 PM", icon: "clear", temp: 34, rainProb: 15 },
            { time: "2 PM", icon: "clear", temp: 34, rainProb: 15 },
            { time: "3 PM", icon: "cloudy", temp: 33, rainProb: 20 },
            { time: "4 PM", icon: "clear", temp: 32, rainProb: 15 },
            { time: "5 PM", icon: "clear", temp: 31, rainProb: 10 },
            { time: "6 PM", icon: "clear", temp: 29, rainProb: 5 },
            { time: "7 PM", icon: "clear", temp: 28, rainProb: 5 }
        ],
        weekly: [
            { day: "MON", date: "Today", icon: "clear", tempMax: 34, tempMin: 26, rainProb: 10 },
            { day: "TUE", date: "Sep 26", icon: "rain", tempMax: 30, tempMin: 24, rainProb: 65 },
            { day: "WED", date: "Sep 27", icon: "storm", tempMax: 29, tempMin: 23, rainProb: 80 },
            { day: "THU", date: "Sep 28", icon: "cloudy", tempMax: 31, tempMin: 25, rainProb: 30 },
            { day: "FRI", date: "Sep 29", icon: "clear", tempMax: 33, tempMin: 26, rainProb: 15 },
            { day: "SAT", date: "Sep 30", icon: "clear", tempMax: 34, tempMin: 27, rainProb: 10 },
            { day: "SUN", date: "Oct 01", icon: "cloudy", tempMax: 32, tempMin: 25, rainProb: 25 }
        ]
    },
    "bengaluru": {
        city: "Bengaluru",
        country: "India",
        temp: 26,
        feelsLike: 27,
        condition: "Passing clouds",
        icon: "cloudy",
        humidity: 65,
        windSpeed: 18,
        windDir: "WSW",
        pressure: 1015,
        visibility: 10,
        uvIndex: 5,
        rainProb: 35,
        tempMax: 28,
        tempMin: 19,
        hourly: [
            { time: "10 AM", icon: "cloudy", temp: 24, rainProb: 20 },
            { time: "11 AM", icon: "cloudy", temp: 25, rainProb: 25 },
            { time: "12 PM", icon: "cloudy", temp: 26, rainProb: 30 },
            { time: "1 PM", icon: "rain", temp: 25, rainProb: 50 },
            { time: "2 PM", icon: "rain", temp: 24, rainProb: 60 },
            { time: "3 PM", icon: "cloudy", temp: 25, rainProb: 40 },
            { time: "4 PM", icon: "clear", temp: 26, rainProb: 20 },
            { time: "5 PM", icon: "clear", temp: 25, rainProb: 15 }
        ],
        weekly: [
            { day: "MON", date: "Today", icon: "cloudy", tempMax: 28, tempMin: 19, rainProb: 35 },
            { day: "TUE", date: "Sep 26", icon: "rain", tempMax: 26, tempMin: 18, rainProb: 70 },
            { day: "WED", date: "Sep 27", icon: "rain", tempMax: 25, tempMin: 18, rainProb: 75 },
            { day: "THU", date: "Sep 28", icon: "cloudy", tempMax: 27, tempMin: 19, rainProb: 30 },
            { day: "FRI", date: "Sep 29", icon: "clear", tempMax: 28, tempMin: 20, rainProb: 15 },
            { day: "SAT", date: "Sep 30", icon: "clear", tempMax: 29, tempMin: 20, rainProb: 10 },
            { day: "SUN", date: "Oct 01", icon: "cloudy", tempMax: 27, tempMin: 19, rainProb: 20 }
        ]
    },
    "mumbai": {
        city: "Mumbai",
        country: "India",
        temp: 30,
        feelsLike: 35,
        condition: "Humid & Partly Cloudy",
        icon: "cloudy",
        humidity: 82,
        windSpeed: 16,
        windDir: "W",
        pressure: 1010,
        visibility: 7,
        uvIndex: 6,
        rainProb: 40,
        tempMax: 32,
        tempMin: 25,
        hourly: [
            { time: "10 AM", icon: "cloudy", temp: 29, rainProb: 30 },
            { time: "11 AM", icon: "cloudy", temp: 30, rainProb: 35 },
            { time: "12 PM", icon: "rain", temp: 30, rainProb: 55 },
            { time: "1 PM", icon: "rain", temp: 29, rainProb: 60 },
            { time: "2 PM", icon: "cloudy", temp: 31, rainProb: 40 }
        ],
        weekly: [
            { day: "MON", date: "Today", icon: "cloudy", tempMax: 32, tempMin: 25, rainProb: 40 },
            { day: "TUE", date: "Sep 26", icon: "rain", tempMax: 30, tempMin: 24, rainProb: 75 },
            { day: "WED", date: "Sep 27", icon: "storm", tempMax: 29, tempMin: 24, rainProb: 85 },
            { day: "THU", date: "Sep 28", icon: "rain", tempMax: 31, tempMin: 25, rainProb: 50 },
            { day: "FRI", date: "Sep 29", icon: "cloudy", tempMax: 32, tempMin: 26, rainProb: 30 },
            { day: "SAT", date: "Sep 30", icon: "clear", tempMax: 33, tempMin: 26, rainProb: 20 },
            { day: "SUN", date: "Oct 01", icon: "clear", tempMax: 33, tempMin: 26, rainProb: 15 }
        ]
    },
    "london": {
        city: "London",
        country: "United Kingdom",
        temp: 18,
        feelsLike: 17,
        condition: "Light Rain & Drizzle",
        icon: "rain",
        humidity: 85,
        windSpeed: 22,
        windDir: "SW",
        pressure: 1008,
        visibility: 9,
        uvIndex: 3,
        rainProb: 75,
        tempMax: 19,
        tempMin: 12,
        hourly: [
            { time: "10 AM", icon: "rain", temp: 16, rainProb: 80 },
            { time: "11 AM", icon: "rain", temp: 17, rainProb: 75 },
            { time: "12 PM", icon: "cloudy", temp: 18, rainProb: 45 },
            { time: "1 PM", icon: "cloudy", temp: 19, rainProb: 35 }
        ],
        weekly: [
            { day: "MON", date: "Today", icon: "rain", tempMax: 19, tempMin: 12, rainProb: 75 },
            { day: "TUE", date: "Sep 26", icon: "cloudy", tempMax: 17, tempMin: 11, rainProb: 40 },
            { day: "WED", date: "Sep 27", icon: "clear", tempMax: 20, tempMin: 12, rainProb: 20 },
            { day: "THU", date: "Sep 28", icon: "rain", tempMax: 16, tempMin: 10, rainProb: 85 },
            { day: "FRI", date: "Sep 29", icon: "wind", tempMax: 15, tempMin: 9, rainProb: 50 },
            { day: "SAT", date: "Sep 30", icon: "clear", tempMax: 18, tempMin: 11, rainProb: 15 },
            { day: "SUN", date: "Oct 01", icon: "cloudy", tempMax: 17, tempMin: 10, rainProb: 30 }
        ]
    },
    "new york": {
        city: "New York",
        country: "United States",
        temp: 22,
        feelsLike: 22,
        condition: "Sunny & Mild",
        icon: "clear",
        humidity: 50,
        windSpeed: 12,
        windDir: "NW",
        pressure: 1018,
        visibility: 10,
        uvIndex: 6,
        rainProb: 5,
        tempMax: 24,
        tempMin: 15,
        hourly: [
            { time: "10 AM", icon: "clear", temp: 20, rainProb: 5 },
            { time: "11 AM", icon: "clear", temp: 22, rainProb: 5 },
            { time: "12 PM", icon: "clear", temp: 23, rainProb: 5 },
            { time: "1 PM", icon: "clear", temp: 24, rainProb: 10 }
        ],
        weekly: [
            { day: "MON", date: "Today", icon: "clear", tempMax: 24, tempMin: 15, rainProb: 5 },
            { day: "TUE", date: "Sep 26", icon: "clear", tempMax: 25, tempMin: 16, rainProb: 10 },
            { day: "WED", date: "Sep 27", icon: "cloudy", tempMax: 23, tempMin: 15, rainProb: 25 },
            { day: "THU", date: "Sep 28", icon: "rain", tempMax: 20, tempMin: 13, rainProb: 70 },
            { day: "FRI", date: "Sep 29", icon: "clear", tempMax: 22, tempMin: 14, rainProb: 15 },
            { day: "SAT", date: "Sep 30", icon: "clear", tempMax: 24, tempMin: 16, rainProb: 5 },
            { day: "SUN", date: "Oct 01", icon: "clear", tempMax: 25, tempMin: 17, rainProb: 5 }
        ]
    }
};

/**
 * Dynamic fallback generator for any city not present in static database
 */
function generateDynamicDemoData(cityQuery) {
    const formattedCity = cityQuery.charAt(0).toUpperCase() + cityQuery.slice(1);
    
    // Hash function for pseudo-random deterministic numbers based on city string
    let hash = 0;
    for (let i = 0; i < cityQuery.length; i++) {
        hash = cityQuery.charCodeAt(i) + ((hash << 5) - hash);
    }
    const absHash = Math.abs(hash);
    
    const temp = 15 + (absHash % 20); // 15 - 34°C
    const humidity = 40 + (absHash % 50); // 40 - 89%
    const rainProb = (absHash % 90);
    const uvIndex = 2 + (absHash % 9);
    const windSpeed = 8 + (absHash % 25);
    
    let condition = "Clear sky";
    let icon = "clear";
    
    if (rainProb > 60) {
        condition = "Heavy rain showers";
        icon = "rain";
    } else if (rainProb > 35) {
        condition = "Mostly cloudy";
        icon = "cloudy";
    } else if (windSpeed > 25) {
        condition = "Breezy & clear";
        icon = "wind";
    }

    const hourly = [];
    const times = ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
    times.forEach((t, idx) => {
        hourly.push({
            time: t,
            icon: (idx % 3 === 0) ? icon : (idx % 2 === 0 ? "cloudy" : "clear"),
            temp: temp + Math.floor(Math.sin(idx) * 3),
            rainProb: Math.max(0, Math.min(100, rainProb + (idx % 5) * 5 - 10))
        });
    });

    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const weekly = days.map((day, idx) => {
        return {
            day: day,
            date: idx === 0 ? "Today" : `Day +${idx}`,
            icon: idx % 3 === 0 ? "clear" : (idx % 2 === 0 ? "cloudy" : "rain"),
            tempMax: temp + 2 + (idx % 3),
            tempMin: temp - 4 - (idx % 2),
            rainProb: (rainProb + idx * 7) % 90
        };
    });

    return {
        city: formattedCity,
        country: "Global Location",
        temp: temp,
        feelsLike: temp + (humidity > 70 ? 3 : -1),
        condition: condition,
        icon: icon,
        humidity: humidity,
        windSpeed: windSpeed,
        windDir: "NE",
        pressure: 1013,
        visibility: 9,
        uvIndex: uvIndex,
        rainProb: rainProb,
        tempMax: temp + 3,
        tempMin: temp - 4,
        hourly: hourly,
        weekly: weekly
    };
}

// ==========================================================================
// 3. FRONTEND API DATA LAYER FUNCTIONS
// ==========================================================================

/**
 * Fetch Current Weather for a given city
 */
async function fetchCurrentWeather(city) {
    if (!city || city.trim() === "") {
        throw new Error("Empty city provided.");
    }
    
    const cleanCity = city.trim();

    try {
        // Attempt fetch from backend API first
        const response = await fetch(`${CONFIG.API_BASE_URL}/weather?city=${encodeURIComponent(cleanCity)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            AppState.isLiveApi = true;
            updateDataStatusBadge(true);
            return data;
        } else {
            throw new Error(`Backend response status: ${response.status}`);
        }
    } catch (error) {
        // Graceful fallback to Demo Mode
        console.warn("Backend API unavailable. Switching seamlessly to WeatherGPT Demo Engine:", error.message);
        AppState.isLiveApi = false;
        updateDataStatusBadge(false);

        const key = cleanCity.toLowerCase();
        if (MOCK_WEATHER_DATABASE[key]) {
            return MOCK_WEATHER_DATABASE[key];
        } else {
            return generateDynamicDemoData(cleanCity);
        }
    }
}

/**
 * Fetch Forecast data for a given city
 */
async function fetchForecast(city) {
    // In our architecture, forecast is included in the unified weather object
    const weather = await fetchCurrentWeather(city);
    return {
        hourly: weather.hourly,
        weekly: weather.weekly
    };
}

/**
 * Search Location query helper
 */
async function searchLocation(query) {
    return await fetchCurrentWeather(query);
}

/**
 * Get User Location via Geolocation API
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // In demo fallback mode, map lat/long to nearby landmark or default city
                console.log(`Detected coordinates: ${latitude}, ${longitude}`);
                resolve(MOCK_WEATHER_DATABASE["chennai"]);
            },
            (error) => {
                let msg = "Unable to retrieve your location.";
                if (error.code === error.PERMISSION_DENIED) {
                    msg = "Location permission denied. Please search for your city manually.";
                }
                reject(new Error(msg));
            },
            { timeout: 8000 }
        );
    });
}

// ==========================================================================
// 4. WEATHERGPT AI ASSISTANT RESPONSE ENGINE
// ==========================================================================

/**
 * Separated AI function: generateWeatherResponse(question, weatherData)
 * Can be connected seamlessly to a real LLM API backend later.
 */
function generateWeatherResponse(question, weatherData) {
    if (!weatherData) {
        return "Please search for a city first so I can analyze the weather data for you.";
    }

    const q = question.toLowerCase();
    const city = weatherData.city;
    const temp = weatherData.temp;
    const rainProb = weatherData.rainProb;
    const condition = weatherData.condition;
    const humidity = weatherData.humidity;
    const windSpeed = weatherData.windSpeed;
    const uvIndex = weatherData.uvIndex;
    const weekly = weatherData.weekly || [];

    // Intent 1: Rain & Umbrella
    if (q.includes("rain") || q.includes("umbrella") || q.includes("shower") || q.includes("drizzle")) {
        if (rainProb >= 50) {
            return `Yes, there is a high probability of rain (${rainProb}%) in ${city} today with ${condition.toLowerCase()}. Carrying an umbrella and rain gear is strongly recommended!`;
        } else if (rainProb >= 25) {
            return `There is a moderate ${rainProb}% chance of rain in ${city}. You might want to keep a compact umbrella handy just in case.`;
        } else {
            return `Rain is unlikely in ${city} today (only ${rainProb}% chance). You shouldn't need an umbrella!`;
        }
    }

    // Intent 2: Cycling / Running / Outdoor Sports
    if (q.includes("cycling") || q.includes("cycle") || q.includes("run") || q.includes("running") || q.includes("sports")) {
        if (rainProb > 40) {
            return `Outdoor sports in ${city} might be tricky today due to a ${rainProb}% chance of rain. Consider indoor alternatives or waiting for clear sky windows.`;
        } else if (temp > 35) {
            return `It's currently ${temp}°C in ${city}. High heat might cause fatigue. If you go cycling or running, do so early in the morning or late evening and stay hydrated.`;
        } else if (windSpeed > 30) {
            return `High winds of ${windSpeed} km/h detected in ${city}. It might feel tough cycling against strong head winds today!`;
        } else {
            return `Conditions in ${city} are great for cycling & running! Temperature is around ${temp}°C with low rain risk (${rainProb}%) and manageable winds (${windSpeed} km/h).`;
        }
    }

    // Intent 3: Hottest / Coldest day this week
    if (q.includes("hottest") || q.includes("warmest") || q.includes("highest temp")) {
        if (weekly.length > 0) {
            let hottest = weekly[0];
            weekly.forEach(d => {
                if (d.tempMax > hottest.tempMax) hottest = d;
            });
            return `The hottest day in ${city} this week will be ${hottest.day} (${hottest.date}) with a peak high of ${hottest.tempMax}°C.`;
        }
    }

    if (q.includes("coldest") || q.includes("coolest") || q.includes("lowest temp")) {
        if (weekly.length > 0) {
            let coolest = weekly[0];
            weekly.forEach(d => {
                if (d.tempMin < coolest.tempMin) coolest = d;
            });
            return `The coolest day in ${city} this week will be ${coolest.day} (${coolest.date}) dropping to a low of ${coolest.tempMin}°C.`;
        }
    }

    // Intent 4: Clothing Advice
    if (q.includes("wear") || q.includes("clothes") || q.includes("jacket") || q.includes("coat")) {
        if (temp < 15) {
            return `It's chilly in ${city} at ${temp}°C. Wear a warm jacket, sweater, or layered thermal clothing.`;
        } else if (temp > 30) {
            return `It's warm at ${temp}°C with ${humidity}% humidity in ${city}. Light, breathable cotton clothing and sunglasses are ideal.`;
        } else if (rainProb > 40) {
            return `Wear waterproof outerwear or carry a raincoat, as rain chance is ${rainProb}%.`;
        } else {
            return `Comfortable casual clothes are perfect for today's ${temp}°C weather in ${city}.`;
        }
    }

    // Intent 5: UV / Sunscreen
    if (q.includes("uv") || q.includes("sun") || q.includes("sunscreen") || q.includes("tan")) {
        if (uvIndex >= 7) {
            return `The UV index in ${city} is currently high at ${uvIndex}. Apply SPF 30+ sunscreen if stepping outdoors during peak afternoon hours.`;
        } else {
            return `The UV index in ${city} is moderate (${uvIndex}). Normal sun protection is sufficient.`;
        }
    }

    // Default Intelligence Summary
    return `In ${city}, current temperature is ${temp}°C (feels like ${weatherData.feelsLike}°C) with ${condition.toLowerCase()}. Humidity is ${humidity}% and rain chance is ${rainProb}%. Let me know if you need specific advice for planning outdoor activities!`;
}

// ==========================================================================
// 5. UI RENDERING & COMPONENT BUILDERS
// ==========================================================================

/**
 * Render Current Weather Card
 */
function renderCurrentWeather(data) {
    document.getElementById("current-city-name").textContent = data.city;
    document.getElementById("current-country").textContent = data.country;
    document.getElementById("current-temp").textContent = data.temp;
    document.getElementById("current-feels-like").textContent = data.feelsLike;
    document.getElementById("current-condition-text").textContent = data.condition;
    document.getElementById("current-high-low").textContent = `H: ${data.tempMax}°C • L: ${data.tempMin}°C`;
    
    // Update Icon
    const iconImg = document.getElementById("current-weather-icon");
    iconImg.src = `assets/icons/${data.icon}.svg`;
    iconImg.alt = data.condition;

    // Update Metrics Grid
    document.getElementById("metric-humidity").textContent = `${data.humidity}%`;
    document.getElementById("bar-humidity").style.width = `${data.humidity}%`;

    document.getElementById("metric-wind").textContent = `${data.windSpeed} km/h`;
    document.getElementById("metric-wind-dir").textContent = data.windDir || "NE";

    document.getElementById("metric-pressure").textContent = `${data.pressure} hPa`;
    document.getElementById("metric-visibility").textContent = `${data.visibility} km`;
    
    document.getElementById("metric-uv").textContent = data.uvIndex;
    const uvLevelEl = document.getElementById("metric-uv-level");
    if (data.uvIndex >= 8) {
        uvLevelEl.textContent = "Very High";
        uvLevelEl.className = "metric-badge danger";
    } else if (data.uvIndex >= 6) {
        uvLevelEl.textContent = "High";
        uvLevelEl.className = "metric-badge warning";
    } else {
        uvLevelEl.textContent = "Moderate";
        uvLevelEl.className = "metric-badge good";
    }

    document.getElementById("metric-rain").textContent = `${data.rainProb}%`;
    document.getElementById("bar-rain").style.width = `${data.rainProb}%`;

    // Favorite Star Status
    updateFavoriteStarState(data.city);

    // Chat context city label
    const chatCityEl = document.getElementById("chat-city-context");
    if (chatCityEl) chatCityEl.textContent = data.city;

    // Atmospheric FX transition
    renderAtmosphere(data.icon);
}

/**
 * Render Hourly Forecast Horizontal Cards
 */
function renderHourlyForecast(hourlyData) {
    const container = document.getElementById("hourly-forecast-container");
    container.innerHTML = "";

    if (!hourlyData || hourlyData.length === 0) return;

    hourlyData.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = `hourly-card ${index === 0 ? 'active-now' : ''}`;
        card.innerHTML = `
            <span class="hourly-time">${item.time}</span>
            <div class="hourly-icon">
                <img src="assets/icons/${item.icon}.svg" alt="Weather condition" width="36" height="36">
            </div>
            <span class="hourly-temp">${item.temp}°C</span>
            <span class="hourly-rain">🌧️ ${item.rainProb}%</span>
        `;
        container.appendChild(card);
    });
}

/**
 * Render 7-Day Forecast Cards Grid
 */
function render7DayForecast(weeklyData) {
    const grid = document.getElementById("weekly-forecast-grid");
    grid.innerHTML = "";

    if (!weeklyData || weeklyData.length === 0) return;

    weeklyData.forEach(item => {
        const card = document.createElement("div");
        card.className = "weekly-card";
        card.innerHTML = `
            <span class="weekly-day">${item.day}</span>
            <span class="weekly-date">${item.date}</span>
            <div class="weekly-icon">
                <img src="assets/icons/${item.icon}.svg" alt="Weather icon" width="44" height="44">
            </div>
            <div class="weekly-temp-range">
                <span class="temp-max">${item.tempMax}°</span>
                <span class="temp-min">${item.tempMin}°</span>
            </div>
            <span class="weekly-rain-badge">🌧️ ${item.rainProb}% rain</span>
        `;
        grid.appendChild(card);
    });
}

/**
 * Render AI Weather Insights Cards
 */
function renderInsights(data) {
    const grid = document.getElementById("insights-grid");
    grid.innerHTML = "";

    const insights = [];

    // Rain Insight
    if (data.rainProb >= 50) {
        insights.push({
            icon: "☂️",
            title: "Rain Insight",
            body: `High rain probability of ${data.rainProb}% detected. Keep rain umbrellas handy and expect potential travel delays during rain spells.`
        });
    } else {
        insights.push({
            icon: "☀️",
            title: "Dry Sky Insight",
            body: `Low chance of rain (${data.rainProb}%). Good clear window for outdoor errands and commute.`
        });
    }

    // Heat & Comfort Insight
    if (data.temp >= 33 || data.feelsLike >= 36) {
        insights.push({
            icon: "🔥",
            title: "Heat & Humidity Insight",
            body: `Afternoon temperatures may feel warmer (${data.feelsLike}°C) due to ${data.humidity}% humidity. Stay hydrated!`
        });
    } else if (data.temp <= 18) {
        insights.push({
            icon: "❄️",
            title: "Cool Climate Insight",
            body: `Crisp temperature of ${data.temp}°C. Morning and evening breezes may feel cool.`
        });
    } else {
        insights.push({
            icon: "🌿",
            title: "Comfort Insight",
            body: `Mild temperature of ${data.temp}°C with balanced atmospheric pressure (${data.pressure} hPa).`
        });
    }

    // Wind Insight
    if (data.windSpeed >= 20) {
        insights.push({
            icon: "🌬️",
            title: "Wind Insight",
            body: `Strong wind breezes expected at ${data.windSpeed} km/h from ${data.windDir}. Secure light outdoor equipment.`
        });
    } else {
        insights.push({
            icon: "🍃",
            title: "Breeze Insight",
            body: `Gentle air movement at ${data.windSpeed} km/h today.`
        });
    }

    // Render cards
    insights.forEach(item => {
        const card = document.createElement("div");
        card.className = "insight-card";
        card.innerHTML = `
            <div class="insight-header">
                <span class="insight-icon">${item.icon}</span>
                <h3 class="insight-title">${item.title}</h3>
            </div>
            <p class="insight-body">${item.body}</p>
        `;
        grid.appendChild(card);
    });
}

/**
 * Render Active Weather Alerts
 */
function renderAlerts(data) {
    const section = document.getElementById("alerts-container-section");
    const container = document.getElementById("weather-alerts");
    container.innerHTML = "";

    const alerts = [];

    if (data.rainProb >= 60) {
        alerts.push({
            type: "alert-rain",
            icon: "🌧️",
            title: "Rain Alert",
            desc: `High chance of rain (${data.rainProb}%) expected today in ${data.city}.`
        });
    }

    if (data.temp >= 35 || data.feelsLike >= 38) {
        alerts.push({
            type: "alert-heat",
            icon: "🔥",
            title: "Heat Warning",
            desc: `High temperature expected during afternoon hours. UV index is ${data.uvIndex}.`
        });
    }

    if (data.icon === "storm" || data.windSpeed >= 35) {
        alerts.push({
            type: "alert-storm",
            icon: "⚡",
            title: "Storm Condition Alert",
            desc: `Strong wind gusts and potential thunder detected in forecast.`
        });
    }

    if (alerts.length > 0) {
        section.classList.remove("hidden");
        alerts.forEach(a => {
            const card = document.createElement("div");
            card.className = `alert-card ${a.type}`;
            card.innerHTML = `
                <span class="alert-icon">${a.icon}</span>
                <div>
                    <h4 class="alert-title">${a.title}</h4>
                    <p class="alert-desc">${a.desc}</p>
                </div>
            `;
            container.appendChild(card);
        });
    } else {
        section.classList.add("hidden");
    }
}

/**
 * Render Activity Suitability Analysis
 */
function renderActivitySuitability(activityKey, data) {
    const card = document.getElementById("activity-result-card");
    if (!data) return;

    let title = "Running";
    let score = "GOOD";
    let scoreClass = "status-good";
    let tempEval = "Comfortable";
    let rainEval = "Low Risk";
    let windEval = "Moderate";

    const rain = data.rainProb;
    const temp = data.temp;
    const wind = data.windSpeed;

    switch(activityKey) {
        case "running":
            title = "🏃 Running";
            if (rain > 50 || temp > 34) {
                score = "POOR"; scoreClass = "status-poor";
            } else if (temp > 28 || rain > 30) {
                score = "MODERATE"; scoreClass = "status-moderate";
            } else {
                score = "EXCELLENT"; scoreClass = "status-excellent";
            }
            break;
        case "cycling":
            title = "🚴 Cycling";
            if (rain > 40 || wind > 25) {
                score = "POOR"; scoreClass = "status-poor";
            } else if (rain > 20 || wind > 18) {
                score = "MODERATE"; scoreClass = "status-moderate";
            } else {
                score = "EXCELLENT"; scoreClass = "status-excellent";
            }
            break;
        case "cricket":
            title = "🏏 Cricket";
            if (rain > 30) {
                score = "POOR"; scoreClass = "status-poor";
            } else if (temp > 35) {
                score = "MODERATE"; scoreClass = "status-moderate";
            } else {
                score = "EXCELLENT"; scoreClass = "status-excellent";
            }
            break;
        case "photography":
            title = "📸 Outdoor Photography";
            if (rain > 60) {
                score = "POOR"; scoreClass = "status-poor";
            } else {
                score = "EXCELLENT"; scoreClass = "status-excellent";
            }
            break;
        case "travel":
            title = "✈️ Travel & Sightseeing";
            if (rain > 70 || wind > 35) {
                score = "POOR"; scoreClass = "status-poor";
            } else {
                score = "GOOD"; scoreClass = "status-good";
            }
            break;
        case "outdoor":
            title = "🌳 Outdoor Event";
            if (rain > 45) {
                score = "POOR"; scoreClass = "status-poor";
            } else if (temp > 33) {
                score = "MODERATE"; scoreClass = "status-moderate";
            } else {
                score = "EXCELLENT"; scoreClass = "status-excellent";
            }
            break;
    }

    tempEval = temp > 32 ? "High Heat" : (temp < 15 ? "Cool" : "Optimal");
    rainEval = rain > 50 ? "High Rain Risk" : (rain > 20 ? "Moderate Chance" : "Low Risk");
    windEval = wind > 25 ? "Strong Winds" : "Calm Breeze";

    card.innerHTML = `
        <div class="activity-res-header">
            <h3 class="activity-name">${title}</h3>
            <span class="activity-status-badge ${scoreClass}">${score}</span>
        </div>
        <div class="activity-details-grid">
            <div class="activity-detail-item">
                <span class="activity-detail-label">Temperature</span>
                <div class="activity-detail-val">${temp}°C (${tempEval})</div>
            </div>
            <div class="activity-detail-item">
                <span class="activity-detail-label">Rain Risk</span>
                <div class="activity-detail-val">${rain}% (${rainEval})</div>
            </div>
            <div class="activity-detail-item">
                <span class="activity-detail-label">Wind Condition</span>
                <div class="activity-detail-val">${wind} km/h (${windEval})</div>
            </div>
        </div>
    `;
}

/**
 * Render Location Comparison Section
 */
function renderComparison(data1, data2) {
    const container = document.getElementById("compare-result-container");
    container.classList.remove("hidden");

    const tempDiff = Math.abs(data1.temp - data2.temp);
    const coolerCity = data1.temp < data2.temp ? data1.city : data2.city;
    const summaryText = `${coolerCity} is ${tempDiff}°C cooler today. ${data1.rainProb > data2.rainProb ? data1.city : data2.city} has higher rain probability (${Math.max(data1.rainProb, data2.rainProb)}%).`;

    container.innerHTML = `
        <div class="compare-grid">
            <div class="compare-card glass-card">
                <h3 class="compare-city-title">📍 ${data1.city}</h3>
                <div class="compare-metric-row"><span>Temperature</span> <strong>${data1.temp}°C</strong></div>
                <div class="compare-metric-row"><span>Feels Like</span> <strong>${data1.feelsLike}°C</strong></div>
                <div class="compare-metric-row"><span>Condition</span> <strong>${data1.condition}</strong></div>
                <div class="compare-metric-row"><span>Humidity</span> <strong>${data1.humidity}%</strong></div>
                <div class="compare-metric-row"><span>Rain Risk</span> <strong>${data1.rainProb}%</strong></div>
                <div class="compare-metric-row"><span>Wind Speed</span> <strong>${data1.windSpeed} km/h</strong></div>
                <div class="compare-metric-row"><span>UV Index</span> <strong>${data1.uvIndex}</strong></div>
            </div>

            <div class="compare-card glass-card">
                <h3 class="compare-city-title">📍 ${data2.city}</h3>
                <div class="compare-metric-row"><span>Temperature</span> <strong>${data2.temp}°C</strong></div>
                <div class="compare-metric-row"><span>Feels Like</span> <strong>${data2.feelsLike}°C</strong></div>
                <div class="compare-metric-row"><span>Condition</span> <strong>${data2.condition}</strong></div>
                <div class="compare-metric-row"><span>Humidity</span> <strong>${data2.humidity}%</strong></div>
                <div class="compare-metric-row"><span>Rain Risk</span> <strong>${data2.rainProb}%</strong></div>
                <div class="compare-metric-row"><span>Wind Speed</span> <strong>${data2.windSpeed} km/h</strong></div>
                <div class="compare-metric-row"><span>UV Index</span> <strong>${data2.uvIndex}</strong></div>
            </div>

            <div class="compare-ai-summary">
                <strong>🤖 WeatherGPT Comparison Insight:</strong> ${summaryText}
            </div>
        </div>
    `;
}

/**
 * Render Atmosphere Dynamic Background Effects
 */
function renderAtmosphere(icon) {
    const bg = document.getElementById("atmosphere-bg");
    if (!bg) return;

    bg.className = "atmosphere-bg";
    if (icon === "clear") {
        bg.classList.add("atmosphere-clear");
    } else if (icon === "cloudy") {
        bg.classList.add("atmosphere-cloudy");
    } else if (icon === "rain") {
        bg.classList.add("atmosphere-rain");
    } else if (icon === "storm") {
        bg.classList.add("atmosphere-storm");
    } else {
        bg.classList.add("atmosphere-clear");
    }
}

// ==========================================================================
// 6. FAVORITES & PREFERENCE STORAGE
// ==========================================================================

function getFavorites() {
    return AppState.favorites;
}

function saveFavorite(city) {
    if (!AppState.favorites.includes(city)) {
        AppState.favorites.push(city);
        localStorage.setItem(CONFIG.STORAGE_FAVORITES_KEY, JSON.stringify(AppState.favorites));
        renderFavoriteChips();
        updateFavoriteStarState(city);
    }
}

function removeFavorite(city) {
    AppState.favorites = AppState.favorites.filter(c => c.toLowerCase() !== city.toLowerCase());
    localStorage.setItem(CONFIG.STORAGE_FAVORITES_KEY, JSON.stringify(AppState.favorites));
    renderFavoriteChips();
    updateFavoriteStarState(city);
}

function isFavorite(city) {
    return AppState.favorites.some(c => c.toLowerCase() === city.toLowerCase());
}

function updateFavoriteStarState(city) {
    const btn = document.getElementById("favorite-toggle-btn");
    if (btn) {
        if (isFavorite(city)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    }
}

function renderFavoriteChips() {
    const container = document.getElementById("favorite-chips");
    if (!container) return;
    container.innerHTML = "";

    AppState.favorites.forEach(city => {
        const btn = document.createElement("button");
        btn.className = "fav-chip";
        btn.textContent = `⭐ ${city}`;
        btn.addEventListener("click", () => handleCitySearch(city));
        container.appendChild(btn);
    });
}

function updateDataStatusBadge(isLive) {
    const badge = document.getElementById("data-status-badge");
    const text = document.getElementById("data-status-text");
    if (isLive) {
        badge.className = "data-status-badge live-mode";
        text.textContent = "🟢 Connected to Live Weather API";
    } else {
        badge.className = "data-status-badge demo-mode";
        text.textContent = "⚡ Demo weather data active";
    }
}

// ==========================================================================
// 7. CORE CONTROLLER & MAIN SEARCH FLOW
// ==========================================================================

async function handleCitySearch(cityName) {
    if (!cityName) return;

    showLoadingState(true);
    hideError();

    try {
        const weatherData = await fetchCurrentWeather(cityName);
        AppState.currentCity = weatherData.city;
        AppState.currentWeatherData = weatherData;

        // Render Dashboard Sections
        renderCurrentWeather(weatherData);
        renderHourlyForecast(weatherData.hourly);
        render7DayForecast(weatherData.weekly);
        renderInsights(weatherData);
        renderAlerts(weatherData);
        renderActivitySuitability(AppState.activeActivity, weatherData);

        // Save last searched city
        localStorage.setItem(CONFIG.STORAGE_LAST_CITY_KEY, weatherData.city);

    } catch (err) {
        showError(err.message || "We couldn't find that location. Please check the city name.");
    } finally {
        showLoadingState(false);
    }
}

function showLoadingState(isLoading) {
    const card = document.getElementById("current-weather-card");
    const skeleton = document.getElementById("weather-skeleton");
    const spinner = document.getElementById("search-spinner");
    const submitBtn = document.getElementById("hero-search-submit");

    if (isLoading) {
        if (card) card.classList.add("hidden");
        if (skeleton) skeleton.classList.remove("hidden");
        if (spinner) spinner.classList.remove("hidden");
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (card) card.classList.remove("hidden");
        if (skeleton) skeleton.classList.add("hidden");
        if (spinner) spinner.classList.add("hidden");
        if (submitBtn) submitBtn.disabled = false;
    }
}

function showError(msg) {
    const banner = document.getElementById("error-banner");
    const text = document.getElementById("error-message");
    if (banner && text) {
        text.textContent = msg;
        banner.classList.remove("hidden");
    }
}

function hideError() {
    const banner = document.getElementById("error-banner");
    if (banner) banner.classList.add("hidden");
}

// ==========================================================================
// 8. CHAT ASSISTANT UI CONTROLLER
// ==========================================================================

function handleChatSubmit(e) {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const question = input.value.trim();
    if (!question) return;

    appendChatMessage("user", question);
    input.value = "";

    // Typing indicator
    const typingMsg = appendTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator(typingMsg);
        const response = generateWeatherResponse(question, AppState.currentWeatherData);
        appendChatMessage("assistant", response);
    }, 700);
}

function appendChatMessage(sender, text) {
    const container = document.getElementById("chat-messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message message-${sender}`;
    
    const avatar = sender === "user" ? "👤" : "🤖";
    msgDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${escapeHTML(text)}</p>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
    const container = document.getElementById("chat-messages");
    const msgDiv = document.createElement("div");
    msgDiv.className = "message message-assistant typing-msg";
    msgDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    return msgDiv;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// ==========================================================================
// 9. EVENT LISTENERS & INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Theme Initialization
    document.documentElement.setAttribute("data-theme", AppState.theme);
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            AppState.theme = AppState.theme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", AppState.theme);
            localStorage.setItem(CONFIG.STORAGE_THEME_KEY, AppState.theme);
        });
    }

    // 2. Mobile Menu Toggle
    const menuBtn = document.getElementById("menu-toggle");
    const nav = document.getElementById("main-nav");
    if (menuBtn && nav) {
        menuBtn.addEventListener("click", () => {
            const open = nav.classList.toggle("open");
            menuBtn.setAttribute("aria-expanded", open);
        });
    }

    // 3. Search Form Submit
    const searchForm = document.getElementById("hero-search-form");
    const searchInput = document.getElementById("hero-search-input");
    const clearBtn = document.getElementById("clear-search-btn");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            handleCitySearch(searchInput.value);
        });

        searchInput.addEventListener("input", () => {
            if (searchInput.value.length > 0) {
                clearBtn.classList.remove("hidden");
            } else {
                clearBtn.classList.add("hidden");
            }
        });

        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearBtn.classList.add("hidden");
            searchInput.focus();
        });
    }

    // Quick search icon in header focuses input
    const quickSearchBtn = document.getElementById("quick-search-trigger");
    if (quickSearchBtn) {
        quickSearchBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (searchInput) searchInput.focus();
        });
    }

    // 4. Geolocation Buttons
    const locBtns = [document.getElementById("hero-location-btn"), document.getElementById("header-location-btn")];
    locBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener("click", async () => {
                showLoadingState(true);
                try {
                    const locData = await getUserLocation();
                    handleCitySearch(locData.city);
                } catch (err) {
                    showError(err.message);
                } finally {
                    showLoadingState(false);
                }
            });
        }
    });

    // 5. Favorite Star Toggle Button
    const favToggleBtn = document.getElementById("favorite-toggle-btn");
    if (favToggleBtn) {
        favToggleBtn.addEventListener("click", () => {
            const city = AppState.currentCity;
            if (isFavorite(city)) {
                removeFavorite(city);
            } else {
                saveFavorite(city);
            }
        });
    }

    // 6. Activity Selector Tabs
    const activityBtns = document.querySelectorAll(".btn-activity");
    activityBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            activityBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            AppState.activeActivity = btn.dataset.activity;
            renderActivitySuitability(AppState.activeActivity, AppState.currentWeatherData);
        });
    });

    // 7. Location Comparison Form
    const compareForm = document.getElementById("compare-form");
    if (compareForm) {
        compareForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const loc1 = document.getElementById("compare-loc-1").value.trim();
            const loc2 = document.getElementById("compare-loc-2").value.trim();

            if (loc1 && loc2) {
                const data1 = await fetchCurrentWeather(loc1);
                const data2 = await fetchCurrentWeather(loc2);
                renderComparison(data1, data2);
            }
        });
    }

    // 8. Chat Form & Suggested Prompt Chips
    const chatForm = document.getElementById("chat-form");
    if (chatForm) chatForm.addEventListener("submit", handleChatSubmit);

    const promptChips = document.querySelectorAll(".prompt-chip");
    promptChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const chatInput = document.getElementById("chat-input");
            if (chatInput) {
                chatInput.value = chip.dataset.prompt;
                chatForm.dispatchEvent(new Event("submit"));
            }
        });
    });

    const clearChatBtn = document.getElementById("clear-chat-btn");
    if (clearChatBtn) {
        clearChatBtn.addEventListener("click", () => {
            const container = document.getElementById("chat-messages");
            container.innerHTML = `
                <div class="message message-assistant">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>Hi! Ask me anything about the weather in <strong id="chat-city-context">${AppState.currentCity}</strong> or planning your day ahead.</p>
                    </div>
                </div>
            `;
        });
    }

    // Close Error Banner
    const closeErrorBtn = document.getElementById("close-error");
    if (closeErrorBtn) closeErrorBtn.addEventListener("click", hideError);

    // Initial Render of Saved Favorite Chips
    renderFavoriteChips();

    // 9. Initial Load (Last city or Default City)
    const initialCity = localStorage.getItem(CONFIG.STORAGE_LAST_CITY_KEY) || CONFIG.DEFAULT_CITY;
    handleCitySearch(initialCity);
});
