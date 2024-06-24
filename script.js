document.getElementById('submitUserId').addEventListener('click', function() {
    const userId = document.getElementById('userIdInput').value;
    
    if (userId) {
        fetch("https://jsonplaceholder.typicode.com/posts")
            .then(response => response.json())
            .then(data => {
                processData(data, userId);
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert("Please enter your user id");
    }
});

function processData(data, userId) {
    console.log("Fetched Data:", data);

    let userIDs = data.map(post => post.userId);

    if (userIDs.includes(parseInt(userId))) {
        document.getElementById('userIdSection').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
        fetchQuestion(data, userId);
        
        console.log("User ID found:", userId);
    } else {
        alert("Invalid user id please try another one");
    }
}

function fetchQuestion(data, userId){
    const userPosts = data.filter(post => post.userId == userId);
    let questionIndex = 0;
    const totalTime = 30;
    const enableTime = 10;
    let timeLeft = totalTime;
    let timer;
    const answers = [];


    function displayNextQuestion() {

        if (questionIndex < userPosts.length) {
            const currentPost = userPosts[questionIndex];
            document.getElementById('questionHTML').innerText = currentPost.title;
            clearInterval(timer);
            timeLeft = totalTime;
            updateTimer();
            startTimer();
            const options = currentPost.body.split("\n");
            document.getElementById('labelA').innerText = "A) " + options[0];
            document.getElementById('labelB').innerText = "B) " + options[1];
            document.getElementById('labelC').innerText = "C) " + options[2];
            document.getElementById('labelD').innerText = "D) " + options[3];

            const totalIndex = document.getElementById('totalIndex');
            totalIndex.innerText = "Question "+(questionIndex +1)
    
            const nextButton = document.getElementById('nextBtn');

            if (questionIndex === 9) {
                nextButton.innerText = "Finish";
            }else{
                nextButton.innerText = "Next";

            }
            questionIndex++;
        } 
        else {
            const tbody = document.querySelector('tbody');

            answers.forEach(item => {
                const tr = document.createElement('tr');
                const tdQuestion = document.createElement('td');
                const tdAnswer = document.createElement('td');
    
                tdQuestion.textContent = `Soru ${item.question}`;
                tdAnswer.textContent = item.answer;
    
                tr.appendChild(tdQuestion);
                tr.appendChild(tdAnswer);
                tbody.appendChild(tr);
            });
            document.getElementById("refresh").addEventListener("click",refreshPage);
            document.getElementById('questionHTML').innerText = "Tüm sorular görüntülendi.";
            document.getElementById('optionsForm').style.display = 'none';
            document.getElementById('footer').style.display = 'none';
            document.getElementById('resultTable').style.display = 'block';
            totalIndex.innerText = "Results"
            clearInterval(timer);

        }
    }
    displayNextQuestion();
    document.getElementById('nextBtn').addEventListener('click', function() {
        if (timeLeft >= 20) {
            alert("You can pass after " + (timeLeft - 20) + " seconds");
        }else{
            const selectedOption = getSelectedOption();
            if (selectedOption) {
                answers.push({ question: questionIndex, answer: selectedOption });

            } else {
                answers.push({ question: questionIndex, answer: "boş" });
            }
            console.log(answers);
            clearSelectedOptions();
            displayNextQuestion();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        alert("You cannot go back to the previous question")
    });


    function getSelectedOption() {
        const options = document.getElementsByName('answer');
        for (const option of options) {
            if (option.checked) {
                const label = document.querySelector(`label[for=${option.id}]`);
                return label.textContent;
            }
        }
        return null; 
    }

    function clearSelectedOptions() {
        const options = document.getElementsByName('answer');
        for (const option of options) {
            option.checked = false;
        }
    }


    function updateTimer() {
        document.getElementById("timer").innerText = "Kalan Süre: " + timeLeft + " saniye";
    }

    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            if (timeLeft <= 0) {
                const selectedOption = getSelectedOption();
                if (selectedOption) {
                    answers.push({ question: questionIndex, answer: selectedOption });
    
                } else {
                    answers.push({ question: questionIndex, answer: "boş" });
                }
                console.log(answers);
                clearSelectedOptions();
                displayNextQuestion();
            }
            updateTimer();
        }, 1000);
   
    }

    function refreshPage() {
        window.location.reload();
    }

}
