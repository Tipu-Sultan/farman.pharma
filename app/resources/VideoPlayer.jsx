"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function VideoPlayer({ src, title, autoPlay = false }) {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Play/Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => console.error("Play error:", err));
    }
    setIsPlaying(!isPlaying);
    setShowControls(true); // Ensure controls stay visible when toggling
  };

  // Mute/Unmute toggle
  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    if (!isMuted) setVolume(0);
    else setVolume(50);
  };

  // Volume control
  const handleVolumeChange = (newValue) => {
    const volumeValue = newValue[0] / 100;
    videoRef.current.volume = volumeValue;
    setVolume(newValue[0]);
    setIsMuted(volumeValue === 0);
  };

  // Seek video
  const handleSeek = (newValue) => {
    const time = (newValue[0] / 100) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Skip forward/backward
  const skip = (seconds) => {
    videoRef.current.currentTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      duration
    );
    setCurrentTime(videoRef.current.currentTime);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Playback speed change
  const changePlaybackSpeed = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  // Auto-play on mount if specified
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch((err) => console.error("Auto-play error:", err));
      setIsPlaying(true);
    }
  }, [autoPlay]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    const updateTime = () => setCurrentTime(video.currentTime);
    const setVideoDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("ended", () => {
      setIsPlaying(false);
      setShowControls(true); // Show controls when video ends
    });

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  // Auto-hide controls only when playing
  useEffect(() => {
    let timeout;
    const hideControls = () => {
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const showControlsOnMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      if (isPlaying) hideControls(); // Only hide again if playing
    };

    const container = videoRef.current?.parentElement;
    if (container) {
      container.addEventListener("mousemove", showControlsOnMove);
      container.addEventListener("mouseleave", () => {
        if (isPlaying) hideControls();
      });
      if (isPlaying) hideControls();
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", showControlsOnMove);
        container.removeEventListener("mouseleave", hideControls);
      }
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-black shadow-lg rounded-lg">
      <div className="relative group">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto rounded-t-lg cursor-pointer"
          onClick={togglePlay}
        >
          Your browser does not support the video tag.
        </video>

        {/* Controls */}
        <div
          ref={controlsRef}
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-3 text-white transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {/* Progress Bar */}
          <Slider
            value={[(currentTime / duration) * 100 || 0]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full h-1 cursor-pointer"
            trackClassName="bg-red-500"
            thumbClassName="bg-white border-2 border-red-500 rounded-full w-3 h-3"
          />

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-28 hidden sm:block"
                  trackClassName="bg-gray-300"
                  thumbClassName="bg-white border-2 border-gray-300 rounded-full w-3 h-3"
                />
              </div>
              <span className="text-sm font-medium bg-black/50 px-2 py-1 rounded">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`cursor-pointer hover:bg-gray-700 ${
                        playbackSpeed === speed ? "bg-gray-700" : ""
                      }`}
                    >
                      {speed}x
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Center Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white bg-white/20 hover:bg-white/30 rounded-full p-4 shadow-lg"
            >
              <Play className="h-12 w-12" />
            </Button>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <span className="text-sm text-gray-400">{formatTime(duration)}</span>
      </div>
    </Card>
  );
}