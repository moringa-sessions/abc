import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const { current_user,updatePatient, patients, deletePatient } = useContext(UserContext);
  
  // State for modal visibility & form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });


  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setFormData({ name: patient.name, email: patient.email });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleUpdate = () => {

    updatePatient(selectedPatient.id, formData);
    closeModal();
  };

  return (
    <div>
      <h1 className="my-3 text-xl font-bold">Patients ( {patients && patients.length})</h1>

      {current_user ? (
        <div>
          {patients && patients.length < 1 && (
            <div className="flex items-center justify-center  py-12">
               <p>You don't have any patients</p>
              <Link to="/addpatient" className="ml-2 text-green-600 underline">Add</Link>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-green-700 rounded-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Actions</th>
                  <th className="py-2 px-4 border">Prescription</th>

                </tr>
              </thead>
              <tbody>
                {patients && patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">
                      <Link to={`/patient/${patient.id}`} className="font-semibold text-green-600 hover:underline">
                        {patient.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 border">{patient.email}</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => openEditModal(patient)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePatient(patient.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </td>
                    <td className="py-2 px-4 border">
                      <Link to={`/patient/${patient.id}`} className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2">                       
                          View Details
                        </Link>
                      </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <Link to="/login" className="font-medium">Login</Link> to access this page.
          </div>
        </div>
      )}



      {/* Edit Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>
            
            <label className="block mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-md mb-4"
            />

            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-md mb-4"
            />

            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
