let currentInput = '';
let operator = '';
let firstOperand = null;
const history = [];

const resultInput = document.getElementById('result');
const historyDisplay = document.getElementById('history'); // Menambahkan elemen untuk menampilkan riwayat
const buttons = document.querySelectorAll('.calculator-buttons button');
const deleteSelectedButton = document.getElementById('delete-selected'); // Tombol untuk hapus yang dipilih

// Load previous result from localStorage
window.onload = () => {
    const storedResult = localStorage.getItem('lastResult');
    if (storedResult) {
        resultInput.value = storedResult;
        firstOperand = parseFloat(storedResult);
    }
    loadHistory(); // Memuat riwayat perhitungan dari localStorage
};

// Event listeners untuk tombol kalkulator
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.value;

        if (value === 'all-clear') {
            clear();
        } else if (value === '=') {
            if (currentInput !== '' && firstOperand !== null) {
                calculate();
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            setOperator(value);
        } else {
            appendToInput(value);
        }
    });
});

// Event listener untuk tombol hapus yang dipilih
deleteSelectedButton.addEventListener('click', deleteSelectedHistory);

function appendToInput(value) {
    currentInput += value;
    resultInput.value = currentInput;
}

function setOperator(value) {
    if (currentInput === '') return;

    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
    } else {
        calculate();
    }

    operator = value;
    resultInput.value = firstOperand + ' ' + operator; // Tampilkan operand dan operator
    currentInput = '';
}

function calculate() {
    let secondOperand = parseFloat(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = firstOperand + secondOperand;
            break;
        case "-":
            result = firstOperand - secondOperand;
            break;
        case "*":
            result = firstOperand * secondOperand;
            break;
        case "/":
            // Validasi angka kedua
            if (secondOperand === 0) {
                resultInput.value = "Error: Cannot divide by zero";
                return;
            }
            result = firstOperand / secondOperand;
            break;
        default:
            return;
    }

    resultInput.value = result;

    // Simpan hasil ke localStorage
    localStorage.setItem('lastResult', result);
    
    // Simpan riwayat perhitungan
    saveHistory(`${firstOperand} ${operator} ${secondOperand} = ${result}`);

    // Reset nilai untuk input berikutnya
    currentInput = '';
    firstOperand = result;
    operator = '';
}

function saveHistory(entry) {
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history)); // Simpan ke localStorage
    displayHistory(); // Tampilkan riwayat terbaru
}

function loadHistory() {
    const storedHistory = localStorage.getItem('history');
    if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        parsedHistory.forEach(item => history.push(item));
        displayHistory();
    }
}

function displayHistory() {
    historyDisplay.innerHTML = history.map((item, index) => 
        `<li><input type="checkbox" id="history-${index}"> ${item}</li>`).join(''); // Tampilkan riwayat dengan checkbox
}

function deleteSelectedHistory() {
    const checkboxes = historyDisplay.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            history.splice(index, 1); // Hapus item yang dipilih
        }
    });
    
    localStorage.setItem('history', JSON.stringify(history)); // Simpan perubahan ke localStorage
    displayHistory(); // Perbarui tampilan riwayat
}

function clear() {
    currentInput = '';
    operator = '';
    firstOperand = null;
    resultInput.value = '';
    
    // Clear the stored result from localStorage
    localStorage.removeItem('lastResult');
}
