import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

export default function AddPatient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const {addPatient} = useContext(UserContext)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    addPatient(name, email)
    setName('') 
    setEmail('')
   
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>


        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
        >
          Add Patient
        </button>
      </form>
    </div>
  );
}
