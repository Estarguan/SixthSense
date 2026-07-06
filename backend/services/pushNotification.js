import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOKEN_FILE = join(__dirname, '../.push-token')

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

function loadToken() {
  try { return readFileSync(TOKEN_FILE, 'utf8').trim() } catch { return null }
}

let pushToken = loadToken()
if (pushToken) console.log('Push token loaded from disk:', pushToken)

export function registerToken(token) {
  pushToken = token
  try { writeFileSync(TOKEN_FILE, token, 'utf8') } catch (err) {
    console.warn('Could not persist push token:', err.message)
  }
  console.log('Push token registered:', token)
}

export async function sendAlertNotification({ confidence, analysis }) {
  if (!pushToken) {
    console.warn('No push token registered — cannot send notification')
    return
  }

  const risk = confidence >= 0.8 ? 'High Risk' : confidence >= 0.5 ? 'Medium Risk' : 'Low Risk'
  const score = Math.round(confidence * 10)

  const message = {
    to: pushToken,
    sound: 'default',
    title: `⚠️ ${risk} Detected`,
    body: analysis?.summary ?? 'Suspicious activity detected at home.',
    data: {
      alert: {
        type: risk,
        location: 'Home',
        score,
        confidence,
        description: analysis?.summary ?? '',
        date: new Date().toISOString(),
      },
    },
    priority: 'high',
  }

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    const json = await res.json()
    console.log('Push notification sent:', json)
  } catch (err) {
    console.error('Failed to send push notification:', err.message)
  }
}
