
import React from 'react';
import { ShipType } from '@/types/radar';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ShipTypeSelectProps {
  value: ShipType;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const ShipTypeSelect: React.FC<ShipTypeSelectProps> = ({ value, onChange, disabled = false }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="ship-type" className="text-right">
        Ship Type
      </Label>
      <div className="col-span-3">
        <Select 
          value={value} 
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-radar-background border-radar-grid text-radar-text">
            <SelectValue placeholder="Select ship type" />
          </SelectTrigger>
          <SelectContent className="bg-radar-background border-radar-grid text-radar-text">
            <SelectGroup>
              <SelectLabel className="text-radar-target">Ship Types</SelectLabel>
              <SelectItem value="LineShip">Linear Motion</SelectItem>
              <SelectItem value="CircleShip">Circular Motion</SelectItem>
              <SelectItem value="RandomShip">Random Motion</SelectItem>
              <SelectItem value="StationaryShip">Stationary</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
