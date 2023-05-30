/*
1 → Validate the form
2 → Post the form data to the server
3 → Define the toastifies
*/
// 1 ----------------------------------------------- CHECK THE VALIDITY OF THE FORM ---------------------------------------
const form_validation = async () => {
    // IF the ISBN in not a number
    if (isNaN(ISBN.value)) {
        toast_error("ISBN is not valid");
        return false;
    }
    toast_success("New book added!");
    return true;
};
// 2 -------------------------------------- SEND THE FORM DATA --------------------------------------
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Don't redirect to the backend route when submitting the form

    const is_validated = await form_validation(); // Returns true if form is validated else is false

    //If form is validated
    if (is_validated) {
        const formData = new FormData(form);
        const url = form.getAttribute('action');

        try {
            await axios.post(url, formData);
            form.reset(); // Reset the form data
        } catch (error) {
            console.error(error);
            window.location.href = 'index.html';
        }
    }
});

// ------------------------- TOASTIFY----------------------

const toast_success = (message) => {
    Toastify({
        text: message,
        duration: 3000, // Duration in milliseconds
        close: true, // Show close button
        gravity: "bottom", // Position the toast at the top of the page
        position: "center", // Center the toast horizontally
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Set the background color
        style: {
            color: "#000000"
        }
    }).showToast();
};

const toast_error = (message) => {
    Toastify({
        text: message,
        duration: 3000, // Duration in milliseconds
        close: true, // Show close button
        gravity: "bottom", // Position the toast at the top of the page
        position: "center", // Center the toast horizontally
        backgroundColor: "#ff3333b1", // Set the background color
        style: {
            color: "#000000", // Set the text color to white
            fontWeight: "bold"
        }
    }).showToast();
};
