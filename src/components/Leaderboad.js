import { useEffect, useState } from 'react'
import { getTeamLeaderboard } from '../functions'

export default function Leaderboard() {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    async function load() {
      const data = await getTeamLeaderboard()
      setTeams(data)
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
      <ul>
        {teams.map(team => (
          <li key={team.team_id} className="p-2 border-b">
            <span className="font-semibold">{team.team_name}</span> — 💰 {team.cash}
          </li>
        ))}
      </ul>
    </div>
  )
}
