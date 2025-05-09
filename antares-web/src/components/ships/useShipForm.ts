
import { useState, useEffect } from 'react';
import { ShipType, ShipParams } from '@/types/radar';
import { validateShipParams } from '@/utils/shipValidation';

export const useShipForm = (isOpen: boolean) => {
  const [shipType, setShipType] = useState<ShipType>('LineShip');
  const [range, setRange] = useState(5000); // 5km
  const [azimuth, setAzimuth] = useState(180);
  const [speed, setSpeed] = useState(10); // 10 m/s
  const [angle, setAngle] = useState(90); // 90 degrees
  const [radius, setRadius] = useState(2000); // 2km
  const [maxSpeed, setMaxSpeed] = useState(15); // 15 m/s
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when it opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Create ship parameters object
  const createShipParams = (): ShipParams => {
    const baseParams: ShipParams = {
      initial_position: {
        range,
        azimuth,
      },
      type: shipType,
    };

    // Add type-specific parameters
    switch (shipType) {
      case 'LineShip':
        return {
          ...baseParams,
          speed,
          angle,
        };
      case 'CircleShip':
        return {
          ...baseParams,
          speed,
          radius,
        };
      case 'RandomShip':
        return {
          ...baseParams,
          max_speed: maxSpeed,
        };
      case 'StationaryShip':
        return baseParams;
      default:
        return baseParams;
    }
  };

  const validateForm = (): boolean => {
    const shipParams = createShipParams();
    const validation = validateShipParams(shipParams);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return false;
    }

    setErrors({});
    return true;
  };

  // Set default parameters based on ship type
  const handleShipTypeChange = (value: string) => {
    const newType = value as ShipType;
    setShipType(newType);
    setErrors({});

    // Set sensible defaults based on ship type
    switch (newType) {
      case 'LineShip':
        setSpeed(10);
        setAngle(90);
        break;
      case 'CircleShip':
        setSpeed(5);
        setRadius(2000);
        break;
      case 'RandomShip':
        setMaxSpeed(15);
        break;
      case 'StationaryShip':
        // No need to set anything for stationary ship
        break;
    }
  };

  return {
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
  };
};
