const specializations = ["Cardiology", "Dermatology", "Neurology", "Orthopedics", "Pediatrics", "Gynecology", "Ophthalmology", "Psychiatry", "Radiology", "Urology"];

$(document).ready(function () {
    loadSpecializations();
    renderDoctors();

    // Reset form when modal is shown for adding new doctor
    $("#doctorModal").on("show.bs.modal", function() {
        if (!$("#doctorId").val()) {
            resetDoctorForm();
        }
    });

    $("#doctorForm").submit(function (e) {
        e.preventDefault();

        if (!validateDoctor()) return;

        let id = $("#doctorId").val();

        let doctor = {
            id: id || generateId("DOC"),
            name: $("#docName").val(),
            specialization: $("#specialization").val(),
            slot: $("#slot").val()
        };

        if (id) {
            let index = doctors.findIndex(d => d.id === id);
            doctors[index] = doctor;
            showToast("Doctor updated");
        } else {
            doctors.push(doctor);
            showToast("Doctor added");
        }

        saveDoctors();
        renderDoctors();

        resetDoctorForm();
        $("#doctorModal").modal("hide");
    });
});

function validateDoctor() {
    if (!$("#docName").val())
        return showToast("Doctor name required", "error"), false;

    if (!$("#specialization").val())
        return showToast("Specialization required", "error"), false;

    if (!$("#slot").val())
        return showToast("Time slot required", "error"), false;

    return true;
}

function loadSpecializations() {
    let select = $("#specialization");
    select.empty();
    select.append('<option value="">Select Specialization</option>');
    specializations.forEach(spec => {
        select.append(`<option value="${spec}">${spec}</option>`);
    });
}

function renderDoctors() {
    let tbody = $("#doctorTable");
    tbody.empty();
    doctors.forEach(doctor => {
        tbody.append(`
            <tr>
                <td>${doctor.name}</td>
                <td>${doctor.specialization}</td>
                <td>${doctor.slot}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editDoctor('${doctor.id}')">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteDoctor('${doctor.id}')">Delete</button>
                </td>
            </tr>
        `);
    });
}

function editDoctor(id) {
    let doctor = doctors.find(d => d.id === id);
    if (doctor) {
        $("#doctorId").val(doctor.id);
        $("#docName").val(doctor.name);
        $("#specialization").val(doctor.specialization);
        $("#slot").val(doctor.slot);
        $(".modal-title").text("Edit Doctor");
        $("#doctorModal").modal("show");
    }
}

function deleteDoctor(id) {
    if (confirmDelete()) {
        doctors = doctors.filter(d => d.id !== id);
        saveDoctors();
        renderDoctors();
        showToast("Doctor deleted");
    }
}

function resetDoctorForm() {
    $("#doctorForm")[0].reset();
    $("#doctorId").val("");
    $("#specialization").val("");
    $(".modal-title").text("Add Doctor");
}