$(document).ready(function () {
    loadDropdowns();
    renderAppointments();

    $("#appointmentForm").submit(function (e) {
        e.preventDefault();

        if (!validateAppointment()) return;

        bookAppointment();
        $("#appointmentModal").modal("hide");
    });

    // Add filter event listeners
    $("#filterDate, #filterStatus").on("change", function() {
        renderAppointments();
    });
});

function loadDropdowns() {
    // Load doctors
    let doctorSelect = $("#doctorSelect");
    doctorSelect.empty();
    doctorSelect.append('<option value="">Select Doctor</option>');
    doctors.forEach(doctor => {
        doctorSelect.append(`<option value="${doctor.id}">${doctor.name} (${doctor.specialization})</option>`);
    });
}

function validateAppointment() {
    if (!$("#patientName").val().trim())
        return showToast("Enter patient name", "error"), false;

    if (!$("#patientAge").val() || $("#patientAge").val() < 1 || $("#patientAge").val() > 120)
        return showToast("Enter valid age", "error"), false;

    if (!$("#patientGender").val())
        return showToast("Select gender", "error"), false;

    if (!$("#patientPhone").val().trim())
        return showToast("Enter phone number", "error"), false;

    if (!/^\d{10}$/.test($("#patientPhone").val()))
        return showToast("Phone must be 10 digits", "error"), false;

    if (!$("#patientEmail").val().trim())
        return showToast("Enter email", "error"), false;

    if (!/^\S+@\S+\.\S+$/.test($("#patientEmail").val()))
        return showToast("Invalid email", "error"), false;

    if (!$("#doctorSelect").val())
        return showToast("Select doctor", "error"), false;

    if (!$("#date").val())
        return showToast("Select date", "error"), false;

    if (!$("#time").val())
        return showToast("Select time", "error"), false;

    return true;
}

function bookAppointment() {
    let patientName = $("#patientName").val().trim();
    let patientAge = $("#patientAge").val();
    let patientGender = $("#patientGender").val();
    let patientPhone = $("#patientPhone").val();
    let patientEmail = $("#patientEmail").val();
    let patientNotes = $("#patientNotes").val();
    let doctorId = $("#doctorSelect").val();
    let date = $("#date").val();
    let time = $("#time").val();

    let exists = appointments.find(a =>
        a.doctorId === doctorId &&
        a.date === date &&
        a.time === time &&
        a.status === "Booked"
    );

    if (exists)
        return showToast("Slot already booked", "error");

    // Check if patient already exists by phone
    let existingPatient = patients.find(p => p.phone === patientPhone);
    let patientId;

    if (existingPatient) {
        // Update existing patient
        patientId = existingPatient.id;
        existingPatient.name = patientName;
        existingPatient.age = patientAge;
        existingPatient.gender = patientGender;
        existingPatient.phone = patientPhone;
        existingPatient.email = patientEmail;
        existingPatient.notes = patientNotes;
    } else {
        // Add new patient
        patientId = generateId("PAT");
        patients.push({
            id: patientId,
            name: patientName,
            age: patientAge,
            gender: patientGender,
            phone: patientPhone,
            email: patientEmail,
            notes: patientNotes
        });
    }

    savePatients();

    appointments.push({
        id: generateId("APT"),
        patientId,
        patientName,
        patientAge,
        patientGender,
        patientPhone,
        patientEmail,
        patientNotes,
        doctorId,
        date,
        time,
        status: "Booked"
    });

    saveAppointments();
    renderAppointments();
    clearAppointmentForm();
    showToast("Appointment booked");
}

function renderAppointments() {
    let tbody = $("#appointmentTable");
    tbody.empty();

    let filteredAppointments = appointments;

    // Apply date filter
    let filterDate = $("#filterDate").val();
    if (filterDate) {
        filteredAppointments = filteredAppointments.filter(a => a.date === filterDate);
    }

    // Apply status filter
    let filterStatus = $("#filterStatus").val();
    if (filterStatus) {
        filteredAppointments = filteredAppointments.filter(a => a.status === filterStatus);
    }

    if (filteredAppointments.length === 0) {
        tbody.html(`<tr><td colspan="5" class="text-center">No appointments found</td></tr>`);
        return;
    }

    filteredAppointments.forEach(appointment => {
        let doctor = getDoctorById(appointment.doctorId);
        let doctorName = doctor ? doctor.name : "Unknown";

        let patientName = appointment.patientName;
        if (!patientName && appointment.patientId) {
            let patient = getPatientById(appointment.patientId);
            patientName = patient ? patient.name : "Unknown";
        }

        tbody.append(`
            <tr>
                <td>${patientName || "Unknown"}</td>
                <td>${doctorName}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${getStatusBadge(appointment.status)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewPatientDetails('${appointment.id}')" title="View Details">Details</button>
                    <button class="btn btn-sm btn-success" onclick="completeAppointment('${appointment.id}')">Complete</button>
                    <button class="btn btn-sm btn-danger" onclick="cancelAppointment('${appointment.id}')">Cancel</button>
                </td>
            </tr>
        `);
    });
}

function completeAppointment(id) {
    let appointment = appointments.find(a => a.id === id);
    if (appointment) {
        appointment.status = "Completed";
        saveAppointments();
        renderAppointments();
        showToast("Appointment completed");
    }
}

function cancelAppointment(id) {
    if (confirmDelete()) {
        let appointment = appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = "Cancelled";
            saveAppointments();
            renderAppointments();
            showToast("Appointment cancelled");
        }
    }
}

function viewPatientDetails(appointmentId) {
    let appointment = appointments.find(a => a.id === appointmentId);
    if (appointment && appointment.patientId) {
        // Store the patient ID to be viewed on patients page
        localStorage.setItem("viewPatientId", appointment.patientId);
        // Navigate to patients page
        window.location.href = "patients.html";
    }
}

function clearAppointmentForm() {
    $("#patientName").val("");
    $("#patientAge").val("");
    $("#patientGender").val("");
    $("#patientPhone").val("");
    $("#patientEmail").val("");
    $("#patientNotes").val("");
    $("#doctorSelect").val("");
    $("#date").val("");
    $("#time").val("");
}