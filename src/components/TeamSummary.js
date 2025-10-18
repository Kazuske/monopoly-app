import { useState } from 'react'
import { getTeamSummary } from '../functions'

export default function TeamSummary() {
  const [teamId, setTeamId] = useState('')
  const [summary, setSummary] = useState([])

  async function loadSummary() {
    const data = await getTeamSummary(parseInt(teamId))
    setSummary(data)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Team Summary</h2>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          placeholder="Team ID"
          value={teamId}
          onChange={e => setTeamId(e.target.value)}
        />
        <button className="bg-purple-500 text-white p-2 rounded" onClick={loadSummary}>
          Load Summary
        </button>
      </div>

      {summary.length > 0 ? (
        <ul>
          {summary.map((row, index) => (
            <li key={index} className="p-2 border-b">
              <strong>{row.team_name}</strong> — 💰 {row.cash} | 🏡 {row.property_name ?? 'No Property'} ({row.property_value ?? '-'})
            </li>
          ))}
        </ul>
      ) : (
        <p>No data loaded.</p>
      )}
    </div>
  )
}
