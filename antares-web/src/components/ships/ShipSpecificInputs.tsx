
import React from 'react';
import { ShipType } from '@/types/radar';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ShipSpecificInputsProps {
  shipType: ShipType;
  speed: number;
  angle: number;
  radius: number;
  maxSpeed: number;
  onSpeedChange: (value: number) => void;
  onAngleChange: (value: number) => void;
  onRadiusChange: (value: number) => void;
  onMaxSpeedChange: (value: number) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export const ShipSpecificInputs: React.FC<ShipSpecificInputsProps> = ({
  shipType,
  speed,
  angle,
  radius,
  maxSpeed,
  onSpeedChange,
  onAngleChange,
  onRadiusChange,
  onMaxSpeedChange,
  errors,
  disabled = false,
}) => {
  if (shipType === 'StationaryShip') {
    return null;
  }

  return (
    <>
      {(shipType === 'LineShip' || shipType === 'CircleShip') && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="speed" className={cn("text-right", errors.speed && "text-red-500")}>
            Speed (m/s)
          </Label>
          <div className="col-span-3">
            <Input
              id="speed"
              type="number"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              min={0}
              className={cn(
                "bg-radar-background border-radar-grid text-radar-text",
                errors.speed && "border-red-500"
              )}
              disabled={disabled}
            />
            {errors.speed && (
              <p className="text-xs text-red-500 mt-1">{errors.speed}</p>
            )}
          </div>
        </div>
      )}

      {shipType === 'LineShip' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="angle" className={cn("text-right", errors.angle && "text-red-500")}>
            Angle (°)
          </Label>
          <div className="col-span-3">
            <Input
              id="angle"
              type="number"
              value={angle}
              onChange={(e) => onAngleChange(Number(e.target.value))}
              min={0}
              max={360}
              className={cn(
                "bg-radar-background border-radar-grid text-radar-text",
                errors.angle && "border-red-500"
              )}
              disabled={disabled}
            />
            {errors.angle && (
              <p className="text-xs text-red-500 mt-1">{errors.angle}</p>
            )}
          </div>
        </div>
      )}

      {shipType === 'CircleShip' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="radius" className={cn("text-right", errors.radius && "text-red-500")}>
            Radius (m)
          </Label>
          <div className="col-span-3">
            <Input
              id="radius"
              type="number"
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              min={100}
              className={cn(
                "bg-radar-background border-radar-grid text-radar-text",
                errors.radius && "border-red-500"
              )}
              disabled={disabled}
            />
            {errors.radius && (
              <p className="text-xs text-red-500 mt-1">{errors.radius}</p>
            )}
          </div>
        </div>
      )}

      {shipType === 'RandomShip' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="maxSpeed" className={cn("text-right", errors.maxSpeed && "text-red-500")}>
            Max Speed (m/s)
          </Label>
          <div className="col-span-3">
            <Input
              id="maxSpeed"
              type="number"
              value={maxSpeed}
              onChange={(e) => onMaxSpeedChange(Number(e.target.value))}
              min={0}
              className={cn(
                "bg-radar-background border-radar-grid text-radar-text",
                errors.maxSpeed && "border-red-500"
              )}
              disabled={disabled}
            />
            {errors.maxSpeed && (
              <p className="text-xs text-red-500 mt-1">{errors.maxSpeed}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
