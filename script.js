document.addEventListener('DOMContentLoaded', () => {
    const resultDiv = document.querySelector('.result');
    const letterButtonsContainer = document.querySelector('#letter-buttons');
    const browseResultsDiv = document.querySelector('.browse-results');
    const form = document.querySelector('form');
    const input = document.querySelector('#text-field');

    let dictionary = {};

    if (form && input && resultDiv && letterButtonsContainer && browseResultsDiv) {

        // LOAD JSON + NORMALIZE KEYS
        fetch('dict.json')
            .then(res => res.json())
            .then(data => {
                dictionary = {};

                // Store lowercase key + original word
                Object.keys(data).forEach(key => {
                    dictionary[key.toLowerCase()] = {
                        word: key,
                        meaning: data[key]
                    };
                });

                generateLetterButtons();
            });

        // SEARCH FORM
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            searchWord(input.value.trim().toLowerCase());
        });

        // RESET
        form.addEventListener('reset', () => {
            input.value = '';
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
            browseResultsDiv.style.display = 'none';
            browseResultsDiv.innerHTML = '';
            browseResultsDiv.classList.remove('expanded');
        });

        // SEARCH FUNCTION
        function searchWord(word) {
            if (!word) {
                resultDiv.style.display = 'none';
                return;
            }

            const entry = dictionary[word];

            if (entry) {
                resultDiv.innerHTML = `<h2>${entry.word}</h2><p>${entry.meaning}</p>`;
            } else {
                resultDiv.innerHTML = `<p>No definition found for "<strong>${word}</strong>".</p>`;
            }

            resultDiv.style.display = 'block';
        }

        // GENERATE LETTER BUTTONS
        function generateLetterButtons() {
            for (let i = 65; i <= 90; i++) {
                const letter = String.fromCharCode(i).toLowerCase();
                const btn = document.createElement('button');

                btn.textContent = letter.toUpperCase();

                btn.addEventListener('click', () => {

                    const words = Object.values(dictionary)
                        .filter(entry => entry.word.toLowerCase().startsWith(letter));

                    browseResultsDiv.innerHTML = `
                        <h2>Words starting with "${letter.toUpperCase()}"</h2><br>
                        <ul>
                            ${words.map(entry => `<li><a href="#" class="browse-word">${entry.word}</a></li>`).join('')}
                        </ul>
                    `;

                    browseResultsDiv.style.display = 'block';

                    document.querySelectorAll('.browse-word').forEach(link => {
                        link.addEventListener('click', (e) => {
                            e.preventDefault();
                            searchWord(link.textContent.toLowerCase());
                        });
                    });
                });

                letterButtonsContainer.appendChild(btn);
            }
        }
    }

    // DARK MODE TOGGLE
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (darkModeToggle) {
        const icon = darkModeToggle.querySelector('img');

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            icon.src = 'images/day.ico';
        }

        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            const isDark = document.body.classList.contains('dark-mode');

            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            icon.src = isDark ? 'images/day.ico' : 'images/night.ico';
        });
    }
});