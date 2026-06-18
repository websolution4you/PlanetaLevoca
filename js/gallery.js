// Planeta Levoca - Gallery Management Script
const DEFAULT_PHOTOS = [
    { src: 'img/interier.jpg', category: 'interior', title: 'Príjemná atmosféra v interiéri' },
    { src: 'img/jedlo2.jpg', category: 'food', title: 'Kvalitné jedlá z čerstvých surovín' },
    { src: 'img/terasa.jpg', category: 'terrace', title: 'Letná terasa s výhľadom' },
    { src: 'img/event1.jpg', category: 'events', title: 'Organizovanie osláv a podujatí' },
    { src: 'img/speciality.jpg', category: 'food', title: 'Naše kuchárske špeciality' },
    { src: 'img/atmosfera.jpg', category: 'interior', title: 'Jedinečná atmosféra' },
    { src: 'img/levoca.jpg', category: 'levoca', title: 'Historické mesto UNESCO' },
    { src: 'img/jedlo1.jpg', category: 'food', title: 'Denné menu 6,90 €' },
    { src: 'img/catering2.jpg', category: 'events', title: 'Profesionálny catering' },
    { src: 'img/namestie.jpg', category: 'levoca', title: 'Námestie Majstra Pavla' },
    { src: 'img/svadby.jpg', category: 'events', title: 'Nezabudnuteľné svadby' },
    { src: 'img/event2.jpg', category: 'events', title: 'Firemné eventy' }
];

let galleryPhotos = [];
let currentFilter = 'all';

// Initialize Gallery
document.addEventListener('DOMContentLoaded', async function() {
    // 1. Load Photos
    await loadPhotos();
    
    // 2. Auth state change listener
    if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(function(user) {
            renderGallery();
            setupAdminForm(user);
        });
    } else {
        renderGallery();
    }

    // 3. Setup filter button listeners
    document.querySelectorAll('[data-filter]').forEach(button => {
        button.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            
            // Update active state in UI
            document.querySelectorAll('[data-filter]').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            filterGalleryDisplay();
        });
    });

    // 4. Setup form submission for adding photo
    const addPhotoForm = document.getElementById('addPhotoForm');
    if (addPhotoForm) {
        addPhotoForm.addEventListener('submit', handleAddPhoto);
    }
});

// Load photos from Firestore or fallback to localStorage / defaults
async function loadPhotos() {
    if (typeof db !== 'undefined') {
        try {
            const doc = await db.collection('gallery').doc('photos').get();
            if (doc.exists && doc.data() && Array.isArray(doc.data().items)) {
                galleryPhotos = doc.data().items;
                return;
            }
            // Seed database if empty
            await db.collection('gallery').doc('photos').set({ items: DEFAULT_PHOTOS });
            galleryPhotos = [...DEFAULT_PHOTOS];
        } catch (error) {
            console.error('Error loading gallery from Firestore:', error);
            loadFallbackPhotos();
        }
    } else {
        loadFallbackPhotos();
    }
}

function loadFallbackPhotos() {
    const saved = localStorage.getItem('galleryPhotosData');
    if (saved) {
        try {
            galleryPhotos = JSON.parse(saved);
            return;
        } catch (e) {}
    }
    galleryPhotos = [...DEFAULT_PHOTOS];
}

// Save photos to Firestore or fallback
async function savePhotos() {
    if (typeof db !== 'undefined') {
        try {
            await db.collection('gallery').doc('photos').set({ items: galleryPhotos });
        } catch (error) {
            console.error('Error saving gallery to Firestore:', error);
            saveFallbackPhotos();
        }
    } else {
        saveFallbackPhotos();
    }
}

function saveFallbackPhotos() {
    localStorage.setItem('galleryPhotosData', JSON.stringify(galleryPhotos));
}

