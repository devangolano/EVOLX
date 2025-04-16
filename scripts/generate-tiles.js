const { execSync } = require('child_process');
const path = require('path');

const tiffPath = 'C:/Users/alber/OneDrive/Documentos/Projectos/Marcus/Iturama-2019.tif';
const outputDir = path.join(__dirname, '../public/tiles');

// Create output directory if it doesn't exist
execSync(`mkdir -p "${outputDir}"`);

// Generate XYZ tiles using GDAL
try {
  execSync(`gdal2tiles.py -z 12-19 -w leaflet "${tiffPath}" "${outputDir}"`, {
    stdio: 'inherit'
  });
  console.log('Tiles generated successfully!');
} catch (error) {
  console.error('Error generating tiles:', error);
}
