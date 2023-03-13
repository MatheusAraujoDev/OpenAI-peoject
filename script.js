const sendButton = document.getElementById("sendButton");
const clearHistoryButton = document.getElementById("clear-search-history");

const questionContainer = document.getElementById("questionContainer");
const answerContainer = document.getElementById("answerContainer");

sendButton.addEventListener("click", AskQuestion);
clearHistoryButton.addEventListener("click", clearHistory);

const OPENAI_API_KEY = ""; // insert your API Key here.

function AskQuestion() {
  if(questionContainer.value !== "") {
    const answerBoxValue = questionContainer.value;

    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + OPENAI_API_KEY,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        max_tokens: 2048,
        temperature: 1,
        model: "text-davinci-003",
        prompt: answerBoxValue,
      }),
    })
    .then((result) => result.json())
    .then((res) => {
      if (answerContainer.value) answerContainer.value += "\n";
      if (res.error?.message) {
        answerContainer.value += `Error: ${res.error.message}`;
      } else if (res.choices?.[0].text) {
        const answer = res.choices[0].text || "Answer Not Found";
        answerContainer.value += "AI Answer: " + answer;
      }
      answerContainer.scrollTop = answerContainer.scrollHeight;
    })
    .catch(err => console.log(err.message))
    .finally(() => {
      questionContainer.disabled = false;
      questionContainer.focus();
      questionContainer.value = "";
    });

  if (answerContainer.value) answerContainer.value += "\n\n\n"; // padding between 2 questions
  questionContainer.value = "Loading...";
  questionContainer.disabled = true;
  answerContainer.value += `You: ${answerBoxValue}`;
  answerContainer.scrollTop = answerContainer.scrollHeight;

  } else {
    return;
  }
}

function clearHistory() {
  return answerContainer.value = "";
}
