/*
1 → Form validation
2 → Sending the form information to the server, keeping the user in the same page and reseting the input fields
3 → Define the toastify
*/

const MY_SERVER = "https://project-test-utrw.onrender.com";

// 1 ------------------------------------ Form Validation -------------------------------------------

const form_validation = async () => {
    const existing_clients = await axios.get(MY_SERVER + "/clients/all");
    let existing_user = existing_clients.data.map(client => {
        return { email: client.email, phone_num: client.phone_num };
    });
    const targetEmail = email_input.value;
    const targetPhoneNum = phone_num_input.value;

    const emailExists = existing_user.some(client => client.email && client.email.includes(targetEmail)); //If email exists returns true
    const phoneNumExists = existing_user.some(client => client.phone_num && client.phone_num.includes(targetPhoneNum));// If phone number exists returns true

    if (emailExists) {
        toast_error("Email already exists");
        return false;
    }

    if (phoneNumExists) {
        toast_error("Phone number already exists");
        return false;
    }
    //if phone number isn't a number
    if (isNaN(phone_num_input.value)) {
        console.log(phone_num_input.value);
        toast_error("Phone number is not valid");
        return false;
    }

    if (!birthdate_input.checkValidity()) {
        console.log(birthdate_input.value);
        return false;
    }

    toast_success("New customer added!");
    return true;
};
 // 2 ----------------------------------- POST FORM TO SERVER ------------------------------------
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const is_validated = await form_validation(); // If form is validated returns true else false

    if (is_validated) {
        const formData = new FormData(form);// Get the data from the form
        const url = form.getAttribute('action'); // Get the link to send the info to

        try {
            await axios.post(url, formData);
            form.reset(); // Reset the form data
        } catch (error) {
            console.error(error);
            window.location.href = 'index.html';
        }
    }
});


// ----------------------------------------- TOASTIFY--------------------------------------

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
