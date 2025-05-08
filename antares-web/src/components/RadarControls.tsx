
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Ship, Sliders, ArrowUp } from "lucide-react";
import { AddShipModal } from './AddShipModal';

interface RadarControlsProps {
  showSweep: boolean;
  onToggleSweep: (value: boolean) => void;
}

export const RadarControls: React.FC<RadarControlsProps> = ({ 
  showSweep, 
  onToggleSweep 
}) => {
  const { 
    resetSimulation, 
    isConnected, 
    updateMaxRange, 
    radarInfo, 
    connectionAttempts, 
    maxConnectionAttempts 
  } = useWebSocket();
  
  const [rangeValue, setRangeValue] = React.useState(radarInfo.operationalRange / 1000);
  const [showAddShipModal, setShowAddShipModal] = React.useState(false);
  
  const handleRangeChange = (value: number[]) => {
    const newRange = value[0];
    setRangeValue(newRange);
    updateMaxRange(newRange);
  };
  
  const rangeOptions = [5, 10, 20, 50, 100]; // km
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-radar-background border border-radar-grid rounded-lg">
        <div className="flex items-center space-x-4">
          <Switch 
            id="sweep-mode" 
            checked={showSweep}
            onCheckedChange={onToggleSweep}
            className="data-[state=checked]:bg-radar-target"
          />
          <Label htmlFor="sweep-mode" className="uppercase text-sm">Radar Sweep</Label>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-green-400 animate-pulse" : 
                  connectionAttempts >= maxConnectionAttempts ? "bg-red-400" : "bg-yellow-400 animate-pulse"
              )}
            ></div>
            <span className="text-xs uppercase">
              {isConnected ? "Connected" : 
                connectionAttempts >= maxConnectionAttempts ? "Failed" : `Connecting (${connectionAttempts}/${maxConnectionAttempts})`}
            </span>
          </div>
          
          <Button 
            onClick={() => setShowAddShipModal(true)} 
            variant="outline" 
            className="text-radar-text border-radar-grid hover:bg-radar-grid hover:text-radar-target"
            disabled={!isConnected}
          >
            <Ship className="mr-1 h-4 w-4" />
            ADD SHIP
          </Button>
          
          <Button 
            onClick={resetSimulation} 
            variant="outline" 
            className="text-radar-text border-radar-grid hover:bg-radar-grid hover:text-radar-target"
            disabled={!isConnected}
          >
            <Sliders className="mr-1 h-4 w-4" />
            RESET
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-radar-background border border-radar-grid rounded-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase">Range ({rangeValue} km)</Label>
            <div className="flex gap-2">
              {rangeOptions.map((option) => (
                <Button
                  key={option}
                  variant={rangeValue === option ? "default" : "outline"}
                  className={cn(
                    "h-6 text-xs px-2 py-0",
                    rangeValue === option 
                      ? "bg-radar-target text-radar-background" 
                      : "text-radar-text border-radar-grid hover:bg-radar-grid hover:text-radar-target"
                  )}
                  onClick={() => {
                    setRangeValue(option);
                    updateMaxRange(option);
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <Slider
            value={[rangeValue]}
            min={5}
            max={100}
            step={5}
            onValueChange={handleRangeChange}
            className="w-full"
          />
        </div>
      </div>
      
      <AddShipModal 
        open={showAddShipModal} 
        onOpenChange={setShowAddShipModal} 
      />
    </div>
  );
};
