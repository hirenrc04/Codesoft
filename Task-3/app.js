document.addEventListener('DOMContentLoaded', function() {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const buttons = document.querySelectorAll('button');
    
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let resetScreen = false;
    
    function updateDisplay() {
        currentOperandElement.textContent = currentOperand;
        if (operation != null) {
            previousOperandElement.textContent = `${previousOperand} ${operation}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }
    
    function appendNumber(number) {
        if (currentOperand === '0' || resetScreen) {
            currentOperand = '';
            resetScreen = false;
        }
        if (number === '.' && currentOperand.includes('.')) return;
        currentOperand += number;
    }
    
    function chooseOperation(op) {
        if (currentOperand === '') return;
        if (previousOperand !== '') {
            compute();
        }
        operation = op;
        previousOperand = currentOperand;
        resetScreen = true;
    }
    
    function compute() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
    }
    
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }
    
    function deleteNumber() {
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number') || button.hasAttribute('data-number')) {
                appendNumber(button.textContent);
            } else if (button.classList.contains('operator')) {
                chooseOperation(button.textContent);
            } else if (button.classList.contains('equals')) {
                compute();
            } else if (button.classList.contains('clear')) {
                clear();
            } else if (button.classList.contains('delete')) {
                deleteNumber();
            }
            updateDisplay();
        });
    });
    
    // Add number class to all number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
        button.classList.add('number');
    });
    
    updateDisplay();
});