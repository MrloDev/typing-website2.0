import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import words from './words.json'; 
import reportWebVitals from './reportWebVitals';

function App() {
    // function vars

    // the words per minute variable
    let wpmNum = 0; 
    let wpmString = ''; 

    // characters
    let correctChars = 0;
    let chars = 0; 

    // word generation and editing
    let wordArray = [];
    let wordIndex = 0; 
    let wordAmount = 0;

    // time variables
    let beginTime = 0; 
    let endTime = 0; 
    let hasEnded = false; 

    // history variables
    let historyVar = []; 

    // time functions

    // function to start the program
    const start = () => { 
        beginTime = Date.now(); 
    }

    // function to end the program
    const end = () => { 

        // setting the time
        endTime = Math.floor((Date.now() - beginTime) / 100);  

        // setting the wpm
        wpmNum = ((wordAmount / endTime) * 600) * (correctChars / chars); 
        wpmString = wpmNum.toString().substring(0, 5); 
        historyVar.push(wpmString, wordAmount); 
        document.getElementById('info').innerHTML = `${wpmString}WPM`
        document.getElementById('testInfo').innerHTML = `
            WPM: ${wpmString}
            <br />
            RAW: ${((wordAmount / endTime) * 600).toString().substring(0, 5)}
            <br /> 
            Time: ${endTime / 10}s
            <br />
            Accuracy: ${((correctChars / chars) * 100).toString().substring(0, 4)}%
        `
    }

    // function to navigate the generate section 
    const countChange = (event) => { 
        wordAmount = parseInt(event.target.value); 
    }

    const updateCount = (event) => {
        event.preventDefault(); 

        if (isNaN(wordAmount) || wordAmount > 250 || wordAmount < 5) { 
            document.getElementById('displayWords').innerHTML =
                `The word Amount should be a number higher than 4, equal to or less than 250`;
            return; 
        }

        generate(wordAmount); 
    }

    const checkWord = (event) => {  
        if (!hasEnded) {

            // giving the current word a colour
            if (document.getElementById(wordIndex))
            document.getElementById(wordIndex).style.color = "#e9c46a"; 

            // calling the start function
            if (wordIndex === 0 && event.target.value.length === 1)
            start(); 

            document.getElementById('wordInput').addEventListener("keyup", (event) => { 
                if (event.code === 'Backspace') { 
                    // adding a color to the current word
                    if (wordArray[wordIndex]) {
                        for (let i = event.target.value.length; i < wordArray[wordIndex].length; i++) { 
                            document.getElementById(`${wordIndex}_${i}`).style.color = "#e9c46a"; 
                        }
                    }
                }
            }); 

            // checking if the word is full correct 
            if (event.target.value === `${wordArray[wordIndex]} `) {

                // adding the correct characters from this word to the correctChars variable
                correctChars += wordArray[wordIndex].length; 

                // reseting the value of the input tag to null
                document.getElementById('wordInput').value = ''; 

                // moving the current word index up to the next word
                wordIndex++;

                // checking for the end of the program
                if (wordIndex === wordArray.length) { 
                    end()
                    document.getElementById('wordInput').value = ''; 
                    hasEnded = true; 
                }
            } else if (event.target.value.includes(' ')) { 
                if (event.target.value === ' ')            
                    return; 

                // adding the correct chars in the word to the correctChars variable
                for (let i = 0; i < event.target.value.length - 1; i++) { 
                    if (event.target.value[i] === wordArray[wordIndex][i])
                        correctChars++;
                }

                // setting the colour of the chars that haven't been typed to red
                if (document.getElementById(wordIndex))
                document.getElementById(wordIndex).style.color = "#f64c72"; 

                // reseting the value of the input tag to null
                document.getElementById('wordInput').value = ''; 
                
                // moving the current word index up to the next word
                wordIndex++; 

                // checking for the end of the program
                if (wordIndex === wordArray.length) { 
                    end(); 
                    hasEnded = true; 
                    document.getElementById('wordInput').value = ''; 
                }
            }

            // highlighting the correct and the wrong chars 
            for (let i = 0; i < event.target.value.length; i++) { 
                if (document.getElementById(`${wordIndex}_${i}`))
                    if (event.target.value[i] === wordArray[wordIndex][i]) {

                        // setting the character's color to green as it is a correct character
                        document.getElementById(`${wordIndex}_${i}`).style.color = "#2a9d8f"; 

                    }
                    else {

                        // setting the character's color to red as it is a wrong character
                        document.getElementById(`${wordIndex}_${i}`).style.color = "#f64c72";

                    }
            }
        }
    }

    const generate = (wordAmount) => { 
        // clearing the content of wordinput input tag
        document.getElementById('wordInput').value = ''; 

        document.getElementById('wordInput').addEventListener("keyup", (event) => { 
            if (event.code === "Escape")
                generate(wordAmount); 
        }); 
        document.getElementById('wordInput').removeEventListener("keyup", (event) => ()); 
        // vars 
        wordArray = []; 
        wordIndex = 0; 
        hasEnded = false; 
        chars = 0;
        correctChars = 0; 
        let lastWord = ''; 

        // reseting the displayWords container aka div 
        document.getElementById('displayWords').innerHTML = ''; 
        for (let i = 0; i < wordAmount; i++) { 
            const currentWord = words[Math.floor(Math.random() * 1000)];     
            if (currentWord === lastWord)
                generate(wordAmount);
            
            // adding the words as spans to the displayWords container
            document.getElementById('displayWords').innerHTML += 
            `<span id="${i}" class="word" />`;

            // adding the word letters in the span 
            for (let j = 0; j < currentWord.length; j++)
                document.getElementById(i).innerHTML += 
                `<span id="${i}_${j}">${currentWord[j]}</span>`

            wordArray.push(currentWord); 
            chars += currentWord.length; 
            lastWord = currentWord; 
        }
    }

    return(
        <div className="mainDiv">

            <div id="info" > 
                XXXXWPM
            </div>
            
            <form onSubmit={updateCount}>
                <div>
                    <input 
                        onChange={countChange}
                        className="wordAmount" 
                        type="text"
                        placeholder="Enter the word amount here." 
                    />

                    <button type="submit" className="submitButton">
                        redo
                    </button>
                </div>
            </form>

            <div className="displayWords" id="displayWords">
                Enter an amount of words to continue. 
            </div>

            <div className="mainInput">

                <input 
                    id="wordInput" 
                    placeholder="Enter words here." 
                    onChange={checkWord}
                />
                
            </div>
            <div className="credits">
                <a id="git" target="_blank" rel="noreferrer" href="https://github.com/MrloDev">
                    <br />
                    <p>
                        MrloDev 2021
                    </p>
                </a>
            </div>
            <div className="binds">
                esc - restart test
            </div>
        </div>
    );   
}

// function to display the history 
const Extra = () => { 
    return (
        <div id="info2">
            <div id="testInfo">
                Info about the current test.
            </div>
            <div id="history">
                History of the tests.
            </div>
        </div>
    ); 
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Extra />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
