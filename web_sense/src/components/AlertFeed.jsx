const TYPE_CONFIG = {
  motion:  { code: 'MOT', label: 'fast movement detected' },
  audio:   { code: 'AUD', label: 'loud sound detected' },
  keyword: { code: 'KWD', label: 'keyword detected' },
  alert:   { code: 'ALT', label: 'emergency alert triggered' },
}

export default function AlertFeed({ alerts }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-label">SYSTEM LOG</span>
        <span className="panel-label">{String(alerts.length).padStart(3, '0')} EVENTS</span>
      </div>

      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="alert-empty">
            <span className="empty-symbol">◌</span>
            <span className="panel-label">NO EVENTS // ALL CLEAR</span>
          </div>
        ) : (
          alerts.map((alert) => {
            const cfg = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.motion
            const isDanger = alert.type === 'alert'
            return (
              <div key={alert.id} className={`alert-item ${isDanger ? 'alert-item-danger' : ''}`}>
                <span className="alert-prompt">›</span>
                <span className={`alert-code ${isDanger ? 'alert-code-danger' : ''}`}>
                  {cfg.code}
                </span>
                <div className="alert-content">
                  <span className="alert-desc">{cfg.label}</span>
                  {alert.confidence !== undefined && (
                    <span className="alert-conf">CONF {alert.confidence}/10</span>
                  )}
                </div>
                <span className="alert-time">{alert.time}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
