(function () {
  // Fragrance Finder Quiz (AI-powered)
  var quizBtn = document.getElementById('fragrance-quiz-btn');
  var quizModal = document.getElementById('fragrance-quiz-modal');
  var quizQuestions = [
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
  var quizAnswers = [];
  var quizStep = 0;

  function showQuizModal() {
    quizModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    renderQuizStep();
  }

  function closeQuizModal() {
    quizModal.style.display = 'none';
    document.body.style.overflow = '';
    quizStep = 0;
    quizAnswers = [];
  }


  async function renderQuizStep() {
    if (quizStep < quizQuestions.length) {
      var q = quizQuestions[quizStep];
      var html = '<div class="quiz-modal-content">';
      html += '<button class="quiz-close" style="position:absolute;top:1rem;right:1rem;font-size:1.5rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>';
      html += '<h2 style="color:#ffd105;">' + q.text + '</h2>';
      html += '<div class="quiz-options">';
      q.options.forEach(function(opt, i) {
        html += '<button class="quiz-option" style="margin:1rem 0.5rem;padding:1rem 2rem;font-size:1.1rem;border-radius:8px;border:none;background:#222;color:#ffd105;cursor:pointer;transition:background 0.2s;" data-idx="' + i + '">' + opt + '</button>';
      });
      html += '</div></div>';
      quizModal.innerHTML = html;
      quizModal.querySelector('.quiz-close').onclick = closeQuizModal;
      quizModal.querySelectorAll('.quiz-option').forEach(function(btn) {
        btn.onclick = function() {
          quizAnswers[quizStep] = q.options[parseInt(btn.getAttribute('data-idx'))];
          quizStep++;
          renderQuizStep();
        };
      });
    } else {
      // Call OpenAI API for real recommendation
      quizModal.innerHTML = '<div class="quiz-modal-content"><h2 style="color:#ffd105;">Finding your signature scent...</h2><p style="color:#fff;">Please wait while we analyze your answers.</p></div>';
      try {
        var result = await getAIFragranceRecommendation(quizAnswers);
        quizModal.innerHTML = '<div class="quiz-modal-content"><button class="quiz-close" style="position:absolute;top:1rem;right:1rem;font-size:1.5rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>' +
          '<h2 style="color:#ffd105;">Your Signature Scent</h2>' +
          '<p style="color:#fff;font-size:1.2rem;margin:2rem 0;">' + result + '</p>' +
          '<button class="btn btn-primary" style="margin-top:1rem;" onclick="document.getElementById(\'fragrance-quiz-modal\').style.display=\'none\';document.body.style.overflow=\'\';">Close</button></div>';
        quizModal.querySelector('.quiz-close').onclick = closeQuizModal;
      } catch (e) {
        quizModal.innerHTML = '<div class="quiz-modal-content"><button class="quiz-close" style="position:absolute;top:1rem;right:1rem;font-size:1.5rem;background:none;border:none;color:#fff;cursor:pointer;">&times;</button>' +
          '<h2 style="color:#ffd105;">Sorry!</h2>' +
          '<p style="color:#fff;font-size:1.1rem;margin:2rem 0;">We could not connect to the AI model. Please try again later.</p>' +
          '<button class="btn btn-primary" style="margin-top:1rem;" onclick="document.getElementById(\'fragrance-quiz-modal\').style.display=\'none\';document.body.style.overflow=\'\';">Close</button></div>';
        quizModal.querySelector('.quiz-close').onclick = closeQuizModal;
      }
    }
  }

  async function getAIFragranceRecommendation(answers) {
    // Use OpenAI API (GPT-4) for real recommendation
    // You must set your OpenAI API key below
    var apiKey = 'YOUR_OPENAI_API_KEY'; // <-- Replace with your OpenAI API key
    var prompt =
      'You are a fragrance expert for a luxury men\'s perfumery brand. Based on the following quiz answers, recommend a personalized fragrance style and describe the scent profile in 2-3 sentences.\n' +
      'Quiz Answers: ' + answers.map(function(a, i) { return (i+1) + '. ' + a; }).join(' | ') + '\nRecommendation:';
    var response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 120,
        temperature: 0.8
      })
    });
    if (!response.ok) throw new Error('API error');
    var data = await response.json();
    return data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content
      ? data.choices[0].message.content.trim()
      : 'We recommend exploring our collection to find your perfect match!';
  }

  if (quizBtn && quizModal) {
    quizBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showQuizModal();
    });
  }
})();

