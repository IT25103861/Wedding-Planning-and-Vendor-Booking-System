/**
 * Wedding Planner SPA Core Engine
 * Manages routing, authentication, dynamic views rendering, and REST API communications with robust Demo Fallback.
 */

// Global State
let state = {
    user: null,
    role: null,
    events: [],
    packages: [],
    categories: [],
    bookings: [],
    payments: [],
    finances: [],
    vendors: [],
    activeEventId: null,
    activePackageDetail: null,
    demoMode: false // Automatically sets to true if backend is offline/empty
};

// SVG Icons Collection to guarantee premium rendering without external asset dependencies
const ICONS = {
    heart: `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>`,
    dollar: `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.9c-.72.73-1.17 1.35-1.17 2.85h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7.93c0-2.5 2.04-4.5 4.54-4.5s4.53 2.04 4.53 4.5c0 .87-.35 1.66-.93 2.25z"/></svg>`,
    users: `<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>`,
    cog: `<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
    card: `<svg viewBox="0 0 24 24"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    setupAuthListeners();
    initRouter();
    await checkInitialSession();
});

// Check if user is already logged in
async function checkInitialSession() {
    if (api.isAuthenticated()) {
        state.user = api.getCurrentUser();
        state.role = api.getRole();
        document.body.classList.add('authenticated');
        showView(state.role + '-dashboard');
        renderSidebar();
    } else {
        document.body.classList.remove('authenticated');
        showView('login-page');
    }
}

// Router & Views Switcher
function initRouter() {
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            if (!api.isAuthenticated() && hash !== 'login') {
                window.location.hash = '#login';
                return;
            }
            showView(hash);
        }
    });

    window.addEventListener('auth-expired', () => {
        showAlert('Your session has expired. Please log in.', 'danger');
        document.body.classList.remove('authenticated');
        showView('login-page');
    });
}

function showView(viewId) {
    // Hide all major screens
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.style.display = 'none';
    });

    // Handle authentication boundaries
    if (!api.isAuthenticated()) {
        viewId = 'login-page';
    }

    const targetScreen = document.getElementById(viewId);
    if (targetScreen) {
        targetScreen.style.display = 'block';
        onViewLoaded(viewId);
    } else {
        console.warn(`Screen with ID ${viewId} does not exist.`);
        // Fallback to customer dashboard or login
        if (api.isAuthenticated()) {
            showView(state.role + '-dashboard');
        } else {
            showView('login-page');
        }
    }
}

// View Initializers
async function onViewLoaded(viewId) {
    try {
        switch (viewId) {
            case 'login-page':
                setupLoginForm();
                break;
            case 'customer-dashboard':
                await loadCustomerDashboard();
                break;
            case 'customer-packages':
                await loadCustomerPackages();
                break;
            case 'customer-events':
                await loadCustomerEvents();
                break;
            case 'customer-bookings':
                await loadCustomerBookings();
                break;
            case 'vendor-dashboard':
                await loadVendorDashboard();
                break;
            case 'vendor-packages':
                await loadVendorPackages();
                break;
            case 'vendor-bookings':
                await loadVendorBookings();
                break;
            case 'admin-dashboard':
                await loadAdminDashboard();
                break;
            case 'admin-vendors':
                await loadAdminVendors();
                break;
            case 'admin-finances':
                await loadAdminFinances();
                break;
            case 'admin-categories':
                await loadAdminCategories();
                break;
        }
    } catch (error) {
        console.error(`Error loading view ${viewId}:`, error);
        enableDemoMode(error.message);
    }
}

// ----------------------------------------------------
// DEMO MODE & FALLBACK DATA GENERATION
// ----------------------------------------------------
function enableDemoMode(reason) {
    if (state.demoMode) return;
    state.demoMode = true;
    console.log("Activating luxury Demo Mode fallback...", reason);
    
    // Generate beautiful sample data
    state.categories = [
        { categoryId: 1, name: 'Venue & Banquet Halls' },
        { categoryId: 2, name: 'Photography & Videography' },
        { categoryId: 3, name: 'Catering & Wedding Cakes' },
        { categoryId: 4, name: 'Floral & Theme Decor' },
        { categoryId: 5, name: 'Entertainment & Live DJs' }
    ];

    state.packages = [
        { packageId: 101, vendorId: 201, categoryId: 1, title: 'Grand Royal Ball Room', description: 'Ultra-luxurious ballroom with elegant high-ceilings, crystal chandeliers, seating up to 450 guests, with red-carpet arrival.', price: 4500.00, duration: '8 Hours', availability: 'AVAILABLE', vendorName: 'Royal Gardens & Resorts', averageRating: 4.8, ratingCount: 24, bookingCount: 88 },
        { packageId: 102, vendorId: 201, categoryId: 1, title: 'Whispering Pines Outdoor Lawn', description: 'Stunning outdoor garden layout surrounded by tall pines. Ideal for elegant rustic theme weddings. Includes twilight string lights.', price: 3200.00, duration: '6 Hours', availability: 'AVAILABLE', vendorName: 'Royal Gardens & Resorts', averageRating: 4.6, ratingCount: 12, bookingCount: 41 },
        { packageId: 103, vendorId: 202, categoryId: 2, title: 'Cinematic Gold Wedding Coverage', description: 'Premium photography & cinema package. Includes 2 principal photographers, 1 videographer, drone footage, custom glass album.', price: 1800.00, duration: 'Full Day', availability: 'AVAILABLE', vendorName: 'Elite Frame Studios', averageRating: 4.9, ratingCount: 45, bookingCount: 120 },
        { packageId: 104, vendorId: 203, categoryId: 3, title: 'Imperial Gastronomy Catering', description: 'A tailored 5-course gourmet dining experience. Fine porcelain setup, specialized silver service, custom menu tasting.', price: 95.00, duration: 'Per Plate', availability: 'AVAILABLE', vendorName: 'Golden Platter Catering', averageRating: 4.7, ratingCount: 30, bookingCount: 95 },
        { packageId: 105, vendorId: 204, categoryId: 4, title: 'Enchanted Forest Floral Layout', description: 'Breathtaking floral archways, dense stage styling with premium roses & orchids, elegant matching candle centerpieces.', price: 2100.00, duration: 'Full Setup', availability: 'AVAILABLE', vendorName: 'Vogue Florals & Design', averageRating: 4.5, ratingCount: 8, bookingCount: 14 }
    ];

    state.events = [
        { eventId: 301, customerId: 1, eventName: 'Sophia & Alexander Premium Wedding', eventType: 'Wedding', eventDate: '2026-08-15', location: 'Royal Ball Room, Colombo', description: 'Luxury evening ceremony followed by sit-down dinner banquet.', status: 'PENDING', eventRating: 0, eventReview: '', reviewedAt: null, createdAt: new Date().toISOString() }
    ];

    state.bookings = [
        { bookingId: 401, eventId: 301, eventName: 'Sophia & Alexander Premium Wedding', eventStatus: 'PENDING', customerId: 1, customerName: 'Sophia Carter', bookingDate: '2026-08-15', location: 'Royal Ball Room, Colombo', status: 'PENDING', paymentStatus: 'PENDING', totalCost: 6300.00, paymentType: 'FULL', packages: [
            { bookingPackageId: 501, bookingId: 401, eventPackageId: 601, quantity: 1, priceAtBooking: 4500.00, packageTitle: 'Grand Royal Ball Room', vendorName: 'Royal Gardens & Resorts', vendorStatus: 'PENDING', customerName: 'Sophia Carter', eventStatus: 'PENDING', eventDate: '2026-08-15', location: 'Royal Ball Room, Colombo', notes: 'Include stage setting' },
            { bookingPackageId: 502, bookingId: 401, eventPackageId: 602, quantity: 1, priceAtBooking: 1800.00, packageTitle: 'Cinematic Gold Wedding Coverage', vendorName: 'Elite Frame Studios', vendorStatus: 'PENDING', customerName: 'Sophia Carter', eventStatus: 'PENDING', eventDate: '2026-08-15', location: 'Royal Ball Room, Colombo', notes: 'Start filming at 8 AM' }
        ] }
    ];

    state.payments = [
        { paymentId: 701, eventName: 'Sophia & Alexander Premium Wedding', bookingId: 401, totalAmount: 6300.00, amount: 6300.00, dueAmount: 0, paymentType: 'FULL', status: 'PAID', paymentDate: new Date().toISOString() }
    ];

    state.finances = [
        { financeId: 801, type: 'INCOME', bookingId: 401, paymentId: 701, amount: 630.00, description: '10% Service Fee - Booking #401', paymentMethod: 'CREDIT_CARD', transactionDate: new Date().toISOString() }
    ];

    state.vendors = [
        { id: 201, name: 'Royal Gardens & Resorts', username: 'royalgardens', email: 'info@royalgardens.com', phone: '+94 77 123 4567', status: 'APPROVED', availability: 'AVAILABLE' },
        { id: 202, name: 'Elite Frame Studios', username: 'elitestudios', email: 'shoot@elitestudios.com', phone: '+94 77 987 6543', status: 'APPROVED', availability: 'AVAILABLE' },
        { id: 203, name: 'Golden Platter Catering', username: 'goldenplatter', email: 'chef@goldenplatter.com', phone: '+94 77 555 4433', status: 'APPROVED', availability: 'AVAILABLE' },
        { id: 204, name: 'Vogue Florals & Design', username: 'vogueflorals', email: 'flowers@vogueflorals.com', phone: '+94 77 222 1100', status: 'PENDING', availability: 'AVAILABLE' }
    ];

    // Reload the active view
    const hash = window.location.hash.substring(1) || (state.role + '-dashboard');
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success';
    alertDiv.style.position = 'fixed';
    alertDiv.style.bottom = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.boxShadow = 'var(--shadow-lg)';
    alertDiv.innerHTML = `🌟 <strong>Interactive Demo Mode Activated!</strong> Feel free to explore all features.`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 4000);

    onViewLoaded(hash);
}

