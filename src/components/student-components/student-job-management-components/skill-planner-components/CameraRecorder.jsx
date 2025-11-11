import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CameraRecorder = ({ isOpen, onClose, skillName, videoScript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(85);
  const [scrollSpeed, setScrollSpeed] = useState(1); // pixels per 100ms
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const [maxScrollHeight, setMaxScrollHeight] = useState(1000);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const scrollTimerRef = useRef(null);
  const scriptContentRef = useRef(null);
  const scriptInnerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      if (scrollTimerRef.current) clearInterval(scrollTimerRef.current);
    };
  }, [isOpen]);

  // Calculate max scroll height when script loads
  useEffect(() => {
    // Use setTimeout to ensure DOM has fully rendered
    const timer = setTimeout(() => {
      if (scriptContentRef.current && scriptInnerRef.current) {
        const containerHeight = scriptContentRef.current.clientHeight;
        const contentHeight = scriptInnerRef.current.scrollHeight;
        // Add extra buffer (200px) to ensure we can scroll past the last line
        const calculatedMax = Math.max(0, contentHeight - containerHeight + 200);
        setMaxScrollHeight(calculatedMax);
        console.log('Scroll calculation:', {
          containerHeight,
          contentHeight,
          buffer: 200,
          maxScrollHeight: calculatedMax,
          note: 'Added 200px buffer to ensure full script visibility'
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [videoScript, showOverlay]);

  // Auto-scroll effect when recording
  useEffect(() => {
    if (isRecording && showOverlay && !isScrollPaused) {
      scrollTimerRef.current = setInterval(() => {
        setScrollPosition((prev) => {
          const newPosition = prev + scrollSpeed;
          return Math.min(newPosition, maxScrollHeight);
        });
      }, 100); // Every 100ms
    } else {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
      }
    }
    return () => {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
      }
    };
  }, [isRecording, showOverlay, isScrollPaused, scrollSpeed, maxScrollHeight]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    // Check if browser supports the codec
    let options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: 'video/webm' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/mp4' };
      }
    }

    const mediaRecorder = new MediaRecorder(streamRef.current, options);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: options.mimeType });
      const url = URL.createObjectURL(blob);
      setRecordedVideoUrl(url);
      setIsPreviewing(true);
      stopCamera();
    };

    mediaRecorder.start(100); // Collect data every 100ms
    setIsRecording(true);
    setRecordingTime(0);
    setScrollPosition(0); // Reset scroll position

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    toast.success('Recording started');
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success('Recording stopped');
    }
  };

  const handleSaveVideo = () => {
    if (recordedVideoUrl && chunksRef.current.length > 0) {
      try {
        // Always save as .mp4 extension
        const fileName = `${skillName.replace(/\s+/g, '_')}_${new Date().getTime()}.mp4`;

        // Create download link
        const a = document.createElement('a');
        a.href = recordedVideoUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast.success('Video saved as MP4 to your device!');
        
        // Clean up and close after a short delay
        setTimeout(() => {
          handleClose();
        }, 500);
      } catch (error) {
        console.error('Error saving video:', error);
        toast.error('Failed to save video. Please try again.');
      }
    }
  };

  const handleRetake = () => {
    // Clean up previous recording
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setIsPreviewing(false);
    setRecordedVideoUrl(null);
    chunksRef.current = [];
    setRecordingTime(0);
    setScrollPosition(0);
    setIsScrollPaused(false);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
    if (scrollTimerRef.current) clearInterval(scrollTimerRef.current);
    
    // Clean up blob URL
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    
    setIsRecording(false);
    setIsPreviewing(false);
    setRecordedVideoUrl(null);
    chunksRef.current = [];
    setRecordingTime(0);
    setScrollPosition(0);
    setIsScrollPaused(false);
    setScrollSpeed(1);
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const recalculateScrollHeight = () => {
    if (scriptContentRef.current && scriptInnerRef.current) {
      const containerHeight = scriptContentRef.current.clientHeight;
      const contentHeight = scriptInnerRef.current.scrollHeight;
      // Add extra buffer (200px) to ensure we can scroll past the last line
      const calculatedMax = Math.max(0, contentHeight - containerHeight + 200);
      setMaxScrollHeight(calculatedMax);
      toast.success(`Scroll range recalculated: ${Math.round(calculatedMax)}px (with 200px buffer)`);
      console.log('Manual scroll recalculation:', {
        containerHeight,
        contentHeight,
        buffer: 200,
        maxScrollHeight: calculatedMax,
        note: 'Added 200px buffer to ensure full script visibility'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-red-600 to-pink-600 shadow-lg z-20">
        <div className="px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-video"></i>
              Record Video
            </h2>
            <p className="text-xs sm:text-sm text-white opacity-90 mt-1">{skillName}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
          >
            <i className="fas fa-times text-white text-xl"></i>
          </button>
        </div>
      </div>

      {/* New Layout: Script Top, Camera Bottom */}
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        {/* Top - Video Script */}
        <div className="w-full bg-slate-50 overflow-y-auto flex-1">
          <div className="p-4 sm:p-6">
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fas fa-script text-purple-600"></i>
                Video Script
              </h3>
              
              {videoScript && (
                <>
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900">Duration: {videoScript.duration}</p>
                  </div>

                  {/* Script Sections */}
                  <div className="space-y-6">
                    {videoScript.sections?.map((section, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                        {section.title !== 'Your Video Script' ? (
                          <>
                            <div className="flex items-start gap-3 mb-2">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold shrink-0">
                                {section.time}
                              </span>
                              <h4 className="text-lg font-bold text-slate-900">{section.title}</h4>
                            </div>
                            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                          </>
                        ) : (
                          <>
                            <div className="mb-3 flex items-center gap-2">
                              <i className="fas fa-file-alt text-purple-600"></i>
                              <h4 className="text-lg font-bold text-slate-900">{section.title}</h4>
                              <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                Custom Script
                              </span>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                              <pre className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans text-sm">
{section.content}
                              </pre>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Visual Suggestions */}
                  {videoScript.visualSuggestions && videoScript.visualSuggestions.length > 0 && (
                    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-lightbulb"></i>
                        Visual Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {videoScript.visualSuggestions.map((suggestion, index) => (
                          <li key={index} className="flex gap-2 text-sm text-blue-800">
                            <span>•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Thumbnail Ideas */}
                  {videoScript.thumbnailIdeas && videoScript.thumbnailIdeas.length > 0 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <i className="fas fa-image"></i>
                        Thumbnail Ideas
                      </h4>
                      <ul className="space-y-2">
                        {videoScript.thumbnailIdeas.map((idea, index) => (
                          <li key={index} className="flex gap-2 text-sm text-green-800">
                            <span>•</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Recording Tips */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <i className="fas fa-info-circle text-amber-600 mt-1"></i>
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm mb-2">Recording Tips</h4>
                    <ul className="text-amber-700 text-sm space-y-1">
                      <li>• Ensure good lighting and minimal background noise</li>
                      <li>• Position yourself in the center of the frame</li>
                      <li>• Follow the video script timing for best results</li>
                      <li>• Your video will be saved locally to your device</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Camera View with Teleprompter Overlay */}
        <div className="w-full bg-slate-900 flex flex-col">
          {/* Video Display - Centered */}
          <div className="relative bg-black flex items-center justify-center p-4" style={{ height: '500px' }}>
            <div className="w-full max-w-3xl mx-auto h-full relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
              
              {/* Teleprompter Overlay - Top */}
              {showOverlay && videoScript && !isPreviewing && (
                <div 
                  ref={scriptContentRef}
                  className="absolute top-0 left-0 right-0 rounded-t-lg overflow-hidden"
                  style={{ 
                    height: '40%',
                    background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity / 100}), rgba(0,0,0,0))`
                  }}
                >
                  <div 
                    ref={scriptInnerRef}
                    className="p-6 pb-64 text-white transition-transform duration-100 ease-linear"
                    style={{ transform: `translateY(-${scrollPosition}px)` }}
                  >
                    {videoScript.sections?.map((section, index) => (
                      <div key={index} className="mb-6">
                        {section.title !== 'Your Video Script' ? (
                          <>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-2 py-1 bg-purple-500 bg-opacity-80 rounded text-xs font-bold">
                                {section.time}
                              </span>
                              <h4 className="text-lg font-bold">{section.title}</h4>
                            </div>
                            <p className="text-base leading-relaxed whitespace-pre-wrap">{section.content}</p>
                          </>
                        ) : (
                          <>
                            <h4 className="text-lg font-bold mb-2">{section.title}</h4>
                            <p className="text-base leading-relaxed whitespace-pre-wrap">{section.content}</p>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recording Timer - Top Right */}
              {isRecording && (
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full animate-pulse shadow-lg z-10">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span className="font-bold">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Toggle Overlay Button */}
              {!isPreviewing && (
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className="absolute top-6 left-6 w-10 h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all z-10"
                  title={showOverlay ? 'Hide Script' : 'Show Script'}
                >
                  <i className={`fas ${showOverlay ? 'fa-eye-slash' : 'fa-eye'} text-white`}></i>
                </button>
              )}
              
              {/* Preview Overlay */}
              {isPreviewing && !isRecording && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                  <div className="bg-white rounded-xl p-8 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-check-circle text-green-600 text-4xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Recording Complete!</h3>
                    <p className="text-slate-600 mb-4">
                      Your video has been recorded successfully.
                    </p>
                    <p className="text-sm text-slate-500">
                      Duration: {formatTime(recordingTime)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-slate-800 space-y-4">
            {/* Main Recording Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {!isPreviewing ? (
                <>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      <i className="fas fa-circle text-xl"></i>
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 border-2 border-white"
                    >
                      <i className="fas fa-stop text-xl"></i>
                      Stop Recording
                    </button>
                  )}
                </>
              ) : (
              <>
                <button
                  onClick={handleRetake}
                  className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-redo"></i>
                  Retake
                </button>
                <button
                  onClick={handleSaveVideo}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-base animate-pulse"
                >
                  <i className="fas fa-download text-xl"></i>
                  Save to Device
                </button>
              </>
              )}
            </div>

            {/* Info text for preview state */}
            {isPreviewing && (
              <div className="text-center">
                <p className="text-white text-xs opacity-75">
                  <i className="fas fa-info-circle mr-1"></i>
                  Video will be downloaded to your device
                </p>
              </div>
            )}

            {/* Teleprompter Controls */}
            {!isPreviewing && showOverlay && (
              <div className="max-w-5xl mx-auto bg-slate-700 rounded-lg p-3 space-y-3">
                {/* All Controls in One Compact Row */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Script Position Seekbar */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-white text-[10px] font-semibold flex items-center gap-1">
                        <i className="fas fa-scroll"></i>
                        Position
                        <button
                          onClick={recalculateScrollHeight}
                          className="ml-1 w-4 h-4 bg-slate-600 hover:bg-slate-500 text-white rounded text-[8px] transition-all flex items-center justify-center"
                          title="Recalculate scroll range (use if script seems incomplete)"
                        >
                          <i className="fas fa-sync-alt"></i>
                        </button>
                      </label>
                      <span className={`text-[10px] font-bold ${
                        scrollPosition >= maxScrollHeight ? 'text-green-400' : 'text-white'
                      }`}>
                        {maxScrollHeight > 0 ? Math.round((scrollPosition / maxScrollHeight) * 100) : 0}%
                        {scrollPosition >= maxScrollHeight && ' ✓'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={Math.max(maxScrollHeight, 100)}
                      value={scrollPosition}
                      onChange={(e) => setScrollPosition(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>

                  {/* Speed Control Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setScrollSpeed(Math.max(0.25, scrollSpeed - 0.25))}
                      className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center"
                      disabled={scrollSpeed <= 0.25}
                      title="Slower"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <div className="px-2 py-1 bg-slate-800 rounded text-white text-xs font-bold min-w-[40px] text-center">
                      {scrollSpeed}x
                    </div>
                    <button
                      onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.25))}
                      className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center"
                      disabled={scrollSpeed >= 5}
                      title="Faster"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>

                  {/* Pause/Play Button */}
                  <button
                    onClick={() => setIsScrollPaused(!isScrollPaused)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      isScrollPaused
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title={isScrollPaused ? 'Resume Scroll' : 'Pause Scroll'}
                  >
                    <i className={`fas ${isScrollPaused ? 'fa-play' : 'fa-pause'}`}></i>
                    {isScrollPaused ? 'Resume' : 'Pause'}
                  </button>

                  {/* Reset Buttons */}
                  <button
                    onClick={() => setScrollPosition(0)}
                    className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs transition-all flex items-center justify-center"
                    title="Reset to Top"
                  >
                    <i className="fas fa-fast-backward"></i>
                  </button>
                  <button
                    onClick={() => setScrollSpeed(1)}
                    className="w-8 h-8 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-xs transition-all flex items-center justify-center"
                    title="Reset Speed to 1x"
                  >
                    <i className="fas fa-redo"></i>
                  </button>

                  {/* Opacity Control - Compact */}
                  <div className="flex items-center gap-2 ml-auto">
                    <label className="text-white text-[10px] font-semibold flex items-center gap-1">
                      <i className="fas fa-adjust"></i>
                      Opacity
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(parseInt(e.target.value))}
                      className="w-24 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      disabled={isRecording}
                    />
                    <span className="text-white text-[10px] font-bold min-w-[30px]">{overlayOpacity}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraRecorder;

