import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const TablePage = ({ match }) => {
  const { tableName } = useParams();
  const [tableData, setTableData] = useState([]);
  const [editFormData, setEditFormData] = useState({});
  const [editingRecordId, setEditingRecordId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/data/${tableName}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  const handleEdit = (recordId) => {
    const selectedRecord = tableData.find((record) => record.id === recordId);
    setEditingRecordId(recordId);
    setEditFormData(selectedRecord);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3001/update/${tableName}/${editingRecordId}`,
        editFormData
      );
      setEditFormData({});
      setEditingRecordId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({});
    setEditingRecordId(null);
  };

  const handleDelete = async (recordId) => {
    try {
      await axios.delete(
        `http://localhost:3001/delete/${tableName}/${recordId}`
      );
      fetchData();
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-6xl p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          {tableName} Table
        </h2>
        <Link to={`/table/${tableName}/insert`} className="block mt-4">
          <button className="bg-blue-500 text-white px-4 py-2">Insert</button>
        </Link>
        <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4 bg-white dark:bg-gray-900">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="text-left dark:text-gray-400">
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Product name
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Description
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Price
                </th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((record, index) => (
                <tr key={index} className={`border-b dark:border-gray-700`}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">
                    {editingRecordId === record.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name || ""}
                        onChange={handleEditInputChange}
                        className="border rounded w-full py-1 px-2 dark:bg-gray-800"
                      />
                    ) : (
                      record.name
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {editingRecordId === record.id ? (
                      <textarea
                        name="description"
                        value={editFormData.description || ""}
                        onChange={handleEditInputChange}
                        className="border rounded w-full py-1 px-2 dark:bg-gray-800"
                      />
                    ) : (
                      record.description
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {editingRecordId === record.id ? (
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price || ""}
                        onChange={handleEditInputChange}
                        className="border rounded w-full py-1 px-2 dark:bg-gray-800"
                      />
                    ) : (
                      record.price
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {editingRecordId === record.id ? (
                      <>
                        <button
                          onClick={handleUpdate}
                          className="text-green-500 hover:underline"
                        >
                          Update
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-500 hover:underline ml-2"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="#"
                          className="text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => handleEdit(record.id)}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-500 hover:underline ml-2"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TablePage;
