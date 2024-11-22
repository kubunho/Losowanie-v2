document.addEventListener("DOMContentLoaded", () => {
    const participantInput = document.getElementById("participant");
    const addParticipantButton = document.getElementById("add-participant");
    const drawButton = document.getElementById("draw-names");
    const participantsList = document.getElementById("participants-list");
    const resultSection = document.getElementById("result");
    const singleResult = document.getElementById("single-result");

    const participants = [];
    let assignments = {};
    let revealedResults = {}; // Keeps track of revealed/hidden results

    // Initialize participants with predefined names
    const initialParticipants = ["Chajdi", "Walu", "Domin", "Siwy", "Biały", "Krzysiu", "Kuchar", "Lisek", "Mariusz"];
    initialParticipants.forEach(name => addParticipant(name));

    // Event listener to add a new participant
    addParticipantButton.addEventListener("click", () => {
        const name = participantInput.value.trim();
        if (name) {
            addParticipant(name); // Add participant if name is not empty
            participantInput.value = "";
        }
    });

    // Function to add a participant to the list
    function addParticipant(name) {
        if (!participants.includes(name)) {
            participants.push(name);

            // Create a new list item for the participant
            const li = document.createElement("li");

            // Add participant name to the list item
            const span = document.createElement("span");
            span.textContent = name;

            // Add a delete button to remove a participant
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Usuń";
            deleteButton.classList.add("delete-btn");
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent click event from triggering on the whole list item
                removeParticipant(name, li); // Remove participant when delete button is clicked
            });

            // Append the name and delete button to the list item
            li.appendChild(span);
            li.appendChild(deleteButton);
            participantsList.appendChild(li);

            // Enable the draw button if there are at least 2 participants
            drawButton.disabled = participants.length < 2;

            // Add click event to reveal or hide the result for this participant
            li.addEventListener("click", () => {
                toggleResult(name);
            });

            // Initialize the result visibility state as hidden
            revealedResults[name] = false;
        }
    }

    // Function to remove a participant from the list
    function removeParticipant(name, liElement) {
        // Remove participant from the participants array
        const index = participants.indexOf(name);
        if (index !== -1) participants.splice(index, 1);

        // Remove the participant from the DOM list
        liElement.remove();

        // Disable draw button if there are fewer than 2 participants
        drawButton.disabled = participants.length < 2;

        // Remove the visibility state for this participant
        delete revealedResults[name];
    }

    // Function to toggle visibility of a participant's result
    function toggleResult(name) {
        if (assignments[name]) {
            revealedResults[name] = !revealedResults[name]; // Toggle the visibility state

            if (revealedResults[name]) {
                singleResult.textContent = `${name} kupuje prezent dla ${assignments[name]}`; // Show the result
                resultSection.classList.remove("hidden"); // Reveal the result section
            } else {
                resultSection.classList.add("hidden"); // Hide the result section
            }
        } else {
            alert("Najpierw przygotuj losowanie!"); // Alert if the draw hasn't been performed yet
        }
    }

    // Event listener for the draw button
    drawButton.addEventListener("click", () => {
        if (participants.length < 2) {
            alert("Musisz mieć przynajmniej dwóch uczestników, aby przeprowadzić losowanie!"); // Alert if there are fewer than 2 participants
            return;
        }

        // Shuffle the participants array
        const shuffled = [...participants];
        do {
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
            }
        } while (shuffled.some((person, i) => person === participants[i])); // Ensure no one draws themselves

        // Assign each participant a person to buy a gift for
        assignments = participants.reduce((acc, participant, index) => {
            acc[participant] = shuffled[index];
            return acc;
        }, {});

        alert("Losowanie gotowe! Kliknij na imię, aby odkryć wynik."); // Alert that the draw is complete
    });
});
