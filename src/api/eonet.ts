import axios from 'axios';

const API_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events/geojson';

type EventStatus = 'open' | 'closed' | 'all';

export const fetchNaturalEvents = async (
  eventStatus: EventStatus = 'open',
  limit: number = 20,
  days: number = 30
): Promise<any> => {
  const response = await axios.get(`${API_URL}`, {
    params: { status: eventStatus, limit, days },
  });
  return response.data;
};
