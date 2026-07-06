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
        </div>
      </section>
    </div>
  )
}
