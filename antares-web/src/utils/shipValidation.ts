
import { ShipParams } from '../types/radar';

/**
 * Validates ship parameters for different ship types
 * @param params - The ship parameters to validate
 * @returns An object containing validation result and error messages
 */
export const validateShipParams = (params: ShipParams): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  // Validate common parameters
  if (params.initial_position.range <= 0) {
    errors.range = 'Range must be greater than 0';
  }

  if (params.initial_position.azimuth < 0 || params.initial_position.azimuth > 360) {
    errors.azimuth = 'Azimuth must be between 0 and 360 degrees';
  }

  // Type-specific validation
  switch (params.type) {
    case 'LineShip':
      if (!params.speed || params.speed <= 0) {
        errors.speed = 'Speed must be greater than 0';
      }
      if (params.angle === undefined || params.angle < 0 || params.angle > 360) {
        errors.angle = 'Angle must be between 0 and 360 degrees';
      }
      break;

    case 'CircleShip':
      if (!params.speed || params.speed <= 0) {
        errors.speed = 'Speed must be greater than 0';
      }
      if (!params.radius || params.radius <= 0) {
        errors.radius = 'Radius must be greater than 0';
      }
      break;

    case 'RandomShip':
      if (!params.max_speed || params.max_speed <= 0) {
        errors.maxSpeed = 'Maximum speed must be greater than 0';
      }
      break;

    case 'StationaryShip':
      // No specific validation for stationary ships
      break;

    default:
      errors.type = 'Invalid ship type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
