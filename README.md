# European Weather Forecast

A browser-based 7-day weather forecast demo. Choose a European city and retrieve forecast data from the 7Timer API.

## Run locally

From the repository root, start a simple static server:

```bash
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser. The forecast request needs an internet connection.

## Project structure

```text
.
├── index.html
├── css/
│   └── master.css
├── js/
│   └── main.js
├── data/
│   └── city_coordinates.csv
└── archives/
    └── weather-forcast.zip
```

The ZIP archive is retained as the original project bundle. The app loads city coordinates from `data/city_coordinates.csv` and forecast data from the 7Timer API.
