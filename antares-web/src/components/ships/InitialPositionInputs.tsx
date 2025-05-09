
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InitialPositionInputsProps {
  range: number;
  azimuth: number;
  onRangeChange: (value: number) => void;
  onAzimuthChange: (value: number) => void;
  errors: Record<string, string>;
  disabled?: boolean;
  maxRange?: number;
}

export const InitialPositionInputs: React.FC<InitialPositionInputsProps> = ({ 
  range, 
  azimuth, 
  onRangeChange, 
  onAzimuthChange,
  errors,
  disabled = false,
  maxRange = 10000
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="range" className={cn("text-right", errors.range && "text-red-500")}>
          Range (m)
        </Label>
        <div className="col-span-3">
          <Input
            id="range"
            type="number"
            value={range}
            onChange={(e) => onRangeChange(Number(e.target.value))}
            min={0}
            max={maxRange}
            className={cn(
              "bg-radar-background border-radar-grid text-radar-text",
              errors.range && "border-red-500"
            )}
            disabled={disabled}
          />
          {errors.range && (
            <p className="text-xs text-red-500 mt-1">{errors.range}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="azimuth" className={cn("text-right", errors.azimuth && "text-red-500")}>
          Azimuth (°)
        </Label>
        <div className="col-span-3">
          <Input
            id="azimuth"
            type="number"
            value={azimuth}
            onChange={(e) => onAzimuthChange(Number(e.target.value))}
            min={0}
            max={360}
            className={cn(
              "bg-radar-background border-radar-grid text-radar-text",
              errors.azimuth && "border-red-500"
            )}
            disabled={disabled}
          />
          {errors.azimuth && (
            <p className="text-xs text-red-500 mt-1">{errors.azimuth}</p>
          )}
        </div>
      </div>
    </>
  );
};
