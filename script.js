// Data
const movies = [
    {
        id: 1,
        title: "Nebula Echoes",
        category: "Sci-Fi / Action",
        price: 12.50,
        poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
        times: ["14:00", "17:30", "20:45", "23:15"]
    },
    {
        id: 2,
        title: "Urban Chase",
        category: "Action / Thriller",
        price: 10.00,
        poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
        times: ["13:15", "16:00", "19:30", "22:00"]
    },
    {
        id: 3,
        title: "The Silent Grin",
        category: "Horreur / Mystère",
        price: 9.50,
        poster: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop",
        times: ["18:30", "21:00", "23:45"]
    },
    {
        id: 4,
        title: "Speed Beyond",
        category: "Action / Sci-Fi",
        price: 11.00,
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop",
        times: ["15:00", "18:00", "20:00"]
    },
    {
        id: 5,
        title: "Midnight Shadow",
        category: "Thriller / Noir",
        price: 10.50,
        poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=600&auto=format&fit=crop",
        times: ["19:15", "21:45", "00:15"]
    },
    {
        id: 6,
        title: "Lost Protocol",
        category: "Adventure / Mystery",
        price: 13.00,
        poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
        times: ["16:45", "19:00", "22:30"]
    }
];

// State
let selectedMovie = null;
let selectedTime = null;
let selectedSeats = [];

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const timeGrid = document.getElementById('time-grid');
const seatMap = document.getElementById('seat-map');
const summaryContent = document.getElementById('summary-content');
const totalPriceEl = document.getElementById('total-price');
const confirmBtn = document.getElementById('confirm-btn');
const sectionHoraires = document.getElementById('horaires');
const sectionSieges = document.getElementById('sieges');

// Initialize
function init() {
    renderMovies();
}

function renderMovies() {
    movieGrid.innerHTML = movies.map(movie => `
        <div class="col-12 col-sm-6 col-md-4">
            <div class="movie-card" onclick="selectMovie(${movie.id})">
                <img src="${movie.poster}" class="movie-poster" alt="${movie.title}">
                <div class="p-3">
                    <h5 class="fw-bold mb-1">${movie.title}</h5>
                    <p class="text-secondary small mb-0">${movie.category}</p>
                </div>
            </div>
        </div>
    `).join('');
}

window.selectMovie = function (id) {
    selectedMovie = movies.find(m => m.id === id);
    selectedTime = null;
    selectedSeats = [];

    // Update UI
    document.querySelectorAll('.movie-card').forEach((card, index) => {
        if (index === movies.findIndex(m => m.id === id)) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    sectionHoraires.classList.remove('d-none');
    renderTimes();
    updateSummary();
    updateProgress(2);

    // Smooth scroll
    sectionHoraires.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderTimes() {
    timeGrid.innerHTML = selectedMovie.times.map(time => `
        <div class="col-6 col-md-3">
            <div class="time-slot" onclick="selectTime('${time}')">${time}</div>
        </div>
    `).join('');
}

window.selectTime = function (time) {
    selectedTime = time;
    selectedSeats = [];

    document.querySelectorAll('.time-slot').forEach(slot => {
        if (slot.innerText === time) {
            slot.classList.add('selected');
        } else {
            slot.classList.remove('selected');
        }
    });

    sectionSieges.classList.remove('d-none');
    renderSeats();
    updateSummary();
    updateProgress(3);

    sectionSieges.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function renderSeats() {
    const rows = 5;
    const cols = 8;
    let html = '';

    for (let i = 0; i < rows; i++) {
        html += '<div class="seat-row">';
        for (let j = 0; j < cols; j++) {
            const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;
            const isOccupied = Math.random() < 0.2; // Randomly occupy some seats
            html += `
                <div class="seat ${isOccupied ? 'occupied' : ''}" 
                     data-seat-id="${seatId}"
                     onclick="toggleSeat('${seatId}', ${isOccupied})">
                </div>
            `;
        }
        html += '</div>';
    }
    seatMap.innerHTML = html;
}

window.toggleSeat = function (seatId, isOccupied) {
    if (isOccupied) return;

    const index = selectedSeats.indexOf(seatId);
    if (index > -1) {
        selectedSeats.splice(index, 1);
    } else {
        selectedSeats.push(seatId);
    }

    // Update UI
    const seatEls = document.querySelectorAll('.seat');
    seatEls.forEach(el => {
        if (el.dataset.seatId === seatId) {
            el.classList.toggle('selected');
        }
    });

    updateSummary();
};

function updateSummary() {
    if (!selectedMovie) return;

    let html = `
        <div class="mb-3">
            <h6 class="text-white fw-bold mb-1">${selectedMovie.title}</h6>
            <span class="badge bg-dark border border-secondary">${selectedMovie.category}</span>
        </div>
    `;

    if (selectedTime) {
        html += `
            <div class="mb-3">
                <p class="small text-secondary mb-1">HORAIRE</p>
                <p class="text-white">${selectedTime}</p>
            </div>
        `;
    }

    if (selectedSeats.length > 0) {
        html += `
            <div class="mb-3">
                <p class="small text-secondary mb-1">SIÈGES (${selectedSeats.length})</p>
                <div class="d-flex flex-wrap gap-2">
                    ${selectedSeats.map(s => `<span class="badge bg-primary text-dark">${s}</span>`).join('')}
                </div>
            </div>
        `;
    }

    summaryContent.innerHTML = html;

    const total = selectedMovie.price * selectedSeats.length;
    totalPriceEl.innerText = `${total.toLocaleString('fr-FR').replace('.', ',')} FCFA`;

    confirmBtn.disabled = !(selectedMovie && selectedTime && selectedSeats.length > 0);
}

function updateProgress(step) {
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index + 1 < step) {
            dot.classList.add('completed');
            dot.classList.remove('active');
        } else if (index + 1 === step) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active', 'completed');
        }
    });
}

confirmBtn.onclick = () => {
    alert(`Merci ! Votre réservation pour "${selectedMovie.title}" à ${selectedTime} (${selectedSeats.join(', ')}) est confirmée.`);
    location.reload();
};

window.handleNav = function (sectionId) {
    const section = document.getElementById(sectionId);
    if (section.classList.contains('d-none')) {
        // If the user tries to go to a hidden section, 
        // they probably need to select a movie/time first
        if (sectionId === 'horaires') {
            alert("Veuillez d'abord choisir un film !");
            document.getElementById('films').scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'sieges') {
            alert("Veuillez d'abord choisir un film et un horaire !");
            document.getElementById('films').scrollIntoView({ behavior: 'smooth' });
        }
    } else {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

init();
