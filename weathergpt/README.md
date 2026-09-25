# 🌤️ WeatherGPT — Weather, but smarter.

WeatherGPT is an AI-powered weather intelligence platform designed to deliver conversational weather insights, real-time atmospheric metrics, 7-day forecasts, location comparison, and activity recommendations.

Built purely with **HTML5**, **CSS3 (Vanilla)**, and **JavaScript (ES6+)**. No external frameworks (No React, No Tailwind, No Bootstrap).

---

## 🚀 Features

1. **Header Navigation & Responsive Layout**
   - Sticky header with glassmorphism aesthetics.
   - Quick City Search trigger, Location detector button, and Dark/Light Mode toggle.
   - Responsive mobile navigation with hamburger drawer.

2. **Hero Search & Saved Favorites**
   - Instant search for any global city with keyboard shortcuts.
   - "Use My Location" geolocation detection.
   - Favorite locations bar stored persistently via `localStorage`.

3. **Current Weather Dashboard**
   - Live temperature, feels-like index, condition badge, and high/low ranges.
   - Detailed metrics: Humidity, Wind speed & direction, Atmospheric Pressure, Visibility, UV Index (with risk scale), and Rain Probability.

4. **Hourly Forecast (24-Hour Timeline)**
   - Horizontally scrollable timeline featuring hour-by-hour temperature, weather icons, and rain probabilities.

5. **7-Day Extended Forecast**
   - Comprehensive weekly outlook with max/min temperature range visualizations.

6. **WeatherGPT AI Assistant (`Ask WeatherGPT`)**
   - ChatGPT-style natural-language weather assistant interface.
   - Separated response generator function (`generateWeatherResponse(question, weatherData)`).
   - Instant intent parsing for rain/umbrella checks, outdoor sports suitability, clothing advice, UV safety, and temperature extremes.

7. **AI Weather Insights**
   - Dynamically generated atmospheric insights (Rain, Heat/Humidity, Wind, Comfort) derived from forecast metrics.

8. **Activity Suitability Analysis (`What are you planning?`)**
   - Interactive suitability calculator for outdoor activities:
     - 🏃 Running
     - 🚴 Cycling
     - 🏏 Cricket
     - 📸 Photography
     - ✈️ Travel
     - 🌳 Outdoor Event

9. **Location Comparison**
   - Side-by-side comparison matrix for two cities with AI summary recommendation.

10. **Weather Alerts**
    - High rain alerts, extreme heat warnings, and storm condition notices triggered automatically by forecast metrics.

11. **Atmospheric Dynamic Visuals & Themes**
    - Seamless dark & light themes.
    - Dynamic atmospheric ambient effects matching active weather conditions (Clear, Cloudy, Rain, Storm).

---

## 🛠️ Project Structure

```
weathergpt/
│
├── index.html          # HTML5 Semantic structure & Layout
├── style.css           # Vanilla CSS3 Design System, Glassmorphism, Responsive Breakpoints
├── script.js           # ES6+ JavaScript Application Engine & AI Intelligence
│
├── assets/
│   ├── logo.svg        # WeatherGPT Vector Brand Logo
│   └── icons/          # SVG Weather Condition Icons
│       ├── clear.svg
│       ├── cloudy.svg
│       ├── rain.svg
│       ├── storm.svg
│       ├── snow.svg
│       └── wind.svg
│
└── README.md           # Documentation
```

---

## ⚙️ API Architecture & Configuration

WeatherGPT is designed with a decoupled frontend-backend API architecture:

```
Browser (HTML/CSS/JS) ──> Frontend API Layer ──> Backend API (http://localhost:8000/api) ──> Weather API / AI Service
```

The configuration is centralized at the top of `script.js`:

```javascript
const CONFIG = {
    API_BASE_URL: "http://localhost:8000/api",
    DEFAULT_CITY: "Chennai"
};
```

### Automatic Fallback Demo Mode
If the backend API is unavailable or offline, WeatherGPT automatically transitions to **Demo Weather Mode** without throwing raw JavaScript errors or breaking the UI.

- Pre-loaded realistic datasets for major global cities (Chennai, Bengaluru, Mumbai, London, New York, Tokyo, etc.).
- Built-in dynamic data generator for any arbitrary city name.

---

## 🏃 How to Run

1. Simply open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
2. Or serve locally using any standard static file server:
   ```bash
   npx serve .
   ```
   or with Python:
   ```bash
   python -m http.server 8000
   ```

---

## 🔒 Security & Best Practices
- No private API keys or credentials are exposed in frontend code.
- Sanitized user inputs to prevent XSS.
- Full keyboard accessibility and ARIA semantics.

---

*WeatherGPT — Weather, but smarter.*
