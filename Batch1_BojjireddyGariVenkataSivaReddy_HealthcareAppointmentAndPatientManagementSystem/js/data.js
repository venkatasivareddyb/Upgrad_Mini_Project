


   //LOAD DATA FROM STORAGE


let patients = JSON.parse(localStorage.getItem("patients")) || [];
let doctors = JSON.parse(localStorage.getItem("doctors")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

   //SAVE FUNCTIONS

// Save patients
function savePatients() {
    localStorage.setItem("patients", JSON.stringify(patients));
}

// Save doctors
function saveDoctors() {
    localStorage.setItem("doctors", JSON.stringify(doctors));
}

// Save appointments
function saveAppointments() {
    localStorage.setItem("appointments", JSON.stringify(appointments));
}


   //GENERATE UNIQUE ID

function generateId(prefix) {
    return prefix + "_" + Date.now();
}

//HELPER FUNCTIONS

// Get patient by ID
function getPatientById(id) {
    return patients.find(p => p.id === id);
}

// Get doctor by ID
function getDoctorById(id) {
    return doctors.find(d => d.id === id);
}

// Reset all data (for testing/demo)
function resetData() {
    localStorage.clear();
    patients = [];
    doctors = [];
    appointments = [];
}