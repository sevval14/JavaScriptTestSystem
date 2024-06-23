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

    function displayNextQuestion() {
        if (questionIndex < userPosts.length) {
            const currentPost = userPosts[questionIndex];
            document.getElementById('questionHTML').innerText = currentPost.title;

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
        } else {
            document.getElementById('questionHTML').innerText = "Tüm sorular görüntülendi.";
            document.getElementById('optionsForm').style.display = 'none';
        }
    }

    displayNextQuestion();

    document.getElementById('nextBtn').addEventListener('click', displayNextQuestion);
}