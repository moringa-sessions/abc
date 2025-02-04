import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function IndividualPatient() {
  const { id } = useParams();
  const {current_user, patients,  createPrescription, updatePrescription, deletePrescription } = useContext(UserContext);
  const [prescriptionData, setPrescriptionData] = useState({
    medication_name: "",
    dosage: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editPrescriptionId, setEditPrescriptionId] = useState(null);

  const patient = patients && patients.find((patient) => patient.id === parseInt(id));


  console.log("xxxx ",patient);
  

  const handleAddPrescription = () => {
    if (!prescriptionData.medication_name || !prescriptionData.dosage) {
      return;
    }
    createPrescription(patient.id, prescriptionData);
    setPrescriptionData({ medication_name: "", dosage: "" });
  };

  const handleEditPrescription = (prescription) => {
    setPrescriptionData({
      medication_name: prescription.medication_name,
      dosage: prescription.dosage,
    });
    setIsEdit(true);
    setEditPrescriptionId(prescription.id);
  };


  const handleUpdatePrescription = () => {
    console.log("ppp ", editPrescriptionId);
    
    updatePrescription(editPrescriptionId, { ...prescriptionData, patient_id: patient.id });

    setIsEdit(false);
    setPrescriptionData({ medication_name: "", dosage: "" });
    setEditPrescriptionId(null);
  };

  const handleDeletePrescription = (prescription_id) => {
    deletePrescription(prescription_id, patient.id);
  };

  return (
    <>
    {current_user ?

    <div>
      {!patient ? (
        <p className="min-w-min text-center text-4xl my-16">Patient not found!</p>
      ) : (
        <div className="border border-green-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <p className="text-right">Patient's Name: <strong>{patient && patient.name}</strong></p>
          </div>
          <h1 className="font-semibold">{patient && patient.email}</h1>

          <div className="mt-5">
            <h2 className="font-semibold text-xl mb-3">Prescriptions</h2>
            <div>
              <input
                type="text"
                placeholder="Medication Name"
                className="p-2 border border-gray-300 mb-2"
                value={prescriptionData.medication_name}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, medication_name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Dosage"
                className="p-2 border border-gray-300 mb-2"
                value={prescriptionData.dosage}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, dosage: e.target.value })}
              />
              <button
                onClick={isEdit ? handleUpdatePrescription : handleAddPrescription}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                {isEdit ? "Update Prescription" : "Add Prescription"}
              </button>
            </div>

            <table className="min-w-full mt-5 bg-white border border-green-700 rounded-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-2 px-4 border">Medication</th>
                  <th className="py-2 px-4 border">Dosage</th>
                  <th className="py-2 px-4 border">Prescribed by</th>

                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  patient && patient.prescriptions.length < 1 &&
                  <p className="mx-auto w-full text-center my-8">No prescription for this patient!</p>
                }
                {patient && patient.prescriptions &&
                  patient && patient.prescriptions.map((prescription) => (
                    <tr key={prescription.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border">{prescription.medication_name}</td>
                      <td className="py-2 px-4 border">{prescription.dosage}</td>
                      <td className="py-2 px-4 border">{prescription.doctor_name}</td>

                      <td className="py-2 px-4 border">
                        <button
                          onClick={() => handleEditPrescription(prescription)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(prescription.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    :
    <div className="flex justify-center items-center min-h-[30vh] text-3xl text-green-500">
      <div>
        Login to access this page
        </div> 
    </div>
}

</>
  );
}
