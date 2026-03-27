# Global Deforestation Monitor

An interactive 3D globe dashboard visualizing global forest coverage trends across countries from 1990 to 2025, inspired by [Pudding.cool](https://pudding.cool)'s storytelling approach.

<br/>

## Data

The dashboard visualizes data from the [Food and Agriculture Organization of the United Nations (FAO)](https://www.fao.org/forest-resources-assessment/en/) via Our World in Data. The dataset includes:
- **Coverage**: 1990–2025
- **Metric**: Share of global forest area per country (% of total world forests)
- **Countries**: 190+ nations tracked
- **Source**: FAO Global Forest Resources Assessment 2025

<br/>

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will open at [http://localhost:5173](http://localhost:5173)

### Build
```bash
npm run build
```

<br/>

## Deployment

The app is configured for [GitHub Pages](https://pages.github.com/) at `https://sudip70.github.io/deforestation/`.

### Deploy to GitHub Pages
```bash
npm run deploy
```

This builds the app and pushes the `dist/` folder to the `gh-pages` branch automatically.

Then enable Pages in your repository:
**GitHub → Settings → Pages → Source → Deploy from branch → `gh-pages` → `/ (root)`**
