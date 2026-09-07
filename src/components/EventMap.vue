<template>
  <div v-if="isLoading">Loading Events...</div>
  <div v-else-if="errorMessage">Error loading events: {{ errorMessage }}</div>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, ref } from 'vue';
import axios from 'axios';
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

const map = shallowRef<Map | null>(null);

const emits = defineEmits(['eventSelected']);

const API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson';

type EventStatus = 'open' | 'closed' | 'all';

const events = ref<any[]>([]);
const isLoading = ref<boolean>(true);
const errorMessage = ref<string | null>(null);

const fetchEvents = async (eventStatus: EventStatus = 'open', limit: number = 20, days: number = 30): Promise<void> => {
  isLoading.value = true;
  errorMessage.value = null;
  events.value = [];
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { status: eventStatus, limit, days },
    });
    events.value = response.data;
    if (response.data.features?.length === 0) {
      errorMessage.value = 'No events found';
    }
  } catch (err) {
    if (err instanceof Error) {
      errorMessage.value = err.message;
    } else {
      errorMessage.value = 'An unknown error occurred';
    }
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  const vectorSource = new VectorSource();

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

  await fetchEvents();

  if (!errorMessage.value && events.value) {
    vectorSource.clear();
    vectorSource.addFeatures(
      new GeoJSON().readFeatures(events.value, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      })
    );
  }
});
</script>

<style scoped>
#map {
  flex: 1;
  min-width: 0;
  height: 100%;
}
</style>
