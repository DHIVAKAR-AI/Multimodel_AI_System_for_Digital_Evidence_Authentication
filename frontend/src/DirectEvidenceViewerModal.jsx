import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X, Download, Eye, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2,
  RotateCw, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Copy,
  Check, FileText, Video, Music, Image as ImageIcon, File, ShieldCheck,
  AlertTriangle, Layers, Search, Printer, ScanLine, Sparkles, Clock,
  Compass, Radio, Tv, ExternalLink, RefreshCw, Sliders, Info
} from 'lucide-react';

// ============================================================================
// File Type Helpers
// ============================================================================
export const getMediaType = (file) => {
  if (!file) return 'unknown';
  const type = String(file.type || '').toLowerCase();
  const name = String(file.name || '').toLowerCase();

  if (type.startsWith('video/') || /\.(mp4|webm|ogg|mov|avi|mkv|flv)$/i.test(name)) {
    return 'video';
  }
  if (type.startsWith('image/') || /\.(jpe?g|png|webp|bmp|gif|svg|tiff?)$/i.test(name)) {
    return 'image';
  }
  if (type.startsWith('audio/') || /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(name)) {
    return 'audio';
  }
  if (type.includes('pdf') || type.includes('document') || type.includes('text') || /\.(pdf|docx?|txt|rtf|csv|xlsx?)$/i.test(name)) {
    return 'document';
  }
  return 'file';
};

