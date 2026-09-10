<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, watch } from 'vue';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM from 'ol/source/OSM.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import 'ol/ol.css';
import Point from 'ol/geom/Point.js';
import Link from 'ol/interaction/Link';
import { toLonLat } from 'ol/proj.js';
import { getCenter } from 'ol/extent.js';
import type { NaturalEvent } from '../types/event';

const props = defineProps<{ events: any | null }>();
const emits = defineEmits(['eventSelected']);

const map = shallowRef<Map | null>(null);
const vectorSource = new VectorSource();

onMounted(async () => {
  map.value = new Map({
    target: 'map',
    layers: [new TileLayer({ source: new OSM() }), new VectorLayer({ source: vectorSource })],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  map.value.addInteraction(new Link());

  map.value.on('click', (event) => {
    const feature = map.value!.forEachFeatureAtPixel(event.pixel, (f) => f);
    let naturalEvent: NaturalEvent | null = null;

    if (feature) {
      const data = feature.getProperties();
      const geom = feature.getGeometry();
      if (geom) {
        const coord = geom.getType() === 'Point' ? (geom as Point).getCoordinates() : getCenter(geom.getExtent());
        const [longitude, latitude] = toLonLat(coord);

        naturalEvent = {
          id: data.id,
          title: data.title,
          category: data.categories?.[0]?.id ?? 'unknown',
          longitude: Number(longitude.toFixed(2)),
          latitude: Number(latitude.toFixed(2)),
        };
      }
    }
    emits('eventSelected', naturalEvent);
  });
});

watch(
  () => props.events,
  (collection) => {
    vectorSource.clear();
    if (!collection) return;
    vectorSource.addFeatures(
      new GeoJSON().readFeatures(collection, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      })
    );
  },
  { immediate: true }
);
</script>

<style scoped>
#map {
  flex: 1;
  min-width: 0;
  height: 100%;
}
</style>
