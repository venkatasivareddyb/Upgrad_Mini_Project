$(document).ready(function () {
    renderPatients();

    // Check if there's a patient to view from appointment page
    let viewPatientId = localStorage.getItem("viewPatientId");
    if (viewPatientId) {
        localStorage.removeItem("viewPatientId");
        let patient = patients.find(p => p.id === viewPatientId);
        if (patient) {
            editPatient(viewPatientId);
        }
    }

    $("#patientForm").submit(function (e) {
        e.preventDefault();

        if (!validatePatient()) return;

        let id = $("#patientId").val();

        let patient = {
            id: id || generateId("PAT"),
            name: $("#name").val(),
            age: $("#age").val(),
            gender: $("#gender").val(),
            phone: $("#phone").val(),
            email: $("#email").val(),
            notes: $("#notes").val()
        };

        if (id) {
            let index = patients.findIndex(p => p.id === id);
            patients[index] = patient;
            showToast("Patient updated");
        } else {
            patients.push(patient);
            showToast("Patient added");
        }

        savePatients();
        renderPatients();

        $("#patientForm")[0].reset();
        $("#patientId").val("");
        $("#patientModal").modal("hide");
    });

    $("#searchPatient").on("keyup", function () {
        let val = $(this).val().toLowerCase();
        $("#patientTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().includes(val));
        });
    });
});

// Validation
function validatePatient() {
    let name = $("#name").val().trim();
    let age = $("#age").val();
    let phone = $("#phone").val();
    let email = $("#email").val();

    if (!name) return showToast("Name required", "error"), false;

    if (age < 1 || age > 120)
        return showToast("Invalid age", "error"), false;

    if (!/^\d{10}$/.test(phone))
        return showToast("Phone must be 10 digits", "error"), false;

    if (!/^\S+@\S+\.\S+$/.test(email))
        return showToast("Invalid email", "error"), false;

    return true;
}

// Render
function renderPatients() {
    if (patients.length === 0) {
        $("#patientTable").html(`<tr><td colspan="3" class="empty">No patients found</td></tr>`);
        return;
    }

    let rows = patients.map(p => `
        <tr>
            <td>${p.name}</td>
            <td>${p.phone}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editPatient('${p.id}')">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deletePatient('${p.id}')">Delete</button>
            </td>
        </tr>
    `);

    $("#patientTable").html(rows);
}

// Edit
function editPatient(id) {
    let p = patients.find(p => p.id === id);

    $("#patientId").val(p.id);
    $("#name").val(p.name);
    $("#age").val(p.age);
    $("#gender").val(p.gender);
    $("#phone").val(p.phone);
    $("#email").val(p.email);
    $("#notes").val(p.notes);

    $("#patientModal").modal("show");
}

// Delete
function deletePatient(id) {
    if (confirmDelete()) {
        patients = patients.filter(p => p.id !== id);
        savePatients();
        renderPatients();
        showToast("Patient deleted", "error");
    }
}