// ----------------------------------------------------
// SIDEBAR & LOGOUT RENDER
// ----------------------------------------------------
function renderSidebar() {
    const sidebar = document.querySelector('aside.sidebar');
    if (!sidebar) return;

    let navHtml = '';
    const role = state.role;
    const name = state.user?.name || 'Guest User';
    const initial = name.charAt(0).toUpperCase();

    if (role === 'customer') {
        navHtml = `
            <div class="sidebar-logo">
                <span class="wedding-logo-icon">${ICONS.heart}</span>
                <span>BridalPlan</span>
            </div>
            <div class="sidebar-nav">
                <div class="nav-item active" onclick="showView('customer-dashboard')">${ICONS.calendar} Overview</div>
                <div class="nav-item" onclick="showView('customer-packages')">${ICONS.plus} Browse Packages</div>
                <div class="nav-item" onclick="showView('customer-events')">${ICONS.check} My Events</div>
                <div class="nav-item" onclick="showView('customer-bookings')">${ICONS.card} My Bookings</div>
            </div>
        `;
    } else if (role === 'vendor') {
        navHtml = `
            <div class="sidebar-logo">
                <span class="wedding-logo-icon">${ICONS.heart}</span>
                <span>VendorSuite</span>
            </div>
            <div class="sidebar-nav">
                <div class="nav-item active" onclick="showView('vendor-dashboard')">${ICONS.calendar} Dashboard</div>
                <div class="nav-item" onclick="showView('vendor-packages')">${ICONS.plus} My Services</div>
                <div class="nav-item" onclick="showView('vendor-bookings')">${ICONS.check} Booking Requests</div>
            </div>
        `;
    } else if (role === 'admin') {
        navHtml = `
            <div class="sidebar-logo">
                <span class="wedding-logo-icon">${ICONS.heart}</span>
                <span>AdminConsole</span>
            </div>
            <div class="sidebar-nav">
                <div class="nav-item active" onclick="showView('admin-dashboard')">${ICONS.calendar} Overview</div>
                <div class="nav-item" onclick="showView('admin-vendors')">${ICONS.users} Vendor Approvals</div>
                <div class="nav-item" onclick="showView('admin-finances')">${ICONS.dollar} Finances</div>
                <div class="nav-item" onclick="showView('admin-categories')">${ICONS.cog} Categories</div>
            </div>
        `;
    }

    navHtml += `
        <div class="sidebar-footer">
            <div class="user-profile-summary">
                <div class="user-avatar">${initial}</div>
                <div class="user-info-text">
                    <div class="user-name">${name}</div>
                    <div class="user-role">${role}</div>
                </div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="logoutUser()">Log Out</button>
        </div>
    `;

    sidebar.innerHTML = navHtml;

    // Attach click highlight logic
    sidebar.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            sidebar.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function logoutUser() {
    api.clearAuth();
    state.user = null;
    state.role = null;
    document.body.classList.remove('authenticated');
    window.location.hash = '#login';
    showView('login-page');
}

// ----------------------------------------------------
// AUTHENTICATION CONTROLLER
// ----------------------------------------------------
function setupLoginForm() {
    const authTabContainer = document.querySelector('.auth-tabs');
    if (!authTabContainer) return;

    let selectedRole = 'customer';

    // Clear active states and switch
    authTabContainer.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            authTabContainer.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedRole = tab.dataset.role;

            // Toggle specific fields in registration form
            const registerTitleField = document.getElementById('reg-title-group');
            const registerPhoneField = document.getElementById('reg-phone-group');
            if (selectedRole === 'customer') {
                if (registerTitleField) registerTitleField.style.display = 'block';
                if (registerPhoneField) registerPhoneField.style.display = 'block';
            } else if (selectedRole === 'vendor') {
                if (registerTitleField) registerTitleField.style.display = 'none';
                if (registerPhoneField) registerPhoneField.style.display = 'block';
            } else {
                if (registerTitleField) registerTitleField.style.display = 'none';
                if (registerPhoneField) registerPhoneField.style.display = 'none';
            }
        });
    });

    // Login Form Submit
    const loginForm = document.getElementById('auth-login-form');
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                let res;
                if (state.demoMode) {
                    // Premium Mock Authenticators
                    if (selectedRole === 'admin' && username === 'admin') {
                        res = { token: 'demo_token_admin', role: 'admin', user: { name: 'System Administrator', username: 'admin', role: 'admin' } };
                    } else if (selectedRole === 'vendor') {
                        const vendor = state.vendors.find(v => v.username === username) || state.vendors[0];
                        res = { token: 'demo_token_vendor', role: 'vendor', user: { id: vendor.id, name: vendor.name, username: vendor.username, role: 'vendor' } };
                    } else {
                        res = { token: 'demo_token_customer', role: 'customer', user: { id: 1, name: 'Sophia Carter', username: username || 'sophia', role: 'customer' } };
                    }
                } else {
                    res = await api.post(`/api/auth/${selectedRole}/login`, { username, password });
                }

                api.saveAuth(res.token, res.role, res.user);
                state.user = res.user;
                state.role = res.role;
                
                document.body.classList.add('authenticated');
                showAlert('Welcome back, ' + state.user.name + '!', 'success');
                showView(state.role + '-dashboard');
                renderSidebar();
            } catch (err) {
                showAlert(err.message, 'danger');
                enableDemoMode(err.message);
            }
        };
    }

    // Register Form Submit
    const registerForm = document.getElementById('auth-register-form');
    if (registerForm) {
        registerForm.onsubmit = async (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value;
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const phone = document.getElementById('reg-phone')?.value || '';
            const title = document.getElementById('reg-title')?.value || '';

            try {
                if (state.demoMode) {
                    showAlert('Registration Successful! (Demo Mode)', 'success');
                    toggleAuthForm(false);
                    return;
                }

                if (selectedRole === 'customer') {
                    await api.post('/api/customers', { username, name, email, password, role: 'customer', title, phone, customerRole: 'Bride' });
                } else if (selectedRole === 'vendor') {
                    await api.post('/api/vendors', { username, name, email, password, role: 'vendor', phone, status: 'PENDING', availability: 'AVAILABLE' });
                } else {
                    throw new Error("Admins must be registered by an existing Administrator.");
                }

                showAlert('Registration successful! Please log in.', 'success');
                toggleAuthForm(false);
            } catch (err) {
                showAlert(err.message, 'danger');
            }
        };
    }
}

