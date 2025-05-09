
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConnectionSettings } from '@/types/radar';

interface ConfigContextType {
  connectionSettings: ConnectionSettings;
  updateConnectionSettings: (settings: ConnectionSettings) => void;
  controllerUrl: string;
  radarUrl: string;
}

// Default values that would be loaded from .env if available
const DEFAULT_HOST = "localhost";
const DEFAULT_CONTROLLER_PORT = 17394;
const DEFAULT_RADAR_PORT = 17396;

const defaultConnectionSettings: ConnectionSettings = {
  host: DEFAULT_HOST,
  controllerPort: DEFAULT_CONTROLLER_PORT,
  radarPort: DEFAULT_RADAR_PORT,
};

const ConfigContext = createContext<ConfigContextType | null>(null);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connectionSettings, setConnectionSettings] = useState<ConnectionSettings>(defaultConnectionSettings);

  // Load initial settings from localStorage if available
  useEffect(() => {
    const savedSettings = localStorage.getItem('antares_connection_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setConnectionSettings(parsedSettings);
      } catch (error) {
        console.error("Failed to parse saved connection settings:", error);
      }
    }
  }, []);

  const updateConnectionSettings = (settings: ConnectionSettings) => {
    setConnectionSettings(settings);
    try {
      localStorage.setItem('antares_connection_settings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save connection settings to localStorage:", error);
    }
  };

  const controllerUrl = `http://${connectionSettings.host}:${connectionSettings.controllerPort}`;
  const radarUrl = `ws://${connectionSettings.host}:${connectionSettings.radarPort}`;

  return (
    <ConfigContext.Provider
      value={{
        connectionSettings,
        updateConnectionSettings,
        controllerUrl,
        radarUrl,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
