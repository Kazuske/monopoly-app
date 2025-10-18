import { useState } from 'react'
import { addCash, removeCash, removeTeam, updateTeamCash } from '../functions'

export default function TeamManager() {
  const [teamId, setTeamId] = useState('')
  const [amount, setAmount] = useState('')

  async function handleAddCash() {
    await addCash(parseInt(amount), parseInt(teamId))
  }

  async function handleRemoveCash() {
    await removeCash(parseInt(amount), parseInt(teamId))
  }

  async function handleUpdateTotalCash() {
    await updateTeamCash(parseInt(amount), parseInt(teamId))
  }

  async function handleRemoveTeam() {
    await removeTeam(parseInt(teamId))
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">⚙️ Manage Teams</h2>

      <div className="flex flex-col gap-3 max-w-sm">
        <input
          className="border p-2"
          placeholder="Team ID"
          value={teamId}
          onChange={e => setTeamId(e.target.value)}
        />
        <input
          className="border p-2"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button className="bg-green-500 text-white p-2 rounded" onClick={handleAddCash}>Add Cash</button>
        <button className="bg-yellow-500 text-white p-2 rounded" onClick={handleRemoveCash}>Remove Cash</button>
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleUpdateTotalCash}>Update Total Cash</button>
        <button className="bg-red-500 text-white p-2 rounded" onClick={handleRemoveTeam}>Remove Team</button>
      </div>
    </div>
  )
}
