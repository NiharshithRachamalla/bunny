// app.js
// SmartLib AI Dashboard Orchestrator & Live Simulation Engine

// 1. Core State & Mock Data Fallbacks
let summaryData = {
    "totalCatalogVolume": 12,
    "availableStock": 10,
    "checkedOutVolume": 2,
    "activeBorrowersCount": 2,
    "accumulatedFines": 0.00
};

let catalogData = [
    {"id": "B01", "title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "genre": "Technology", "totalCopies": 2, "availableCopies": 1},
    {"id": "B02", "title": "Clean Code", "author": "Robert C. Martin", "genre": "Technology", "totalCopies": 1, "availableCopies": 0},
    {"id": "B03", "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Fiction", "totalCopies": 5, "availableCopies": 5},
    {"id": "B04", "title": "Deep Learning", "author": "Ian Goodfellow", "genre": "AI & ML", "totalCopies": 1, "availableCopies": 0},
    {"id": "B05", "title": "Design Patterns", "author": "Erich Gamma", "genre": "Technology", "totalCopies": 3, "availableCopies": 3}
];

let transactionsData = [
    {"txId": "TX1001", "bookTitle": "Introduction to Algorithms", "borrowerName": "Rachamalla Niharshith", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": false},
    {"txId": "TX1002", "bookTitle": "Clean Code", "borrowerName": "Sandeep Kumar", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": true},
    {"txId": "TX1003", "bookTitle": "Clean Code", "borrowerName": "Rachamalla Niharshith", "checkoutDate": "2026-05-21", "dueDate": "2026-06-04", "isReturned": false}
];

let reportsData = {
    "recommendations": {
        "Rachamalla Niharshith": {
            "collaborative": [
                {"id": "B02", "title": "Clean Code", "genre": "Technology"}
            ],
            "content_based": [
                {"id": "B01", "title": "Introduction to Algorithms", "genre": "Technology"},
                {"id": "B05", "title": "Design Patterns", "genre": "Technology"}
            ]
        },
        "Sandeep Kumar": {
            "collaborative": [
                {"id": "B04", "title": "Deep Learning", "genre": "AI & ML"}
            ],
            "content_based": [
                {"id": "B01", "title": "Introduction to Algorithms", "genre": "Technology"},
                {"id": "B05", "title": "Design Patterns", "genre": "Technology"}
            ]
        },
        "Anjali Sharma": {
            "collaborative": [
                {"id": "B01", "title": "Introduction to Algorithms", "genre": "Technology"}
            ],
            "content_based": [
                {"id": "B04", "title": "Deep Learning", "genre": "AI & ML"}
            ]
        },
        "Rahul Verma": {
            "collaborative": [
                {"id": "B05", "title": "Design Patterns", "genre": "Technology"}
            ],
            "content_based": [
                {"id": "B03", "title": "The Great Gatsby", "genre": "Fiction"}
            ]
        }
    },
    "sentiment_analysis": {
        "reviews": [
            {
                "borrower": "Rachamalla Niharshith",
                "book": "Introduction to Algorithms",
                "review": "This book is an absolute masterpiece! Highly practical and clean structure. Love the clear proofs.",
                "sentiment": "Positive",
                "score": 0.85,
                "positive_hits": ["masterpiece", "practical", "clean", "love"],
                "negative_hits": []
            },
            {
                "borrower": "Sandeep Kumar",
                "book": "Clean Code",
                "review": "Clean Code is an amazing, brilliant, and must-read book. Easy to understand and highly recommended!",
                "sentiment": "Positive",
                "score": 0.9,
                "positive_hits": ["amazing", "brilliant", "easy", "recommend"],
                "negative_hits": []
            },
            {
                "borrower": "Anjali Sharma",
                "book": "Deep Learning",
                "review": "The deep learning content is brilliant, clear, and wonderful, but some mathematical sections are heavy, difficult, and confusing.",
                "sentiment": "Neutral",
                "score": 0.1,
                "positive_hits": ["brilliant", "clear", "wonderful"],
                "negative_hits": ["heavy", "difficult", "confusing"]
            },
            {
                "borrower": "Rahul Verma",
                "book": "The Great Gatsby",
                "review": "A boring and tedious read. The pacing was dull and disappointingly slow. Quite useless for computer science.",
                "sentiment": "Negative",
                "score": -0.75,
                "positive_hits": [],
                "negative_hits": ["boring", "tedious", "dull", "disappointingly", "useless"]
            }
        ],
        "summary": {
            "positive": 2,
            "neutral": 1,
            "negative": 1,
            "total_reviews": 4
        }
    },
    "demand_forecast": {
        "book_forecasts": [
            {"book_id": "B01", "title": "Introduction to Algorithms", "genre": "Technology", "available_copies": 1, "total_copies": 2, "historical_checkouts": 2, "demand_score": 50, "stockout_risk": "Medium", "urgency_level": "Medium", "predicted_checkouts": 1.5},
            {"book_id": "B02", "title": "Clean Code", "genre": "Technology", "available_copies": 0, "total_copies": 1, "historical_checkouts": 3, "demand_score": 75, "stockout_risk": "Critical", "urgency_level": "High", "predicted_checkouts": 2.2},
            {"book_id": "B03", "title": "The Great Gatsby", "genre": "Fiction", "available_copies": 5, "total_copies": 5, "historical_checkouts": 0, "demand_score": 0, "stockout_risk": "Low", "urgency_level": "Low", "predicted_checkouts": 0.0},
            {"book_id": "B04", "title": "Deep Learning", "genre": "AI & ML", "available_copies": 0, "total_copies": 1, "historical_checkouts": 1, "demand_score": 25, "stockout_risk": "High", "urgency_level": "High", "predicted_checkouts": 0.8},
            {"book_id": "B05", "title": "Design Patterns", "genre": "Technology", "available_copies": 3, "total_copies": 3, "historical_checkouts": 1, "demand_score": 10, "stockout_risk": "Low", "urgency_level": "Low", "predicted_checkouts": 0.3}
        ],
        "genre_demand": [
            {"genre": "Technology", "checkout_count": 6, "demand_share_percentage": 60.0},
            {"genre": "AI & ML", "checkout_count": 3, "demand_share_percentage": 30.0},
            {"genre": "Fiction", "checkout_count": 1, "demand_share_percentage": 10.0}
        ],
        "overall_occupancy_rate": 16.7
    }
};

let demandChartInstance = null;

// 2. Application Init
document.addEventListener("DOMContentLoaded", async () => {
    showToast("SmartLib AI Analytics initializing...");
    await loadDashboardData();
    setupEventListeners();
});

// 3. Data Orchestrator (Load from Local files, fail gracefully to mock datasets)
async function loadDashboardData() {
    try {
        // Fetch summary.json
        const sumRes = await fetch('summary.json');
        if (sumRes.ok) summaryData = await sumRes.json();

        // Fetch catalog.json
        const catRes = await fetch('catalog.json');
        if (catRes.ok) catalogData = await catRes.json();

        // Fetch transactions.json
        const txRes = await fetch('transactions.json');
        if (txRes.ok) transactionsData = await txRes.json();

        // Fetch reports.json (Python AI)
        const repRes = await fetch('reports.json');
        if (repRes.ok) reportsData = await repRes.json();

        console.log("Successfully retrieved data feeds from local disk outputs!");
    } catch (e) {
        console.warn("CORS/Fetch restriction detected. Displaying local cache mock metrics (Perfect for file:// offline portfolios).", e);
    }

    renderMetrics();
    renderCatalog();
    renderTransactions();
    renderRecommendations();
    renderSentiment();
    renderDemandForecast();
}

// 4. Renderers
function renderMetrics() {
    document.getElementById("stat-total-volume").innerText = summaryData.totalCatalogVolume;
    document.getElementById("stat-active-borrowers").innerText = summaryData.activeBorrowersCount;
    document.getElementById("stat-occupancy-rate").innerText = 
        reportsData.demand_forecast ? `${reportsData.demand_forecast.overall_occupancy_rate}%` : "16.7%";
    document.getElementById("stat-fines").innerText = `₹${summaryData.accumulatedFines.toFixed(2)}`;
}

function renderCatalog() {
    const tbody = document.querySelector("#catalog-table tbody");
    tbody.innerHTML = "";

    catalogData.forEach(book => {
        const tr = document.createElement("tr");

        // Map status
        let statusBadge = "";
        let stockoutRisk = "Low";
        
        // Match with demand forecast to extract stockout risk
        if (reportsData.demand_forecast && reportsData.demand_forecast.book_forecasts) {
            const fore = reportsData.demand_forecast.book_forecasts.find(f => f.book_id === book.id || f.title === book.title);
            if (fore) stockoutRisk = fore.stockout_risk;
        }

        if (book.availableCopies === 0) {
            statusBadge = `<span class="status-pill danger"><i class="fa-solid fa-circle-xmark"></i> Out of Stock</span>`;
        } else if (book.availableCopies === 1) {
            statusBadge = `<span class="status-pill warning"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock</span>`;
        } else {
            statusBadge = `<span class="status-pill success"><i class="fa-solid fa-circle-check"></i> Available (${book.availableCopies})</span>`;
        }

        // Format stockout risk pill
        let riskClass = "success";
        if (stockoutRisk === "Critical") riskClass = "danger";
        else if (stockoutRisk === "High") riskClass = "danger";
        else if (stockoutRisk === "Medium") riskClass = "warning";

        tr.innerHTML = `
            <td><strong>${book.id}</strong></td>
            <td>
                <div><strong>${book.title}</strong></div>
                <div style="font-size: 0.75rem; color: var(--text-secondary)">by ${book.author}</div>
            </td>
            <td><span class="status-pill info">${book.genre}</span></td>
            <td>${book.availableCopies} / ${book.totalCopies}</td>
            <td>
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    ${statusBadge}
                    <span class="status-pill ${riskClass}" style="font-size: 0.7rem; padding: 0.1rem 0.4rem; justify-content: center;">
                        Risk: ${stockoutRisk}
                    </span>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderTransactions() {
    const tbody = document.querySelector("#transactions-table tbody");
    tbody.innerHTML = "";

    transactionsData.forEach(tx => {
        const tr = document.createElement("tr");

        let stateBadge = tx.isReturned 
            ? `<span class="status-pill success"><i class="fa-solid fa-circle-check"></i> Returned</span>`
            : `<span class="status-pill danger"><i class="fa-solid fa-clock"></i> Active Borrow</span>`;

        // Check if checkoutDate is today
        let timelines = `
            <div style="font-weight: 500;">Out: ${tx.checkoutDate}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary)">Due: ${tx.dueDate}</div>
        `;

        // Highlight premium status if user is VIP
        let memberLabel = tx.borrowerName;
        if (tx.borrowerName.includes("Niharshith")) {
            memberLabel = `${tx.borrowerName} <span class="status-pill info" style="font-size: 0.65rem; padding: 0.05rem 0.3rem;"><i class="fa-solid fa-crown"></i> VIP</span>`;
        }

        tr.innerHTML = `
            <td><code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${tx.txId}</code></td>
            <td><strong>${tx.bookTitle}</strong></td>
            <td>${memberLabel}</td>
            <td>${timelines}</td>
            <td>${stateBadge}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRecommendations() {
    const select = document.getElementById("member-select");
    const activeMember = select.value;
    
    const collabList = document.getElementById("collab-rec-list");
    const contentList = document.getElementById("content-rec-list");

    collabList.innerHTML = "";
    contentList.innerHTML = "";

    const userRec = reportsData.recommendations[activeMember];
    
    if (userRec) {
        // Render collaborative
        if (userRec.collaborative && userRec.collaborative.length > 0) {
            userRec.collaborative.forEach(book => {
                const li = document.createElement("li");
                li.className = "rec-item";
                li.innerHTML = `
                    <div class="rec-book-info">
                        <h4>${book.title}</h4>
                        <p>${book.genre}</p>
                    </div>
                    <span class="status-pill info" style="font-size: 0.7rem;"><i class="fa-solid fa-bolt"></i> Sim score</span>
                `;
                collabList.appendChild(li);
            });
        } else {
            collabList.innerHTML = `<li class="rec-item"><p style="font-size: 0.8rem; color: var(--text-secondary);">Borrow more books to calculate overlaps...</p></li>`;
        }

        // Render Content based
        if (userRec.content_based && userRec.content_based.length > 0) {
            userRec.content_based.forEach(book => {
                const li = document.createElement("li");
                li.className = "rec-item";
                li.innerHTML = `
                    <div class="rec-book-info">
                        <h4>${book.title}</h4>
                        <p>${book.genre}</p>
                    </div>
                    <span class="status-pill success" style="font-size: 0.7rem;"><i class="fa-solid fa-heart"></i> Genre Match</span>
                `;
                contentList.appendChild(li);
            });
        } else {
            contentList.innerHTML = `<li class="rec-item"><p style="font-size: 0.8rem; color: var(--text-secondary);">No content profiles built yet.</p></li>`;
        }
    } else {
        collabList.innerHTML = `<li class="rec-item"><p style="font-size: 0.8rem; color: var(--text-secondary);">Select a member above.</p></li>`;
        contentList.innerHTML = `<li class="rec-item"><p style="font-size: 0.8rem; color: var(--text-secondary);">Select a member above.</p></li>`;
    }
}

function renderSentiment() {
    const container = document.getElementById("reviews-list-container");
    container.innerHTML = "";

    const sentiment = reportsData.sentiment_analysis;
    if (!sentiment) return;

    document.getElementById("sent-pos").innerText = sentiment.summary.positive;
    document.getElementById("sent-neu").innerText = sentiment.summary.neutral;
    document.getElementById("sent-neg").innerText = sentiment.summary.negative;

    sentiment.reviews.forEach(rev => {
        const div = document.createElement("div");
        div.className = `review-item ${rev.sentiment.toLowerCase()}`;

        // Render keyword hits
        let posHits = rev.positive_hits.map(w => `<span class="keyword-tag pos">${w}</span>`).join(" ");
        let negHits = rev.negative_hits.map(w => `<span class="keyword-tag neg">${w}</span>`).join(" ");

        let scoreTag = rev.score > 0 ? `+${rev.score}` : `${rev.score}`;

        div.innerHTML = `
            <div class="review-meta">
                <span>${rev.borrower} <span style="font-weight: normal; color: var(--text-secondary)">on</span> "${rev.book}"</span>
                <span class="status-pill ${rev.sentiment.toLowerCase() === 'positive' ? 'success' : rev.sentiment.toLowerCase() === 'neutral' ? 'info' : 'danger'}" style="font-size: 0.7rem;">
                    Score: ${scoreTag} (${rev.sentiment})
                </span>
            </div>
            <div class="review-body">"${rev.review}"</div>
            <div class="keyword-hits">
                ${posHits}
                ${negHits}
            </div>
        `;
        container.appendChild(div);
    });
}

function renderDemandForecast() {
    const forecast = reportsData.demand_forecast;
    if (!forecast || !forecast.book_forecasts) return;

    const labels = forecast.book_forecasts.map(b => b.title);
    const demandScores = forecast.book_forecasts.map(b => b.demand_score);
    const predictedCheckouts = forecast.book_forecasts.map(b => b.predicted_checkouts);

    const ctx = document.getElementById('demandChart').getContext('2d');
    
    // Destroy previous instance to avoid visual overlapping artifacts
    if (demandChartInstance) {
        demandChartInstance.destroy();
    }

    demandChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Predictive Demand Score',
                    data: demandScores,
                    backgroundColor: 'rgba(59, 130, 246, 0.65)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1.5,
                    borderRadius: 6
                },
                {
                    label: 'Projected Borrow Velocity (Next Week)',
                    data: predictedCheckouts,
                    backgroundColor: 'rgba(236, 72, 153, 0.65)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1.5,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Plus Jakarta Sans', size: 10 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value, index) {
                            const title = labels[index];
                            return title.length > 15 ? title.substring(0, 15) + '...' : title;
                        }
                    }
                }
            }
        }
    });
}

