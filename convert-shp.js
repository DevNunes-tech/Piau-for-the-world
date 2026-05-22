import { open } from 'shapefile';
import fs from 'fs';

async function convertShapefileToGeoJSON() {
  const source = 'src/data/PI_Municipios_2025.shp';
  const geojson = [];

  const reader = await open(source);
  let result = await reader.read();

  while (!result.done) {
    geojson.push(result.value);
    result = await reader.read();
  }

  fs.writeFileSync('src/data/municipios_piaui.geojson', JSON.stringify({
    type: 'FeatureCollection',
    features: geojson
  }, null, 2));
}

convertShapefileToGeoJSON().catch(console.error);