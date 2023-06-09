/*
1 → Update colors function
2 → Return a loan function
3 → Load data function populate table with information
4 → Filter table function, seach bar, search filters and status filters functionality
5 → Add evenListeners to the input fields and execute the load_data() method
6 → Define the toastifies
*/
const MY_SERVER = "https://project-test-utrw.onrender.com";
let result_found = 0;

// 1 ------------------------------------ UPDATE STATUS COLORS ----------------------------------------------

const updateColors = () => {
  const rows = document.querySelectorAll("#table_body tr");
  let lateCount = 0; // Counter for late loans

  for (const row of rows) {
    const statusColumn = row.querySelector(".stts");
    if (statusColumn.textContent === "on time") {
      statusColumn.style.color = "green";
    } else if (statusColumn.textContent === "Late") {
      statusColumn.style.color = "red";
      lateCount++; // Increment the late count
    } else {
      row.style.color = "gray";
      const returnButton = statusColumn.parentNode.querySelector(".return-button");
      returnButton.classList.add("disabled");
    }
  }

  // Update the counter element with the late count
  if (lateCount > 0)
    late_counter.textContent = `There are ${lateCount} late loans`; // late_counter is the id of the div that displays the counter
  else
    late_counter.textContent = ''
};

// 2 ---------------------------------------------- RETURN A LOAN ----------------------------------------------------

const handleReturnButtonClick = async (event) => {
  if (confirm("Are you sure you want to return this loan?")) {
    const button = event.target; // Get the button selected
    const row = button.parentNode.parentNode; // Get the row it is located in
    const loanId = row.querySelector("td:first-child").textContent; // Get the loan ID
    const bookID = row.querySelector("td:nth-child(4)").textContent; // Get the book ID

    try {
      await markLoanAsReturned(loanId, bookID);
      toast_success("Loan returned successfully!")
      row.remove(); // Remove the returned row
    } catch (error) {
      toast_error("An error occurred while returning the loan.")
      console.error(error);
    }
  }
};

const markLoanAsReturned = async (loanId, bookID) => {
  const url = `${MY_SERVER}/loans/${loanId}/return`; // Return the loan
  await axios.put(url);
  await axios.put(`${MY_SERVER}/books/${bookID}/edit`, { status: "Available" }) // Change the book's status back to Available
};

// 3 ----------------------------------------------------- LOAD DATA --------------------------------------------------------

const load_data = async () => {
  const all_loans = await axios.get(`${MY_SERVER}/loans/all`);
  const loanData = all_loans.data;

  table_body.innerHTML = ""; // Clear the table body before populating

  // Reverse loop to populate the rows starting from the latest loan
  for (let i = loanData.length - 1; i >= 0; i--) {
    result_found++;
    const loan = loanData[i];
    const customerData = await fetchCustomerData(loan.client_id);
    const bookData = await fetchBookData(loan.book_id);

    const row = document.createElement("tr");

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    row.innerHTML = `
      <td>${loan.id}</td>
      <td>${loan.client_id}</td>
      <td>${customerData.name}</td>
      <td>${customerData.email}</td>
      <td>${loan.book_id}</td>
      <td>${bookData.name}</td>
      <td>${bookData.ISBN}</td>
      <td>${formatDate(loan.loan_date)}</td>
      <td>${formatDate(loan.return_date)}</td>
      <td class="stts">${loan.status}</td>
      <td><button class="btn btn-outline-primary return-button">return</button></td>`;

    const returnButton = row.querySelector(".return-button");
    returnButton.addEventListener("click", handleReturnButtonClick);
    table_body.appendChild(row);
  }
  updateColors();
  res_found.textContent = `${result_found} results found`;
};

const fetchCustomerData = async (clientID) => {
  const response = await axios.get(`${MY_SERVER}/clients/${clientID}`);
  return response.data;
};

const fetchBookData = async (bookID) => {
  const response = await axios.get(`${MY_SERVER}/books/${bookID}`);
  return response.data;
};

// 4 ----------------------------------------------- FILTER TABLE  ----------------------------------------------

const filterTable = () => {
  const searchValue = search.value.toLowerCase();
  const search_filter = Array.from(document.querySelectorAll('.top-row input:checked')).map(checkbox => checkbox.id);
  const status_filter = Array.from(document.querySelectorAll('.bottom-row input:checked')).map(checkbox => checkbox.id)
  const tableRows = document.querySelectorAll("#table_body tr");
  result_found = 0

  tableRows.forEach((row) => {
    const columns = row.getElementsByTagName("td");
    let matchFound = false;
    let statusFound = false; // Initialize to false

    const columns_array = Array.from(columns);
    columns_array.forEach((column) => {
      const column_value = column.textContent.toLowerCase();
      // If no check box was selected
      if (search_filter.length === 0 && column_value.includes(searchValue)) {
        matchFound = true;
      } else if (search_filter.length > 0) {
        if (((search_filter.includes("loan_id") && columns_array[0].textContent === searchValue) || searchValue === "") ||  // Filter the search bar
          ((search_filter.includes("customer_id") && columns_array[1].textContent === searchValue) || searchValue === "") ||
          ((search_filter.includes("cust_email") && columns_array[3].textContent.toLowerCase().includes(searchValue)) ||
            ((search_filter.includes("book_id") && columns_array[4].textContent === searchValue) || searchValue === "")) ||
          (search_filter.includes("customer_name") && columns_array[2].textContent.toLowerCase().includes(searchValue)) ||
          (search_filter.includes("book_name") && columns_array[5].textContent.toLowerCase().includes(searchValue)) ||
          (search_filter.includes("isbn") && columns_array[6].textContent.toLowerCase().includes(searchValue))) {
          matchFound = true;
        }
      }
    });

    // Check the status filter if any checkbox is checked
    if (status_filter.length > 0) {
      const status_column = row.querySelector(".stts"); // Checking the status column
      if ((status_filter.includes("on_time_checkbox") && status_column && status_column.textContent === "on time") ||
        (status_filter.includes("late_checkbox") && status_column && status_column.textContent === "Late") ||
        (status_filter.includes("returned_checkbox") && status_column && status_column.textContent === "returned")) {
        statusFound = true;
      }
    } else {
      // If no status filter checkbox is checked, consider it as a match
      statusFound = true;
    }

    // Show/hide the row based on the search result and status filter
    if (matchFound && statusFound) {
      row.style.display = "";
      result_found++
    } else {
      row.style.display = "none";
    }
  });
  res_found.textContent = `${result_found} results found`;
  if (result_found === 0) {
    no_res_found.textContent = "Didn't find anything :/"
  }
};

// 5 --------------------------------------- ADD EVENT LISTENERS AND EXECUTE LOAD_DATA() --------------------------------------

search.addEventListener("input", filterTable);

const status_filter_checkboxes = document.querySelectorAll('.filter-container input[type="checkbox"]');
status_filter_checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", filterTable);
});
load_data();

// 6 ------------------------------------ TOASTIFY--------------------------------------

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
}