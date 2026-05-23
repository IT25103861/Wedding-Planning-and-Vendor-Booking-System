// Auth & Session Management

/**
 * Helper to get relative path prefix for redirects when running via file://
 */
function getRedirectPrefix() {
    const path = window.location.pathname;
    if (path.includes('/customer/') || path.includes('/vendor/') || path.includes('/admin/')) {
        return '../';
    }
    return '';
}

/**
 * Auth guard - add to top of each protected page's script block.
 * @param {string[]} allowedRoles - List of roles allowed to access the page ('CUSTOMER', 'VENDOR', 'ADMIN')
 * @returns {Object} The user object from localStorage
 */
function requireAuth(allowedRoles) {
    const user = JSON.parse(localStorage.getItem('ethereal_user') || 'null');
    const prefix = getRedirectPrefix();
    
    if (!user) {
        window.location.href = prefix + 'login.html';
        return null;
    }
    
    if (!allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they are logged in but in the wrong area
        if (user.role === 'CUSTOMER') window.location.href = prefix + 'customer/dashboard.html';
        else if (user.role === 'VENDOR') window.location.href = prefix + 'vendor/dashboard.html';
        else if (user.role === 'ADMIN') window.location.href = prefix + 'admin/dashboard.html';
        else window.location.href = prefix + 'login.html';
        return null;
    }
    
    return user;
}

// Logout function
function logout() {
    const performLogout = () => {
        localStorage.removeItem('ethereal_user');
        window.location.href = getRedirectPrefix() + 'index.html';
    };

    if (typeof confirmModal === 'function') {
        confirmModal('Are you sure you want to log out?', performLogout);
    } else if (confirm('Are you sure you want to log out?')) {
        performLogout();
    }
}

// Global UI initializations
document.addEventListener('DOMContentLoaded', () => {
    // Fade in effect
    document.body.classList.add('fade-in');

    // Sidebar toggle for mobile
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // Auto-close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // --- Automated Review Popup Logic ---
    const user = JSON.parse(localStorage.getItem('ethereal_user') || 'null');
    if (user && user.role === 'CUSTOMER') {
        checkPendingReviews(user.id);
    }
});

async function checkPendingReviews(customerId) {
    try {
        const pendingEvents = await api.get(`/events/customer/${customerId}/pending-reviews`);
        if (pendingEvents && pendingEvents.length > 0) {
            const event = pendingEvents[0]; // Show one at a time
            showReviewPopup(event);
        }
    } catch (e) { console.error("Review check failed", e); }
}

