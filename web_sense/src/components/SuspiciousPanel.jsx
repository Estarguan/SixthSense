const SEGMENTS = 20

export default function SuspiciousPanel({ countdown, result, onDismiss }) {
  if (!result) {
    const isUpload = countdown === null
    const filled = isUpload ? SEGMENTS : Math.round(((10 - countdown) / 10) * SEGMENTS)
    return (
      <div className="suspicious-panel suspicious-analyzing">
        <div className="suspicious-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="dot-amber" />
            <span className="suspicious-label">
              {isUpload ? 'UPLOAD // ANALYZING' : 'SUSPICIOUS ACTIVITY // ANALYZING'}
            </span>
          </div>
          <span className="suspicious-count">{isUpload ? '...' : `${countdown}s`}</span>
        </div>
        <div className="seg-bar">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <div key={i} className={`seg ${i < filled ? 'seg-amber' : ''}`} />
          ))}
        </div>
        <p className="suspicious-sub">
          {isUpload ? 'PROCESSING UPLOAD — ALL TRIGGERS PAUSED' : 'RECORDING SEQUENCE — ALL TRIGGERS PAUSED'}
        </p>
      </div>
    )
  }

  const isAlert    = result.decision === 'send_alert'
  const isContinue = result.decision === 'continue_analyzing'
  const isNormal   = result.decision === 'return_to_normal'

  const label = {
    send_alert:        'ALERT // THREAT CONFIRMED',
    continue_analyzing:'ANALYZING // CONTINUING WATCH',
    return_to_normal:  'CLEAR // RETURNED TO NORMAL',
  }[result.decision]

  const panelClass  = isAlert ? 'suspicious-alert' : isContinue ? 'suspicious-continue' : 'suspicious-clear'
  const labelColor  = isAlert ? 'var(--red)' : isContinue ? 'var(--amber)' : 'var(--phosphor)'
  const segClass    = isAlert ? 'seg-red' : isContinue ? 'seg-amber' : 'seg-green'
  const filled      = Math.round((result.confidence / 10) * SEGMENTS)

  return (
    <div className={`suspicious-panel ${panelClass}`}>
      <div className="suspicious-header">
        <span className="suspicious-label" style={{ color: labelColor }}>{label}</span>
        <span className="suspicious-count" style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
          CONF {result.confidence}/10
        </span>
      </div>

      <div className="seg-bar">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div key={i} className={`seg ${i < filled ? segClass : ''}`} />
        ))}
      </div>

      <p className="suspicious-analysis">{result.analysis}</p>

      {(isAlert || isNormal) && (
        <button onClick={onDismiss} className="btn-dismiss">
          {isNormal ? '[ PROCEED ]' : '[ DISMISS ]'}
        </button>
      )}
    </div>
  )
}
