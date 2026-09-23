export const getlonAndLatFromEvent = (event: any): [number, number] | null => {
  if (!event?.geometry?.coordinates) return null;

  if (event.geometry.type == 'Point') {
    return [event.geometry.coordinates[0], event.geometry.coordinates[1]];
  }

  if (
    event.geometry.type == 'Polygon' ||
    event.geometry.type == 'MultiPolygon' ||
    event.geometry.type == 'LineString' ||
    event.geometry.type == 'MultiLineString'
  ) {
    let sumX = 0;
    let sumY = 0;
    let flatCoordinates = event.geometry.coordinates;
    while (typeof flatCoordinates[0][0] !== 'number') {
      flatCoordinates = flatCoordinates[0];
    }
    for (const coordinate of flatCoordinates) {
      sumX += coordinate[0];
      sumY += coordinate[1];
    }
    return [sumX / flatCoordinates.length, sumY / flatCoordinates.length];
  }
  return null;
};
