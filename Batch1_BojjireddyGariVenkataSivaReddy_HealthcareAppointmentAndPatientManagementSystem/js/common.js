// common.js

// Toast message
function showToast(message, type = "success") {
    let bg = type === "error" ? "bg-danger" : "bg-success";

    let toast = `
    <div class="toast align-items-center text-white ${bg} border-0 show mb-2">
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button class="btn-close btn-close-white me-2 m-auto" onclick="$(this).closest('.toast').remove()"></button>
        </div>
    </div>`;

    $(".toast-container").append(toast);

    setTimeout(() => {
        $(".toast").first().remove();
    }, 3000);
}

// Confirm delete
function confirmDelete() {
    return confirm("Are you sure?");
}

// Status badge
function getStatusBadge(status) {
    let color = {
        "Booked": "primary",
        "Completed": "success",
        "Cancelled": "danger"
    };
    return `<span class="badge bg-${color[status]}">${status}</span>`;
}