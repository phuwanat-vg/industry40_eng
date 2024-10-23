import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import axios from 'axios';
import DataTable from './DataTable';
import Loading from './Loading';

function Monitor() {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState('station1'); // Default table

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchData(selectedTable); // Fetch default table data
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate, selectedTable]); // Re-fetch when the selectedTable changes

  const fetchData = async (tableName) => {
    setLoading(true);
    setError(null); // Reset any previous errors
    try {
      const response = await axios.get(`http://localhost:5000/data/${tableName}`);
      //const response = await axios.get(`http://ime40-fb722.web.app:5000/api/data/${tableName}`);
      setColumns(response.data.columns);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to fetch data from ${tableName}. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle table selection change
  const handleTableChange = (tableName) => {
    setSelectedTable(tableName); // Set the new selected table
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 bg-light sidebar">
          <h5></h5>
          <ul className="list-group">
            {['Overall','station1', 'station2', 'station3', 'station4', 'station5', 'station6'].map((table, index) => (
              <li
                key={index}
                className={`list-group-item ${selectedTable === table ? 'active' : ''}`}
                onClick={() => handleTableChange(table)} // Update the selected table on click
              >
                {table}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-8">
          <h2>Data from {selectedTable}</h2>
          {isAuthenticated ? (
            loading ? <Loading /> : (
              error ? <p style={{ color: 'red' }}>{error}</p> : <DataTable columns={columns} data={data} />
            )
          ) : (
            <p>Loading authentication...</p>
          )}
        </div>

        <div className="col-md-2 right-space">
          {/* Optional right-side space */}
        </div>
      </div>
    </div>
  );
}

export default Monitor;
