import { useEffect, useState } from 'react'
import { getAvailableProperties } from '../functions'

export default function Properties() {
  const [properties, setProperties] = useState([])

  useEffect(() => {
    async function load() {
      const data = await getAvailableProperties()
      setProperties(data)
    }
    load()
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏠 Available Properties</h2>
      <ul>
        {properties.map(p => (
          <li key={p.property_name} className="p-2 border-b">
            {p.property_name} — 💵 {p.property_value}
          </li>
        ))}
      </ul>
    </div>
  )
}
