    document.addEventListener('DOMContentLoaded', () => {
        const resultDiv = document.querySelector('.result');
        const letterButtonsContainer = document.querySelector('#letter-buttons');
        const browseResultsDiv = document.querySelector('.browse-results');
        const form = document.querySelector('form');
        const input = document.querySelector('#text-field');

        let dictionary = {};

        if (form && input && resultDiv && letterButtonsContainer && browseResultsDiv) {
            fetch('dict.json')
                .then(res => res.json())
                .then(data => {
                    dictionary = data;
                    generateLetterButtons();
                });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                searchWord(input.value.trim().toLowerCase());
            });

            form.addEventListener('reset', () => {
                input.value = '';
                resultDiv.style.display = 'none';
                resultDiv.innerHTML = '';
                browseResultsDiv.style.display = 'none';
                browseResultsDiv.innerHTML = '';
                browseResultsDiv.classList.remove('expanded');
            });

            function searchWord(word) {
                if (!word) {
                    resultDiv.style.display = 'none';
                    return;
                }
                const meaning = dictionary[word];
                if (meaning) {
                    resultDiv.innerHTML = `<h2>${word}</h2><p>${meaning}</p>`;
                } else {
                    resultDiv.innerHTML = `<p>No definition found for "<strong>${word}</strong>".</p>`;
                }
                resultDiv.style.display = 'block';
            }

            function generateLetterButtons() {
                for (let i = 65; i <= 90; i++) {
                    const letter = String.fromCharCode(i).toLowerCase();
                    const btn = document.createElement('button');
                    btn.textContent = letter.toUpperCase();
                    btn.addEventListener('click', () => {
                        const words = Object.keys(dictionary).filter(w => w.startsWith(letter));
                        browseResultsDiv.innerHTML = `
                            <h2>Words starting with "${letter.toUpperCase()}"</h2><br>
                            <ul>${words.map(w => `<li><a href="#" class="browse-word">${w}</a></li>`).join('')}</ul>
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

        // DARK MODE ICON TOGGLE
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