(function () {
  'use strict';

  // Header/nav logic (existing)
  var header = document.querySelector('.header');
  var navToggle = document.querySelector('.nav-toggle');
  var navDrawer = document.getElementById('nav-drawer');

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  function onNavToggle() {
    var open = header.classList.toggle('menu-open');
    if (navDrawer) {
      navDrawer.setAttribute('aria-hidden', !open);
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }

  if (header) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (navToggle) {
    navToggle.addEventListener('click', onNavToggle);
  }

  // Quiz logic
  var quizData = [
    {
      text: "Where are you wearing your fragrance?",
      options: [
        { label: "Night Out", img: "assets/night-out.jpg" },
        { label: "Special Occasion", img: "assets/special-occasion.jpg" },
        { label: "Date Night", img: "assets/date-night.jpg" },
        { label: "Everyday", img: "assets/everyday.jpg" },
        { label: "Office", img: "assets/office.jpg" }
      ]
    },
    {
      text: "Which mood do you want your fragrance to express?",
      options: [
        { label: "Happy", img: "assets/happy.jpg" },
        { label: "Flirty", img: "assets/flirty.jpg" },
        { label: "Sensual", img: "assets/sensual.jpg" },
        { label: "Confident", img: "assets/confident.jpg" },
        { label: "Cozy", img: "assets/cozy.jpg" },
        { label: "Classic", img: "assets/classic.jpg" }
      ]
    },
    {
      text: "What's your favourite smell?",
      options: [
        { label: "Cut grass", img: "assets/cut-grass.jpg" },
        { label: "Wood burning fireplace", img: "assets/fireplace.jpg" },
        { label: "Ocean air", img: "assets/ocean.jpg" },
        { label: "Rose Garden", img: "assets/rose-garden.jpg" },
        { label: "Mulled Wine", img: "assets/mulled-wine.jpg" },
        { label: "Sugar Cookie", img: "assets/sugar-cookie.jpg" },
        { label: "Latte", img: "assets/latte.jpg" },
        { label: "Pina Colada", img: "assets/pina-colada.jpg" }
      ]
    },
    {
      text: "Where would you rather be?",
      options: [
        { label: "Private beach", img: "assets/private-beach.jpg" },
        { label: "Versailles Gardens", img: "assets/gardens.jpg" },
        { label: "Ski Resort", img: "assets/ski-resort.jpg" },
        { label: "Hiking on a mountain", img: "assets/mountain.jpg" }
      ]
    },
    {
      text: "What's your drink of choice?",
      options: [
        { label: "Mimosa", img: "assets/mimosa.jpg" },
        { label: "Coffee", img: "assets/coffee.jpg" },
        { label: "Glass Of Rosé", img: "assets/rose.jpg" },
        { label: "Moscow Mule", img: "assets/moscow-mule.jpg" },
        { label: "Scotch", img: "assets/scotch.jpg" }
      ]
    },
    {
      text: "Do you prefer your fragrance to:",
      options: [
        { label: "Make a Statement", color: "#fcba03" },
        { label: "Subtly Linger", color: "#fcba03" }
      ],
      isBox: true
    }
  ];

  var quizContainer = document.getElementById('quiz-container');
  if (quizContainer) {
    var current = 0;
    var answers = [];

    function renderQuestion(idx) {
      var q = quizData[idx];
      var html = '<div class="quiz-question"><h2>' + q.text + '</h2><div class="quiz-options">';
      if (q.isBox) {
        q.options.forEach(function(opt, i) {
          html += '<button class="quiz-box-option" style="background:#fcba03;color:#000;font-weight:600;margin:1rem 0.5rem;padding:2rem 2.5rem;border:none;border-radius:8px;font-size:1.2rem;" data-idx="' + i + '">' + opt.label + '</button>';
        });
      } else {
        q.options.forEach(function(opt, i) {
          html += '<button class="quiz-option" data-idx="' + i + '" style="display:inline-block;margin:1rem 0.5rem;padding:0;border:none;background:none;cursor:pointer;">' +
            '<img src="' + opt.img + '" alt="' + opt.label + '" style="width:120px;height:120px;object-fit:cover;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.12);display:block;margin-bottom:0.5rem;">' +
            '<span style="display:block;font-size:1rem;font-weight:500;color:#fff;">' + opt.label + '</span>' +
            '</button>';
        });
      }
      html += '</div></div>';
      quizContainer.innerHTML = html;

      var optionBtns = quizContainer.querySelectorAll('.quiz-option, .quiz-box-option');
      optionBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          answers[idx] = q.options[parseInt(btn.getAttribute('data-idx'))].label;
          if (idx < quizData.length - 1) {
            renderQuestion(idx + 1);
          } else {
            showResults();
          }
        });
      });
    }

    function showResults() {
      quizContainer.innerHTML = '<div class="quiz-complete"><h2>Thank you for taking the quiz!</h2><p>Your answers have been recorded.</p></div>';
    }

    renderQuestion(current);
  }
})();
