export const camelCaseToName = (value: string): string => {
  if (!value) return '';

  const words: string[] = [];
  let left = 0;

  for (let right = 1; right < value.length; right++) {
    const isUppercase = value[right] !== value[right].toLowerCase();

    if (isUppercase) {
      const word = value.slice(left, right);
      words.push(word[0].toUpperCase() + word.slice(1));
      left = right;
    }
  }

  const lastWord = value.slice(left);
  words.push(lastWord[0].toUpperCase() + lastWord.slice(1));
  return words.join(' ');
};

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

