import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { getTeamLeaderboard } from "./functions.js";
// Import components
const Navigation = React.lazy(() => import("./components/Navigation.js"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard.js"));
const TeamSummary = React.lazy(() => import("./pages/TeamSummary.js"));
const Properties = React.lazy(() => import("./pages/Properties.js"));
const AddCash = React.lazy(() => import("./pages/AddCash.js"));
const RemoveCash = React.lazy(() => import("./pages/RemoveCash.js"));
const EditTeam = React.lazy(() => import("./pages/EditTeam.js"));
const RemoveTeam = React.lazy(() => import("./pages/RemoveTeam.js"));
const AddProperty = React.lazy(() => import("./pages/AddProperty.js"));
const RemoveProperty = React.lazy(() => import("./pages/RemoveProperty.js"));
const ResetTables = React.lazy(() => import("./pages/ResetTables.js"));
const Timer = React.lazy(() => import("./components/Timer.js"));

function App() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const result = await getTeamLeaderboard();
        setLeaderboard(result.data || []);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="App">
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="app-header">
          <h1 className="app-title">🎲 Monopoly Manager</h1>
          <Timer />
        </div>
        <Navigation />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<Leaderboard leaderboard={leaderboard} loading={loading} />}
            />
            <Route path="/team-summary" element={<TeamSummary />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/add-cash" element={<AddCash />} />
            <Route path="/remove-cash" element={<RemoveCash />} />
            <Route path="/edit-team" element={<EditTeam />} />
            <Route path="/remove-team" element={<RemoveTeam />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/remove-property" element={<RemoveProperty />} />
            <Route path="/reset-tables" element={<ResetTables />} />
          </Routes>
        </div>
      </React.Suspense>
    </div>
  );
}

export default App;
