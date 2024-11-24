// Array to store quote:
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying", category: "Motivation" },
    { text: "You only live once, but if you do it right, once is enough.", category:"Life" },
    { text: "In the middle of the difficulty lies opportunity.", category: "Opportunity" }
];

// Function to display random quote:
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

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

// Add event listener to "Show New Quote" button:
document.getElementById('newquote').addEventListener('click', showRandomQuote);

// Create "Add Quote" button to display the form:
const addQuoteButton = document.createElement('button');
addQuoteButton.textContent = "Add Quote";
addQuoteButton.addEventListener('click', createAddQuoteForm);
document.body.appendChild(addQuoteButton);

// Show a random quote when the page loads:
window.onload = showRandomQuote;
