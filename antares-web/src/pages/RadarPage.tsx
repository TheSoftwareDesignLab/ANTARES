
import React, { useState } from 'react';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { SettingsModal } from '@/components/SettingsModal';
import { RadarDisplay } from '@/components/RadarDisplay';
import { RadarControls } from '@/components/RadarControls';
import { RadarInfoPanel } from '@/components/RadarInfoPanel';
import { RadarConfig } from '@/types/radar';

const RadarPage: React.FC = () => {
  const [radarConfig, setRadarConfig] = useState<RadarConfig>({
    maxRange: 10_000, // 10km
    rangeRings: 5,
    azimuthLines: 12,
    showSweep: true,
  });

  const handleToggleSweep = (value: boolean) => {
    setRadarConfig(prev => ({
      ...prev,
      showSweep: value,
    }));
  };

  return (
    <ConfigProvider>
      <WebSocketProvider>
        <div className="min-h-screen bg-radar-background text-radar-text p-4">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-radar-target">ANTARES Radar System</h1>
            <SettingsModal />
          </header>

          <main className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <RadarControls
                  showSweep={radarConfig.showSweep}
                  onToggleSweep={handleToggleSweep}
                />

                <div className="mt-4 bg-radar-background border border-radar-grid rounded-lg p-4">
                  <RadarDisplay config={radarConfig} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <RadarInfoPanel />
              </div>
            </div>
          </main>

          <footer className="mt-6 text-center text-xs text-radar-text opacity-70">
            <p>ANTARES • TheSoftwareDesignLab @ Uniandes • ICMT 2025</p>
          </footer>
        </div>
      </WebSocketProvider>
    </ConfigProvider>
  );
};

export default RadarPage;
