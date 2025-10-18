import React, { useState, useEffect } from "react";
import { getAvailableProperties } from "../functions.js";
import "./Properties.css";

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const result = await getAvailableProperties();
        console.log('Properties result:', result); // Debug log
        
        if (result.error) {
          setError(result.error);
          setProperties([]);
        } else {
          setProperties(result.data || []);
          setError(null);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (error) {
    return <div className="properties">
      <h1>🏡 Available Properties</h1>
      <p style={{color: 'red'}}>Error loading properties: {error.message}</p>
    </div>;
  }

  return (
    <div className="properties">
      <h1>🏡 Available Properties</h1>
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <table className="properties-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Property Name</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property, index) => (
              <tr key={property.property_name || index}>
                <td>{index + 1}</td>
                <td>{property.property_name}</td>
                <td>₹{property.property_value || property.value}</td>
                <td>{property.owner_id ? 'Owned' : 'Available'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Properties;
