// Planéta Levoča - Gallery Management Script
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
let currentFilteredPhotos = [];
let currentPhotoIndex = -1;

function getFilteredPhotos() {
    return currentFilter === 'all' 
        ? galleryPhotos 
        : galleryPhotos.filter(p => p.category === currentFilter);
}

function selectFilter(filterValue) {
    currentFilter = filterValue;
    
    // Update active state in UI
    document.querySelectorAll('[data-filter]').forEach(btn => {
        if (btn.getAttribute('data-filter') === filterValue) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    filterGalleryDisplay();
}

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
            selectFilter(this.getAttribute('data-filter'));
        });
    });

    // 4. Setup form submission for adding photo
    const addPhotoForm = document.getElementById('addPhotoForm');
    if (addPhotoForm) {
        addPhotoForm.addEventListener('submit', handleAddPhoto);
    }

    // Update chosen file name text
    const photoFile = document.getElementById('photoFile');
    const fileChosen = document.getElementById('file-chosen');
    if (photoFile && fileChosen) {
        photoFile.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileChosen.textContent = this.files[0].name;
                fileChosen.classList.remove('text-muted');
                fileChosen.classList.add('text-dark', 'fw-bold');
            } else {
                fileChosen.textContent = 'Nie je vybraný žiadny súbor';
                fileChosen.classList.remove('text-dark', 'fw-bold');
                fileChosen.classList.add('text-muted');
            }
        });
    }

    // 5. Setup modal navigation listeners
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showPrevPhoto();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showNextPhoto();
        });
    }

    // Swipe gestures on mobile
    const modalEl = document.getElementById('imageModal');
    if (modalEl) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        modalEl.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        modalEl.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 50;
            const diff = touchEndX - touchStartX;
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    showPrevPhoto();
                } else {
                    showNextPhoto();
                }
            }
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modalEl = document.getElementById('imageModal');
        if (modalEl && modalEl.classList.contains('show')) {
            if (e.key === 'ArrowRight') {
                showNextPhoto();
            } else if (e.key === 'ArrowLeft') {
                showPrevPhoto();
            }
        }
    });

    // 6. Setup edit photo form submission
    const editPhotoForm = document.getElementById('editPhotoForm');
    if (editPhotoForm) {
        editPhotoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const index = parseInt(document.getElementById('editPhotoIndex').value);
            const category = document.getElementById('editPhotoCategory').value;
            const title = document.getElementById('editPhotoTitle').value.trim();
            
            if (index >= 0 && index < galleryPhotos.length) {
                galleryPhotos[index].category = category;
                galleryPhotos[index].title = title;
                
                await savePhotos();
                renderGallery();
                
                // Close modal
                const editModalEl = document.getElementById('editPhotoModal');
                if (editModalEl) {
                    const modal = bootstrap.Modal.getInstance(editModalEl) || bootstrap.Modal.getOrCreateInstance(editModalEl);
                    if (modal) modal.hide();
                }
                
                // Scroll to the updated category and select it
                selectFilter(category);
                const filterContainer = document.getElementById('gallery-filter-container');
                if (filterContainer) {
                    filterContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
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
                    <div class="position-absolute top-0 end-0 m-3 d-flex gap-1" style="z-index: 10;">
                        <button class="btn btn-sm btn-primary" onclick="editPhoto(${index}, event)">
                            <i class="fa fa-pencil-alt me-1"></i>Upraviť
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletePhoto(${index}, event)">
                            <i class="fa fa-trash me-1"></i>Vymazať
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Click to open in modal
        const img = itemCol.querySelector('img');
        img.addEventListener('click', function() {
            const filtered = getFilteredPhotos();
            const filteredIndex = filtered.findIndex(p => p.src === photo.src);
            openPhoto(filteredIndex);
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
window.deletePhoto = async function(index, event) {
    if (event) event.stopPropagation();
    if (confirm('Naozaj chcete vymazať túto fotku z galérie?')) {
        galleryPhotos.splice(index, 1);
        await savePhotos();
        renderGallery();
    }
};

// Handle adding new photo
async function handleAddPhoto(e) {
    e.preventDefault();

    const formEl = e.target;
    const fileChosen = document.getElementById('file-chosen');
    const category = document.getElementById('photoCategory').value;
    const title = document.getElementById('photoTitle').value.trim();
    
    const submitBtn = formEl.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Ukladám...';

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
                
                selectFilter(category);
                const filterContainer = document.getElementById('gallery-filter-container');
                if (filterContainer) {
                    filterContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                
                formEl.reset();
                if (fileChosen) {
                    fileChosen.textContent = 'Nie je vybraný žiadny súbor';
                    fileChosen.classList.remove('text-dark', 'fw-bold');
                    fileChosen.classList.add('text-muted');
                }
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

// Show/hide admin form
function setupAdminForm(user) {
    const formContainer = document.getElementById('adminButtonContainer');
    const loginForm = document.getElementById('loginFormContainer');
    
    if (user) {
        if (formContainer) formContainer.style.display = 'block';
        if (loginForm) loginForm.style.display = 'none';
    } else {
        if (formContainer) formContainer.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
    }
}

// Modal helpers and navigation
function openPhoto(index) {
    currentFilteredPhotos = getFilteredPhotos();
    if (index < 0 || index >= currentFilteredPhotos.length) return;
    currentPhotoIndex = index;
    const photo = currentFilteredPhotos[index];
    
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalLabel');
    if (modalImg) modalImg.src = photo.src;
    if (modalTitle) modalTitle.textContent = photo.title;
}

window.showNextPhoto = function() {
    if (currentFilteredPhotos.length <= 1) return;
    let newIndex = currentPhotoIndex + 1;
    if (newIndex >= currentFilteredPhotos.length) {
        newIndex = 0;
    }
    openPhoto(newIndex);
};

window.showPrevPhoto = function() {
    if (currentFilteredPhotos.length <= 1) return;
    let newIndex = currentPhotoIndex - 1;
    if (newIndex < 0) {
        newIndex = currentFilteredPhotos.length - 1;
    }
    openPhoto(newIndex);
};

window.editPhoto = function(index, event) {
    if (event) event.stopPropagation();
    
    const photo = galleryPhotos[index];
    if (!photo) return;
    
    document.getElementById('editPhotoIndex').value = index;
    document.getElementById('editPhotoCategory').value = photo.category;
    document.getElementById('editPhotoTitle').value = photo.title;
    
    const editModalEl = document.getElementById('editPhotoModal');
    if (editModalEl) {
        const modal = bootstrap.Modal.getInstance(editModalEl) || new bootstrap.Modal(editModalEl);
        modal.show();
    }
};
