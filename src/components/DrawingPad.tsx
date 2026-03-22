import React, { useRef, useEffect, useState } from 'react';

interface DrawingPadProps {
  onClear?: () => void;
}

const DrawingPad: React.FC<DrawingPadProps> = ({ onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#2c3e50';
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    onClear?.();
  };

  // Expose clearCanvas to parent if needed, but here we just have a button
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xl">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border-3 border-dashed border-stone-300 bg-white rounded-2xl cursor-crosshair touch-none shadow-inner w-full aspect-square"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <button
        onClick={clearCanvas}
        className="px-6 py-2 bg-rose-500 text-white font-bold rounded-xl shadow-md hover:bg-rose-600 active:translate-y-0.5 transition-all text-sm"
      >
        清除畫布
      </button>
    </div>
  );
};

export default DrawingPad;
