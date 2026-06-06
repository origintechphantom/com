// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        }
    });
});

// Chat Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const message = document.getElementById('chatMessage').value.trim();

        if (message) {
            saveChatMessage({
                text: message
            });
            renderChatWindow();
            this.reset();
        } else {
            alert('Please enter a message before sending.');
        }
    });
}

function getChatThreads() {
    const threads = JSON.parse(localStorage.getItem('adminChatThreads') || '[]');
    return threads;
}

function setChatThreads(threads) {
    localStorage.setItem('adminChatThreads', JSON.stringify(threads));
}

function initChatSession() {
    const chatSessionKey = 'origintechChatSessionActive';
    const chatSessionExpiryKey = 'origintechChatSessionExpires';
    const sessionExpiry = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();
    const expiresAt = Number(localStorage.getItem(chatSessionExpiryKey));

    const shouldResetSession = !sessionStorage.getItem(chatSessionKey) || !expiresAt || now >= expiresAt;

    if (shouldResetSession) {
        sessionStorage.setItem(chatSessionKey, String(now));
        localStorage.setItem(chatSessionExpiryKey, String(now + sessionExpiry));
        clearChatHistory();
    }
}

const CHAT_CLEAR_DELAY = 10 * 60 * 1000; // 10 minutes
let chatClearTimeoutId;

function saveChatMessage(chatData) {
    const threads = getChatThreads();
    let thread = threads.find(t => t.id === 'default_chat');

    if (!thread) {
        thread = {
            id: 'default_chat',
            name: 'Customer',
            email: 'livechat@origintech.local',
            createdAt: new Date().toISOString(),
            status: 'unread',
            messages: []
        };
        threads.push(thread);
    }

    thread.messages.push({
        sender: 'customer',
        text: chatData.text,
        date: new Date().toISOString(),
        status: 'sent'
    });
    thread.status = 'unread';

    setChatThreads(threads);
    setChatLastUpdate(new Date().toISOString());
    scheduleChatClear();
}

function setChatLastUpdate(timestamp) {
    localStorage.setItem('adminChatLastUpdate', timestamp);
}

function getChatLastUpdate() {
    return localStorage.getItem('adminChatLastUpdate');
}

function clearChatHistory() {
    const threads = getChatThreads();
    const thread = threads.find(t => t.id === 'default_chat');

    if (thread) {
        thread.messages = [];
        thread.status = 'read';
        setChatThreads(threads);
    }

    localStorage.removeItem('adminChatLastUpdate');
    renderChatWindow();
}

function markAdminRepliesSeen(thread) {
    if (!thread || !thread.messages) return;
    const threads = getChatThreads();
    const storedThread = threads.find(t => t.id === thread.id);
    if (!storedThread) return;

    let updated = false;
    storedThread.messages.forEach(msg => {
        if (msg.sender === 'admin' && msg.status === 'sent') {
            msg.status = 'seen';
            updated = true;
        }
    });

    if (updated) {
        setChatThreads(threads);
    }
    return storedThread || thread;
}

function formatMessageStatus(msg) {
    if (!msg.status) return '';
    return msg.status === 'seen' ? 'Seen' : 'Sent';
}

function scheduleChatClear() {
    if (chatClearTimeoutId) {
        clearTimeout(chatClearTimeoutId);
    }

    const lastUpdate = getChatLastUpdate();
    if (!lastUpdate) {
        chatClearTimeoutId = setTimeout(clearChatHistory, CHAT_CLEAR_DELAY);
        return;
    }

    const timeUntilClear = CHAT_CLEAR_DELAY - (Date.now() - new Date(lastUpdate).getTime());

    if (timeUntilClear <= 0) {
        clearChatHistory();
        return;
    }

    chatClearTimeoutId = setTimeout(clearChatHistory, timeUntilClear);
}

function handleChatExpiration() {
    const lastUpdate = getChatLastUpdate();
    if (!lastUpdate) return;

    const elapsed = Date.now() - new Date(lastUpdate).getTime();
    if (elapsed >= CHAT_CLEAR_DELAY) {
        clearChatHistory();
    } else {
        scheduleChatClear();
    }
}

