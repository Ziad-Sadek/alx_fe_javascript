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
                <label for="quoteText">Quote Text:<label><br>
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
                text: quoteText,
                category: quoteCategory
            };
            quotes.push(newQuote); //here we are adding the new quote to the main array.
            alert('New quote added successfully!');

            // Clearing the quote form:
            document.getElementById('quoteText').value = '';
            document.getElementById('quoteCategory').value = '';
        } else {
            // Display error if the form is incomplete:
            document.getElementById('errorMesssage').style.display = 'block';
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
    showRandomQuote();
};

