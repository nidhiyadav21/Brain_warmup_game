// Game state
let currentRiddleIndex = 0;
let scores = {
    correct: 0,
    close: 0,
    wrong: 0
};

// Riddles database
const riddles = [
    {
        question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
        answer: "echo",
        alternatives: ["echoes", "sound", "voice"]
    },
    {
        question: "The more you take, the more you leave behind. What am I?",
        answer: "footsteps",
        alternatives: ["footstep", "steps", "footprints"]
    },
    {
        question: "What has keys, but no locks; space, but no room; and you can enter, but not go in?",
        answer: "keyboard",
        alternatives: ["computer", "typewriter", "keys"]
    },
    {
        question: "What gets wetter and wetter the more it dries?",
        answer: "towel",
        alternatives: ["sponge", "cloth", "rag"]
    },
    {
        question: "What has a head and a tail but no body?",
        answer: "coin",
        alternatives: ["penny", "nickel", "quarter", "dime"]
    },
    {
        question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
        answer: "letter m",
        alternatives: ["m", "the letter m", "letter m", "m letter"]
    },
    {
        question: "What is always in front of you but can't be seen?",
        answer: "future",
        alternatives: ["tomorrow", "time", "destiny"]
    },
    {
        question: "What breaks when you say it?",
        answer: "silence",
        alternatives: ["quiet", "peace", "stillness"]
    }
];

// Motivational quotes
const quotes = [
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" }
];

// DOM elements
const riddleText = document.getElementById('riddle-text');
const riddleNumber = document.getElementById('riddle-number');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const resultSection = document.getElementById('result-section');
const scoreTitle = document.getElementById('score-title');
const scoreIcon = document.getElementById('score-icon');
const scoreMessage = document.getElementById('score-message');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const nextBtn = document.getElementById('next-btn');
const correctCount = document.getElementById('correct-count');
const closeCount = document.getElementById('close-count');
const wrongCount = document.getElementById('wrong-count');

// Initialize the game
function initGame() {
    loadRiddle();
    updateStats();
    
    // Event listeners
    submitBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextRiddle);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    
    // Add typing effect to riddle text
    addTypingEffect();
    
    // Add particle effect
    createParticles();
}

// Add typing effect to riddle text
function addTypingEffect() {
    const text = riddleText.textContent;
    riddleText.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            riddleText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }
    
    typeWriter();
}

// Create floating particles
function createParticles() {
    const container = document.querySelector('.container');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: floatParticle ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        container.appendChild(particle);
    }
}

// Load a random riddle
function loadRiddle() {
    const randomIndex = Math.floor(Math.random() * riddles.length);
    currentRiddleIndex = randomIndex;
    const riddle = riddles[currentRiddleIndex];
    
    // Add loading animation
    riddleText.innerHTML = '<span class="loading"></span> Loading riddle...';
    
    setTimeout(() => {
        riddleText.textContent = riddle.question;
        addTypingEffect();
    }, 500);
    
    riddleNumber.textContent = Math.floor(Math.random() * 100) + 1;
    
    // Clear previous state
    answerInput.value = '';
    resultSection.style.display = 'none';
    answerInput.disabled = false;
    submitBtn.disabled = false;
    answerInput.focus();
    
    // Add entrance animation
    const riddleCard = document.querySelector('.riddle-card');
    riddleCard.style.animation = 'slideInUp 0.6s ease-out';
}

// Check the user's answer
function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const currentRiddle = riddles[currentRiddleIndex];
    const correctAnswer = currentRiddle.answer.toLowerCase();
    const alternatives = currentRiddle.alternatives.map(alt => alt.toLowerCase());
    
    let result;
    let message;
    let icon;
    let scoreClass;
    
    // Add button click effect
    submitBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        submitBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Check if answer is correct
    if (userAnswer === correctAnswer || alternatives.includes(userAnswer)) {
        result = 'correct';
        message = 'Excellent! You got it right! 🎉';
        icon = '🎯';
        scoreClass = 'correct';
        scores.correct++;
        addConfetti();
    }
    // Check if answer is close
    else if (isCloseAnswer(userAnswer, correctAnswer, alternatives)) {
        result = 'close';
        message = 'Close! You\'re on the right track! 🔍';
        icon = '🎯';
        scoreClass = 'close';
        scores.close++;
    }
    // Wrong answer
    else {
        result = 'wrong';
        message = `Not quite right. The answer was: "${correctAnswer}" 💡`;
        icon = '💡';
        scoreClass = 'wrong';
        scores.wrong++;
    }
    
    // Update UI with animation
    scoreTitle.textContent = result.charAt(0).toUpperCase() + result.slice(1);
    scoreIcon.textContent = icon;
    scoreMessage.textContent = message;
    
    // Show motivational quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
    
    // Apply styling
    resultSection.className = `result-section ${scoreClass}`;
    
    // Show result with animation
    resultSection.style.display = 'block';
    answerInput.disabled = true;
    submitBtn.disabled = true;
    
    // Update stats with animation
    updateStats();
    
    // Add celebration effect for correct answers
    if (result === 'correct') {
        setTimeout(() => {
            addSparkles();
        }, 500);
    }
}

// Add confetti effect for correct answers
function addConfetti() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#48bb78'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            pointer-events: none;
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            z-index: 1000;
        `;
        container.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

// Add sparkles effect
function addSparkles() {
    const sparkleContainer = document.querySelector('.score-icon');
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            animation: sparkle ${1 + Math.random()}s ease-out forwards;
            left: ${Math.random() * 200 - 100}px;
            top: ${Math.random() * 200 - 100}px;
            pointer-events: none;
        `;
        sparkleContainer.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }
}

// Check if answer is close to correct
function isCloseAnswer(userAnswer, correctAnswer, alternatives) {
    // Check if user answer contains part of correct answer
    if (correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer)) {
        return true;
    }
    
    // Check if user answer is similar to any alternative
    for (let alt of alternatives) {
        if (alt.includes(userAnswer) || userAnswer.includes(alt)) {
            return true;
        }
    }
    
    // Check for common typos or similar words
    const similarWords = {
        'echo': ['echoes', 'sound', 'voice'],
        'footsteps': ['footstep', 'steps', 'footprints'],
        'keyboard': ['computer', 'typewriter', 'keys'],
        'towel': ['sponge', 'cloth', 'rag'],
        'coin': ['penny', 'nickel', 'quarter', 'dime'],
        'letter m': ['m', 'the letter m', 'm letter'],
        'future': ['tomorrow', 'time', 'destiny'],
        'silence': ['quiet', 'peace', 'stillness']
    };
    
    if (similarWords[correctAnswer]) {
        return similarWords[correctAnswer].includes(userAnswer);
    }
    
    return false;
}

// Load next riddle
function nextRiddle() {
    // Add button click effect
    nextBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        nextBtn.style.transform = 'scale(1)';
    }, 150);
    
    // Fade out current content
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        loadRiddle();
        resultSection.style.opacity = '1';
        resultSection.style.transform = 'translateY(0)';
    }, 300);
}

// Update statistics display with animation
function updateStats() {
    const elements = [
        { element: correctCount, value: scores.correct },
        { element: closeCount, value: scores.close },
        { element: wrongCount, value: scores.wrong }
    ];
    
    elements.forEach(({ element, value }) => {
        const currentValue = parseInt(element.textContent);
        if (currentValue !== value) {
            animateCounter(element, currentValue, value);
        }
    });
}

// Animate counter
function animateCounter(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes sparkle {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes floatParticle {
        0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

// Start the game when page loads
document.addEventListener('DOMContentLoaded', initGame);
