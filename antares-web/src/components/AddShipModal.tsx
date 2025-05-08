
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Ship } from "lucide-react";
import { ShipTypeSelect } from './ships/ShipTypeSelect';
import { InitialPositionInputs } from './ships/InitialPositionInputs';
import { ShipSpecificInputs } from './ships/ShipSpecificInputs';
import { useShipForm } from './ships/useShipForm';

interface AddShipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddShipModal: React.FC<AddShipModalProps> = ({ open, onOpenChange }) => {
  const { addShip, radarInfo } = useWebSocket();
  const {
    shipType,
    range,
    azimuth,
    speed,
    angle,
    radius,
    maxSpeed,
    errors,
    isSubmitting,
    setRange,
    setAzimuth,
    setSpeed,
    setAngle,
    setRadius,
    setMaxSpeed,
    setIsSubmitting,
    handleShipTypeChange,
    createShipParams,
    validateForm
  } = useShipForm(open);
  
  const handleAddShip = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addShip(createShipParams());
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding ship:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-radar-background border-radar-grid text-radar-text">
        <DialogHeader>
          <DialogTitle className="text-radar-target flex items-center gap-2">
            <Ship className="h-5 w-5" />
            Add New Ship
          </DialogTitle>
          <DialogDescription className="text-radar-text opacity-70">
            Configure parameters for the new ship
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Ship Type Selection */}
          <ShipTypeSelect 
            value={shipType}
            onChange={handleShipTypeChange}
            disabled={isSubmitting}
          />
          
          {/* Initial Position */}
          <InitialPositionInputs 
            range={range}
            azimuth={azimuth}
            onRangeChange={setRange}
            onAzimuthChange={setAzimuth}
            errors={errors}
            disabled={isSubmitting}
            maxRange={radarInfo.operationalRange}
          />
          
          {/* Ship-specific parameters */}
          <ShipSpecificInputs 
            shipType={shipType}
            speed={speed}
            angle={angle}
            radius={radius}
            maxSpeed={maxSpeed}
            onSpeedChange={setSpeed}
            onAngleChange={setAngle}
            onRadiusChange={setRadius}
            onMaxSpeedChange={setMaxSpeed}
            errors={errors}
            disabled={isSubmitting}
          />
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-radar-text border-radar-grid hover:bg-radar-grid hover:text-radar-target"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleAddShip}
            className="bg-radar-target text-radar-background hover:bg-radar-target-highlight"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Ship'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