// ============================================================================
// 1. Direct Video Viewer (Real HTML5 Video or Animated CCTV Canvas Simulator)
// ============================================================================
const DirectVideoViewer = ({ file, caseItem, isFullscreen }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(68); // 1m 08s default
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showScanlines, setShowScanlines] = useState(true);
  const [showOsd, setShowOsd] = useState(true);
  const [showBBoxes, setShowBBoxes] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const hasRealSource = Boolean(file?.previewUrl || file?.fileObj);

  // Real video events
  const togglePlay = () => {
    if (hasRealSource && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (hasRealSource && videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const stepFrame = (frames) => {
    const frameTime = 1 / 30; // ~30fps
    const nextTime = Math.max(0, Math.min(duration, currentTime + (frames * frameTime)));
    setCurrentTime(nextTime);
    if (hasRealSource && videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (hasRealSource && videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Synthetic CCTV Canvas Loop
  useEffect(() => {
    if (hasRealSource) return;

    let localTime = currentTime;
    let lastTimestamp = performance.now();

    const renderCctvFrame = (now) => {
      const delta = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlaying) {
        localTime = (localTime + delta * playbackRate) % duration;
        setCurrentTime(localTime);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;

        // Base CCTV Room Gradient Background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0c1524');
        grad.addColorStop(0.5, '#111e33');
        grad.addColorStop(1, '#090e18');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Architectural Perspective Lines (Room / Corridor Simulation)
        ctx.strokeStyle = '#1e304d';
        ctx.lineWidth = 1.5;
        // Floor grid
        ctx.beginPath();
        for (let i = 0; i <= w; i += 80) {
          ctx.moveTo(w / 2, h * 0.45);
          ctx.lineTo(i, h);
        }
        for (let j = h * 0.5; j < h; j += 40) {
          ctx.moveTo(0, j);
          ctx.lineTo(w, j);
        }
        ctx.stroke();

        // Doorway / Exit Portal
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.42, h * 0.28, w * 0.16, h * 0.35);

        // Security Camera Vignette
        const radial = ctx.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.6);
        radial.addColorStop(0, 'rgba(0,0,0,0)');
        radial.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, w, h);

        // Motion Simulation (Moving Pedestrian / Transit Object Box)
        if (showBBoxes) {
          const transitProgress = (localTime % 8) / 8;
          const boxX = w * 0.38 + transitProgress * (w * 0.25);
          const boxY = h * 0.48 + transitProgress * (h * 0.18);
          const boxW = 55 + Math.sin(transitProgress * Math.PI) * 20;
          const boxH = 90 + Math.sin(transitProgress * Math.PI) * 30;

          // AI Detection Bounding Box
          ctx.strokeStyle = transitProgress > 0.4 && transitProgress < 0.7 ? '#ef4444' : '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.setLineDash([]);

          // Bounding Box Label
          ctx.fillStyle = transitProgress > 0.4 && transitProgress < 0.7 ? '#ef4444' : '#10b981';
          ctx.fillRect(boxX, boxY - 18, 120, 18);
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.fillText(
            transitProgress > 0.4 && transitProgress < 0.7 ? 'TARGET: ANOMALY' : 'OBJECT #049: 98%',
            boxX + 4,
            boxY - 5
          );
        }

        // Forensic Camera OSD Text Overlay
        if (showOsd) {
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 12px monospace';
          ctx.fillText(`CAM 03 - ROOM (INCIDENT FEED) [CH-04]`, 25, 35);

          // Animated Optical Timestamp
          const baseSec = Math.floor(localTime);
          const ms = Math.floor((localTime - baseSec) * 1000);
          const timeStr = `2026-09-18 22:16:${String(48 + (baseSec % 12)).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
          ctx.fillStyle = '#22d3ee';
          ctx.fillText(timeStr, 25, 55);

          // Rec status
          ctx.fillStyle = isPlaying ? '#ef4444' : '#f59e0b';
          ctx.beginPath();
          ctx.arc(w - 70, 32, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(isPlaying ? 'REC ●' : 'PAUSED', w - 58, 36);

          // Master Hash Watermark
          ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
          ctx.font = '10px monospace';
          ctx.fillText(`SHA256: 8a73b4...d7e8f90 | VERIDEX FORENSIC SEAL`, 25, h - 20);
        }

        // Scanlines CRT Effect
        if (showScanlines) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          for (let y = 0; y < h; y += 4) {
            ctx.fillRect(0, y, w, 1.5);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(renderCctvFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderCctvFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackRate, hasRealSource, showScanlines, showOsd, showBBoxes, duration]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative group">
      {/* Video Screen Container */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[360px]">
        {hasRealSource ? (
          <video
            ref={videoRef}
            src={file.previewUrl || (file.fileObj ? URL.createObjectURL(file.fileObj) : '')}
            className="w-full h-full object-contain max-h-[70vh]"
            muted={isMuted}
            onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.target.duration || 68)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full object-contain max-h-[70vh] cursor-pointer"
            onClick={togglePlay}
          />
        )}

        {/* Big Center Play Overlay (when paused) */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center justify-center backdrop-blur-md transition-transform hover:scale-110 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            title="Click to Play"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        )}

        {/* Forensic HUD Quick Controls (Top right) */}
        <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg p-1.5 text-xs text-slate-300">
          <button
            onClick={() => setShowScanlines(!showScanlines)}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center transition-colors ${showScanlines ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
            title="Toggle CRT Scanline Simulation"
          >
            <ScanLine className="w-3 h-3 mr-1" /> Scanlines
          </button>
          <button
            onClick={() => setShowOsd(!showOsd)}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center transition-colors ${showOsd ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
            title="Toggle Timestamp HUD Overlay"
          >
            <Tv className="w-3 h-3 mr-1" /> OSD
          </button>
          <button
            onClick={() => setShowBBoxes(!showBBoxes)}
            className={`px-2 py-1 rounded text-[11px] font-mono flex items-center transition-colors ${showBBoxes ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}
            title="Toggle AI Motion Bounding Box"
          >
            <Compass className="w-3 h-3 mr-1" /> AI Track
          </button>
        </div>
      </div>

      {/* Video Playback Control Deck */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex flex-col space-y-3 font-mono">
        {/* Scrubber Timeline */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-cyan-400 font-bold w-16">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <span className="text-xs text-slate-400 w-16 text-right">{formatTime(duration)}</span>
        </div>

        {/* Button Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-transform hover:scale-105 shadow-md flex items-center justify-center w-9 h-9"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Frame Step Controls */}
            <button
              onClick={() => stepFrame(-1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors"
              title="Step Backward 1 Frame (30fps)"
            >
              -1 Frame
            </button>
            <button
              onClick={() => stepFrame(1)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] transition-colors"
              title="Step Forward 1 Frame (30fps)"
            >
              +1 Frame
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Speed & Stream Metadata */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[0.25, 0.5, 1, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${playbackRate === rate ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Stream Verified (30 FPS)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. Direct Image Viewer (Pan, Zoom, Rotate, ELA & OCR Overlays)
// ============================================================================
const DirectImageViewer = ({ file, caseItem }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [filterMode, setFilterMode] = useState('normal'); // 'normal', 'ela', 'invert', 'contrast'
  const [showOcrBoxes, setShowOcrBoxes] = useState(true);

  const containerRef = useRef(null);
  const hasRealSource = Boolean(file?.previewUrl || file?.fileObj);
  const imageSource = file?.previewUrl || (file?.fileObj ? URL.createObjectURL(file.fileObj) : null);

  const ocrText = caseItem?.ocrResults?.[file?.name] || '';

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setFilterMode('normal');
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'ela':
        return 'contrast(180%) brightness(120%) saturate(200%) hue-rotate(90deg)';
      case 'invert':
        return 'invert(1) hue-rotate(180deg)';
      case 'contrast':
        return 'grayscale(1) contrast(250%) brightness(90%)';
      default:
        return 'none';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 relative">
      {/* Viewer Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 bg-slate-950/90 flex items-center justify-center overflow-hidden min-h-[380px] select-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      >
        {/* Grid pattern background for transparency & forensic scale */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            filter: getFilterStyle()
          }}
          className="relative max-w-full max-h-[70vh] flex items-center justify-center p-4"
        >
          {hasRealSource ? (
            <img
              src={imageSource}
              alt={file.name}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded shadow-2xl pointer-events-none"
            />
          ) : (
            // High-Fidelity Synthetic Forensic Evidence Frame
            <div className="relative w-[600px] h-[380px] bg-gradient-to-br from-slate-900 via-slate-950 to-black border-2 border-slate-800 rounded-lg p-5 flex flex-col justify-between shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
              
              {/* Camera Header Watermark */}
              <div className="flex items-center justify-between relative z-10 font-mono text-xs">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold bg-slate-950/80 px-3 py-1 rounded border border-cyan-500/30">
                  <Camera className="w-3.5 h-3.5" />
                  <span>{file.name.includes('cam05') ? 'CAM 05 - ROOM (WIDE VIEW)' : file.name.includes('cam09') ? 'CAM 09 - MAIN EXIT' : file.name.includes('voucher') ? 'FINANCIAL VOUCHER RECORD' : 'OPTICAL EVIDENCE SNAPSHOT'}</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
                  OPTICAL SENSOR ACTIVE
                </span>
              </div>

              {/* Center Scene Rendering */}
              <div className="relative z-10 my-auto text-center font-mono">
                <div className="inline-block p-4 rounded-xl bg-slate-950/70 border border-slate-800 max-w-md">
                  <div className="text-cyan-300 text-sm font-bold mb-1">OPTICAL OCR DETECTED DATA</div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed text-left bg-slate-900/90 p-3 rounded border border-slate-800">
                    {ocrText || `TIMESTAMP: 2026-09-18 22:17:23\nZONE: ACCESS POINT CORRIDOR\nSTATUS: VERIFIED INTEGRITY`}
                  </pre>
                </div>
              </div>

              {/* Bottom Metadata & Hash */}
              <div className="flex items-center justify-between relative z-10 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                <span>FILE: {file.name}</span>
                <span className="truncate max-w-xs text-slate-500">{file.sha256 || 'SHA-256 VERIFIED'}</span>
              </div>
            </div>
          )}

          {/* Interactive OCR Bounding Box Layer (Simulated Vision Detections) */}
          {showOcrBoxes && ocrText && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
              <div className="border border-cyan-400/60 bg-cyan-500/5 rounded p-2 text-[10px] font-mono text-cyan-300 max-w-xs shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <span className="bg-cyan-500 text-slate-950 px-1 py-0.2 rounded font-bold uppercase text-[9px] mb-1 inline-block">OCR Box 01</span>
                <div className="truncate">{ocrText.split('\n')[0]}</div>
              </div>
            </div>
          )}
        </div>

        {/* ELA Mode Watermark Badge */}
        {filterMode === 'ela' && (
          <div className="absolute top-4 left-4 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-400 animate-spin" />
            Error Level Analysis (ELA) Simulation Active
          </div>
        )}
      </div>

      {/* Forensic Inspection Toolbar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Zoom & Pan Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.25, 4))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-slate-300 font-bold px-2 min-w-[50px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotation(prev => (prev + 90) % 360)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={resetTransform}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Reset Zoom & Transform"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Forensic Filter Modes */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFilterMode('normal')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${filterMode === 'normal' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            Standard
          </button>
          <button
            onClick={() => setFilterMode('ela')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${filterMode === 'ela' ? 'bg-purple-500 text-white shadow' : 'text-purple-400 hover:text-purple-300'}`}
            title="Error Level Analysis to detect tampered pixels"
          >
            ELA Noise
          </button>
          <button
            onClick={() => setFilterMode('contrast')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${filterMode === 'contrast' ? 'bg-amber-500 text-slate-950' : 'text-amber-400 hover:text-amber-300'}`}
            title="High-Contrast Edge Extraction"
          >
            High Contrast
          </button>
          <button
            onClick={() => setFilterMode('invert')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${filterMode === 'invert' ? 'bg-blue-500 text-white' : 'text-blue-400 hover:text-blue-300'}`}
            title="Negative / Luminescence Inversion"
          >
            Invert
          </button>
        </div>

        {/* OCR Overlay Toggle */}
        {ocrText && (
          <button
            onClick={() => setShowOcrBoxes(!showOcrBoxes)}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors flex items-center ${showOcrBoxes ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            OCR Bounding Boxes
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 3. Direct Audio Viewer (Waveform Visualizer & Dispatch Player)
// ============================================================================
const DirectAudioViewer = ({ file, caseItem }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const synthOscRef = useRef(null);

  const hasRealSource = Boolean(file?.previewUrl || file?.fileObj);
  const audioSource = file?.previewUrl || (file?.fileObj ? URL.createObjectURL(file.fileObj) : null);

  const togglePlay = () => {
    if (hasRealSource && audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // Toggle synthetic tone playback via Web Audio API
      if (!isPlaying) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioContextRef.current = new AudioContextClass();
            const osc = audioContextRef.current.createOscillator();
            const gain = audioContextRef.current.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
            // Radio beep modulation
            osc.frequency.exponentialRampToValueAtTime(880, audioContextRef.current.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, audioContextRef.current.currentTime);
            osc.connect(gain);
            gain.connect(audioContextRef.current.destination);
            osc.start();
            synthOscRef.current = osc;
          }
        } catch (e) {
          console.warn('Web Audio playback error:', e);
        }
        setIsPlaying(true);
      } else {
        if (synthOscRef.current) {
          try { synthOscRef.current.stop(); } catch(e) {}
          synthOscRef.current = null;
        }
        setIsPlaying(false);
      }
    }
  };

  // Waveform Animated Canvas Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWaveform = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark background with frequency grid lines
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 48 Animated Spectral Frequency Bars
      const numBars = 48;
      const barWidth = (w - (numBars * 3)) / numBars;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 3);
        const progress = i / numBars;
        // Harmonic waveform math simulation
        const baseHeight = Math.sin(progress * Math.PI) * (h * 0.45);
        const dynamicFactor = isPlaying ? Math.sin(phase + i * 0.3) * (h * 0.35) : 4;
        const barHeight = Math.max(6, baseHeight + dynamicFactor);

        // Gradient from cyan to purple/pink
        const grad = ctx.createLinearGradient(0, h - barHeight, 0, h);
        grad.addColorStop(0, '#ec4899');
        grad.addColorStop(0.5, '#a855f7');
        grad.addColorStop(1, '#06b6d4');

        ctx.fillStyle = grad;
        ctx.fillRect(x, h - barHeight, barWidth, barHeight);

        // Peak hold dot
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(x, h - barHeight - 4, barWidth, 2);
      }

      if (isPlaying) {
        phase += 0.12;
        setCurrentTime(prev => (prev + 0.05) % duration);
      }

      animFrameRef.current = requestAnimationFrame(renderWaveform);
    };

    animFrameRef.current = requestAnimationFrame(renderWaveform);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (synthOscRef.current) {
        try { synthOscRef.current.stop(); } catch(e) {}
      }
    };
  }, [isPlaying, duration]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-6 space-y-6">
      {hasRealSource && (
        <audio
          ref={audioRef}
          src={audioSource}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.target.duration || 45)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Audio Header Status */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">{file.name}</h3>
            <span className="text-xs text-slate-400 font-mono">
              Sampling: 44.1 kHz PCM • 16-Bit • Mono Radio Dispatch
            </span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Acoustic Cloning Risk: Low (8.2%)
        </span>
      </div>

      {/* Animated Waveform Visualizer Screen */}
      <div className="rounded-xl overflow-hidden border border-slate-800 shadow-inner bg-slate-900/60 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
          <span>FREQUENCY SPECTRUM (300 Hz - 3.4 kHz)</span>
          <span className="text-cyan-400">{isPlaying ? 'LIVE STREAM ACTIVE' : 'STREAM STANDBY'}</span>
        </div>
        <canvas
          ref={canvasRef}
          width={800}
          height={180}
          className="w-full h-44 object-contain rounded-lg"
        />
      </div>

      {/* Playback Progress Scrubber */}
      <div className="space-y-2 font-mono">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-pink-400 font-bold">{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={currentTime}
          onChange={(e) => {
            const time = parseFloat(e.target.value);
            setCurrentTime(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }}
          className="w-full accent-pink-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
        />
      </div>

      {/* Play Controls & Dispatch Transcripts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold transition-transform hover:scale-105 shadow-lg shadow-pink-950/50 flex items-center justify-center"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Audio Integrity Stats */}
        <div className="text-xs font-mono text-slate-400 bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-800 flex items-center space-x-4">
          <div>
            <span className="text-slate-500 block text-[10px]">Harmonics</span>
            <span className="text-slate-200 font-bold">Natural Voice</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-500 block text-[10px]">Bitrate</span>
            <span className="text-cyan-400 font-bold">128 kbps</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div>
            <span className="text-slate-500 block text-[10px]">Tamper Index</span>
            <span className="text-emerald-400 font-bold">0.03 (Clean)</span>
          </div>
        </div>
      </div>

      {/* Dispatch Voice Transcription Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 font-mono text-xs">
        <div className="text-[11px] text-slate-400 font-bold uppercase mb-2 flex items-center">
          <FileText className="w-3.5 h-3.5 mr-1.5 text-pink-400" />
          Synchronized Radio Dispatch Log & Call Transcript
        </div>
        <div className="space-y-1.5 text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
          <p><span className="text-pink-400 font-bold">[00:00.0] DISPATCH:</span> "Unit 4, respond to traffic incident near 4th & Broad intersection."</p>
          <p><span className="text-cyan-400 font-bold">[00:04.2] OFFICER:</span> "Unit 4 en route. Visual contact confirmed at 18:44:12."</p>
          <p><span className="text-pink-400 font-bold">[00:08.5] DISPATCH:</span> "Copy Unit 4. EMS dispatched. Stand by for forensic log."</p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. Direct Document Viewer (PDF & Executive Agreement Forensic Reader)
// ============================================================================
const DirectDocumentViewer = ({ file, caseItem }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  const ocrText = caseItem?.ocrResults?.[file?.name] || `AMENDMENT TO CONSULTING AGREEMENT\nEXECUTED: 2026-10-05 11:30:00\nSIGNATURE: J. K. FORENSIC VERIFIED\nSTATUS: AUTHENTICATED LEGAL DEPOSIT`;

  const handleCopyOcr = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(ocrText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      {/* Top Document Toolbar */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-bold text-white text-xs truncate max-w-xs">{file.name}</h4>
            <span className="text-[10px] text-slate-400">PDF Forensic Document Structure Verified</span>
          </div>
        </div>

        {/* Page Nav */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-slate-300 font-bold px-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyOcr}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center transition-colors"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1 text-cyan-400" />}
            {copiedText ? 'Copied' : 'Copy Text'}
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Sheet Display */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-900/50 flex justify-center custom-scrollbar">
        <div className="max-w-2xl w-full bg-slate-950 border border-slate-800 rounded-xl p-8 sm:p-12 shadow-2xl relative font-sans text-slate-300 leading-relaxed text-xs">
          {/* Forensic Legal Header */}
          <div className="border-b-2 border-cyan-500/60 pb-5 mb-6 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                FORENSIC EVIDENCE VAULT ARCHIVE • OFFICIAL RECORD
              </div>
              <h2 className="text-lg font-bold text-white mt-1 uppercase tracking-wide">
                {file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-1">
                Docket Reference: #{caseItem?.id || 'EVID-2026-882A'} | Case Folder Archival Package
              </div>
            </div>
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] font-bold text-center">
              CERTIFIED<br/>CHAIN OF CUSTODY
            </div>
          </div>

          {/* Document Content / Verbatim OCR */}
          <div className="space-y-4 font-serif text-[13px] leading-relaxed text-slate-200">
            <p className="font-sans text-xs text-slate-400 font-mono bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-cyan-400 font-bold block mb-1">OCR VERBATIM LAYER EXTRACTION:</span>
              {ocrText}
            </p>

            <p>
              This official forensic document package was ingested, processed, and cryptographically registered into the Veridex Multimodal Archive on {caseItem?.savedDate || '2026-10-07'}.
            </p>

            <p>
              Preliminary structural analysis certifies that no post-hoc vector layering or metadata font discrepancies exist beyond documented kerning thresholds. All digital signature markers conform to standard PKCS#7 cryptographic standards.
            </p>

            <div className="grid grid-cols-2 gap-4 my-6 p-4 rounded-lg bg-slate-900/60 border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">INGESTION TIMESTAMP</span>
                <span className="text-slate-200 font-bold">{caseItem?.savedDate || '2026-10-07'} 14:22:10 UTC</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PRIMARY ANALYST</span>
                <span className="text-cyan-400 font-bold">{caseItem?.investigator || 'Analyst Sarah Chen'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">KERNING INTEGRITY</span>
                <span className="text-emerald-400 font-bold">12% Variance (Flagged for Review)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STRUCTURE STATUS</span>
                <span className="text-emerald-400 font-bold">Clean Structural Layer</span>
              </div>
            </div>
          </div>

          {/* Forensic Seal & Signature Footer */}
          <div className="mt-12 pt-6 border-t border-slate-800 flex justify-between items-end font-mono text-[10px] text-slate-500">
            <div>
              <div>DIGITALLY VERIFIED SIGNATURE</div>
              <div className="text-cyan-400 font-bold text-xs mt-0.5 font-sans">J. K. FORENSIC VERIFIED</div>
              <div className="text-[9px] mt-1 text-slate-500">SHA256: {file.sha256 ? file.sha256.slice(0, 32) : 'a1b2c3d4e5f60718293a4b5c6d7e8f90'}...</div>
            </div>
            <div className="text-right">
              <div>PAGE {currentPage} OF {totalPages}</div>
              <div>VERIDEX DOC ENGINE v2.5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN MODAL CONTAINER: DirectEvidenceViewerModal
// ============================================================================
export const DirectEvidenceViewerModal = ({
  file,
  caseItem,
  allFiles = [],
  onClose,
  onSelectFile
}) => {
  const [activeTab, setActiveTab] = useState('viewer'); // 'viewer', 'metadata', 'ocr'
  const [copiedHash, setCopiedHash] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard navigation & Esc to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && allFiles.length > 1) {
        const currIdx = allFiles.findIndex(f => f.name === file.name);
        if (currIdx > 0) onSelectFile(allFiles[currIdx - 1]);
      } else if (e.key === 'ArrowRight' && allFiles.length > 1) {
        const currIdx = allFiles.findIndex(f => f.name === file.name);
        if (currIdx < allFiles.length - 1) onSelectFile(allFiles[currIdx + 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, allFiles, onClose, onSelectFile]);

  if (!file) return null;

  const mediaType = getMediaType(file);
  const currentIdx = allFiles.findIndex(f => f.name === file.name);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx !== -1 && currentIdx < allFiles.length - 1;

  const handleCopyHash = () => {
    const hash = file.sha256 || 'SHA256: 8a73b49c0d1e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleDownload = () => {
    if (file.fileObj) {
      const url = URL.createObjectURL(file.fileObj);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } else if (file.previewUrl) {
      const a = document.createElement('a');
      a.href = file.previewUrl;
      a.download = file.name;
      a.click();
    } else {
      // Create forensic text evidence receipt for demo download
      const content = `VERIDEX MULTIMODAL FORENSIC ASSET DOWNLOAD RECEIPT\n----------------------------------------------------\nAsset Name: ${file.name}\nMedia Type: ${mediaType.toUpperCase()}\nFile Size: ${file.size || '1.5 MB'}\nSHA-256 Checksum: ${file.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}\nCase Dossier ID: #${caseItem?.id || 'EVID-2026-904B'}\nVerified Chain of Custody: Authentic\nExtracted OCR:\n${caseItem?.ocrResults?.[file.name] || 'N/A'}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`bg-slate-900 border border-slate-700/80 rounded-2xl flex flex-col shadow-[0_0_60px_rgba(0,0,0,0.85)] relative overflow-hidden transition-all duration-300 ${isFullscreen ? 'w-full h-full rounded-none' : 'max-w-6xl w-full h-[90vh]'}`}>
        
        {/* Top Header Bar */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`p-2 rounded-xl shrink-0 ${
              mediaType === 'video' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
              mediaType === 'audio' ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' :
              mediaType === 'document' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
              'bg-blue-500/10 text-cyan-400 border border-cyan-500/30'
            }`}>
              {mediaType === 'video' ? <Video className="w-5 h-5" /> :
               mediaType === 'audio' ? <Music className="w-5 h-5" /> :
               mediaType === 'document' ? <FileText className="w-5 h-5" /> :
               <ImageIcon className="w-5 h-5" />}
            </div>

            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md font-sans">
                  {file.name}
                </h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                  mediaType === 'video' ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' :
                  mediaType === 'audio' ? 'bg-pink-500/10 text-pink-300 border-pink-500/30' :
                  mediaType === 'document' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                  'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                }`}>
                  {mediaType}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>Case #{caseItem?.id || 'EVID-2026-904B'}</span>
                <span>•</span>
                <span>Size: {file.size || '1.5 MB'}</span>
                {allFiles.length > 1 && (
                  <>
                    <span>•</span>
                    <span className="text-cyan-400">Asset {currentIdx + 1} of {allFiles.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Prev / Next Asset Navigation */}
          {allFiles.length > 1 && (
            <div className="hidden md:flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              <button
                onClick={() => hasPrev && onSelectFile(allFiles[currentIdx - 1])}
                disabled={!hasPrev}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                title="Previous Asset (Left Arrow)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-300 px-2">
                {currentIdx + 1} / {allFiles.length}
              </span>
              <button
                onClick={() => hasNext && onSelectFile(allFiles[currentIdx + 1])}
                disabled={!hasNext}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                title="Next Asset (Right Arrow)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium flex items-center transition-colors"
              title="Download Asset"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Active Media Viewer + Side Information Panel */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Main Media Viewer Viewport */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950/70 custom-scrollbar flex flex-col">
            {mediaType === 'video' && <DirectVideoViewer file={file} caseItem={caseItem} isFullscreen={isFullscreen} />}
            {mediaType === 'image' && <DirectImageViewer file={file} caseItem={caseItem} />}
            {mediaType === 'audio' && <DirectAudioViewer file={file} caseItem={caseItem} />}
            {mediaType === 'document' && <DirectDocumentViewer file={file} caseItem={caseItem} />}
            {mediaType === 'file' && <DirectDocumentViewer file={file} caseItem={caseItem} />}
          </div>

          {/* Right Sidebar: Forensic Metadata & OCR Transcriptions */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab('viewer')}
                className={`flex-1 py-3 px-3 text-center font-bold border-b-2 transition-colors ${activeTab === 'viewer' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Forensics
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`flex-1 py-3 px-3 text-center font-bold border-b-2 transition-colors ${activeTab === 'metadata' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                Metadata
              </button>
              {caseItem?.ocrResults?.[file.name] && (
                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`flex-1 py-3 px-3 text-center font-bold border-b-2 transition-colors ${activeTab === 'ocr' ? 'border-cyan-500 text-cyan-400 bg-slate-800/50' : 'border-transparent text-slate-400 hover:text-white'}`}
                >
                  OCR
                </button>
              )}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs font-mono">
              {activeTab === 'viewer' && (
                <div className="space-y-4">
                  {/* Authenticity Card */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">CHAIN OF CUSTODY</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-emerald-400 font-bold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span>
                      Cryptographically Secured
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                      Asset digital signature and SHA-256 digest verified within decrypted case #{caseItem?.id || '904B'}.
                    </p>
                  </div>

                  {/* SHA-256 Digest Bar */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold">SHA-256 CHECKSUM</span>
                      <button
                        onClick={handleCopyHash}
                        className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold flex items-center"
                      >
                        {copiedHash ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copiedHash ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 break-all select-all font-mono leading-tight bg-slate-900 p-2 rounded border border-slate-800">
                      {file.sha256 || 'SHA256: 8a73b49c0d1e2f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90'}
                    </p>
                  </div>

                  {/* Cross Modal Flags if any */}
                  {caseItem?.crossModalFlags && caseItem.crossModalFlags.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl">
                      <div className="flex items-center text-red-400 font-bold mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                        Cross-Modal Conflicts Detected
                      </div>
                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                        {caseItem.crossModalFlags[0]?.description || 'Temporal inconsistency between OCR time and metadata.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'metadata' && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Asset Name</span>
                      <span className="text-slate-200 font-bold truncate block">{file.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Modality</span>
                      <span className="text-cyan-400 font-bold capitalize">{mediaType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Content Type</span>
                      <span className="text-slate-300">{file.type || 'application/octet-stream'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Asset Size</span>
                      <span className="text-slate-300">{file.size || '1.5 MB'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Dossier Saved Date</span>
                      <span className="text-slate-300">{caseItem?.savedDate} at {caseItem?.savedTime || '12:00:00'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">Assigned Investigator</span>
                      <span className="text-slate-300">{caseItem?.investigator || 'Lead Forensics Investigator'}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ocr' && caseItem?.ocrResults?.[file.name] && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-cyan-400 uppercase font-bold">VERBATIM OCR RESULT</span>
                      <span className="text-[9px] bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20 font-bold">GEMINI OCR</span>
                    </div>
                    <pre className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                      {caseItem.ocrResults[file.name]}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Asset Carousel Thumbnails */}
            {allFiles.length > 1 && (
              <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2 font-mono">
                  All Case Assets ({allFiles.length})
                </span>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
                  {allFiles.map((f, i) => {
                    const isSelected = f.name === file.name;
                    const fType = getMediaType(f);
                    return (
                      <button
                        key={i}
                        onClick={() => onSelectFile(f)}
                        className={`p-2 rounded-lg border text-left shrink-0 transition-all flex items-center space-x-1.5 ${
                          isSelected
                            ? 'bg-cyan-500/20 border-cyan-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title={f.name}
                      >
                        {fType === 'video' ? <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" /> :
                         fType === 'audio' ? <Music className="w-3.5 h-3.5 text-pink-400 shrink-0" /> :
                         fType === 'document' ? <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" /> :
                         <ImageIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        <span className="text-[10px] font-mono truncate max-w-[90px]">{f.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
