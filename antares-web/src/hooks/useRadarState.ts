
import { useState, useEffect, useRef } from 'react';
import { RadarInfo, RadarState } from '../types/radar';
import { toast } from 'sonner';
import { fetchRadarState } from '../api/radarApi';

// Default values in case API fails
const defaultRadarInfo: RadarInfo = {
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
  heading: 0,
  ownSpeed: 0,
  operationalRange: 10_000, // 10km default
};

/**
 * Custom hook to manage radar state information
 * @returns Object containing radar info and update methods
 */
export const useRadarState = (controllerUrl: string) => {
  const [radarInfo, setRadarInfo] = useState<RadarInfo>(defaultRadarInfo);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const failedAttemptsRef = useRef(0);

  // Convert radians to degrees
  const radiansToDegrees = (radians: number): number => {
    return radians * (180 / Math.PI);
  };

  // Fetch radar state from API
  useEffect(() => {
    let isMounted = true;
    const MAX_RETRY_COUNT = 3;

    const fetchRadarData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchRadarState(controllerUrl);

        if (!isMounted) return;

        if (data) {
          setRadarInfo({
            coordinates: {
              latitude: data.start_coordinates[0],
              longitude: data.start_coordinates[1],
            },
            heading: radiansToDegrees(data.angle),
            ownSpeed: data.speed,
            operationalRange: radarInfo.operationalRange, // Keep the operational range as is
          });
          setHasError(false);
          failedAttemptsRef.current = 0;
        } else {
          failedAttemptsRef.current += 1;

          if (failedAttemptsRef.current >= MAX_RETRY_COUNT) {
            setHasError(true);
            toast.error("Failed to connect to radar controller");
          }
        }
      } catch (error) {
        if (!isMounted) return;

        console.error("Error in useRadarState:", error);
        failedAttemptsRef.current += 1;

        if (failedAttemptsRef.current >= MAX_RETRY_COUNT) {
          setHasError(true);
          toast.error("Failed to connect to radar controller");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchRadarData();

    // Clean up
    return () => {
      isMounted = false;
    };
  }, [controllerUrl]);

  const updateMaxRange = (range: number) => {
    setRadarInfo(prevInfo => ({
      ...prevInfo,
      operationalRange: range * 1000 // Convert km to meters
    }));

    toast.info(`Radar range set to ${range} km`);
  };

  return {
    radarInfo,
    isLoading,
    hasError,
    updateMaxRange
  };
};
