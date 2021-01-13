document.addEventListener('DOMContentLoaded', (event) => {

    
// initial variables
const startTime = 75;
let time = 75;
let score = 0;
let questionCount = 0;
let timeset;
let answers = document.querySelectorAll('#quizContent button');


// quiz questions and answers
let questions = [
    {
      title: "Commonly used data types DO NOT include:",
      choices: ["strings", "booleans", "alerts", "numbers"],
      answer: "alerts"
    },
    {
      title: "The condition in an if / else statement is enclosed within _____.",
      choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
      answer: "parentheses"
    },
    {
      title: "Arrays in JavaScript can be used to store _____.",
      choices: ["numbers and strings", "other arrays", "booleans", "all the above"],
      answer: "all of the above"
    },
    {
      title: "String values must be enclosed within _____ when being assinged to variables",
      choices: ["commas", "curly brackets", "quotes", "parenthesis"],
      answer: "quotes"
    },
    {
      title: "A very useful tool used during development and debugger for printing content of the debugger is:",
      choices: ["JavaScript", "terminal/bash",  "for loops", "console.log"],
      answer: "console.log"
    },
  ];


// store highscores in local storage
let records = [];
(localStorage.getItem('records')) ? records = JSON.parse(localStorage.getItem('records')): records = [];


// Function to call elements
let queryElement = (element) => {
    return document.querySelector(element);
} 


// Function to hide/unhide
let onlyDisplaySection = (element) => {
    let sections = document.querySelectorAll("section");
    Array.from(sections).forEach((userItem) => {
        userItem.classList.add('hide');
    });
    queryElement(element).classList.remove('hide');
}


// Function to reset HTML display for score
let HTMLreset = () => {
    queryElement('#highScores div').innerHTML = "";
    let i = 1;
    records.sort((a,b) => b.score - a.score);
    Array.from(records).forEach(check => {
        let scores = document.createElement("div");
        scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
        queryElement('#highScores div').appendChild(scores);
        i = i + 1   
    });
    i = 0;
    Array.from(answers).forEach(answer => {
        answer.classList.remove('disable');
    });
}


// Function to set question data
let qData = () => {
    queryElement('#quizContent p').innerHTML = questions[questionCount].title;
    queryElement('#quizContent button:nth-of-type(1)').innerHTML = `1. ${questions[questionCount].choices[0]}`;
    queryElement('#quizContent button:nth-of-type(2)').innerHTML = `2. ${questions[questionCount].choices[1]}`;
    queryElement('#quizContent button:nth-of-type(3)').innerHTML = `3. ${questions[questionCount].choices[2]}`;
    queryElement('#quizContent button:nth-of-type(4)').innerHTML = `4. ${questions[questionCount].choices[3]}`;
}


// Function to change question and show whether answer is correct or not
let quizUpdate = (answerCopy) => {
    queryElement('#scoreLabel p').innerHTML = answerCopy;
    queryElement('#scoreLabel').classList.remove('hidden', scoreLabel());
    Array.from(answers).forEach(answer => {
        answer.classList.add('disable');
    });

    // Exit quiz if all questions answered
    setTimeout(() => {
        if (questionCount === questions.length) {
            onlyDisplaySection("#finished");
            time = 0;
            queryElement('#time').innerHTML = time;
        } else {
            qData ();
            Array.from(answers).forEach(answer =>  {
                answer.classList.remove('disable');
            });
        }    
    }, 1000);
}


// Function for time
let Timer = () => {
    if (time > 0) {
        time = time - 1;
        queryElement('#time').innerHTML = time;
    } else {
        clearInterval(clock);
        queryElement('#score').innerHTML = score;
        onlyDisplaySection("#finished");
    }
}


// On intro button click start time and starts giving questions
let clock;
queryElement("#intro button").addEventListener("click", (e) => {
	//call above function to set Initial data in questionHolder section
	qData();
	onlyDisplaySection("#quizContent");
	clock = setInterval(Timer, 1000);
	});


// Clears timeout if next question is answered before current timeout is reached or if form element has a requirement not met.
let scoreLabel = () => {
	clearTimeout(timeset);
	timeset = setTimeout(() => {
		queryElement('#scoreLabel').classList.add('hidden');
	}, 1000);
}


//////////////////// QUIZ CONTROLS ////////////////////

// Create an array of selected divs so I can refer to them with the this keyword and replace their values to then check against the answer property for all questions.
Array.from(answers).forEach(check => {
	check.addEventListener('click', function (event) {
		    // Handles events if a question is answered correctly
		    if (this.innerHTML.substring(3, this.length) === questions[questionCount].answer) {
			    score = score + 1;
			    questionCount = questionCount + 1;
			    quizUpdate("Correct!");
		    }else{
			// Handles events if a question is answered incorrectly.
			    time = time - 10;
			    questionCount = questionCount + 1;
			    quizUpdate("Wrong!");
		}
	});
});


//////////////////// SCORE SUBMISSION ////////////////////

// Displays error message if initials given do not meet requirements
let errorLabel = () => {
	clearTimeout(timeset);
	timeset = setTimeout(() => {
		    queryElement('#errorLabel').classList.add('hidden');
	}, 3000);
}

// Error handling for submitting high scores
queryElement("#records button").addEventListener("click", () => {
	let initialsRecord = queryElement('#initials').value;
	if (initialsRecord === ''){
		    queryElement('#errorLabel p').innerHTML = "You need at least 1 character";
		    queryElement('#errorLabel').classList.remove('hidden', errorLabel());
	} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
		    queryElement('#errorLabel p').innerHTML = "Only letters for initials allowed.";
		    queryElement('#errorLabel').classList.remove('hidden', errorLabel());
	} else if (initialsRecord.length > 5) {
		    queryElement('#errorLabel p').innerHTML = "Maximum of 5 characters allowed.";
		    queryElement('#errorLabel').classList.remove('hidden', errorLabel());
	} else {
		//Sends value to current array for use now.
		records.push({
			"initialRecord": initialsRecord,
			"score": score
		});
		//Sends value to local storage for later use.
		localStorage.setItem('records', JSON.stringify(records));
		queryElement('#highScores div').innerHTML = '';
		onlyDisplaySection("#highScores");
		HTMLreset();
		queryElement("#initials").value = '';
	}
});


//////////////////// HIGH SCORE CONTROL ARRAY/LOCAL STORAGE ////////////////////

// Clears highscores from the html, array and localstorage
queryElement("#clearScores").addEventListener("click", () => {
	records = [];
	queryElement('#highScores div').innerHTML = "";
	localStorage.removeItem('records');
});

// Resets all quiz settings to the default to replay the quiz
queryElement("#reset").addEventListener("click", () => {
	time = startTime;
	score = 0;
	questionCount = 0;
	onlyDisplaySection("#intro");
});

// If a player pushes the view high scores button in the html view then this abdandons all quiz progress and lets them view the high scores.
queryElement("#HScore").addEventListener("click", (e) => {
	e.preventDefault();
	clearInterval(clock);
	queryElement('#time').innerHTML = 0;
	time = startTime;
	score = 0;
	questionCount = 0;
	onlyDisplaySection("#highScores");
	HTMLreset();
    });

});