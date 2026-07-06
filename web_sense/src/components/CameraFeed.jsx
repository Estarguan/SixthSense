import { useEffect, useRef } from 'react'

export default function CameraFeed({ streamRef, ready, error }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [ready])

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-label">CAMERA // FEED</span>
        <div className="live-indicator">
          <span className="dot-red" />
          <span className="panel-label" style={{ color: 'var(--red)' }}>REC</span>
        </div>
      </div>

      <div className="camera-viewport">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`camera-video ${ready ? 'ready' : ''}`}
        />

        {!ready && (
          <div className="camera-placeholder">
            <span className="camera-icon">◈</span>
            <span className="camera-status">{error ? error.toUpperCase() : 'INITIALIZING...'}</span>
          </div>
        )}

        {ready && <div className="camera-scan-wrap" />}
        <div className="camera-crt" />
      </div>

      <div className="panel-footer">
        <span className="panel-label">MONITORING ACTIVE</span>
        <span className="panel-label">TRIGGERS ARMED</span>
      </div>
    </div>
  )
}