// Render gallery items dynamically
function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    container.innerHTML = '';
    const isLoggedIn = typeof auth !== 'undefined' && auth.currentUser;

    const categoryNames = {
        'interior': 'Interiér',
        'food': 'Jedlá',
        'terrace': 'Terasa',
        'events': 'Oslavy',
        'levoca': 'Levoča'
    };

    galleryPhotos.forEach((photo, index) => {
        const itemCol = document.createElement('div');
        itemCol.className = 'col-lg-4 col-md-6 gallery-item';
        itemCol.setAttribute('data-category', photo.category);
        
        // Render item HTML
        itemCol.innerHTML = `
            <div class="position-relative overflow-hidden rounded">
                <img class="img-fluid w-100" src="${photo.src}" alt="${photo.title}" style="height: 300px; object-fit: cover; cursor: pointer;">
                <div class="position-absolute top-0 start-0 rounded m-3 py-1 px-2 bg-primary text-white">
                    ${categoryNames[photo.category] || photo.category}
                </div>
                <div class="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75 text-white">
                    <h6 class="mb-0 text-white">${photo.title}</h6>
                </div>
                ${isLoggedIn ? `
                    <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-3" style="z-index: 10;" onclick="deletePhoto(${index})">
                        <i class="fa fa-trash me-1"></i>Vymazať
                    </button>
                ` : ''}
            </div>
        `;

        // Click to open in modal
        const img = itemCol.querySelector('img');
        img.addEventListener('click', function() {
            openModal(photo.src, photo.title);
            // Open modal via bootstrap
            const modalEl = document.getElementById('imageModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modal.show();
            }
        });

        container.appendChild(itemCol);
    });

    // Re-apply filter
    filterGalleryDisplay();
}

// Filter display of items
function filterGalleryDisplay() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        const cat = item.getAttribute('data-category');
        if (currentFilter === 'all' || cat === currentFilter) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 10);
        } else {
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Delete Photo
window.deletePhoto = async function(index) {
    if (confirm('Naozaj chcete vymazať túto fotku z galérie?')) {
        galleryPhotos.splice(index, 1);
        await savePhotos();
        renderGallery();
    }
};

// Toggle Photo Input fields
window.togglePhotoSource = function() {
    const type = document.getElementById('photoSourceType').value;
    const fileContainer = document.getElementById('photoFileInputContainer');
    const urlContainer = document.getElementById('photoUrlInputContainer');

    if (type === 'file') {
        fileContainer.style.display = 'block';
        urlContainer.style.display = 'none';
        document.getElementById('photoFile').setAttribute('required', 'required');
        document.getElementById('photoUrl').removeAttribute('required');
    } else {
        fileContainer.style.display = 'none';
        urlContainer.style.display = 'block';
        document.getElementById('photoUrl').setAttribute('required', 'required');
        document.getElementById('photoFile').removeAttribute('required');
    }
};

// Handle adding new photo
async function handleAddPhoto(e) {
    e.preventDefault();

    const category = document.getElementById('photoCategory').value;
    const title = document.getElementById('photoTitle').value.trim();
    const type = document.getElementById('photoSourceType').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Ukladám...';

    if (type === 'url') {
        const url = document.getElementById('photoUrl').value.trim();
        if (url) {
            galleryPhotos.unshift({ src: url, category, title });
            await savePhotos();
            renderGallery();
            e.target.reset();
            togglePhotoSource();
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    } else {
        const fileInput = document.getElementById('photoFile');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = async function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const max_size = 1000;
                    
                    if (width > height) {
                        if (width > max_size) {
                            height *= max_size / width;
                            width = max_size;
                        }
                    } else {
                        if (height > max_size) {
                            width *= max_size / height;
                            height = max_size;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG with 75% quality to save space
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
                    
                    galleryPhotos.unshift({ src: dataUrl, category, title });
                    await savePhotos();
                    renderGallery();
                    
                    addPhotoForm.reset();
                    togglePhotoSource();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }
}

// Show/hide admin form
function setupAdminForm(user) {
    const formContainer = document.getElementById('adminButtonContainer');
    const loginForm = document.getElementById('loginFormContainer');
    
    if (user) {
        if (formContainer) formContainer.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
        
        // Ensure default file input is configured correctly
        togglePhotoSource();
    } else {
        if (formContainer) formContainer.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    }
}

// Modal helper
function openModal(imageSrc, imageTitle) {
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    if (modalImg) modalImg.src = imageSrc;
    if (modalTitle) modalTitle.textContent = imageTitle;
}
