// State Variables
let is24HourFormat = true;
const sessionStartTime = Date.now();

// DOM Elements
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const periodEl = document.getElementById('period');
const fullDateEl = document.getElementById('full-date');
const userTimezoneEl = document.getElementById('user-timezone');
const secondProgressEl = document.getElementById('second-progress');
const greetingIconEl = document.getElementById('greeting-icon');
const greetingTextEl = document.getElementById('greeting-text');
const formatToggleBtn = document.getElementById('format-toggle');
const formatLabelEl = document.getElementById('format-label');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIconEl = document.getElementById('theme-icon');
const sessionUptimeEl = document.getElementById('session-uptime');
const isoTimeEl = document.getElementById('iso-time');
const dayOfYearEl = document.getElementById('day-of-year');
const currentYearEl = document.getElementById('current-year');

// Update Clock & Time Data
function updateClock() {
  const now = new Date();

  // Hours, Minutes, Seconds
  let rawHours = now.getHours();
  const rawMinutes = now.getMinutes();
  const rawSeconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Greeting logic
  updateGreeting(rawHours);

  // Period (AM/PM)
  const isPM = rawHours >= 12;
  const period = isPM ? 'PM' : 'AM';

  // Format hours
  let displayHours = rawHours;
  if (!is24HourFormat) {
    displayHours = rawHours % 12;
    displayHours = displayHours ? displayHours : 12; // 0 becomes 12
    periodEl.style.display = 'inline-block';
    periodEl.textContent = period;
  } else {
    periodEl.style.display = 'none';
  }

  // Format with leading zeros
  const formattedHours = String(displayHours).padStart(2, '0');
  const formattedMinutes = String(rawMinutes).padStart(2, '0');
  const formattedSeconds = String(rawSeconds).padStart(2, '0');

  // Update DOM
  hoursEl.textContent = formattedHours;
  minutesEl.textContent = formattedMinutes;
  secondsEl.textContent = formattedSeconds;

  // Progress Bar for current second (0% to 100% of minute)
  const secondFraction = ((rawSeconds * 1000 + milliseconds) / 60000) * 100;
  secondProgressEl.style.width = `${secondFraction.toFixed(2)}%`;

  // Full Date formatting
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  fullDateEl.textContent = now.toLocaleDateString('en-US', options);

  // ISO Time string in metrics
  isoTimeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });

  // Current Year in footer
  if (currentYearEl) {
    currentYearEl.textContent = now.getFullYear();
  }
}

// Update Greeting based on hour
function updateGreeting(hours) {
  let greeting = 'Hello';
  let icon = '✨';

  if (hours >= 5 && hours < 12) {
    greeting = 'Good morning';
    icon = '🌅';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
    icon = '☀️';
  } else if (hours >= 17 && hours < 21) {
    greeting = 'Good evening';
    icon = '🌆';
  } else {
    greeting = 'Good night';
    icon = '🌙';
  }

  greetingTextEl.textContent = `${greeting}, Da-Wei`;
  greetingIconEl.textContent = icon;
}

// Calculate Timezone Details
function initTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -new Date().getTimezoneOffset() / 60;
    const offsetString = offset >= 0 ? `+${offset}` : `${offset}`;
    userTimezoneEl.textContent = `${tz} (GMT${offsetString})`;
  } catch (e) {
    userTimezoneEl.textContent = 'Local Time';
  }
}

// Calculate Day of the Year
function updateDayOfYear() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  const isLeapYear = (now.getFullYear() % 4 === 0 && now.getFullYear() % 100 !== 0) || (now.getFullYear() % 400 === 0);
  const totalDays = isLeapYear ? 366 : 365;

  dayOfYearEl.textContent = `Day ${day} / ${totalDays}`;
}

// Session Uptime Counter
function updateSessionUptime() {
  const elapsedSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
  const hrs = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(elapsedSeconds % 60).padStart(2, '0');
  sessionUptimeEl.textContent = `${hrs}:${mins}:${secs}`;
}

// Toggle 12h / 24h format
formatToggleBtn.addEventListener('click', () => {
  is24HourFormat = !is24HourFormat;
  formatLabelEl.textContent = is24HourFormat ? '24H' : '12H';
  updateClock();
});

// Theme Toggle (Dark / Light)
function setTheme(isDark) {
  if (isDark) {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIconEl.innerHTML = `
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    `;
    localStorage.setItem('personal-theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIconEl.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    `;
    localStorage.setItem('personal-theme', 'light');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-theme');
  setTheme(!isDark);
});

// Initialize Stored Theme
const savedTheme = localStorage.getItem('personal-theme');
if (savedTheme === 'light') {
  setTheme(false);
}

// Mouse Interactive Tilt Effect for Glass Cards
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

// Initialization
initTimezone();
updateDayOfYear();
updateClock();

// Live Update Intervals
setInterval(updateClock, 100);
setInterval(updateSessionUptime, 1000);
