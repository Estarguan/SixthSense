import { useState, useRef, useCallback } from 'react'
import Navbar from './components/Navbar'
import AlertFeed from './components/AlertFeed'
import CameraFeed from './components/CameraFeed'
import SuspiciousPanel from './components/SuspiciousPanel'
import useMotionSocket from './hooks/useMotionSocket'
import useAudioTrigger from './hooks/useAudioTrigger'
import useCamera from './hooks/useCamera'
import useSuspiciousMode from './hooks/useSuspiciousMode'
import useStreamRelay from './hooks/useStreamRelay'
import './App.css'

export default function App() {
  const isMonitoring = true
  const [isSuspicious, setIsSuspicious] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [alerts, setAlerts] = useState([])
  const monitorRef = useRef(null)

  const { streamRef, ready, error } = useCamera()
  useStreamRelay(streamRef, ready)
  const { analyze } = useSuspiciousMode()
  const analyzingRef = useRef(false)
  const fileInputRef = useRef(null)

  const enterSuspiciousMode = useCallback(async () => {
    if (analyzingRef.current) return
    analyzingRef.current = true
    setIsSuspicious(true)
    setAnalysisResult(null)
    setCountdown(10)

    try {
      const result = await analyze(streamRef, setCountdown)
      setAnalysisResult(result)

      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      })

      if (result.decision === 'send_alert') {
        setAlerts(prev => [{ id: Date.now(), time, type: 'alert', confidence: result.confidence }, ...prev])
      } else if (result.decision === 'continue_analyzing') {
        analyzingRef.current = false
        setTimeout(() => enterSuspiciousMode(), 1000)
      }
    } catch (err) {
      console.error('Analysis failed:', err)
      setIsSuspicious(false)
      analyzingRef.current = false
    }
  }, [analyze, streamRef])

  const handleTrigger = useCallback((type) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    setAlerts(prev => [{ id: Date.now(), time, type }, ...prev])
    if (!isSuspicious) enterSuspiciousMode()
  }, [isSuspicious, enterSuspiciousMode])

  useMotionSocket(
    () => handleTrigger('motion'),
    () => handleTrigger('keyword'),
  )
  useAudioTrigger(isMonitoring && !isSuspicious, () => handleTrigger('audio'))

  async function analyzeUploadedVideo(file) {
    if (analyzingRef.current) return
    analyzingRef.current = true
    setIsSuspicious(true)
    setAnalysisResult(null)
    setCountdown(null)

    const time = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
    setAlerts(prev => [{ id: Date.now(), time, type: 'upload' }, ...prev])

    try {
      const mimeType = file.type || 'video/mp4'
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result.replace(/^data:.*;base64,/, ''))
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const res = await fetch('http://localhost:3001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoBase64: base64, mimeType }),
      })
      const result = await res.json()
      setAnalysisResult(result)

      if (result.decision === 'send_alert') {
        const alertTime = new Date().toLocaleTimeString('en-US', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
        })
        setAlerts(prev => [{ id: Date.now(), time: alertTime, type: 'alert', confidence: result.confidence }, ...prev])
      } else if (result.decision === 'continue_analyzing') {
        analyzingRef.current = false
        setTimeout(() => enterSuspiciousMode(), 1000)
      }
    } catch (err) {
      console.error('Upload analysis failed:', err)
      setIsSuspicious(false)
      analyzingRef.current = false
    }
  }

  function dismissAlert() {
    setIsSuspicious(false)
    setAnalysisResult(null)
    analyzingRef.current = false
  }

  function handleTryDemo() {
    monitorRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="page-bg">
      <Navbar isLive={isMonitoring} />

      {/* Hero */}
      <section className="hero">
        <h1 className="hero-heading">
          Watch over<br />
          <em>what matters</em>
        </h1>

        <p className="hero-body">
          Sixth Sense connects to your home camera and uses AI<br />
          to monitor for conflict — classifying risk in real time,<br />
          privately. You only see the footage if there's an alert.
        </p>

        <button onClick={handleTryDemo} className="btn-primary">
          <span className="btn-bracket">[</span>
          LAUNCH DEMO
          <span className="btn-bracket">]</span>
        </button>
      </section>

      {/* Live Monitoring */}
      <section ref={monitorRef} className="monitor-section">
        <div className="section-header">
          <span className="section-title">LIVE MONITORING</span>
          <div className="section-rule" />
        </div>

        {isSuspicious && (
          <div style={{ marginBottom: '14px' }}>
            <SuspiciousPanel
              countdown={countdown}
              result={analysisResult}
              onDismiss={dismissAlert}
            />
          </div>
        )}

        <div className="monitor-grid">
          <CameraFeed streamRef={streamRef} ready={ready} error={error} />
          <AlertFeed alerts={alerts} />
        </div>

        <div className="action-bar">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files[0]) analyzeUploadedVideo(e.target.files[0])
              e.target.value = ''
            }}
          />
          <button
            onClick={async () => {
              await fetch('http://localhost:3001/test-speech', { method: 'POST' })
              new Audio('http://localhost:3001/audio/latest').play()
            }}
            className="btn-secondary"
          >
            [ PLAY ALERT AUDIO ]
          </button>
          <button
            onClick={() => fetch('http://localhost:3001/test-notification', { method: 'POST' })}
            className="btn-danger"
          >
            [ SEND TEST NOTIFICATION ]
          </button>
          <button
            onClick={() => handleTrigger('manual')}
            className="btn-warning"
            disabled={isSuspicious}
          >
            [ MANUAL SUSPICIOUS TRIGGER ]
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-warning"
            disabled={isSuspicious}
          >
            [ UPLOAD VIDEO FOR ANALYSIS ]
          </button>
        </div>
      </section>
    </div>
  )
}
