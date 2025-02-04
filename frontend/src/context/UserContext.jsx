import { createContext, useEffect, useState } from "react";
import {toast} from "react-toastify"
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) =>
{
    const navigate = useNavigate()
    const [authToken , setAuthToken] = useState( ()=> sessionStorage.getItem("token")  )
    const [current_user, setCurrentUser] = useState(null)
const [patients, setPatients] = useState([])

    console.log("Current user ",current_user)


    // LOGIN
    const login = (email, password) =>
    {
        toast.loading("Logging you in ... ")
        fetch("http://127.0.0.1:5000/login",{
            method:"POST",
            headers: {
                'Content-type': 'application/json',
              },
            body: JSON.stringify({
                email, password
            })
        })
        .then((resp)=>resp.json())
        .then((response)=>{
            console.log("token",response.access_token)
            if(response.access_token){
                toast.dismiss()

                sessionStorage.setItem("token", response.access_token);

                setAuthToken(response.access_token)

                fetch('http://127.0.0.1:5000/currentUser',{
                    method:"GET",
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Bearer ${response.access_token}`
                    }
                })
                .then((response) => response.json())
                .then((response) => {
                    console.log("current_user", response)
                  if(response.email){
                          setCurrentUser(response)
                          toast.success("Successfully Logged in")
                          navigate("/")
                        }
                });


            }
            else if(response.error){
                toast.dismiss()
                toast.error(response.error)

            }
            else{
                toast.dismiss()
                toast.error("Failed to login")

            }


        })
    };

    const logout = () =>
    {

        toast.loading("Logging out ... ")
        fetch("http://127.0.0.1:5000/logout",{
            method:"DELETE",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },

        })
        .then((resp)=>resp.json())
        .then((response)=>{
           console.log(response);

            if(response.success)
            {
                sessionStorage.removeItem("token");
                setAuthToken(null)
                setCurrentUser(null)

                toast.dismiss()
                toast.success("Successfully Logged out")

                navigate("/login")
            }
        })

    };


    // Fetch current user
    useEffect(()=>{
        fetchCurrentUser()
    }, [])
    const fetchCurrentUser = () =>
    {


        fetch('http://127.0.0.1:5000/currentUser',{
            method:"GET",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
          if(response.email){
           setCurrentUser(response)
          }
        });
    };

    


    // ADD dcotor
    const addDoctor = (name, email, password) =>
    {
        toast.loading("Registering ... ")
        fetch("http://127.0.0.1:5000/doctors",{
            method:"POST",
            headers: {
                'Content-type': 'application/json',
              },
            body: JSON.stringify({
                name, email, password
            })
        })
        .then((resp)=>resp.json())
        .then((response)=>{
            console.log(response);

            if(response.success){
                toast.dismiss()
                toast.success(response.success)
                navigate("/login")
            }
            else if(response.error){
                toast.dismiss()
                toast.error(response.error)

            }
            else{
                toast.dismiss()
                toast.error("Failed to add")

            }


        })


    };


    // Add patient
    const addPatient = (name, email) =>
        {
            toast.loading("Registering ... ")
            fetch("http://127.0.0.1:5000/patient",{
                method:"POST",
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                  },
                body: JSON.stringify({
                    name, email
                })
            })
            .then((resp)=>resp.json())
            .then((response)=>{
                console.log(response);
    
                if(response.success){
                    toast.dismiss()
                    toast.success(response.success)
                    navigate("/")
                    fetchPatients()
                }
                else if(response.error){
                    toast.dismiss()     
                    toast.error(response.error)
    
                }
                else{
                    toast.dismiss()
                    toast.error("Failed to add patient")
    
                }
            })
    
        };




    const updatePatient = (id, formData) =>
    {
        toast.loading("Updating ... ")
        fetch(`http://127.0.0.1:5000/patient/${id}`,{
            method:"PUT",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
            body: JSON.stringify( formData )
        })
        .then((resp)=>resp.json())
        .then((response)=>{
            console.log(response);

            if(response.success){
                toast.dismiss()
                toast.success(response.success)
                navigate("/")
                fetchPatients()
            }
            else if(response.error){
                toast.dismiss()     
                toast.error(response.error)

            }
            else{
                toast.dismiss()
                toast.error("Failed to update patient")

            }
        })
    };


    const deletePatient =  (patientId) =>
    {
        toast.loading("Deleting ... ")
        fetch(`http://127.0.0.1:5000/patient/${patientId}`,{
            method:"DELETE",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
           if(response.success){
            toast.dismiss()
            toast.success(response.success)
            fetchPatients()
           }
           else if(response.error){
            toast.dismiss()
            toast.error(response.error)
           }
           else{
            toast.dismiss()
            toast.error("Failed to delete")
           }
        });
    };


    // get patients
    useEffect(()=>{
        fetchPatients()
    }, [])
    const fetchPatients = () =>
    {
        fetch('http://127.0.0.1:5000/patients',{
            method:"GET",
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        })
        .then((response) => response.json())
        .then((response) => {
          console.log("Patients", response)
          setPatients(response)
        });
    }

    // Prescription=======================================

     



        const createPrescription = (patient_id, data) => {
            fetch("http://127.0.0.1:5000/prescriptions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ patient_id, ...data }),
            })
            .then((res) => res.json())
            .then(() => fetchPatients())
            .catch((error) => console.error("Error creating prescription:", error));
        };



        const updatePrescription = (prescription_id, data) => {
            fetch(`http://127.0.0.1:5000/prescriptions/${prescription_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(data),
            })
            .then((res) => res.json())
            .then((response) => 
                {
                    if(response.success){
                        toast.success(response.success)                    
                        fetchPatients()
                    }
                    else{
                        toast.error("Error updating prescription")
                    }

        })
            
        
        };

        
    //  Delet prescriptions
        const deletePrescription = (prescription_id, patient_id) => {
            fetch(`http://127.0.0.1:5000/prescriptions/${prescription_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
            },
            })
            .then(res=>res.json())
            .then((res) => {
                console.log(res);
                
               if(res.success){
                   toast.success(res.success) 
                fetchPatients()

                }
                else{
                  toast.error("Error deleting prescription")
                }
                
        })

        };

      
  const data = {
    authToken,
    login,
    current_user,
    logout,
    addDoctor,
    addPatient,
    updatePatient,
    deletePatient,
    patients,


    createPrescription,
    updatePrescription,
    deletePrescription,
      
  };

  return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
};
