
import { ShipParams, RadarState } from '../types/radar';

/**
 * Base function to handle API requests with consistent error handling
 * @param url - The URL to fetch
 * @param options - Fetch options
 * @returns Promise that resolves to the response data or null if there's an error
 */
async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response | null> {
  try {
    return await fetch(url, options);
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}

/**
 * Sends a request to add a ship to the radar simulation
 * @param controllerUrl - The URL of the controller API
 * @param params - The parameters for the ship to add
 * @returns Promise that resolves when the ship is added
 */
export const addShip = async (controllerUrl: string, params: ShipParams): Promise<boolean> => {
  const typeToString = (type: ShipParams['type']): string => {
    switch (type) {
      case 'CircleShip':
        return 'circle';
      case 'LineShip':
        return 'line';
      case 'RandomShip':
        return 'random';
      case 'StationaryShip':
        return 'stationary';
      default:
        throw new Error(`Unknown ship type: ${type}`);
    }
  };

  const response = await fetchWithErrorHandling(
    `${controllerUrl}/simulation/ships`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        type: typeToString(params.type),
        initial_position: [
          params.initial_position.range * Math.cos((params.initial_position.azimuth * Math.PI) / 180),
          params.initial_position.range * Math.sin((params.initial_position.azimuth * Math.PI) / 180),
        ],
        angle: params.angle ? (params.angle * Math.PI) / 180 : undefined,
      }),
    }
  );

  return response.ok;
};

/**
 * Sends a request to reset the radar simulation
 * @param controllerUrl - The URL of the controller API
 * @returns Promise that resolves when the simulation is reset
 */
export const resetSimulation = async (controllerUrl: string): Promise<boolean> => {
  const response = await fetchWithErrorHandling(
    `${controllerUrl}/simulation/reset`,
    { method: 'POST' }
  );

  return response.ok;
};

/**
 * Fetches the current radar state from the controller API
 * @param controllerUrl - The URL of the controller API
 * @returns Promise that resolves to the radar state data
 */
export const fetchRadarState = async (controllerUrl: string): Promise<RadarState | null> => {
  const response = await fetchWithErrorHandling(`${controllerUrl}/simulation/config`).then(res => res.json());

  if (!response || !response.antares?.radar?.detector) {
    return null;
  }

  return response.antares.radar.detector as RadarState;
};