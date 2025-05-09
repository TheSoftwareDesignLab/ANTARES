
import { Track, RadarInfo } from '../types/radar';

/**
 * Converts polar coordinates (range, azimuth) to Cartesian coordinates (x, y) for display
 * @param range - Distance from center point in meters
 * @param azimuth - Angle in degrees
 * @param maxRange - Maximum radar range in meters
 * @param centerX - X coordinate of the radar center
 * @param centerY - Y coordinate of the radar center
 * @param radius - Radius of the radar display in pixels
 * @returns Object with x and y coordinates
 */
export const polarToCartesian = (
  range: number,
  azimuth: number,
  maxRange: number,
  centerX: number,
  centerY: number,
  radius: number
): { x: number; y: number } => {
  // Convert range to relative distance (0-1) based on maxRange
  const distance = (range / maxRange) * radius;
  // Convert azimuth to radians
  const angle = (azimuth * Math.PI) / 180;
  
  // Calculate x and y
  const x = centerX + distance * Math.sin(angle);
  const y = centerY - distance * Math.cos(angle);
  
  return { x, y };
};

/**
 * Finds a track at the given coordinates
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param tracks - Array of tracks
 * @param radarInfo - Radar information
 * @param centerX - X coordinate of the radar center
 * @param centerY - Y coordinate of the radar center
 * @param radius - Radius of the radar display in pixels
 * @param clickRadius - Radius around the track to consider a click (in pixels)
 * @returns The track at the coordinates or null if none found
 */
export const findTrackAtCoordinates = (
  x: number,
  y: number,
  tracks: Track[],
  radarInfo: RadarInfo,
  centerX: number,
  centerY: number,
  radius: number,
  clickRadius: number = 10
): Track | null => {
  return tracks.find(track => {
    const trackPos = polarToCartesian(
      track.range,
      track.azimuth,
      radarInfo.operationalRange,
      centerX,
      centerY,
      radius
    );
    
    const dx = x - trackPos.x;
    const dy = y - trackPos.y;
    const clickDistance = Math.sqrt(dx * dx + dy * dy);
    
    return clickDistance <= clickRadius;
  }) || null;
};

/**
 * Formats a coordinate pair as a string
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns Formatted string representation
 */
export const formatCoordinates = (lat: number, lon: number): string => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
};
