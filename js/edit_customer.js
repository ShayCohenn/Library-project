/*
1 → Getting the client's id stored in local storage and loading its data in the page
2 → Update customer function
3 → Edit button functionality
4 → Define the toastifies
*/

const MY_SERVER = `https://project-test-utrw.onrender.com`;
let current_phone_num = ""
let current_email = ""
// 1 --------------------------------- LOAD CUSTOMER DATA FROM LOCAL STORAGE -----------------------------
// Retrieve the customer ID from localStorage
const customerId = localStorage.getItem("customerId");
const get_customers_data = async () => {
    // Check if the customer ID exists
    if (customerId) {
        const customers_info = await axios.get(`${MY_SERVER}/clients/${customerId}`);
        name_input.value = customers_info.data.name;
        email_input.value = customers_info.data.email;
        current_email = customers_info.data.email;
        phone_num_input.value = customers_info.data.phone_num;
        current_phone_num = customers_info.data.phone_num;
        address_input.value = customers_info.data.address;
        birthdate_input.value = customers_info.data.birthDate;
        (customers_info.data.status == "Active") ? Active.checked = true : Inactive.checked = true
    }
};
get_customers_data();
// ------------------------------------------- UPDATE CUSTOMER ------------------------------------
const update_customer = async () => {
    if (!isNaN(phone_num_input.value) && confirm_checkbox.checked) {
        clients = await axios.get(MY_SERVER + "/clients/all")
        existing_phone_numbers = clients.data.map(client => client.phone_num)
        existing_emails = clients.data.map(client => client.email)
        const updated_status = ((Active.checked) ? 'Active' : 'Inactive')
        const data = {
            name: name_input.value,
            email: email_input.value,
            phone_num: phone_num_input.value,
            address: address_input.value,
            birthDate: birthdate_input.value,
            status: updated_status
        }
        if ((!existing_phone_numbers.includes(phone_num_input.value) && !existing_emails.includes(email_input.value)) ||
            (current_phone_num == phone_num_input.value && current_email == email_input.value)) { // Check if phone number / email in use
            try {
                const response = await axios.put(`${MY_SERVER}/clients/${customerId}/edit`, data);
                // Handle the successful response here
                console.log(response.data);  // Print the response data to the console
                toast_success("Customer updated!")
            } catch (error) {
                // Handle any error that occurred during the request
                console.error(error);
                toast_error("Unexpected error!")
                // Perform error handling or display an error message to the user
            }
        }
        else {
            toast_error("Phone number in use!")
        }

    }
    if (!confirm_checkbox.checked)
        toast_error("You did'nt confirm the changes!")
    if (isNaN(phone_num_input.value))
        toast_error("Invalid phone number")

};

// ------------------------------ EDIT BUTTON FUNCTION ----------------------------------
const enableEdit = (inputId, btn) => {
    const inputField = document.getElementById(inputId);
    inputField.removeAttribute("readonly");
    inputField.style.border = "2px solid steelblue"
    btn.style.display = "none"
};
// ------------------------------ DEFINE THE TOASTIFY -----------------------------
const toast_success = (message) => {
    Toastify({
        text: message,
        duration: 3000, // Duration in milliseconds
        close: true, // Show close button
        gravity: "top", // Position the toast at the top of the page
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
        gravity: "top", // Position the toast at the top of the page
        position: "center", // Center the toast horizontally
        backgroundColor: "#ff3333b1", // Set the background color
        style: {
            color: "#000000", // Set the text color to white
            fontWeight: "bold"
        }
    }).showToast();
};