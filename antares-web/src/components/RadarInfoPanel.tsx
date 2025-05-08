
import React from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation2, Gauge, Compass } from 'lucide-react';
import { formatCoordinates } from '@/utils/radarUtils';
import { Skeleton } from '@/components/ui/skeleton';

export const RadarInfoPanel: React.FC = () => {
  const { radarInfo, isLoading, hasError, isConnected } = useWebSocket();
  
  // Render error state
  if (hasError) {
    return (
      <Card className="bg-radar-background border border-radar-grid text-radar-text">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-red-500 flex items-center gap-2">
            <Navigation2 size={16} className="text-red-500" />
            CONNECTION ERROR
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-red-500">
            Unable to connect to the radar controller.
            Please check your connection settings.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Render loading state
  if (isLoading && !isConnected) {
    return (
      <Card className="bg-radar-background border border-radar-grid text-radar-text">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-mono text-radar-grid flex items-center gap-2">
            <Navigation2 size={16} className="text-radar-grid" />
            RADAR INFO
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-1">
            <Skeleton className="h-4 w-20 bg-radar-grid/30" />
            <Skeleton className="h-4 w-24 bg-radar-grid/30" />
            <Skeleton className="h-4 w-20 bg-radar-grid/30" />
            <Skeleton className="h-4 w-24 bg-radar-grid/30" />
            <Skeleton className="h-4 w-20 bg-radar-grid/30" />
            <Skeleton className="h-4 w-24 bg-radar-grid/30" />
            <Skeleton className="h-4 w-20 bg-radar-grid/30" />
            <Skeleton className="h-4 w-24 bg-radar-grid/30" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render data state
  return (
    <Card className="bg-radar-background border border-radar-grid text-radar-text">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono text-radar-target flex items-center gap-2">
          <Navigation2 size={16} className="text-radar-target" />
          RADAR INFO
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="font-mono flex items-center">
            <Compass size={14} className="mr-1 text-radar-grid" />
            Coordinates:
          </div>
          <div className="text-radar-target">
            {formatCoordinates(radarInfo.coordinates.latitude, radarInfo.coordinates.longitude)}
          </div>
          
          <div className="font-mono flex items-center">
            <Navigation2 size={14} className="mr-1 text-radar-grid" />
            Heading:
          </div>
          <div className="text-radar-target">{radarInfo.heading.toFixed(1)}°</div>
          
          <div className="font-mono flex items-center">
            <Gauge size={14} className="mr-1 text-radar-grid" />
            Speed:
          </div>
          <div className="text-radar-target">{radarInfo.ownSpeed.toFixed(1)} m/s</div>
          
          <div className="font-mono flex items-center">
            <Compass size={14} className="mr-1 text-radar-grid" />
            Range:
          </div>
          <div className="text-radar-target">{(radarInfo.operationalRange / 1000).toFixed(1)} km</div>
        </div>
      </CardContent>
    </Card>
  );
};
