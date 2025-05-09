
import React, { createContext, useContext } from 'react';
import { Track, ShipParams, RadarInfo } from '../types/radar';
import { toast } from "sonner";
import { useConfig } from './ConfigContext';
import { useRadarWebSocket } from '../hooks/useRadarWebSocket';
import { useRadarState } from '../hooks/useRadarState';
import { addShip, resetSimulation } from '../api/radarApi';

interface WebSocketContextType {
  tracks: Track[];
  isConnected: boolean;
  isLoading: boolean;
  hasError: boolean;
  connectionAttempts: number;
  maxConnectionAttempts: number;
  addShip: (params: ShipParams) => Promise<void>;
  resetSimulation: () => Promise<void>;
  sweepAngle: number;
  radarInfo: RadarInfo;
  updateMaxRange: (range: number) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { radarUrl, controllerUrl } = useConfig();
  const { tracks, isConnected, sweepAngle, connectionAttempts, maxAttempts } = useRadarWebSocket(radarUrl);
  const { radarInfo, updateMaxRange, isLoading, hasError } = useRadarState(controllerUrl);
  
  const handleAddShip = async (params: ShipParams) => {
    const success = await addShip(controllerUrl, params);
    
    if (success) {
      toast.success("Ship added successfully");
    } else {
      toast.error("Failed to add ship");
    }
  };
  
  const handleResetSimulation = async () => {
    const success = await resetSimulation(controllerUrl);
    
    if (success) {
      toast.success("Simulation reset successfully");
    } else {
      toast.error("Failed to reset simulation");
    }
  };
  
  return (
    <WebSocketContext.Provider
      value={{
        tracks,
        isConnected,
        isLoading,
        hasError,
        connectionAttempts,
        maxConnectionAttempts: maxAttempts,
        addShip: handleAddShip,
        resetSimulation: handleResetSimulation,
        sweepAngle,
        radarInfo,
        updateMaxRange,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
