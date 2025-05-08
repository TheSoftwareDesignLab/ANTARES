
import { useState, useEffect, useRef } from 'react';
import { parseCSVTrack } from '../utils/radarDataParser';
import { Track } from '../types/radar';
import { toast } from 'sonner';

// Constants for WebSocket connection management
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * Custom hook to manage WebSocket connection to the radar data stream
 * @param radarUrl - The URL of the radar WebSocket
 * @returns Object containing tracks data and connection status
 */
export const useRadarWebSocket = (radarUrl: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  const wsRef = useRef<WebSocket | null>(null);
  const sweepIntervalRef = useRef<number | null>(null);
  const tracksRef = useRef<Map<string, Track>>(new Map());
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // Effect to handle WebSocket connection
  useEffect(() => {
    let isMounted = true;
    
    const connectWebSocket = () => {
      // Clear any existing connection
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      if (!isMounted) return;
      
      try {
        console.log(`Connecting to WebSocket at ${radarUrl} (attempt ${connectionAttempts + 1})`);
        const ws = new WebSocket(radarUrl);
        
        ws.onopen = () => {
          if (!isMounted) return;
          
          setIsConnected(true);
          setConnectionAttempts(0);
          toast.success("Connected to radar data stream");
          
          // Set up the radar sweep animation
          if (!sweepIntervalRef.current) {
            sweepIntervalRef.current = window.setInterval(() => {
              setSweepAngle(prevAngle => (prevAngle + 1) % 360);
            }, 1000 / 30); // Update at 30fps for smoother animation
          }
        };
        
        ws.onclose = (event) => {
          if (!isMounted) return;
          
          setIsConnected(false);
          
          // Don't show a message if it's a normal closure
          if (event.code !== 1000) {
            toast.error("Disconnected from radar data stream");
          }
          
          // Try to reconnect with backoff
          if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
            const nextAttempt = connectionAttempts + 1;
            setConnectionAttempts(nextAttempt);
            
            // Clear any existing timeout
            if (reconnectTimeoutRef.current) {
              window.clearTimeout(reconnectTimeoutRef.current);
            }
            
            // Set timeout for reconnection
            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (isMounted) {
                connectWebSocket();
              }
            }, RECONNECT_INTERVAL * Math.min(nextAttempt, 3)); // Backoff strategy
          } else {
            toast.error("Maximum reconnection attempts reached");
          }
        };
        
        ws.onerror = (error) => {
          if (!isMounted) return;
          console.error("WebSocket error:", error);
        };
        
        ws.onmessage = (event) => {
          try {
            // Split the CSV data by lines
            const lines = event.data.trim().split('\n');
            
            // Process each line
            const updatedTracks = new Map(tracksRef.current);
            let hasUpdates = false;
            
            lines.forEach(line => {
              if (!line.trim()) return; // Skip empty lines
              
              const track = parseCSVTrack(line);
              if (track) {
                // Update the track in our map
                updatedTracks.set(track.id, track);
                hasUpdates = true;
              }
            });
            
            if (hasUpdates && isMounted) {
              // Update the tracks ref
              tracksRef.current = updatedTracks;
              
              // Update the state with an array of tracks
              setTracks(Array.from(updatedTracks.values()));
            }
          } catch (error) {
            console.error("Error processing WebSocket message:", error);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        if (!isMounted) return;
        
        console.error("Error creating WebSocket connection:", error);
        
        // Try to reconnect with backoff
        if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
          const nextAttempt = connectionAttempts + 1;
          setConnectionAttempts(nextAttempt);
          
          if (reconnectTimeoutRef.current) {
            window.clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (isMounted) {
              connectWebSocket();
            }
          }, RECONNECT_INTERVAL * Math.min(nextAttempt, 3)); // Backoff strategy
        } else {
          toast.error("Maximum reconnection attempts reached");
        }
      }
    };
    
    // Initialize connection
    connectWebSocket();
    
    // Cleanup function
    return () => {
      isMounted = false;
      
      if (sweepIntervalRef.current) {
        clearInterval(sweepIntervalRef.current);
        sweepIntervalRef.current = null;
      }
      
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [radarUrl, connectionAttempts]);
  
  return {
    tracks,
    isConnected,
    sweepAngle,
    connectionAttempts,
    maxAttempts: MAX_RECONNECT_ATTEMPTS
  };
};
