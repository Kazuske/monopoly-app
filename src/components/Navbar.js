import React from 'react'

export default function Navbar({ currentPage, setCurrentPage }) {
  const pages = ['Leaderboard', 'Properties', 'Teams', 'Summary']

  return (
    <nav className="bg-purple-600 text-white p-4 flex gap-6">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`hover:underline ${currentPage === page ? 'font-bold underline' : ''}`}
        >
          {page}
        </button>
      ))}
    </nav>
  )
}
