import { useState, useEffect, useCallback } from 'react'
import Styles from './App.module.css';
const REGEX = /[0-9]/


function App() {

  const [input, setInput] = useState([]);
  const [defaultValue, setDefaultValue] = useState(0);
  let clickedEquals = false;

  const handleButtonClick = (event) => {
    const value = event.target.value;
    setInput((prevState) => {
      let prevValue = prevState[prevState.length - 1]
      const newState = [...prevState]
      const index = newState.indexOf(prevValue)
      if (value === 'c') {
        return [];
      } else if (value === '+/-') {
        if (prevValue > 0) {
          newState[index] = -prevValue
          return newState
        } else {
          newState[index] = Math.abs(prevValue)
          return newState
        }
      } else if (value === '%') {
        newState[index] = prevValue / 100
        return newState
      } else if (value === '.') {
        if (prevValue.includes('.')) {
          return newState;
        }
        newState[index] = prevValue + value
        return newState
      } else if (REGEX.test(value) && REGEX.test(prevValue)) {
        newState[index] = prevValue + value
        return newState
      }
      return newState.concat(value)
    })
  }


  const changeDefaultValue = useCallback(value => {
    if (value.length > 0) {
      let defaultValue = value[value.length - 1];
      if (defaultValue && !REGEX.test(defaultValue)) {
        value.pop(defaultValue);
        return changeDefaultValue(value);
      }
      else {
        setDefaultValue(defaultValue);
        return;
      }
    }
    setDefaultValue(REGEX.test(value) ? 0 : value = 0);
  }, [])

  useEffect(() => {
    let value = [...input];
    changeDefaultValue(value);
  }, [input, changeDefaultValue])

  const evaluate = useCallback((a, b, identifier, clickedEquals) => {
    let result = 0;
    switch (identifier) {
      case '+': result = a + b;
        break;
      case '-': result = a - b;
        break;
      case 'x': result = a * b;
        break;
      case '÷': result = a / b;
        break;
      case '%': result = a % b;
        break;
      default: result = 0;
    }
    clickedEquals = false
    setDefaultValue([result])
    setInput(prevState => {
      const newState = [...prevState]
      if (newState.length > 3) {
        const unCalculatedInputs = newState.slice(newState.length - 1)
        return [result, ...unCalculatedInputs]
      }
      return [result]
    })
  }, [])

  const handleEquals = useCallback((clickedEquals) => {
    if (input.length >= 3) {
      clickedEquals = true;
      evaluate(+input[0], +input[2], input[1], clickedEquals)
    }
  }, [evaluate, input])

  useEffect(() => {
    if (!clickedEquals && input.length >= 3 && !REGEX.test(input[input.length - 1])) {
      handleEquals(clickedEquals)
    }
  }, [clickedEquals, handleEquals, input])

  return (
    <div className={Styles.container}>
      <div className={Styles.calculator}>
        <div className={Styles.displayArea}>
          <input className={Styles.display} name='screen' id='screen' value={defaultValue} disabled={true} />
        </div>
        <div className={Styles.buttons}>
          <button id='c' className={`${Styles.button} ${Styles.operator}`} value='c' onClick={handleButtonClick}>c</button>
          <button id='+/-' className={`${Styles.button} ${Styles.operator}`} value='+/-' onClick={handleButtonClick}>+/-</button>
          <button id='%' className={`${Styles.button} ${Styles.operator}`} value='%' onClick={handleButtonClick}>%</button>
          <button id='%' className={`${Styles.button} ${Styles.operator}`} value='÷' onClick={handleButtonClick}>÷</button>
          <button id='7' className={Styles.button} value='7' onClick={handleButtonClick}>7</button>
          <button id='8' className={Styles.button} value='8' onClick={handleButtonClick}>8</button>
          <button id='9' className={Styles.button} value='9' onClick={handleButtonClick}>9</button>
          <button id='x' className={`${Styles.button} ${Styles.operator}`} value='x' onClick={handleButtonClick}>x</button>
          <button id='4' className={Styles.button} value='4' onClick={handleButtonClick} >4</button>
          <button id='5' className={Styles.button} value='5' onClick={handleButtonClick}>5</button>
          <button id='6' className={Styles.button} value='6' onClick={handleButtonClick}>6</button>
          <button id='-' className={`${Styles.button} ${Styles.operator}`} value='-' onClick={handleButtonClick}>-</button>
          <button id='1' className={Styles.button} value='1' onClick={handleButtonClick}>1</button>
          <button id='2' className={Styles.button} value='2' onClick={handleButtonClick}>2</button>
          <button id='3' className={Styles.button} value='3' onClick={handleButtonClick}>3</button>
          <button id='+' className={`${Styles.button} ${Styles.operator}`} value='+' onClick={handleButtonClick}>+</button>
          <button id='0' className={Styles.button} value='0' onClick={handleButtonClick}>0</button>
          <button id='.' className={Styles.button} value='.' onClick={handleButtonClick}>.</button>
          <button id='=' className={`${Styles.button} ${Styles.result}`} value='=' onClick={handleEquals.bind(clickedEquals)}>=</button>
        </div>
      </div>
    </div>
  );
}

export default App;
