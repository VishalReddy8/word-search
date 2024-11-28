const gridSize = 15;
const words = [
    "DEMOCRACY", "JUDICIARY", "LEGISLATURE", "EXECUTIVE",
    "LIBERTY", "EQUALITY", "CONSTITUTION", "SOVEREIGN",
    "JUSTICE", "FRATERNITY", "REPUBLIC", "FUNDAMENTAL",
    "RIGHTS", "DUTIES", "FEDERAL"
];

const wordInfo = {
    DEMOCRACY: "A system of government where power is vested in the people.",
    JUDICIARY: "The branch of government responsible for interpreting laws.",
    LEGISLATURE: "The body responsible for creating and passing laws.",
    EXECUTIVE: "The branch responsible for implementing and enforcing laws.",
    LIBERTY: "The state of being free within society from oppressive restrictions.",
    EQUALITY: "The state of being equal, especially in status, rights, and opportunities.",
    CONSTITUTION: "The fundamental principles governing a nation's political system.",
    SOVEREIGN: "Having supreme power and authority within a territory.",
    JUSTICE: "The quality of being fair and reasonable in legal proceedings.",
    FRATERNITY: "A sense of friendship and support within a community.",
    REPUBLIC: "A state where power is held by the people and their elected representatives.",
    FUNDAMENTAL: "Basic and essential principles underlying a system.",
    RIGHTS: "Legal, social, or ethical principles of freedom or entitlement.",
    DUTIES: "Moral or legal obligations required of citizens.",
    FEDERAL: "A system of government with power divided between central and regional authorities."
};

class ConstitutionWordSearch {
    constructor() {
        this.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
        this.selectedCells = [];
        this.foundWords = new Set();
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.placeWords();
        this.fillGrid();
        this.renderGrid();
        this.renderWordList();
    }

    placeWords() {
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                const direction = Math.floor(Math.random() * 3);
                const startRow = Math.floor(Math.random() * gridSize);
                const startCol = Math.floor(Math.random() * gridSize);

                if (this.canPlaceWord(word, startRow, startCol, direction)) {
                    this.placeWordInGrid(word, startRow, startCol, direction);
                    placed = true;
                }
            }
        });
    }

    canPlaceWord(word, row, col, direction) {
        const checks = [
            () => col + word.length <= gridSize,  // Horizontal
            () => row + word.length <= gridSize,  // Vertical
            () => row + word.length <= gridSize && col + word.length <= gridSize  // Diagonal
        ];

        if (!checks[direction]()) return false;

        for (let i = 0; i < word.length; i++) {
            const r = row + (direction !== 0 ? i : 0);
            const c = col + (direction !== 1 ? i : 0);
            if (this.grid[r][c] !== '' && this.grid[r][c] !== word[i]) return false;
        }
        return true;
    }

    placeWordInGrid(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            const r = row + (direction !== 0 ? i : 0);
            const c = col + (direction !== 1 ? i : 0);
            this.grid[r][c] = word[i];
        }
    }

    fillGrid() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (this.grid[row][col] === '') {
                    this.grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    renderGrid() {
        const puzzle = document.getElementById("puzzle");
        puzzle.innerHTML = "";
        puzzle.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;

        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const cell = document.createElement("div");
                cell.className = "cell";
                cell.textContent = this.grid[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", this.handleCellClick.bind(this));
                puzzle.appendChild(cell);
            }
        }
    }

    renderWordList() {
        const wordList = document.getElementById("words");
        wordList.innerHTML = "";
        words.forEach(word => {
            const li = document.createElement("li");
            li.textContent = word;
            li.id = word;
            wordList.appendChild(li);
        });
    }

    handleCellClick(e) {
        const cell = e.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        cell.classList.toggle("selected");

        const cellIndex = this.selectedCells.findIndex(c => c.row === row && c.col === col);
        
        if (cellIndex !== -1) {
            this.selectedCells.splice(cellIndex, 1);
        } else {
            this.selectedCells.push({ row, col });
        }

        this.checkSelection();
    }

    checkSelection() {
        if (this.selectedCells.length < 2) return;

        const selectedLetters = this.selectedCells.map(({ row, col }) => this.grid[row][col]);
        const selectedWord = selectedLetters.join('');
        const reversedWord = selectedLetters.slice().reverse().join('');

        if (words.includes(selectedWord) || words.includes(reversedWord)) {
            const word = words.includes(selectedWord) ? selectedWord : reversedWord;
            this.highlightCorrectWord();
            this.markWordFound(word);
            this.showWordInfo(word);
            this.selectedCells = [];
        }
    }

    highlightCorrectWord() {
        this.selectedCells.forEach(({ row, col }) => {
            const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add("correct");
            cell.classList.remove("selected");
        });
    }

    markWordFound(word) {
        if (!this.foundWords.has(word)) {
            const wordElement = document.getElementById(word);
            wordElement.classList.add("found");
            this.foundWords.add(word);
            this.checkGameCompletion();
        }
    }

    showWordInfo(word) {
        const modal = document.getElementById("info-modal");
        const modalTitle = document.getElementById("modal-title");
        const modalDescription = document.getElementById("modal-description");

        modalTitle.textContent = word;
        modalDescription.textContent = wordInfo[word];
        modal.style.display = "flex";

        const closeBtn = modal.querySelector(".close");
        closeBtn.onclick = () => modal.style.display = "none";
    }

    checkGameCompletion() {
        if (this.foundWords.size === words.length) {
            document.getElementById("completion-modal").style.display = "flex";
        }
    }

    setupEventListeners() {
        // Instructions Modal
        document.getElementById("instructions-icon").addEventListener("click", () => {
            document.getElementById("instructions-modal").style.display = "flex";
        });

        // Constitution Info Modal
        document.getElementById("constitution-icon").addEventListener("click", () => {
            document.getElementById("constitution-modal").style.display = "flex";
        });

        // Close Modal Events
        document.querySelectorAll(".modal .close").forEach(close => {
            close.addEventListener("click", () => {
                close.closest(".modal").style.display = "none";
            });
        });

        // Completion Modal Actions
        document.getElementById("restart-game").addEventListener("click", () => {
            this.resetGame();
        });

        document.getElementById("learn-more").addEventListener("click", () => {
            document.getElementById("constitution-modal").style.display = "flex";
        });
    }

    resetGame() {
        // Reset grid
        this.grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
        this.selectedCells = [];
        this.foundWords.clear();

        // Remove found and correct classes
        document.querySelectorAll('.cell.correct').forEach(cell => {
            cell.classList.remove('correct');
        });
        document.querySelectorAll('#words li.found').forEach(li => {
            li.classList.remove('found');
        });

        // Hide completion modal
        document.getElementById("completion-modal").style.display = "none";

        // Reinitialize game
        this.initializeGame();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ConstitutionWordSearch();
});