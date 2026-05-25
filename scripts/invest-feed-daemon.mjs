
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const buildScript = path.join(__dirname, 'build-invest-feed.mjs')
const intervalMs = Math.max(60_000, Number(process.env.INVEST_FEED_INTERVAL_MS || 90 * 60 * 1000))

function runBuild() {
  const r = spawnSync(process.execPath, [buildScript], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env },
  })
  if (r.status !== 0) {
    console.error('[invest-feed-daemon] build exited', r.status)
  }
}

console.log('[invest-feed-daemon] every', Math.round(intervalMs / 60_000), 'min →', buildScript)
runBuild()
setInterval(runBuild, intervalMs)
