
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useConfig } from '@/contexts/ConfigContext';
import { ConnectionSettings } from '@/types/radar';

export const SettingsModal: React.FC = () => {
  const { connectionSettings, updateConnectionSettings } = useConfig();
  const [host, setHost] = useState(connectionSettings.host);
  const [controllerPort, setControllerPort] = useState(connectionSettings.controllerPort);
  const [radarPort, setRadarPort] = useState(connectionSettings.radarPort);
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    const settings: ConnectionSettings = {
      host,
      controllerPort: Number(controllerPort),
      radarPort: Number(radarPort),
    };
    updateConnectionSettings(settings);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-radar-background border-radar-grid hover:bg-radar-grid hover:text-radar-target"
        >
          <Settings className="h-5 w-5 text-radar-text" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-radar-background border-radar-grid">
        <DialogHeader>
          <DialogTitle className="text-radar-target uppercase">ANTARES Connection Settings</DialogTitle>
          <DialogDescription className="text-radar-text">
            Configure connection parameters for the ANTARES radar system
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="host" className="text-right uppercase text-radar-text">
              Host
            </Label>
            <Input
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="col-span-3 bg-radar-background border-radar-grid text-radar-text"
              placeholder="localhost or IP address"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="controllerPort" className="text-right uppercase text-radar-text">
              Controller Port
            </Label>
            <Input
              id="controllerPort"
              type="number"
              value={controllerPort}
              onChange={(e) => setControllerPort(parseInt(e.target.value) || 0)}
              className="col-span-3 bg-radar-background border-radar-grid text-radar-text"
              placeholder="17394"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="radarPort" className="text-right uppercase text-radar-text">
              Radar Port
            </Label>
            <Input
              id="radarPort"
              type="number"
              value={radarPort}
              onChange={(e) => setRadarPort(parseInt(e.target.value) || 0)}
              className="col-span-3 bg-radar-background border-radar-grid text-radar-text"
              placeholder="17396"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSave}
            className="bg-radar-target text-radar-background hover:bg-radar-highlight"
          >
            SAVE CHANGES
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