function renderChatWindow() {
    const chatWindow = document.getElementById('chatWindow');
    const threads = getChatThreads();
    const thread = threads.find(t => t.id === 'default_chat');

    if (!chatWindow) return;

    if (!thread || thread.messages.length === 0) {
        chatWindow.innerHTML = `
            <div class="chat-empty">
                <i class="fas fa-comments"></i>
                <p>Your chat history will appear here once you send a message.</p>
            </div>
        `;
        return;
    }

    const displayedThread = markAdminRepliesSeen(thread);
    chatWindow.innerHTML = '';
    displayedThread.messages.forEach(msg => {
        const statusText = formatMessageStatus(msg);
        const messageElement = document.createElement('div');
        messageElement.className = `chat-bubble ${msg.sender}`;
        messageElement.innerHTML = `
            <p>${escapeHtml(msg.text)}</p>
            <small>${formatDate(msg.date)}${statusText ? ` • ${statusText}` : ''}</small>
        `;
        chatWindow.appendChild(messageElement);
    });
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

// Render any existing chat history on load
initChatSession();
renderChatWindow();
handleChatExpiration();

// Update chat window automatically when localStorage changes in another tab or window
window.addEventListener('storage', (event) => {
    if (event.key === 'adminChatThreads' || event.key === 'adminChatLastUpdate') {
        renderChatWindow();
        handleChatExpiration();
    }
});

// CTA Button Click Handler
const ctaButtons = document.querySelectorAll('.cta-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.textContent.includes('Get Started')) {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    observer.observe(el);
});

// Mobile Responsive Menu
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.style.display = 'flex';
    } else {
        navLinks.style.display = 'none';
    }
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

console.log('OriginTech Website Loaded Successfully');

// AI Chat Widget
const chatToggle = document.getElementById('chatToggle');
const chatBox = document.getElementById('chatBox');
const closeChat = document.getElementById('closeChat');
const sendChat = document.getElementById('sendChat');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

// AI Response Database
const aiResponses = {
    'services': 'We offer App Development, Web Development, Software Management, Computer Updates, IT Consulting, and Cloud Solutions. Which service interests you?',
    'app development': 'Our App Development team creates custom mobile and desktop applications using cutting-edge technology. We handle everything from concept to deployment.',
    'web development': 'We build responsive, scalable, and SEO-optimized websites that convert visitors into customers. All our websites are mobile-friendly.',
    'software management': 'We provide complete software lifecycle management including updates, maintenance, and optimization to keep your systems running smoothly.',
    'computer updates': 'We offer system optimization, security updates, and performance enhancement for your devices to ensure peak efficiency.',
    'pricing': 'Our pricing varies based on project complexity and requirements. Please contact us for a custom quote or visit our contact section.',
    'contact': 'You can reach us at info@origintech.com or +1 (555) 123-4567. Our office is located at 123 Tech Street, Innovation City.',
    'team': 'OriginTech has 50+ expert team members with diverse skills in various technologies and programming languages.',
    'projects': 'We\'ve completed 500+ projects for 200+ happy clients. Check our Portfolio section to see some of our latest work!',
    'cloud': 'Our Cloud Solutions include secure infrastructure, migration services, and comprehensive management for your business needs.',
    'consulting': 'Our IT Consulting services provide strategic technology guidance to transform your business and increase operational efficiency.',
    'about': 'OriginTech is a leading technology company dedicated to delivering innovative solutions. We\'ve been in business for over a decade.',
    'hello': 'Hello! Welcome to OriginTech. How can I assist you today?',
    'hi': 'Hi there! 👋 What can I help you with? Feel free to ask about our services!',
    'help': 'I can help you with information about our services, pricing, team, and more. Just ask away!',
    'thanks': 'You\'re welcome! 😊 Is there anything else I can help you with?',
    'thank you': 'Happy to help! Feel free to ask if you have more questions.',
    'default': 'That\'s a great question! I can help with information about our services, pricing, team, and more. Feel free to ask!'
};

// Toggle Chat Box
chatToggle.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
});

closeChat.addEventListener('click', () => {
    chatBox.classList.add('hidden');
});

// Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Get AI response
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'bot');
    }, 300);
}

// Add Message to Chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Get AI Response
function getAIResponse(userInput) {
    const input = userInput.toLowerCase();
    
    for (const [key, value] of Object.entries(aiResponses)) {
        if (input.includes(key)) {
            return value;
        }
    }
    
    return aiResponses['default'];
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Send on button click
sendChat.addEventListener('click', sendMessage);

// Send on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Focus input when chat opens
chatToggle.addEventListener('click', () => {
    if (!chatBox.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 200);
    }
});
