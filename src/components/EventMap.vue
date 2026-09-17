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
import Link from 'ol/interaction/Link';
import Style from 'ol/style/Style.js';
import Fill from 'ol/style/Fill.js';
import Stroke from 'ol/style/Stroke.js';
import Circle from 'ol/style/Circle.js';

const props = defineProps<{ events: any | null; selectedEventId: string | null }>();
const emits = defineEmits(['eventSelected']);

const map = shallowRef<Map | null>(null);
const vectorSource = new VectorSource();

const WORLD_CENTER: [number, number] = [0, 0];
const WORLD_ZOOM = 0;
const FLY_MS = 1000;

function flyTo(id: string | null) {
  const view = map.value?.getView();
  if (!view) return;

  view.cancelAnimations();

  if (!id) {
    view.animate({
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
      duration: FLY_MS,
    });
    return;
  }

  const feature = vectorSource.getFeatures().find((f) => {
    return f.getId() === id;
  });
  const geometry = feature?.getGeometry();
  if (!geometry) return;

  view.fit(geometry.getExtent(), {
    duration: FLY_MS,
    padding: [80, 80, 80, 80],
    maxZoom: 8,
  });
}

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: (feature) => {
    const selected = feature.getId() === props.selectedEventId;
    return new Style({
      image: new Circle({
        radius: selected ? 8 : 5,
        fill: new Fill({ color: selected ? 'red' : '#3399CC' }),
        stroke: new Stroke({ color: 'white', width: 1 }),
      }),
      stroke: new Stroke({
        color: selected ? 'darkred' : '#3399CC',
        width: selected ? 3 : 1,
      }),
      fill: new Fill({
        color: selected ? 'rgba(255,0,0,0.3)' : 'rgba(51,153,204,0.2)',
      }),
    });
  },
});

onMounted(async () => {
  map.value = new Map({
    target: 'map',
    layers: [new TileLayer({ source: new OSM() }), vectorLayer],
    view: new View({
      center: WORLD_CENTER,
      zoom: WORLD_ZOOM,
    }),
  });

  map.value.addInteraction(new Link());

  map.value.on('click', (event) => {
    const feature = map.value!.forEachFeatureAtPixel(event.pixel, (f) => f);
    emits('eventSelected', feature ? feature.getId() : null);
  });
});

watch(
  () => props.selectedEventId,
  (id) => {
    vectorLayer.changed();
    flyTo(id);
  }
);

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
