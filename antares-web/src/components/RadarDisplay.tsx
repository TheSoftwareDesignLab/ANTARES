
import React, { useRef, useEffect, useState } from 'react';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Track, RadarConfig } from '@/types/radar';
import { cn } from '@/lib/utils';
import { polarToCartesian, findTrackAtCoordinates } from '@/utils/radarUtils';
import { TrackInfo } from '@/components/TrackInfo';

interface RadarDisplayProps {
  config: RadarConfig;
}

export const RadarDisplay: React.FC<RadarDisplayProps> = ({ config }) => {
  const { tracks, sweepAngle, radarInfo } = useWebSocket();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number } | null>(null);

  const drawRadar = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get the canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate the radius of the radar
    const radius = Math.min(centerX, centerY) * 0.9;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw radar background elements
    drawRadarBackground(ctx, centerX, centerY, radius);

    // Draw tracks
    drawTracks(ctx, centerX, centerY, radius);

    // Draw sweep line if enabled
    if (config.showSweep) {
      drawSweepLine(ctx, centerX, centerY, radius);
    }
  };

  const drawRadarBackground = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    // Set up the drawing styles
    ctx.strokeStyle = '#1f2833'; // Grid color
    ctx.lineWidth = 1;

    // Draw range rings
    for (let i = 1; i <= config.rangeRings; i++) {
      const ringRadius = (radius / config.rangeRings) * i;

      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Add range labels
      const rangeValue = Math.round((radarInfo.operationalRange / config.rangeRings) * i / 1000);
      ctx.fillStyle = '#c5c6c7';
      ctx.font = '12px "Roboto Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${rangeValue}km`, centerX + ringRadius * 0.9, centerY - 5);
    }

    // Draw azimuth lines
    for (let i = 0; i < config.azimuthLines; i++) {
      const angle = (Math.PI * 2 * i) / config.azimuthLines;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + radius * Math.sin(angle),
        centerY - radius * Math.cos(angle)
      );
      ctx.stroke();

      // Add azimuth labels
      const azimuthValue = Math.round((360 / config.azimuthLines) * i);
      const labelRadius = radius + 20;
      ctx.fillStyle = '#c5c6c7';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${azimuthValue}°`,
        centerX + labelRadius * Math.sin(angle),
        centerY - labelRadius * Math.cos(angle)
      );
    }
  };

  const drawTracks = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    tracks.forEach(track => {
      const { x, y } = polarToCartesian(
        track.range,
        track.azimuth,
        radarInfo.operationalRange,
        centerX,
        centerY,
        radius
      );

      // Draw track
      ctx.beginPath();
      ctx.fillStyle = track.id === selectedTrack?.id ? '#45a29e' : '#66fcf1';
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw track ID
      ctx.fillStyle = '#c5c6c7';
      ctx.font = '12px "Roboto Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(track.id, x + 10, y);

      // Draw velocity vector if available
      if (track.velocity) {
        drawVelocityVector(ctx, x, y, track.velocity.speed, track.velocity.heading);

        // Draw speed label
        ctx.fillStyle = '#c5c6c7';
        ctx.font = '10px "Roboto Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`${track.velocity.speed.toFixed(1)}m/s`, x + 10, y + 12);
      }
    });
  };

  const drawVelocityVector = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    speed: number,
    heading: number
  ) => {
    // Scale vector length based on speed (1-20 pixels)
    const vectorLength = Math.min(Math.max(speed, 5), 20);

    // Calculate vector endpoint
    const headingRad = (heading * Math.PI) / 180;
    const vectorX = x + vectorLength * Math.sin(headingRad);
    const vectorY = y - vectorLength * Math.cos(headingRad);

    // Draw vector line
    ctx.beginPath();
    ctx.strokeStyle = '#66fcf1';
    ctx.lineWidth = 2;
    ctx.moveTo(x, y);
    ctx.lineTo(vectorX, vectorY);
    ctx.stroke();

    // Draw arrowhead
    const arrowSize = 5;
    const arrowAngle1 = headingRad + Math.PI - Math.PI / 6;
    const arrowAngle2 = headingRad + Math.PI + Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(vectorX, vectorY);
    ctx.lineTo(
      vectorX + arrowSize * Math.sin(arrowAngle1),
      vectorY - arrowSize * Math.cos(arrowAngle1)
    );
    ctx.lineTo(
      vectorX + arrowSize * Math.sin(arrowAngle2),
      vectorY - arrowSize * Math.cos(arrowAngle2)
    );
    ctx.closePath();
    ctx.fillStyle = '#66fcf1';
    ctx.fill();
  };

  const drawSweepLine = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    const sweepRad = (sweepAngle * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * Math.sin(sweepRad),
      centerY - radius * Math.cos(sweepRad)
    );
    ctx.strokeStyle = 'rgba(102, 252, 241, 0.75)'; // Cyan with transparency
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw a small arc at the end of the sweep line
    ctx.beginPath();
    ctx.arc(
      centerX + radius * Math.sin(sweepRad),
      centerY - radius * Math.cos(sweepRad),
      3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(102, 252, 241, 0.75)';
    ctx.fill();
  };

  useEffect(() => {
    // Set canvas dimensions based on container size
    const resizeCanvas = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          const size = Math.min(width, height);
          canvasRef.current.width = size;
          canvasRef.current.height = size;
          drawRadar();
        }
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    drawRadar();
  }, [tracks, config, selectedTrack, sweepAngle, radarInfo.operationalRange]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.9;

    // Check if any track was clicked
    const clickedTrack = findTrackAtCoordinates(
      x,
      y,
      tracks,
      radarInfo,
      centerX,
      centerY,
      radius
    );

    setSelectedTrack(clickedTrack);
  };

  const handleCanvasHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setHoveredPoint({ x, y });
  };

  return (
    <div className="radar-container relative w-full h-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasHover}
        className="w-full h-full"
      />
      {selectedTrack && (
        <div
          className="absolute bg-radar-background border border-radar-grid p-3 rounded-md text-radar-text text-xs"
          style={{
            top: '10px',
            right: '10px',
            zIndex: 30
          }}
        >
          <TrackInfo track={selectedTrack} />
        </div>
      )}
    </div>
  );
};
