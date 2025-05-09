
export interface Track {
  id: string;
  range: number; // In meters
  azimuth: number; // In degrees
  velocity?: {
    speed: number; // In m/s
    heading: number; // In degrees
  };
  lat?: number;
  long?: number;
  timestamp?: number;
  quality?: number;
  type?: string;
  name?: string;
  size?: number;
}

export interface WebSocketMessage {
  type: 'track_update';
  data: Track[];
}

export interface ConnectionSettings {
  host: string;
  controllerPort: number;
  radarPort: number;
}

export interface RadarConfig {
  maxRange: number; // Maximum range in meters
  rangeRings: number; // Number of range rings to display
  azimuthLines: number; // Number of azimuth lines to display
  showSweep: boolean; // Whether to show the radar sweep animation
}

export interface RadarInfo {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  heading: number; // In degrees
  ownSpeed: number; // In meters per second
  operationalRange: number; // In meters (synced with maxRange in config)
}

export interface RadarState {
  range: number;         // Radar detection range in meters
  speed: number;         // Current speed of the radar platform (in m/s)
  angle: number;         // Current orientation/heading in radians
  start_coordinates: [number, number]; // Latitude and longitude of radar's initial position
}

export interface ShipParams {
  initial_position: {
    range: number; // In meters
    azimuth: number; // In degrees
  };
  type: ShipType;
  speed?: number; // In meters per second
  angle?: number; // In degrees
  radius?: number; // For circular motion, in meters
  max_speed?: number; // For random ships, in meters per second
}

export type ShipType = 'LineShip' | 'CircleShip' | 'RandomShip' | 'StationaryShip';
