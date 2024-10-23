// src/components/DataTable.js
import React, { useState } from 'react';
import './DataTable.css'; // Import the CSS file for DataTable styles

function DataTable({ columns, data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (column) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === column &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key: column, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'ascending'
            ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
            : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData.reverse();
  }, [data, sortConfig]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  return (
    <div>
      <nav>
        <ul className="pagination justify-content-center mb-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  style={{ cursor: 'pointer' }}
                >
                  {column}
                  {sortConfig && sortConfig.key === column ? (
                    sortConfig.direction === 'ascending' ? (
                      <span className="sort-icon"> 🔼</span> // Ascending icon
                    ) : (
                      <span className="sort-icon"> 🔽</span> // Descending icon
                    )
                  ) : null} 
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td key={column}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <nav>
        <ul className="pagination justify-content-center mb-3">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default DataTable;
