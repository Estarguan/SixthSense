import { useState, useEffect } from 'react'

export default function Navbar({ isLive }) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    update()
    const t = setInterval(update, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-bracket">[</span>
        <span className="brand-name">Sixth Sense</span>
        <span className="brand-bracket">]</span>
      </div>

      <div className="navbar-right">
        <span className="sys-time">{time}</span>
        <div className={`status-badge ${isLive ? 'status-live' : 'status-offline'}`}>
          <span className={isLive ? 'dot-live' : 'dot-off'} />
          {isLive ? 'MONITORING' : 'OFFLINE'}
        </div>
      </div>
    </nav>
  )
}
