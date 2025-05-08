
import React from 'react';
import { Track } from '@/types/radar';

interface TrackInfoProps {
  track: Track;
  className?: string;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track, className }) => {
  return (
    <div className={className}>
      <h3 className="text-radar-target mb-1 uppercase font-bold">Track Info</h3>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between gap-3">
          <span>ID:</span>
          <span className="text-radar-target">{track.id}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Range:</span>
          <span className="text-radar-target">{(track.range / 1000).toFixed(1)}km</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Azimuth:</span>
          <span className="text-radar-target">{track.azimuth.toFixed(1)}°</span>
        </div>
        {track.velocity && (
          <>
            <div className="flex justify-between gap-3">
              <span>Speed:</span>
              <span className="text-radar-target">{track.velocity.speed.toFixed(1)} m/s</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Heading:</span>
              <span className="text-radar-target">{track.velocity.heading.toFixed(1)}°</span>
            </div>
          </>
        )}
        {track.type && (
          <div className="flex justify-between gap-3">
            <span>Type:</span>
            <span className="text-radar-target">{track.type}</span>
          </div>
        )}
        {track.name && (
          <div className="flex justify-between gap-3">
            <span>Name:</span>
            <span className="text-radar-target">{track.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
