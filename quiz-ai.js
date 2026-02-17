// AI-powered Fragrance Finder Quiz for quiz.html
const quizQuestions = [
  {
    text: "Where are you wearing your fragrance?",
    options: ["Night Out", "Special Occasion", "Date Night", "Everyday", "Office"]
  },
  {
    text: "Which mood do you want your fragrance to express?",
    options: ["Happy", "Flirty", "Sensual", "Confident", "Cozy", "Classic"]
  },
  {
    text: "What's your favourite smell?",
    options: ["Cut grass", "Wood burning fireplace", "Ocean air", "Rose Garden", "Mulled Wine", "Sugar Cookie", "Latte", "Pina Colada"]
  },
  {
    text: "Where would you rather be?",
    options: ["Private beach", "Versailles Gardens", "Ski Resort", "Hiking on a mountain"]
  },
  {
    text: "What's your drink of choice?",
    options: ["Mimosa", "Coffee", "Glass Of Rosé", "Moscow Mule", "Scotch"]
  },
  {
    text: "Do you prefer your fragrance to:",
    options: ["Make a Statement", "Subtly Linger"]
  }
];

let quizStep = 0;
let quizAnswers = [];
const quizContent = document.getElementById('quiz-content');

function renderQuizStep() {
  if (quizStep < quizQuestions.length) {
    const q = quizQuestions[quizStep];
    let html = `<div class='quiz-question'>${q.text}</div><div class='quiz-options'>`;
    q.options.forEach((opt, i) => {
      html += `<button class='quiz-option' data-idx='${i}'>${opt}</button>`;
    });
    html += '</div>';
    quizContent.innerHTML = html;
    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.onclick = function() {
        quizAnswers[quizStep] = q.options[parseInt(btn.getAttribute('data-idx'))];
        quizStep++;
        renderQuizStep();
      };
    });
  } else {
    showLoader();
    getAIFragranceRecommendation(quizAnswers).then(result => {
      quizContent.innerHTML = `<div class='quiz-result'><strong>Your Signature Scent:</strong><br>${result}</div>`;
    }).catch(() => {
      quizContent.innerHTML = `<div class='quiz-result'>Sorry, we could not connect to the AI model. Please try again later.</div>`;
    });
  }
}

function showLoader() {
  quizContent.innerHTML = `<div class='quiz-loader'>Finding your signature scent...<br><span style='font-size:2rem;'>⏳</span></div>`;
}

async function getAIFragranceRecommendation(answers) {
  // Call the Netlify Function (works locally and on production)
  const response = await fetch('/.netlify/functions/get-recommendation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ answers })
  });
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  return data.recommendation || 'We recommend exploring our collection to find your perfect match!';
}

renderQuizStep();
