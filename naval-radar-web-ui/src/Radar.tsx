import React, { useEffect, useRef } from "react";

interface RadarProps {
  points: { range: number; azimuth: number }[];
  radarRange: number;
}

const Radar: React.FC<RadarProps> = ({ points, radarRange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const convertToCanvasCoordinates = (
    range: number,
    azimuth: number,
    canvasSize: number
  ) => {
    const radius = (range / radarRange) * (canvasSize / 2);
    const x = canvasSize / 2 + radius * Math.cos(azimuth);
    const y = canvasSize / 2 - radius * Math.sin(azimuth); // Invert y-axis
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!ctx || !canvas) return;

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw concentric circles
      ctx.strokeStyle = "rgba(0, 255, 0, 0.3)";
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, (i * canvas.width) / 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw points
      points.forEach((point) => {
        const { x, y } = convertToCanvasCoordinates(point.range, point.azimuth, canvas.width);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 0, 0, 1)";
        ctx.fill();
      });
    };

    drawRadar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, radarRange]); // Re-render whenever points, range, or center change

  return <canvas ref={canvasRef} width="500" height="500"></canvas>;
};

export default Radar;