async function showReviewPopup(event) {
    let packages = [];
    try {
        packages = await api.get(`/event-packages/event/${event.eventId}`);
    } catch (e) { console.error("Failed to load packages for review", e); }

    const { value: formValues } = await Swal.fire({
        title: `<h3 class="brand-font">How was your ${event.eventName}?</h3>`,
        html: `
            <div style="text-align: left; padding: 0 1rem;">
                <p class="text-muted mb-2">We'd love to hear about your experience on ${new Date(event.eventDate).toLocaleDateString()}.</p>
                
                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700;">Overall Event Rating (Mandatory)</label>
                    <div id="eventRatingStars" style="font-size: 1.5rem; color: #ffd700; cursor: pointer; display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                        <i class="far fa-star" data-val="1"></i>
                        <i class="far fa-star" data-val="2"></i>
                        <i class="far fa-star" data-val="3"></i>
                        <i class="far fa-star" data-val="4"></i>
                        <i class="far fa-star" data-val="5"></i>
                    </div>
                    <input type="hidden" id="eventRating" value="0">
                </div>

                <div class="form-group mb-3">
                    <label class="form-label" style="font-weight: 700;">Event Review</label>
                    <textarea id="eventReview" class="form-control" rows="3" placeholder="Tell us more about your special day..."></textarea>
                </div>

                ${packages.length > 0 ? `
                    <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
                        <label class="form-label" style="font-weight: 700;">Rate Services (Optional)</label>
                        <div style="max-height: 200px; overflow-y: auto; padding-right: 0.5rem;">
                            ${packages.map(p => `
                                <div class="card mb-1" style="padding: 1rem; background: var(--bg-light);">
                                    <div style="font-weight: 600; font-size: 0.9rem;">${p.packageTitle}</div>
                                    <div class="package-rating" data-pkg-id="${p.packageId}" style="color: #ffd700; margin-top: 0.3rem; font-size: 1.1rem; cursor: pointer;">
                                        <i class="far fa-star" data-val="1"></i>
                                        <i class="far fa-star" data-val="2"></i>
                                        <i class="far fa-star" data-val="3"></i>
                                        <i class="far fa-star" data-val="4"></i>
                                        <i class="far fa-star" data-val="5"></i>
                                    </div>
                                    <input type="hidden" id="pkg-rating-${p.packageId}" value="0">
                                    <input type="text" id="pkg-review-${p.packageId}" class="form-control mt-1" style="font-size: 0.8rem; padding: 0.4rem;" placeholder="Optional comment...">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `,
        didOpen: () => {
            // Star rating logic for event
            const eventStars = document.getElementById('eventRatingStars').querySelectorAll('i');
            eventStars.forEach(star => {
                star.onclick = () => {
                    const val = parseInt(star.getAttribute('data-val'));
                    document.getElementById('eventRating').value = val;
                    eventStars.forEach((s, idx) => {
                        s.classList.toggle('fas', idx < val);
                        s.classList.toggle('far', idx >= val);
                    });
                };
            });

            // Star rating logic for packages
            const pkgContainers = document.querySelectorAll('.package-rating');
            pkgContainers.forEach(container => {
                const pkgId = container.getAttribute('data-pkg-id');
                const pkgStars = container.querySelectorAll('i');
                pkgStars.forEach(star => {
                    star.onclick = () => {
                        const val = parseInt(star.getAttribute('data-val'));
                        document.getElementById(`pkg-rating-${pkgId}`).value = val;
                        pkgStars.forEach((s, idx) => {
                            s.classList.toggle('fas', idx < val);
                            s.classList.toggle('far', idx >= val);
                        });
                    };
                });
            });
        },
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'SUBMIT REVIEW',
        confirmButtonColor: '#b7935e',
        cancelButtonText: 'LATER',
        preConfirm: () => {
            const rating = parseInt(document.getElementById('eventRating').value);
            const review = document.getElementById('eventReview').value;
            if (rating === 0) {
                Swal.showValidationMessage('Please provide a rating for the event');
                return false;
            }

            const pkgReviews = [];
            packages.forEach(p => {
                const pkgRating = parseInt(document.getElementById(`pkg-rating-${p.packageId}`).value);
                const pkgReview = document.getElementById(`pkg-review-${p.packageId}`).value;
                if (pkgRating > 0) {
                    pkgReviews.push({
                        eventId: event.eventId,
                        customerId: event.customerId,
                        packageId: p.packageId,
                        packageRating: pkgRating,
                        packageComment: pkgReview
                    });
                }
            });

            return { eventRating: rating, eventReview: review, packageReviews: pkgReviews };
        }
    });

    if (formValues) {
        try {
            // 1. Submit Event Review
            await api.post(`/events/${event.eventId}/review?rating=${formValues.eventRating}&review=${encodeURIComponent(formValues.eventReview)}`, {});
            
            // 2. Submit Package Reviews
            for (const pr of formValues.packageReviews) {
                await api.post('/reviews', pr);
            }

            Swal.fire({
                title: 'Thank You!',
                text: 'Your feedback helps us provide better service.',
                icon: 'success',
                confirmButtonColor: '#b7935e'
            });
        } catch (error) {
            console.error("Failed to submit reviews", error);
            Swal.fire('Error', 'Failed to save your review. Please try again later.', 'error');
        }
    }
}

// Shared Utilities
const utils = {
    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },
    
    setLoading(btn, isLoading, originalText = 'Submit') {
        if (isLoading) {
            btn.innerHTML = '<span class="loader" style="width: 20px; height: 20px; border-width: 2px;"></span>';
            btn.disabled = true;
        } else {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    },

    formatCurrency(amount) {
        return new Number(amount || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
};

// --- Customer Profile Modal Logic ---
async function openProfileModal() {
    const sessionUser = JSON.parse(localStorage.getItem('ethereal_user') || 'null');
    if (!sessionUser) return;

    let customer;
    try {
        showLoader();
        customer = await api.get('/customers/' + sessionUser.id);
        hideLoader();
    } catch (err) {
        hideLoader();
        console.error("Failed to fetch profile details", err);
        Swal.fire('Error', 'Failed to fetch profile details', 'error');
        return;
    }

    if (!customer) return;

    // Phase 2: Edit Profile Form
    const { value: formValues } = await Swal.fire({
        title: '<h3 class="brand-font" style="margin-bottom: 0.5rem;">Edit Profile</h3>',
        width: '600px',
        html: `
            <div style="text-align: left; padding: 0 1rem; font-family: inherit;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                    <div>
                        <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Title</label>
                        <select id="profTitle" class="form-control" style="width: 100%; height: 42px; border-radius: 4px; border: 1px solid var(--border); padding: 0.5rem;">
                            <option value="Mr" ${customer.title === 'Mr' ? 'selected' : ''}>Mr</option>
                            <option value="Miss" ${customer.title === 'Miss' ? 'selected' : ''}>Miss</option>
                            <option value="Mrs" ${customer.title === 'Mrs' ? 'selected' : ''}>Mrs</option>
                            <option value="Master" ${customer.title === 'Master' ? 'selected' : ''}>Master</option>
                        </select>
                    </div>
                    <div>
                        <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Role</label>
                        <select id="profCustomerRole" class="form-control" style="width: 100%; height: 42px; border-radius: 4px; border: 1px solid var(--border); padding: 0.5rem;">
                            <option value="BRIDE" ${customer.customerRole === 'BRIDE' ? 'selected' : ''}>BRIDE</option>
                            <option value="GROOM" ${customer.customerRole === 'GROOM' ? 'selected' : ''}>GROOM</option>
                            <option value="OTHER" ${customer.customerRole === 'OTHER' ? 'selected' : ''}>OTHER</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Full Name</label>
                    <input type="text" id="profName" class="form-control" value="${customer.name || ''}" placeholder="Enter full name" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>

                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Username (Cannot be changed)</label>
                    <input type="text" id="profUsername" class="form-control" value="${customer.username || ''}" disabled style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px; background-color: #f5f5f5; cursor: not-allowed;">
                </div>

                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Email Address</label>
                    <input type="email" id="profEmail" class="form-control" value="${customer.email || ''}" placeholder="Enter email address" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>

                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Mobile Number</label>
                    <input type="text" id="profPhone" class="form-control" value="${customer.phone || ''}" placeholder="Enter mobile number" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>

                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Partner's Name</label>
                    <input type="text" id="profOtherPartyName" class="form-control" value="${customer.otherPartyName || ''}" placeholder="Enter partner's name" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>

                <div class="form-group mb-2">
                    <label class="form-label" style="font-weight: 700; font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.3rem;">Password</label>
                    <input type="password" id="profPassword" class="form-control" placeholder="Enter new password to change (leave blank to keep current)" style="width: 100%; padding: 0.6rem; border: 1px solid var(--border); border-radius: 4px;">
                </div>
            </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'SAVE CHANGES',
        confirmButtonColor: '#b7935e',
        cancelButtonText: 'CANCEL',
        preConfirm: () => {
            const title = document.getElementById('profTitle').value;
            const customerRole = document.getElementById('profCustomerRole').value;
            const name = document.getElementById('profName').value.trim();
            const email = document.getElementById('profEmail').value.trim();
            const phone = document.getElementById('profPhone').value.trim();
            const otherPartyName = document.getElementById('profOtherPartyName').value.trim();
            const password = document.getElementById('profPassword').value;

            if (!name) {
                Swal.showValidationMessage('Full name is required');
                return false;
            }
            if (!email) {
                Swal.showValidationMessage('Email is required');
                return false;
            }
            if (!phone) {
                Swal.showValidationMessage('Mobile number is required');
                return false;
            }

            const payload = {
                title,
                customerRole,
                name,
                username: customer.username,
                email,
                phone,
                otherPartyName
            };
            
            if (password && password.trim() !== '') {
                payload.password = password;
            }

            return payload;
        }
    });

    if (formValues) {
        showLoader();
        try {
            // Update customer details in backend DB
            const updatedCustomer = await api.put('/customers/' + sessionUser.id, formValues);
            
            // Sync with local session
            sessionUser.name = updatedCustomer.name;
            sessionUser.email = updatedCustomer.email;
            localStorage.setItem('ethereal_user', JSON.stringify(sessionUser));

            hideLoader();
            await Swal.fire({
                title: 'Success!',
                text: 'Your profile has been updated successfully.',
                icon: 'success',
                confirmButtonColor: '#b7935e'
            });

            // Dynamically refresh the page profile elements
            if (document.getElementById('userName')) {
                document.getElementById('userName').innerText = updatedCustomer.name;
            }
            if (document.getElementById('userInitial')) {
                document.getElementById('userInitial').innerText = updatedCustomer.name.charAt(0);
            }
            if (document.getElementById('sideUserName')) {
                document.getElementById('sideUserName').innerText = updatedCustomer.name;
            }
            if (document.getElementById('sideUserInitial')) {
                document.getElementById('sideUserInitial').innerText = updatedCustomer.name.charAt(0);
            }
        } catch (error) {
            hideLoader();
            console.error("Save profile failed", error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to save profile changes.',
                icon: 'error',
                confirmButtonColor: '#b7935e'
            });
        }
    }
}