function toggleAuthForm(showRegister) {
    document.getElementById('login-form-container').style.display = showRegister ? 'none' : 'block';
    document.getElementById('register-form-container').style.display = showRegister ? 'block' : 'none';
}

// ----------------------------------------------------
// CUSTOMER OVERVIEW & ACTIONS
// ----------------------------------------------------
async function loadCustomerDashboard() {
    if (!state.demoMode) {
        try {
            state.events = await api.get(`/api/events/customer/${state.user.id}`);
            state.bookings = await api.get(`/api/bookings/customer/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const overview = document.getElementById('customer-dashboard');
    if (!overview) return;

    // Calculate totals
    const currentEvent = state.events[0];
    const bookingsCount = state.bookings.length;
    const totalSpent = state.bookings.reduce((sum, b) => sum + (b.totalCost || 0), 0);
    const eventDateText = currentEvent ? new Date(currentEvent.eventDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Event Set';

    // Wedding Countdown Calculation
    let countdownHtml = '<span>Days to celebration:</span> <span class="countdown-numbers">TBD</span>';
    if (currentEvent) {
        const diffTime = new Date(currentEvent.eventDate) - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        countdownHtml = `<span>Wedding Countdown:</span> <span class="countdown-numbers">${diffDays > 0 ? diffDays : 0} Days</span>`;
    }

    overview.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Wedding Planner</h1>
                <p>Welcome, ${state.user.name}. Let's craft your absolute dream wedding.</p>
            </div>
            <div class="wedding-countdown-widget">${countdownHtml}</div>
        </div>

        <div class="stats-grid">
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Active Wedding Plan</div>
                    <div class="stat-value" style="font-size: 1.3rem; margin-top: 0.5rem; max-width: 200px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                        ${currentEvent ? currentEvent.eventName : 'None Created'}
                    </div>
                    <p style="font-size: 0.8rem; margin-top: 5px;">${eventDateText}</p>
                </div>
                <div class="stat-icon">${ICONS.heart}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Booked Vendors</div>
                    <div class="stat-value">${bookingsCount} Services</div>
                </div>
                <div class="stat-icon">${ICONS.check}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Estimated Expenses</div>
                    <div class="stat-value">$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stat-icon">${ICONS.dollar}</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="glass-panel">
                <h3 style="margin-bottom: 1.5rem;">Quick Wedding Setup</h3>
                ${!currentEvent ? `
                    <p style="margin-bottom: 2rem;">You do not have an active wedding event. Create one to begin adding services.</p>
                    <button class="btn btn-primary" onclick="showView('customer-events')">Setup New Event</button>
                ` : `
                    <div style="display:flex; flex-direction:column; gap: 1rem;">
                        <p><strong>Ceremony Venue:</strong> ${currentEvent.location}</p>
                        <p><strong>Description:</strong> ${currentEvent.description}</p>
                        <p><strong>Plan Status:</strong> <span class="badge badge-pending">${currentEvent.status}</span></p>
                        <div style="display:flex; gap:10px; margin-top: 1rem;">
                            <button class="btn btn-primary" onclick="showView('customer-packages')">Add Vendor Services</button>
                            <button class="btn btn-secondary" onclick="showView('customer-events')">Edit Plan</button>
                        </div>
                    </div>
                `}
            </div>

            <div class="glass-panel">
                <h3 style="margin-bottom: 1.5rem;">Recent Booking Package Status</h3>
                <div style="display:flex; flex-direction:column; gap: 1rem;">
                    ${state.bookings.length === 0 ? `
                        <p>No bookings requested yet.</p>
                    ` : state.bookings.slice(0, 3).map(b => `
                        <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <h4 style="font-size: 1.05rem;">${b.eventName}</h4>
                                <p style="font-size: 0.8rem; margin-top: 3px;">Date: ${b.bookingDate}</p>
                            </div>
                            <span class="badge ${b.status === 'APPROVED' ? 'badge-success' : 'badge-pending'}">${b.status}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// PACKAGE CATALOG VIEW (CUSTOMER)
// ----------------------------------------------------
async function loadCustomerPackages() {
    if (!state.demoMode) {
        try {
            state.packages = await api.get('/api/packages');
            state.categories = await api.get('/api/categories');
            state.events = await api.get(`/api/events/customer/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('customer-packages');
    if (!container) return;

    let selectedCategoryId = null;

    function renderCatalog() {
        const filtered = selectedCategoryId 
            ? state.packages.filter(p => p.categoryId === selectedCategoryId) 
            : state.packages;

        container.innerHTML = `
            <div class="top-bar">
                <div>
                    <h1 class="luxury-title">Browse Vendor Services</h1>
                    <p>Select elite catering, royal ballrooms, creative photography, and premium entertainment.</p>
                </div>
            </div>

            <div class="catalog-section">
                <div class="filters-bar">
                    <div class="category-tags">
                        <span class="category-tag ${selectedCategoryId === null ? 'active' : ''}" data-id="all">All Services</span>
                        ${state.categories.map(cat => `
                            <span class="category-tag ${selectedCategoryId === cat.categoryId ? 'active' : ''}" data-id="${cat.categoryId}">${cat.name}</span>
                        `).join('')}
                    </div>
                </div>

                <div class="packages-grid">
                    ${filtered.length === 0 ? `
                        <div class="glass-panel" style="grid-column: 1/-1; text-align:center; padding: 4rem;">
                            <h3>No packages available in this category.</h3>
                        </div>
                    ` : filtered.map(pkg => `
                        <div class="glass-panel package-card">
                            <div class="package-header">
                                <span class="package-category">${getCategoryName(pkg.categoryId)}</span>
                                <span class="package-price">$${pkg.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <h3 class="package-title">${pkg.title}</h3>
                            <p class="package-desc">${pkg.description}</p>
                            <div class="package-meta">
                                <span>Duration: ${pkg.duration || 'Full Setup'}</span>
                                <span class="package-rating">
                                    ${ICONS.star} ${pkg.averageRating?.toFixed(1) || '0.0'} (${pkg.ratingCount || 0})
                                </span>
                            </div>
                            <div style="margin-top: 1.5rem; display:flex; gap: 10px;">
                                <button class="btn btn-primary" style="flex:1;" onclick="triggerAddPackage(${pkg.packageId})">Add to Event Plan</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Attach category tags event listeners
        container.querySelectorAll('.category-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const id = tag.dataset.id;
                selectedCategoryId = id === 'all' ? null : parseInt(id);
                renderCatalog();
            });
        });
    }

    renderCatalog();
}

function getCategoryName(id) {
    const cat = state.categories.find(c => c.categoryId === id);
    return cat ? cat.name : 'Wedding Services';
}

function triggerAddPackage(packageId) {
    if (state.events.length === 0) {
        showAlert('Please set up an Event Plan first!', 'danger');
        showView('customer-events');
        return;
    }

    const pkg = state.packages.find(p => p.packageId === packageId);
    state.activePackageDetail = pkg;

    const overlay = document.getElementById('add-package-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-content').innerHTML = `
        <button class="modal-close" onclick="closeModal('add-package-modal')">${ICONS.close}</button>
        <h2 class="luxury-title" style="font-size: 1.8rem; margin-bottom: 1rem;">Add to Event Plan</h2>
        <p style="margin-bottom: 2rem;">You are adding <strong>${pkg.title}</strong> by ${pkg.vendorName || 'Elite Vendor'}.</p>
        
        <form id="add-to-event-form">
            <div class="form-group">
                <label class="form-label">Select Event</label>
                <select class="form-control" id="add-event-select" required>
                    ${state.events.map(ev => `<option value="${ev.eventId}">${ev.eventName}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Quantity</label>
                <input type="number" class="form-control" id="add-event-qty" min="1" value="1" required />
            </div>
            <div class="form-group">
                <label class="form-label">Add Notes / Special Instructions</label>
                <textarea class="form-control" id="add-event-notes" rows="3" placeholder="E.g., Special flower colors, stage dimensions, allergy alerts..."></textarea>
            </div>
            <div style="display:flex; gap: 12px; margin-top: 2rem;">
                <button type="submit" class="btn btn-primary" style="flex:1;">Confirm Add</button>
                <button type="button" class="btn btn-secondary" onclick="closeModal('add-package-modal')">Cancel</button>
            </div>
        </form>
    `;

    openModal('add-package-modal');

    const form = document.getElementById('add-to-event-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const eventId = parseInt(document.getElementById('add-event-select').value);
        const qty = parseInt(document.getElementById('add-event-qty').value);
        const notes = document.getElementById('add-event-notes').value;

        try {
            if (state.demoMode) {
                // Mock Add
                const event = state.events.find(ev => ev.eventId === eventId);
                let booking = state.bookings.find(b => b.eventId === eventId);
                if (!booking) {
                    booking = { bookingId: 400 + eventId, eventId, eventName: event.eventName, status: 'PENDING', customerId: state.user.id, customerName: state.user.name, bookingDate: event.eventDate, location: event.location, paymentStatus: 'PENDING', totalCost: 0, paymentType: 'FULL', packages: [] };
                    state.bookings.push(booking);
                }
                booking.packages.push({
                    bookingPackageId: 800 + Math.random(),
                    bookingId: booking.bookingId,
                    eventPackageId: 900 + Math.random(),
                    quantity: qty,
                    priceAtBooking: pkg.price,
                    packageTitle: pkg.title,
                    vendorName: pkg.vendorName || 'Elite Vendor',
                    vendorStatus: 'PENDING',
                    notes
                });
                booking.totalCost += (pkg.price * qty);
            } else {
                await api.post('/api/event-packages', { eventId, packageId, quantity: qty, notes });
            }

            showAlert('Successfully added package to your wedding planner!', 'success');
            closeModal('add-package-modal');
            showView('customer-events');
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

// ----------------------------------------------------
// WEDDING EVENTS PLANNER (CUSTOMER)
// ----------------------------------------------------
async function loadCustomerEvents() {
    if (!state.demoMode) {
        try {
            state.events = await api.get(`/api/events/customer/${state.user.id}`);
            state.bookings = await api.get(`/api/bookings/customer/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('customer-events');
    if (!container) return;

    const activeEvent = state.events[0];
    const relatedBooking = activeEvent ? state.bookings.find(b => b.eventId === activeEvent.eventId) : null;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Wedding Ceremony Builder</h1>
                <p>Plan your wedding itinerary, schedule dates, select locations, and review custom vendor assemblies.</p>
            </div>
        </div>

        <div class="grid-2">
            <div class="glass-panel">
                <h3 style="margin-bottom: 1.5rem;">${activeEvent ? 'Modify Wedding Ceremony Plan' : 'Setup Ceremony Plan'}</h3>
                <form id="event-plan-form">
                    <div class="form-group">
                        <label class="form-label">Ceremony Plan Name</label>
                        <input type="text" class="form-control" id="event-name" value="${activeEvent?.eventName || ''}" placeholder="E.g., Sophia & Alexander Royal Wedding" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Event Type</label>
                        <select class="form-control" id="event-type">
                            <option value="Wedding" ${activeEvent?.eventType === 'Wedding' ? 'selected' : ''}>Wedding Ceremony</option>
                            <option value="Engagement" ${activeEvent?.eventType === 'Engagement' ? 'selected' : ''}>Engagement Soiree</option>
                            <option value="Reception" ${activeEvent?.eventType === 'Reception' ? 'selected' : ''}>Dinner Banquet Reception</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Event Date</label>
                        <input type="date" class="form-control" id="event-date" value="${activeEvent?.eventDate || ''}" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ceremony Location / Venue</label>
                        <input type="text" class="form-control" id="event-loc" value="${activeEvent?.location || ''}" placeholder="E.g., Grand Hyatt, Grand Ballroom" required />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ceremony Description</label>
                        <textarea class="form-control" id="event-desc" rows="3" placeholder="A romantic twilight layout with white orchids and classic orchestral sounds...">${activeEvent?.description || ''}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                        ${activeEvent ? 'Save Updates' : 'Create Event Plan'}
                    </button>
                </form>
            </div>

            <div class="glass-panel">
                <h3 style="margin-bottom: 1.5rem;">Your Wedding Assemblies</h3>
                ${!activeEvent ? `
                    <p style="text-align:center; padding: 3rem;">Please create a Wedding Plan first to add assemblies.</p>
                ` : `
                    <div class="luxury-table-container">
                        <table class="luxury-table">
                            <thead>
                                <tr>
                                    <th>Assembly</th>
                                    <th>Vendor</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${!relatedBooking || !relatedBooking.packages || relatedBooking.packages.length === 0 ? `
                                    <tr>
                                        <td colspan="4" style="text-align:center; padding: 2rem;">No services added yet. Browse and add some.</td>
                                    </tr>
                                ` : relatedBooking.packages.map(p => `
                                    <tr>
                                        <td><strong>${p.packageTitle}</strong></td>
                                        <td>${p.vendorName}</td>
                                        <td>$${p.priceAtBooking?.toFixed(2)}</td>
                                        <td>${p.quantity}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>

                    ${relatedBooking && relatedBooking.packages && relatedBooking.packages.length > 0 ? `
                        <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <p style="font-size: 0.85rem; color: var(--text-secondary);">Assembly Subtotal</p>
                                <h3 style="font-size: 1.6rem; color: #fff;">$${relatedBooking.totalCost?.toFixed(2)}</h3>
                            </div>
                            <button class="btn btn-accent" onclick="confirmWeddingBooking(${activeEvent.eventId})">Book Wedding Now</button>
                        </div>
                    ` : ''}
                `}
            </div>
        </div>
    `;

    // Manage Event Submit
    const form = document.getElementById('event-plan-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const eventName = document.getElementById('event-name').value;
        const eventType = document.getElementById('event-type').value;
        const eventDate = document.getElementById('event-date').value;
        const location = document.getElementById('event-loc').value;
        const description = document.getElementById('event-desc').value;

        try {
            if (state.demoMode) {
                if (activeEvent) {
                    activeEvent.eventName = eventName;
                    activeEvent.eventType = eventType;
                    activeEvent.eventDate = eventDate;
                    activeEvent.location = location;
                    activeEvent.description = description;
                    showAlert('Ceremony Plan updated successfully!', 'success');
                } else {
                    const newEv = { eventId: 302, customerId: state.user.id, eventName, eventType, eventDate, location, description, status: 'PENDING', eventRating: 0, eventReview: '', reviewedAt: null, createdAt: new Date().toISOString() };
                    state.events.push(newEv);
                    showAlert('Ceremony Plan created successfully!', 'success');
                }
            } else {
                if (activeEvent) {
                    await api.put(`/api/events/${activeEvent.eventId}`, { eventName, eventType, eventDate, location, description, customerId: state.user.id, status: activeEvent.status });
                } else {
                    await api.post('/api/events', { eventName, eventType, eventDate, location, description, customerId: state.user.id, status: 'PENDING' });
                }
                showAlert('Wedding Ceremony plan saved!', 'success');
            }

            await loadCustomerEvents();
            showView('customer-dashboard');
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

async function confirmWeddingBooking(eventId) {
    const ev = state.events.find(e => e.eventId === eventId);
    try {
        if (state.demoMode) {
            const b = state.bookings.find(bo => bo.eventId === eventId);
            if (b) {
                b.status = 'CONFIRMED';
            }
            showAlert('Wedding Booking confirmed! Processing vendor schedules.', 'success');
        } else {
            await api.post(`/api/bookings/confirm-event/${eventId}`, null, { location: ev.location, paymentType: 'FULL' });
            showAlert('Wedding Booking confirmed successfully!', 'success');
        }

        showView('customer-bookings');
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// ----------------------------------------------------
// BOOKINGS & CREDIT CARD PAYMENTS (CUSTOMER)
// ----------------------------------------------------
async function loadCustomerBookings() {
    if (!state.demoMode) {
        try {
            state.bookings = await api.get(`/api/bookings/customer/${state.user.id}`);
            state.payments = await api.get(`/api/payments/customer/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('customer-bookings');
    if (!container) return;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">My Bookings & Payments</h1>
                <p>Manage booked services, complete credit card checkouts, and finalize wedding contracts.</p>
            </div>
        </div>

        <div class="glass-panel" style="margin-bottom: 3rem;">
            <h3 style="margin-bottom: 1.5rem;">Registered Bookings</h3>
            <div class="luxury-table-container">
                <table class="luxury-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Event Name</th>
                            <th>Venue</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Booking Status</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.bookings.length === 0 ? `
                            <tr>
                                <td colspan="8" style="text-align:center; padding: 2rem;">No bookings completed yet.</td>
                            </tr>
                        ` : state.bookings.map(b => `
                            <tr>
                                <td>#${b.bookingId}</td>
                                <td><strong>${b.eventName}</strong></td>
                                <td>${b.location}</td>
                                <td>${b.bookingDate}</td>
                                <td>$${b.totalCost?.toFixed(2)}</td>
                                <td><span class="badge ${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? 'badge-success' : 'badge-pending'}">${b.status}</span></td>
                                <td><span class="badge ${b.paymentStatus === 'PAID' ? 'badge-success' : 'badge-pending'}">${b.paymentStatus}</span></td>
                                <td>
                                    <div style="display:flex; gap: 8px;">
                                        ${b.paymentStatus === 'PENDING' ? `
                                            <button class="btn btn-primary btn-sm" onclick="triggerPaymentModal(${b.bookingId}, ${b.totalCost})">Pay Now</button>
                                        ` : ''}
                                        ${b.paymentStatus === 'PAID' && b.status === 'CONFIRMED' ? `
                                            <button class="btn btn-accent btn-sm" onclick="triggerReviewModal(${b.bookingId})">Add Review</button>
                                        ` : ''}
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function triggerPaymentModal(bookingId, totalCost) {
    const overlay = document.getElementById('payment-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-content').innerHTML = `
        <button class="modal-close" onclick="closeModal('payment-modal')">${ICONS.close}</button>
        <h2 class="luxury-title" style="font-size: 1.8rem; margin-bottom: 0.5rem; text-align:center;">Luxurious Checkout</h2>
        <p style="text-align:center; margin-bottom: 2rem; color: var(--text-secondary);">Booking Total: $${totalCost?.toFixed(2)}</p>
        
        <!-- Live Card Preview -->
        <div class="credit-card-preview">
            <div class="card-chip"></div>
            <div class="card-number-display" id="card-num-preview">•••• •••• •••• ••••</div>
            <div class="card-meta-row">
                <div>
                    <div>Card Holder</div>
                    <div class="card-holder-name" id="card-name-preview">FULL NAME</div>
                </div>
                <div>
                    <div>Expires</div>
                    <div id="card-exp-preview">MM/YY</div>
                </div>
            </div>
        </div>

        <form id="credit-card-payment-form">
            <div class="form-group">
                <label class="form-label">Card Holder Name</label>
                <input type="text" class="form-control" id="card-holder-input" placeholder="E.g., Sophia Carter" required />
            </div>
            <div class="form-group">
                <label class="form-label">Card Number</label>
                <input type="text" class="form-control" id="card-number-input" placeholder="4000 1234 5678 9010" maxlength="19" required />
            </div>
            <div class="grid-2" style="gap: 1rem; margin-bottom: 1.5rem;">
                <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">Expiry Date</label>
                    <input type="text" class="form-control" id="card-exp-input" placeholder="MM/YY" maxlength="5" required />
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label class="form-label">CVV</label>
                    <input type="password" class="form-control" id="card-cvv-input" placeholder="•••" maxlength="3" required />
                </div>
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%; font-size:1.1rem; padding: 1rem;">Complete Secure Payment</button>
        </form>
    `;

    // Dynamic Credit Card Interactivity
    const cardHolderInput = document.getElementById('card-holder-input');
    const cardNumberInput = document.getElementById('card-number-input');
    const cardExpInput = document.getElementById('card-exp-input');

    cardHolderInput.oninput = (e) => {
        document.getElementById('card-name-preview').innerText = e.target.value.toUpperCase() || 'FULL NAME';
    };

    cardNumberInput.oninput = (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        e.target.value = formatted;
        document.getElementById('card-num-preview').innerText = formatted || '•••• •••• •••• ••••';
    };

    cardExpInput.oninput = (e) => {
        let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
        document.getElementById('card-exp-preview').innerText = value || 'MM/YY';
    };

    openModal('payment-modal');

    // Secure Checkout submit
    const form = document.getElementById('credit-card-payment-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        try {
            if (state.demoMode) {
                const b = state.bookings.find(bo => bo.bookingId === bookingId);
                if (b) {
                    b.paymentStatus = 'PAID';
                }
                const newPay = { paymentId: 700 + Math.random(), eventName: b?.eventName || 'Dream Wedding', bookingId, totalAmount: totalCost, amount: totalCost, dueAmount: 0, paymentType: 'FULL', status: 'PAID', paymentDate: new Date().toISOString() };
                state.payments.push(newPay);
                state.finances.push({
                    financeId: 900 + Math.random(),
                    type: 'INCOME',
                    bookingId,
                    paymentId: newPay.paymentId,
                    amount: totalCost * 0.1, // 10% commission
                    description: `Commission from Booking #${bookingId}`,
                    paymentMethod: 'CREDIT_CARD',
                    transactionDate: new Date().toISOString()
                });
            } else {
                await api.post('/api/payments', { bookingId, totalAmount: totalCost, amount: totalCost, dueAmount: 0, paymentType: 'FULL', status: 'PAID' });
            }

            showAlert('Payment successful! Your wedding booking is now secure.', 'success');
            closeModal('payment-modal');
            await loadCustomerBookings();
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

// ----------------------------------------------------
// RATINGS & REVIEWS MODULE (CUSTOMER)
// ----------------------------------------------------
function triggerReviewModal(bookingId) {
    const booking = state.bookings.find(b => b.bookingId === bookingId);
    const overlay = document.getElementById('review-modal');
    if (!overlay || !booking) return;

    let selectedRating = 5;

    overlay.querySelector('.modal-content').innerHTML = `
        <button class="modal-close" onclick="closeModal('review-modal')">${ICONS.close}</button>
        <h2 class="luxury-title" style="font-size: 1.8rem; margin-bottom: 1rem; text-align:center;">Add Premium Review</h2>
        <p style="text-align:center; margin-bottom: 2rem;">Write feedback for the services in: <strong>${booking.eventName}</strong></p>
        
        <form id="wedding-review-form">
            <div class="form-group" style="text-align:center;">
                <label class="form-label" style="display:block; margin-bottom: 1rem;">Your Rating</label>
                <div class="stars-input-container" style="justify-content:center;">
                    <button type="button" class="star-rating-btn active" data-val="1">${ICONS.star}</button>
                    <button type="button" class="star-rating-btn active" data-val="2">${ICONS.star}</button>
                    <button type="button" class="star-rating-btn active" data-val="3">${ICONS.star}</button>
                    <button type="button" class="star-rating-btn active" data-val="4">${ICONS.star}</button>
                    <button type="button" class="star-rating-btn active" data-val="5">${ICONS.star}</button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Review Details / Comment</label>
                <textarea class="form-control" id="review-comment" rows="4" placeholder="Share your experience with the wedding package... E.g., The venue decoration was breathtaking, and catering was exquisite!" required></textarea>
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%; padding:1rem; font-size:1.1rem; margin-top: 1rem;">Submit Review</button>
        </form>
    `;

    // Stars Selection Interactivity
    const starBtns = overlay.querySelectorAll('.star-rating-btn');
    starBtns.forEach(btn => {
        btn.onclick = () => {
            const val = parseInt(btn.dataset.val);
            selectedRating = val;
            starBtns.forEach((b, idx) => {
                if (idx < val) b.classList.add('active');
                else b.classList.remove('active');
            });
        };
    });

    openModal('review-modal');

    const form = document.getElementById('wedding-review-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const comment = document.getElementById('review-comment').value;

        try {
            if (state.demoMode) {
                // Find first package in booking to review
                const pkg = booking.packages[0];
                if (pkg) {
                    const originalPackage = state.packages.find(p => p.packageId === pkg.packageId || p.title === pkg.packageTitle);
                    if (originalPackage) {
                        originalPackage.ratingCount = (originalPackage.ratingCount || 0) + 1;
                        originalPackage.averageRating = ((originalPackage.averageRating * (originalPackage.ratingCount - 1)) + selectedRating) / originalPackage.ratingCount;
                    }
                }
                showAlert('Review submitted! Thank you for your feedback.', 'success');
            } else {
                await api.post('/api/reviews', {
                    eventId: booking.eventId,
                    customerId: state.user.id,
                    packageId: booking.packages[0]?.packageId || 101,
                    packageRating: selectedRating,
                    packageComment: comment
                });
                showAlert('Review recorded successfully!', 'success');
            }

            closeModal('review-modal');
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

// ----------------------------------------------------
// VENDOR DASHBOARD
// ----------------------------------------------------
async function loadVendorDashboard() {
    if (!state.demoMode) {
        try {
            state.packages = await api.get('/api/packages'); // Needs custom filtered query ideally
            state.bookings = await api.get(`/api/bookings/vendor/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('vendor-dashboard');
    if (!container) return;

    // Filter vendor specific bookings (or packages)
    const myBookings = state.demoMode 
        ? state.bookings.flatMap(b => b.packages.filter(p => p.vendorName === state.user.name)) 
        : state.bookings;

    const myPackages = state.packages.filter(p => p.vendorId === state.user.id || p.vendorName === state.user.name);

    // Calculate metrics
    const totalEarned = myBookings.reduce((sum, b) => sum + (b.vendorStatus === 'APPROVED' ? Number(b.priceAtBooking || 0) * (b.quantity || 1) : 0), 0);
    const activeRequests = myBookings.filter(b => b.vendorStatus === 'PENDING').length;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Vendor Console</h1>
                <p>Welcome, ${state.user.name}. Manage services, coordinate reservations, and inspect wedding assemblies.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Active Packages</div>
                    <div class="stat-value">${myPackages.length} Listed</div>
                </div>
                <div class="stat-icon">${ICONS.cog}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Pending Requests</div>
                    <div class="stat-value">${activeRequests} Bookings</div>
                </div>
                <div class="stat-icon">${ICONS.calendar}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value">$${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stat-icon">${ICONS.dollar}</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="glass-panel">
                <h3>Vendor Profile & Status</h3>
                <div style="margin-top: 1.5rem; display:flex; flex-direction:column; gap: 1rem;">
                    <p><strong>Business Name:</strong> ${state.user.name}</p>
                    <p><strong>Username:</strong> @${state.user.username}</p>
                    <p><strong>Platform Status:</strong> <span class="badge badge-success">VERIFIED</span></p>
                    <p><strong>Accepting Bookings:</strong> <span class="badge badge-info">AVAILABLE</span></p>
                </div>
            </div>

            <div class="glass-panel">
                <h3>Latest Operations Log</h3>
                <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:10px;">
                    <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong>Platform Commission updated</strong>
                            <p style="font-size:0.8rem;">Commission fee configured to standard 10%</p>
                        </div>
                        <span class="badge badge-success">ACTIVE</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// MANAGE VENDOR SERVICE PACKAGES
// ----------------------------------------------------
async function loadVendorPackages() {
    if (!state.demoMode) {
        try {
            state.packages = await api.get('/api/packages');
            state.categories = await api.get('/api/categories');
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('vendor-packages');
    if (!container) return;

    const myPackages = state.packages.filter(p => p.vendorId === state.user.id || p.vendorName === state.user.name);

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">My Service Packages</h1>
                <p>Register and coordinate your elegant banquet halls, gourmet food menus, or premium photography plans.</p>
            </div>
            <button class="btn btn-primary" onclick="triggerCreatePackageModal()">${ICONS.plus} New Package</button>
        </div>

        <div class="packages-grid">
            ${myPackages.length === 0 ? `
                <div class="glass-panel" style="grid-column: 1/-1; text-align:center; padding: 4rem;">
                    <h3>You have not created any service packages yet.</h3>
                </div>
            ` : myPackages.map(pkg => `
                <div class="glass-panel package-card">
                    <div class="package-header">
                        <span class="package-category">${getCategoryName(pkg.categoryId)}</span>
                        <span class="package-price">$${pkg.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <h3 class="package-title">${pkg.title}</h3>
                    <p class="package-desc">${pkg.description}</p>
                    <div class="package-meta">
                        <span>Duration: ${pkg.duration || 'Full Setup'}</span>
                        <span class="badge ${pkg.availability === 'AVAILABLE' ? 'badge-success' : 'badge-danger'}">${pkg.availability}</span>
                    </div>
                    <div style="display:flex; gap: 10px; margin-top: 1.5rem;">
                        <button class="btn btn-secondary btn-sm" style="flex:1;" onclick="togglePackageAvailability(${pkg.packageId})">Toggle Active</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteVendorPackage(${pkg.packageId})">${ICONS.trash}</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function triggerCreatePackageModal() {
    const overlay = document.getElementById('create-package-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-content').innerHTML = `
        <button class="modal-close" onclick="closeModal('create-package-modal')">${ICONS.close}</button>
        <h2 class="luxury-title" style="font-size: 1.8rem; margin-bottom: 1.5rem;">Register New Service Package</h2>
        
        <form id="create-package-form">
            <div class="form-group">
                <label class="form-label">Package Title</label>
                <input type="text" class="form-control" id="pkg-title" placeholder="E.g., Moonlight Ceremony Setup" required />
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-control" id="pkg-category" required>
                    ${state.categories.map(cat => `<option value="${cat.categoryId}">${cat.name}</option>`).join('')}
                </select>
            </div>
            <div class="grid-2" style="gap:1rem;">
                <div class="form-group">
                    <label class="form-label">Price ($)</label>
                    <input type="number" class="form-control" id="pkg-price" min="0" step="0.01" placeholder="2500" required />
                </div>
                <div class="form-group">
                    <label class="form-label">Duration / Scale</label>
                    <input type="text" class="form-control" id="pkg-duration" placeholder="E.g., 6 Hours / Full Setup" required />
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Package Description</label>
                <textarea class="form-control" id="pkg-desc" rows="4" placeholder="Detailed description of elements included in this service package..." required></textarea>
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%; padding:1rem; font-size:1.1rem; margin-top: 1.5rem;">Register Package</button>
        </form>
    `;

    openModal('create-package-modal');

    const form = document.getElementById('create-package-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const title = document.getElementById('pkg-title').value;
        const categoryId = parseInt(document.getElementById('pkg-category').value);
        const price = parseFloat(document.getElementById('pkg-price').value);
        const duration = document.getElementById('pkg-duration').value;
        const description = document.getElementById('pkg-desc').value;

        try {
            if (state.demoMode) {
                state.packages.push({
                    packageId: 100 + Math.random(),
                    vendorId: state.user.id,
                    categoryId,
                    title,
                    description,
                    price,
                    duration,
                    availability: 'AVAILABLE',
                    vendorName: state.user.name,
                    averageRating: 0.0,
                    ratingCount: 0,
                    bookingCount: 0
                });
            } else {
                await api.post('/api/packages', { title, categoryId, price, duration, description, vendorId: state.user.id, availability: 'AVAILABLE' });
            }

            showAlert('New package registered successfully!', 'success');
            closeModal('create-package-modal');
            await loadVendorPackages();
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

async function togglePackageAvailability(packageId) {
    const pkg = state.packages.find(p => p.packageId === packageId);
    if (!pkg) return;
    const nextAvailability = pkg.availability === 'AVAILABLE' ? 'UNAVAILABLE' : 'AVAILABLE';

    try {
        if (state.demoMode) {
            pkg.availability = nextAvailability;
        } else {
            await api.patch(`/api/packages/${packageId}/availability`, null, { availability: nextAvailability });
        }
        showAlert('Availability toggled successfully!', 'success');
        await loadVendorPackages();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

async function deleteVendorPackage(packageId) {
    if (!confirm('Are you sure you want to delete this service package?')) return;
    try {
        if (state.demoMode) {
            state.packages = state.packages.filter(p => p.packageId !== packageId);
        } else {
            await api.delete(`/api/packages/${packageId}`);
        }
        showAlert('Service package deleted successfully.', 'success');
        await loadVendorPackages();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// ----------------------------------------------------
// VENDOR BOOKINGS REQUESTS
// ----------------------------------------------------
async function loadVendorBookings() {
    if (!state.demoMode) {
        try {
            state.bookings = await api.get(`/api/bookings/vendor/${state.user.id}`);
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('vendor-bookings');
    if (!container) return;

    // Filter vendor booking packages
    const myBookings = state.demoMode 
        ? state.bookings.flatMap(b => b.packages.filter(p => p.vendorName === state.user.name)) 
        : state.bookings;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Customer Reservation Demands</h1>
                <p>Verify wedding planner itineraries, check timeline slots, and accept/reject reservations.</p>
            </div>
        </div>

        <div class="glass-panel">
            <h3 style="margin-bottom: 1.5rem;">Booking Demands</h3>
            <div class="luxury-table-container">
                <table class="luxury-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Service Requested</th>
                            <th>Customer Name</th>
                            <th>Ceremony Venue</th>
                            <th>Target Date</th>
                            <th>Notes</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${myBookings.length === 0 ? `
                            <tr>
                                <td colspan="8" style="text-align:center; padding: 2rem;">No reservation requests assigned to you.</td>
                            </tr>
                        ` : myBookings.map(b => `
                            <tr>
                                <td>#${b.bookingPackageId || b.bookingId}</td>
                                <td><strong>${b.packageTitle}</strong></td>
                                <td>${b.customerName || 'Sophia Carter'}</td>
                                <td>${b.location || 'Banquet Hall'}</td>
                                <td>${b.eventDate || 'TBD'}</td>
                                <td style="font-size:0.85rem; color:var(--text-secondary); max-width: 150px; text-overflow:ellipsis; overflow:hidden;">${b.notes || 'None'}</td>
                                <td><span class="badge ${b.vendorStatus === 'APPROVED' ? 'badge-success' : b.vendorStatus === 'REJECTED' ? 'badge-danger' : 'badge-pending'}">${b.vendorStatus || 'PENDING'}</span></td>
                                <td>
                                    ${b.vendorStatus === 'PENDING' ? `
                                        <div style="display:flex; gap: 8px;">
                                            <button class="btn btn-primary btn-sm" onclick="respondToBooking(${b.bookingPackageId || b.bookingId}, 'APPROVED')">Accept</button>
                                            <button class="btn btn-danger btn-sm" onclick="respondToBooking(${b.bookingPackageId || b.bookingId}, 'REJECTED')">Reject</button>
                                        </div>
                                    ` : 'Completed'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function respondToBooking(bookingPackageId, status) {
    let reason = '';
    if (status === 'REJECTED') {
        reason = prompt('Enter a reason for rejection (optional):') || 'Schedule fully booked';
    }

    try {
        if (state.demoMode) {
            // Find package inside mock state and change status
            state.bookings.forEach(b => {
                b.packages.forEach(p => {
                    if (p.bookingPackageId === bookingPackageId || p.bookingId === bookingPackageId) {
                        p.vendorStatus = status;
                        p.rejectionReason = reason;
                    }
                });
            });
        } else {
            await api.put(`/api/bookings/package/${bookingPackageId}/status`, null, { status, reason });
        }

        showAlert(`Booking successfully ${status.toLowerCase()}!`, 'success');
        await loadVendorBookings();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// ----------------------------------------------------
// ADMIN DASHBOARD
// ----------------------------------------------------
async function loadAdminDashboard() {
    if (!state.demoMode) {
        try {
            state.vendors = await api.get('/api/vendors');
            state.bookings = await api.get('/api/bookings');
            state.finances = await api.get('/api/finance');
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('admin-dashboard');
    if (!container) return;

    // Calculate Admin stats
    const totalVendors = state.vendors.length;
    const pendingVendors = state.vendors.filter(v => v.status === 'PENDING').length;
    const activeBookings = state.bookings.length;
    const adminCommission = state.finances.reduce((sum, f) => sum + (f.type === 'INCOME' ? Number(f.amount || 0) : 0), 0);

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Platform Administration</h1>
                <p>Welcome, Admin. Audit wedding registries, verify vendor credentials, inspect platform finances.</p>
            </div>
        </div>

        <div class="stats-grid">
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Verified Vendors</div>
                    <div class="stat-value">${totalVendors} Registered</div>
                    <p style="font-size:0.8rem; margin-top:5px;">${pendingVendors} Pending verification</p>
                </div>
                <div class="stat-icon">${ICONS.users}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Active Bookings</div>
                    <div class="stat-value">${activeBookings} Bookings</div>
                </div>
                <div class="stat-icon">${ICONS.calendar}</div>
            </div>
            <div class="glass-panel stat-card">
                <div>
                    <div class="stat-label">Total Commission Income</div>
                    <div class="stat-value">$${adminCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div class="stat-icon">${ICONS.dollar}</div>
            </div>
        </div>

        <div class="grid-2">
            <div class="glass-panel">
                <h3>Admin Authorization</h3>
                <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:10px;">
                    <p><strong>Standard Role:</strong> Administrator</p>
                    <p><strong>Rights:</strong> Full system access, Vendor approvals, and financial logs verification.</p>
                </div>
            </div>

            <div class="glass-panel">
                <h3>System Health</h3>
                <div style="margin-top: 1.5rem; display:flex; flex-direction:column; gap:1rem;">
                    <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Database Server</span>
                        <span class="badge badge-success">ONLINE</span>
                    </div>
                    <div class="glass-card" style="display:flex; justify-content:space-between; align-items:center;">
                        <span>Credit Checkout Gateway</span>
                        <span class="badge badge-success">ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// ADMIN VENDOR VERIFICATION QUEUE
// ----------------------------------------------------
async function loadAdminVendors() {
    if (!state.demoMode) {
        try {
            state.vendors = await api.get('/api/vendors');
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('admin-vendors');
    if (!container) return;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">Vendor Verification Queue</h1>
                <p>Audit new business registration accounts and activate their profile indexes on BridalPlan.</p>
            </div>
        </div>

        <div class="glass-panel">
            <h3 style="margin-bottom: 1.5rem;">Registered Profiles</h3>
            <div class="luxury-table-container">
                <table class="luxury-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Business Name</th>
                            <th>Email Address</th>
                            <th>Contact Phone</th>
                            <th>Platform Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.vendors.length === 0 ? `
                            <tr>
                                <td colspan="6" style="text-align:center; padding: 2rem;">No vendors registered in the platform yet.</td>
                            </tr>
                        ` : state.vendors.map(v => `
                            <tr>
                                <td>#${v.id}</td>
                                <td><strong>${v.name}</strong></td>
                                <td>${v.email}</td>
                                <td>${v.phone || 'None'}</td>
                                <td><span class="badge ${v.status === 'APPROVED' ? 'badge-success' : v.status === 'REJECTED' ? 'badge-danger' : 'badge-pending'}">${v.status}</span></td>
                                <td>
                                    ${v.status === 'PENDING' ? `
                                        <div style="display:flex; gap: 8px;">
                                            <button class="btn btn-primary btn-sm" onclick="verifyVendorProfile(${v.id}, 'APPROVED')">Verify</button>
                                            <button class="btn btn-danger btn-sm" onclick="verifyVendorProfile(${v.id}, 'REJECTED')">Reject</button>
                                        </div>
                                    ` : 'Verified'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function verifyVendorProfile(vendorId, status) {
    try {
        if (state.demoMode) {
            const v = state.vendors.find(ve => ve.id === vendorId);
            if (v) {
                v.status = status;
            }
        } else {
            await api.put(`/api/vendors/${vendorId}/${status.toLowerCase()}`);
        }

        showAlert(`Vendor profile has been successfully ${status.toLowerCase()}!`, 'success');
        await loadAdminVendors();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// ----------------------------------------------------
// ADMIN FINANCE LOGS
// ----------------------------------------------------
async function loadAdminFinances() {
    if (!state.demoMode) {
        try {
            state.finances = await api.get('/api/finance');
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('admin-finances');
    if (!container) return;

    const totalSystemIncome = state.finances.reduce((sum, f) => sum + (f.type === 'INCOME' ? Number(f.amount || 0) : 0), 0);

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">System Finance Records</h1>
                <p>Verify transaction ledgers, audit commission fee incomes, and track booking commission statements.</p>
            </div>
        </div>

        <div class="stats-grid" style="grid-template-columns: 1fr;">
            <div class="glass-panel stat-card" style="justify-content: flex-start; gap: 2rem;">
                <div class="stat-icon" style="width: 70px; height: 70px;">${ICONS.dollar}</div>
                <div>
                    <div class="stat-label">Net Platforms Incomes (10% Service Commissions)</div>
                    <div class="stat-value" style="font-size: 3rem;">$${totalSystemIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
            </div>
        </div>

        <div class="glass-panel">
            <h3 style="margin-bottom: 1.5rem;">Commission Ledgers</h3>
            <div class="luxury-table-container">
                <table class="luxury-table">
                    <thead>
                        <tr>
                            <th>Finance ID</th>
                            <th>Description</th>
                            <th>Amount Collected</th>
                            <th>Related Booking</th>
                            <th>Method</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.finances.length === 0 ? `
                            <tr>
                                <td colspan="6" style="text-align:center; padding: 2rem;">No finance records posted yet.</td>
                            </tr>
                        ` : state.finances.map(f => `
                            <tr>
                                <td>#${f.financeId}</td>
                                <td><strong>${f.description}</strong></td>
                                <td style="color: hsl(var(--accent-light)); font-weight:700;">+$${f.amount?.toFixed(2)}</td>
                                <td>#${f.bookingId || 'TBD'}</td>
                                <td><span class="badge badge-info">${f.paymentMethod}</span></td>
                                <td>${new Date(f.transactionDate).toLocaleString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ----------------------------------------------------
// ADMIN CATEGORIES MANAGEMENT
// ----------------------------------------------------
async function loadAdminCategories() {
    if (!state.demoMode) {
        try {
            state.categories = await api.get('/api/categories');
        } catch (e) {
            enableDemoMode(e.message);
        }
    }

    const container = document.getElementById('admin-categories');
    if (!container) return;

    container.innerHTML = `
        <div class="top-bar">
            <div>
                <h1 class="luxury-title">System Categories Manager</h1>
                <p>Register and coordinate service categories like Catering, Florist, Music DJs, and Hall Venues.</p>
            </div>
            <button class="btn btn-primary" onclick="triggerCreateCategoryModal()">${ICONS.plus} New Category</button>
        </div>

        <div class="glass-panel">
            <h3 style="margin-bottom: 1.5rem;">Available Categories</h3>
            <div class="luxury-table-container">
                <table class="luxury-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.categories.map(cat => `
                            <tr>
                                <td>#${cat.categoryId}</td>
                                <td><strong>${cat.name}</strong></td>
                                <td>
                                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${cat.categoryId})">${ICONS.trash}</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function triggerCreateCategoryModal() {
    const overlay = document.getElementById('edit-category-modal');
    if (!overlay) return;

    overlay.querySelector('.modal-content').innerHTML = `
        <button class="modal-close" onclick="closeModal('edit-category-modal')">${ICONS.close}</button>
        <h2 class="luxury-title" style="font-size: 1.8rem; margin-bottom: 1.5rem;">Create Service Category</h2>
        
        <form id="create-category-form">
            <div class="form-group">
                <label class="form-label">Category Name</label>
                <input type="text" class="form-control" id="cat-name" placeholder="E.g., Videography & Drone Cinematic" required />
            </div>
            <button type="submit" class="btn btn-accent" style="width:100%; padding:1rem; font-size:1.1rem; margin-top: 1.5rem;">Create Category</button>
        </form>
    `;

    openModal('edit-category-modal');

    const form = document.getElementById('create-category-form');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('cat-name').value;

        try {
            if (state.demoMode) {
                state.categories.push({ categoryId: 10 + Math.random(), name });
            } else {
                await api.post('/api/categories', { name });
            }

            showAlert('New Category created successfully!', 'success');
            closeModal('edit-category-modal');
            await loadAdminCategories();
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    };
}

async function deleteCategory(id) {
    if (!confirm('Are you sure you want to delete this Category?')) return;
    try {
        if (state.demoMode) {
            state.categories = state.categories.filter(c => c.categoryId !== id);
        } else {
            await api.delete(`/api/categories/${id}`);
        }
        showAlert('Category deleted successfully.', 'success');
        await loadAdminCategories();
    } catch (err) {
        showAlert(err.message, 'danger');
    }
}

// ----------------------------------------------------
// MODALS & NOTIFICATIONS CONTROL
// ----------------------------------------------------
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

function showAlert(message, type = 'success') {
    // Check if there is an active alert container, or build a clean toast notification
    let toast = document.getElementById('global-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'global-toast';
        toast.style.position = 'fixed';
        toast.style.top = '30px';
        toast.style.right = '30px';
        toast.style.zIndex = '99999';
        toast.style.pointerEvents = 'none';
        document.body.appendChild(toast);
    }

    const item = document.createElement('div');
    item.className = `alert alert-${type}`;
    item.style.pointerEvents = 'auto';
    item.style.boxShadow = 'var(--shadow-lg)';
    item.style.animation = 'slide-up var(--transition-normal) forwards';
    item.innerHTML = `<strong>${type === 'success' ? '✔ Success:' : '✖ Notice:'}</strong> ${message}`;
    
    toast.appendChild(item);
    setTimeout(() => {
        item.style.animation = 'fade-out var(--transition-fast) forwards';
        setTimeout(() => item.remove(), 500);
    }, 4500);
}

// Export modals control to global context
window.closeModal = closeModal;
window.respondToBooking = respondToBooking;
window.triggerPaymentModal = triggerPaymentModal;
window.triggerReviewModal = triggerReviewModal;
window.verifyVendorProfile = verifyVendorProfile;
window.togglePackageAvailability = togglePackageAvailability;
window.deleteVendorPackage = deleteVendorPackage;
window.confirmWeddingBooking = confirmWeddingBooking;
window.triggerAddPackage = triggerAddPackage;
window.triggerCreateCategoryModal = triggerCreateCategoryModal;
window.deleteCategory = deleteCategory;
window.triggerCreatePackageModal = triggerCreatePackageModal;
window.toggleAuthForm = toggleAuthForm;
window.logoutUser = logoutUser;
window.showView = showView;