// 5. Event Listeners
function setupEventListeners() {
    // Member dropdown selector
    document.getElementById("member-select").addEventListener("change", () => {
        renderRecommendations();
        showToast("Recalculating member preference vectors...");
    });

    // Simulate Java Simulation run
    document.getElementById("btn-run-java").addEventListener("click", () => {
        showToast("Synchronizing multithreaded Waitlist priorities...");
        const button = document.getElementById("btn-run-java");
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = `<i class="fa-solid fa-mug-hot"></i> Trigger Java Sim`;
            
            // Randomly update a checkout to simulate returned state mutation
            const randomTx = transactionsData[0];
            if (randomTx) {
                randomTx.isReturned = !randomTx.isReturned;
            }
            
            showToast("Success! Java state model dump rewritten to dashboard.");
            loadDashboardData();
        }, 1500);
    });

    // Simulate AI model calculations
    document.getElementById("btn-run-ai").addEventListener("click", () => {
        showToast("Running Jaccard similarity and lexicon NLP parses...");
        const button = document.getElementById("btn-run-ai");
        button.disabled = true;
        button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = `<i class="fa-solid fa-circle-nodes"></i> Recalculate AI Models`;
            
            // Randomly shuffle a recommendation to show interactive model changes
            if (reportsData.recommendations["Sandeep Kumar"]) {
                reportsData.recommendations["Sandeep Kumar"].collaborative.reverse();
            }

            showToast("Success! Python cognitive analytical indexes reconstructed!");
            loadDashboardData();
        }, 1500);
    });
}

// 6. Utility UI Toast
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerHTML = `<i class="fa-solid fa-bolt text-blue"></i> <span>${message}</span>`;
    toast.classList.remove("hidden");
    
    // Clear previous timeouts if button clicked fast
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}
