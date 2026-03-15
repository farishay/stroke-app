const WORKER_URL = 'https://strokeai.farwa-tariq2434.workers.dev'

export async function sendMessage(message, strokeCount = 0) {
  try {
    const res = await fetch(WORKER_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message, strokeCount }),
    })

    const data = await res.json()
    return data.reply || getOfflineResponse(message)

  } catch {
    return getOfflineResponse(message)
  }
}

function getOfflineResponse(message) {
  const l = message.toLowerCase()

  if (l.includes('idea') || l.includes('draw') || l.includes('suggest')) {
    const ideas = [
      'Try a sitting fox — start at the tail, loop through the body, trace both ears, end at the nose.',
      'A heron in profile: tall S-curved neck, sharp beak, two thin legs. Very elegant.',
      'Sleeping cat curled in a circle — one closed loop with two small ear bumps.',
      'Elephant from the side: big arched back, curling trunk, tiny tail.',
      'A leaping deer: arched spine, four legs extended, two antler tines.',
    ]
    return ideas[Math.floor(Math.random() * ideas.length)]
  }

  if (l.includes('tip') || l.includes('improve') || l.includes('technique')) {
    const tips = [
      'Slow at curves, fast on straights — gives strokes natural rhythm.',
      'Practice the motion in air before touching canvas. Muscle memory is everything.',
      'If you can remove a line and subject is still recognizable, remove it.',
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  if (l.includes('title') || l.includes('name')) {
    return "Single-word titles work beautifully: 'Vigil', 'Threshold', 'Drift', 'Pause'."
  }

  if (l.includes('feedback') || l.includes('review')) {
    return "Focus on your most expressive line — does everything else support it, or distract?"
  }

  return "Every line is a decision. The more intentional you are, the more alive your sketches feel."
}