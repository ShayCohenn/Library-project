/*
1 → Getting the client's id stored in local storage
2 → Loading its data in the page
3 → Update customer function
4 → Edit button functionality
5 → Define the toastifies
*/

const MY_SERVER = `https://project-test-utrw.onrender.com`;
// Retrieve the customer ID from localStorage
const customerId = localStorage.getItem("customerId");
// Check if the customer ID exists
// --------------------------------- LOAD CUSTOMER DATA FROM LOCAL STORAGE -----------------------------
const get_customers_data = async () => {
    if (customerId) {
        const customers_info = await axios.get(`${MY_SERVER}/clients/${customerId}`);
        name_input.value = customers_info.data.name;
        email_input.value = customers_info.data.email;
        phone_num_input.value = customers_info.data.phone_num;
        address_input.value = customers_info.data.address;
        birthdate_input.value = customers_info.data.birthDate;
    }
};
// ------------------------------------------- UPDATE CUSTOMER ------------------------------------
const update_customer = async () => {
    if (!isNaN(phone_num_input.value) && confirm_checkbox.checked) {
        clients = await axios.get(MY_SERVER + "/clients/all")
        existing_phone_numbers = clients.data.map(client => client.phone_num)
        const data = {
            name: name_input.value,
            email: email_input.value,
            phone_num: phone_num_input.value,
            address: address_input.value,
            birthDate: birthdate_input.value
        }
        if (!existing_phone_numbers.includes(phone_num_input.value)) { // Check if phone number is in use
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
        else{
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
get_customers_data();
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