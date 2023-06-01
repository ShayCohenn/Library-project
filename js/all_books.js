/*
1 → Update colors accordign to the status and disabling the delete book button
2 → Load the books, populate the table with the book's info
3 → Delete books - change status to "Removed"
4 → Filter functions - searchbar, search filters and status filters functionality
5 → Define the toastify
*/

const MY_SERVER = "https://project-test-utrw.onrender.com";
let result_found = 0;

// 1 ------------------------ Update the status color -------------------------
const updateColors = () => {
    const rows = document.querySelectorAll("#table_body tr");
    for (const row of rows) {
        const statusColumn = row.querySelector(".stts");
        if (statusColumn.textContent === "Available") {
            statusColumn.style.color = "green";
        } else if (statusColumn.textContent === "Unavailable") {
            statusColumn.style.color = "red";
        } else if (statusColumn.textContent === "on loan") {
            statusColumn.style.color = "steelblue";
        } else {
            row.style.color = "gray";
            const deleteButton = statusColumn.parentNode.querySelector(".delete-btn");

            deleteButton.classList.add("disabled");
        }
    }
};


// 2 -------------------------------- Load books function ------------------------------
const loadBooks = async () => {
    const all_books = await axios.get(MY_SERVER + "/books/all");
    // Iterate over each book entry
    for (const book of all_books.data) {
        result_found++;
        // Create a new row for the book
        const row = document.createElement("tr");
        // Populate the row with book data
        row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.category}</td>
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${book.release_date}</td>
        <td>${book.ISBN}</td>
        <td>${book.book_type}</td>
        <td class="stts">${book.status}</td>
        <td><button onclick="del_book()" class="delete-btn btn btn-outline-danger">Delete</button></td>`;
        // Add the row to the table body
        table_body.appendChild(row);
    }
    updateColors(); // Change the status color after loading the books
    res_found.textContent = `${result_found} results found`;
};

loadBooks();
// 3 ------------------------------- DELETE BOOK ----------------------------------

const del_book = async () => {
    if (confirm("Are you sure you want to delete this book?")) {
        const button = event.target;
        const row = button.parentNode.parentNode;
        const bookID = row.firstElementChild.textContent;


        try {
            await mark_book_as_removed(bookID);
            toast_success("Book deleted")
            row.remove();
        } catch {
            toast_error("An error occurred while returning the loan.")
        }
    }
}

const mark_book_as_removed = async (bookID) => {
    const url = `${MY_SERVER}/books/${bookID}/edit`;
    await axios.put(url, { status: "Removed" });
}

// 4 ----------------------------- Filter function -------------------------------
const filterBookTable = () => {
    const search_value = search.value.toLowerCase();
    // Array of all the search filter checkboxes
    const search_filter = Array.from(document.querySelectorAll('.top-row input:checked')).map(checkbox => checkbox.id);

    // Array of all the status filter checkboxes
    const status_filter = Array.from(document.querySelectorAll('.bottom-row input:checked')).map(checkbox => checkbox.id);
    const table_rows = document.querySelectorAll("#table_body tr");

    // Reset result_found
    result_found = 0;

    // Searching the table row by row
    table_rows.forEach((row) => {
        const columns = row.getElementsByTagName("td");
        let matchFound = false;
        let statusFound = true;

        const columns_array = Array.from(columns); // Turning the HTML collection to an array
        columns_array.forEach(column => {
            const column_value = column.textContent.toLowerCase();
            // If no checkbox was selected
            if (search_filter.length == 0 && column_value.includes(search_value)) {
                matchFound = true;
            }
            else if (search_filter.length > 0) { // If one or more checkboxes were selected
                // column_array[index] is the index of the column in the array, not checking index = 4 because no need to search release date
                if (((search_filter.includes("book_id") && columns_array[0].textContent === (search_value)) || search_value === "") ||
                    (search_filter.includes("category") && columns_array[1].textContent.toLowerCase().includes(search_value)) ||
                    (search_filter.includes("book_name") && columns_array[2].textContent.toLowerCase().includes(search_value)) ||
                    (search_filter.includes("author") && columns_array[3].textContent.toLowerCase().includes(search_value)) ||
                    (search_filter.includes("isbn") && columns_array[5].textContent.toLowerCase().startsWith(search_value)) ||
                    (search_filter.includes("type") && columns_array[6].textContent.toLowerCase().includes(search_value))) {
                    matchFound = true;
                }
            }
        });

        // Check the status filter if any checkbox is checked
        if (status_filter.length > 0) {
            const status_column = row.querySelector(".stts"); // Checking the status column
            if ((status_filter.includes("available_checkbox") && status_column && status_column.textContent === "Available") ||
                (status_filter.includes("on_loan_checkbox") && status_column && status_column.textContent === "on loan") ||
                (status_filter.includes("removed_checkbox") && status_column && status_column.textContent === "Removed")) {
                statusFound = true;
            } else {
                statusFound = false;
            }
        }

        // Show/hide the row based on the search result
        if (matchFound && statusFound) {
            row.style.display = "";
            result_found++;
        } else {
            row.style.display = "none";
        }
    });
    // If no results found show a message
    res_found.textContent = `${result_found} results found`;
    if (result_found === 0) {
        no_res_found.textContent = "Didn't find anything :/"
    }
};

// Add event listener for search input
const search = document.getElementById("search");
search.addEventListener("input", filterBookTable);

// Add event listeners for status_filter_checkboxes
const status_filter_checkboxes = document.querySelectorAll('.filter-container input[type="checkbox"]');
status_filter_checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filterBookTable);
});

// 5 ---------------------------- DEFINING THE TOASTIFY --------------------------------
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