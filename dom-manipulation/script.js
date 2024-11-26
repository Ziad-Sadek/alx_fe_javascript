syncQuotes();
function showSyncNotification(message) {
    // Creating a div element for the notification:
    const notification = document.createElement('div');

    // The message content of the notification:
    notification.textContent = message;

    // Styling for the notification:
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';

    document.body.appendChild(notification);

    // Remove the notification after 3sec:
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Array to store quote:
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category:"Life" },
    { text: "In the middle of the difficulty lies opportunity.", category: "Opportunity" }
];

// Load Quotes from LocalStorage:
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to localStorage:
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display random quote:
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

// Storing the last viewed quote in sessionStorage:
sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));

//Display the quote and the category in the div:
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = 
        `<p><strong>Quote:</strong> ${randomQuote.text}</p>
         <p><strong>Category:</strong> ${randomQuote.category}</p>`;
}

// Function to create and disply a form to add new quote:
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.id = 'quoteFormContainer';

    formContainer.innerHTML = 
        `<h3>Add a New Quote</h3>
         <form id='quoteForm'>
                <label for="quoteText">Quote Text:</label><br>
                <textarea id="quoteText" required></textarea><br><br>
                <label for="quoteCategory">Category:</label><br>
                <input type="text" id="quoteCategory" required><br><br>
                <button type="submit">Add Quote</button>
         </form>
         <p id="errorMessage" style="color: red; display: none;">Both fields are required!!!</p>`;
    
    document.body.appendChild(formContainer);


    // Addeing event listener to handle form submission:
    document.getElementById('quoteForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const quoteText = document.getElementById('quoteText');
        const quoteCategory = document.getElementById('quoteCategory');

        // Validation to check if both fields are filled:
        if (quoteText && quoteCategory) {
            const newQuote = {
                text: quoteText.value,
                category: quoteCategory.value
            };

            quotes.push(newQuote); //here we are adding the new quote to the main array.
            alert('New quote added successfully!');
            saveQuotes();

            populateCategories();

            document.getElementById('quoteForm').reset();
            document.getElementById('quoteFormContainer').remove();

        } else {
            // Display error if the form is incomplete:
            document.getElementById('errorMessage').style.display = 'block';
        }
    });
};

// Adding a function to export quotes to JSON file:
function exportToJson() {
    const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
}

// Adding a function to import quotes from JSON file:
function importToJson(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes Imported Successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Populating the dropdown menu:
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');

    // Extract uniqe categories from the quotes array:
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];

    // Loop through the categories and add them as options:
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;

    let filteredQuotes = []; 

    if (selectedCategory === 'all') {
        filteredQuotes = quotes;
    } else {
        filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
    displayFilteredQuotes(filteredQuotes);
}

function displayFilteredQuotes(filteredQuotes) {
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];

        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
        <p><strong>Quote:</strong> ${randomQuote.text}</p><br>
        <p><strong>Category:</strong> ${randomQuote.category}</p><br><br>`;
    } else {
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = '<p> No quotes found for this category.</p>';
    }
}

// Last Selected Category filter:
function loadCategoryFilter() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        document.getElementById('categoryFilter').value = lastSelectedCategory;
        filterQuotes();
    }
}

// Defining the mock server endpoint:
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const serverQuotes = await response.json();

        const serverFormattedQuotes = serverQuotes.slice(0, 5).map(post => ({
            text: post.title,
            category: post.body 
        }));

        resolveConflicts(serverFormattedQuotes);
        console.log('Quotes fetched from server.', serverQuotes);
        // Then we gonna log the quotes fetched from server to the console:
       showSyncNotification('Data has been successfully synced with the server.');
    } catch (error) {
        console.log("Error fetching quotes from server:", error);
    }
}

// Function to add new quote and update server:
async function addNewQuote(quoteText, quoteCategory) {
    const newQuote = {
        text:quoteText,
        category:quoteCategory
    };


// Sending the new quote to the server:
    try {
        const response = await fetch(SERVER_URL, {
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ title: quoteText, body: quoteCategory })
        });

        if (response.ok) {
            console.log("New quote added and synced with server");
        } else {
            console.log("Failed to add quote to server");
        }

    } catch (error) {
        console.error("Error adding quote to server", error);
    }
}

// periodic data syncing:
function syncQuotes() {
    setInterval(() => {
        console.log("Checking for updates from the server...");
        fetchQuotesFromServer(); //fetch data every 10sec
    }, 10000);
    showSyncNotification("Data has been successfully synced with the server.");
}

// Conflict resolution: Server data takes precedence:
function resolveConflicts(serverQuotes) {

    //Compare local quotes with server quotes:
    if (quotes.length !== serverQuotes.length) {
        console.log("Conflicts detected: Syncing local data with server...");
        quotes = serverQuotes; // Overwrite local quotes with server data
        saveQuotes();
        showSyncNotification("Data synced from the server.");
    }
}

// Save the selected category to local storage when changed:
document.getElementById('categoryFilter').addEventListener('change', function() {
    localStorage.setItem('lastSelectedCategory', this.value);
}
)

// Add event listener to "Show New Quote" button:
document.getElementById('newquote').addEventListener('click', showRandomQuote);

// Create "Add Quote" button to display the form:
const addQuoteButton = document.createElement('button');
addQuoteButton.textContent = "Add Quote";
addQuoteButton.addEventListener('click', createAddQuoteForm);
document.body.appendChild(addQuoteButton);

// Create "Export Quotes" button to download quotes as JSON:
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', exportToJson);



// Show a random quote when the page loads:
window.onload = function() {
    loadQuotes();
    populateCategories();
    loadCategoryFilter()
    filterQuotes();
    showRandomQuote();
    syncQuotes();
};

