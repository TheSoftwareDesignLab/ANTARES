
import { Track } from '../types/radar';

/**
 * Parses a CSV line from the radar data stream into a Track object
 * @param csvLine - Raw CSV line from the radar WebSocket
 * @returns Track object or null if parsing fails
 */
export const parseCSVTrack = (csvLine: string): Track | null => {
  try {
    const [
      id, year, month, day, hour, minute, second, millisecond,
      stat, type, name, linemask, size, range, azimuth, lat, long,
      speed, course, quality, l16quality, lacks, winrgw, winazw, stderr
    ] = csvLine.split(',');

    // Create a Date object for the timestamp
    const trackDate = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed in JS
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
      parseInt(millisecond)
    );

    return {
      id,
      range: parseFloat(range),
      azimuth: parseFloat(azimuth) * (180 / Math.PI),
      velocity: {
        speed: parseFloat(speed),
        heading: parseFloat(course) * (180 / Math.PI),
      },
      lat: parseFloat(lat),
      long: parseFloat(long),
      timestamp: trackDate.getTime(),
      quality: parseInt(quality),
      type,
      name: name || undefined,
      size: size ? parseFloat(size) : undefined
    };
  } catch (error) {
    console.error("Failed to parse CSV track data:", error, csvLine);
    return null;
  }
};
