# GasOneClick (Frontend)

Frontend for **GasOneClick**: find nearby gas stations, compare prices, and show the best option suggested by the API (AI).

## Features

- Browser geolocation or manual map selection
- Filters by fuel type, radius (km), and reference liters
- Nearby station ranking with price and distance
- Best-option recommendation (`ia.best_option`)
- Interactive map (Leaflet) with markers and Google Maps links

## Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Leaflet / react-leaflet
- Lucide React (icons)

## Requirements

- Node.js 18+ (20+ recommended)
- npm

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file from the sample:

```bash
cp .env.sample .env
```

3. Set the API base URL (Vite only exposes variables prefixed with `VITE_`):

```env
VITE_API_STATIONS_URL=https://your-api.example.com
```

> The app reads `import.meta.env.VITE_API_STATIONS_URL`. Without this variable, requests will have no base URL.

## Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Development server (HMR)             |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

## API

The app calls the nearby stations report endpoint:

```
GET {VITE_API_STATIONS_URL}/stations/nearby/report
```

Query parameters:

| Parameter   | Description                              |
|-------------|------------------------------------------|
| `user_lat`  | User latitude                            |
| `user_lng`  | User longitude                           |
| `radius_km` | Search radius in km (5, 10, 20, 30)      |
| `fuel`      | Fuel type                                |

Fuel types supported in the UI:

- `gasolina_95_e5`
- `gasolina_98_e5`
- `gasoleo_a`
- `gasoleo_premium`

Expected response fields used by the UI:

- `top_estaciones`: ranked list with price, distance, address, coordinates / Maps URL
- `ia.best_option`: recommended option from the backend

## Project structure

```
src/
  App.jsx                      # Main UI, state, and API call
  components/
    StationsMap.jsx            # Results map
    SelectGpsMap.jsx           # Map for manual location selection
  index.css                    # Tailwind + Leaflet styles
```

## Notes

- The map uses OpenStreetMap tiles.
- If the browser denies geolocation, enable the map and pick a point manually.
- Do not commit the `.env` file (it is already in `.gitignore`).
