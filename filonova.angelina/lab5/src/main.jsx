import React, {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

function calculate(left, right, operation) {
  switch (operation) {
    case 'add':
      return left + right;
    case 'subtract':
      return left - right;
    case 'multiply':
      return left * right;
    case 'divide':
      return right === 0 ? null : left / right;
    default:
      return right;
  }
}

function formatResult(value) {
  return String(Math.round(value * 1000000000000) / 1000000000000);
}

function getOperationSymbol(operation) {
  switch (operation) {
    case 'add':
      return '+';
    case 'subtract':
      return '−';
    case 'multiply':
      return '×';
    case 'divide':
      return '÷';
    default:
      return '';
  }
}

function App() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [storedValue, setStoredValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  function updateExpression(value) {
    if (storedValue !== null && operation !== null) {
      setExpression(
        `${formatResult(storedValue)} ${getOperationSymbol(operation)} ${value}`,
      );
    }
  }

  function inputDigit(digit) {
    const startingNewCalculation =
      waitingForOperand && storedValue === null && operation === null;

    let nextDisplay;

    if (display === 'Ошибка' || waitingForOperand) {
      nextDisplay = digit;
      setWaitingForOperand(false);
    } else {
      nextDisplay = display === '0' ? digit : display + digit;
    }

    if (startingNewCalculation || display === 'Ошибка') {
      setExpression('');
    }

    setDisplay(nextDisplay);
    updateExpression(nextDisplay);
  }

  function inputDecimal() {
    const startingNewCalculation =
      waitingForOperand && storedValue === null && operation === null;

    if (display === 'Ошибка' || waitingForOperand) {
      if (startingNewCalculation || display === 'Ошибка') {
        setExpression('');
      }

      setDisplay('0.');
      setWaitingForOperand(false);
      updateExpression('0.');
      return;
    }

    if (!display.includes('.')) {
      const nextDisplay = `${display}.`;

      setDisplay(nextDisplay);
      updateExpression(nextDisplay);
    }
  }

  function chooseOperation(nextOperation) {
    if (display === 'Ошибка') {
      return;
    }

    const inputValue = Number(display);
    let value = inputValue;

    if (storedValue !== null && operation !== null && !waitingForOperand) {
      const result = calculate(storedValue, inputValue, operation);

      if (result === null) {
        setDisplay('Ошибка');
        setExpression('');
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      value = result;
      setDisplay(formatResult(result));
    }

    setStoredValue(value);
    setOperation(nextOperation);
    setWaitingForOperand(true);
    setExpression(
      `${formatResult(value)} ${getOperationSymbol(nextOperation)}`,
    );
  }

  function calculateResult() {
    if (storedValue === null || operation === null || display === 'Ошибка') {
      return;
    }

    const rightValue = Number(display);
    const result = calculate(storedValue, rightValue, operation);

    setExpression(
      `${formatResult(storedValue)} ${getOperationSymbol(operation)} ${formatResult(rightValue)} =`,
    );

    if (result === null) {
      setDisplay('Ошибка');
    } else {
      setDisplay(formatResult(result));
    }

    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }

  function clearCalculator() {
    setDisplay('0');
    setExpression('');
    setStoredValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }

  function changeSign() {
    if (display === 'Ошибка' || display === '0') {
      return;
    }

    const nextDisplay = formatResult(Number(display) * -1);

    setDisplay(nextDisplay);
    updateExpression(nextDisplay);
  }

  function calculatePercent() {
    if (display === 'Ошибка') {
      return;
    }

    const nextDisplay = formatResult(Number(display) / 100);

    setDisplay(nextDisplay);
    updateExpression(nextDisplay);
  }

  return (
    <section className="calculator">
      <h1>Калькулятор</h1>

      <div className="display-container">
        <div className="calculator-expression">{expression || '\u00A0'}</div>

        <output
          className="calculator-display"
          data-testid="calculator-display"
          aria-live="polite"
        >
          {display}
        </output>
      </div>

      <div className="calculator-buttons">
        <button
          type="button"
          data-testid="calculator-clear"
          onClick={clearCalculator}
        >
          C
        </button>

        <button type="button" onClick={changeSign}>
          ±
        </button>

        <button type="button" onClick={calculatePercent}>
          %
        </button>

        <button
          type="button"
          data-operation="divide"
          onClick={() => chooseOperation('divide')}
        >
          ÷
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="7"
          onClick={() => inputDigit('7')}
        >
          7
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="8"
          onClick={() => inputDigit('8')}
        >
          8
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="9"
          onClick={() => inputDigit('9')}
        >
          9
        </button>

        <button
          type="button"
          data-operation="multiply"
          onClick={() => chooseOperation('multiply')}
        >
          ×
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="4"
          onClick={() => inputDigit('4')}
        >
          4
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="5"
          onClick={() => inputDigit('5')}
        >
          5
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="6"
          onClick={() => inputDigit('6')}
        >
          6
        </button>

        <button
          type="button"
          data-operation="subtract"
          onClick={() => chooseOperation('subtract')}
        >
          −
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="1"
          onClick={() => inputDigit('1')}
        >
          1
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="2"
          onClick={() => inputDigit('2')}
        >
          2
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="3"
          onClick={() => inputDigit('3')}
        >
          3
        </button>

        <button
          type="button"
          data-operation="add"
          onClick={() => chooseOperation('add')}
        >
          +
        </button>

        <button
          type="button"
          className="zero-button"
          data-testid="calculator-key"
          data-value="0"
          onClick={() => inputDigit('0')}
        >
          0
        </button>

        <button
          type="button"
          data-testid="calculator-key"
          data-value="."
          onClick={inputDecimal}
        >
          .
        </button>

        <button
          type="button"
          className="equals-button"
          data-testid="calculator-equals"
          onClick={calculateResult}
        >
          =
        </button>
      </div>
    </section>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
