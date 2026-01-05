// Authentication handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    auth.onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in
            showAdminButton();
        } else {
            // User is signed out
            showLoginForm();
        }
    });

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }

});

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    // Clear previous error
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    // Sign in with email and password
    auth.signInWithEmailAndPassword(email, password)
        .then(function(userCredential) {
            // Login successful
            console.log('Prihlásenie úspešné:', userCredential.user);
            // Auth state change will automatically show admin button
        })
        .catch(function(error) {
            // Handle errors
            let errorMessage = 'Chyba pri prihlásení.';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage = 'Používateľ s týmto emailom neexistuje.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Nesprávne heslo.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Neplatný email.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'Tento účet bol deaktivovaný.';
                    break;
                default:
                    errorMessage = 'Chyba pri prihlásení: ' + error.message;
            }
            
            errorDiv.textContent = errorMessage;
            errorDiv.style.display = 'block';
        });
}

function logout() {
    auth.signOut()
        .then(function() {
            console.log('Odhlásenie úspešné');
            // Auth state change will automatically show login form
        })
        .catch(function(error) {
            console.error('Chyba pri odhlásení:', error);
            alert('Chyba pri odhlásení: ' + error.message);
        });
}

function showAdminButton() {
    document.getElementById('adminButtonContainer').style.display = 'block';
    document.getElementById('loginFormContainer').style.display = 'none';
}

function showLoginForm() {
    document.getElementById('adminButtonContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('loginForm').style.display = 'block';
    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
    // Reset error color
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.style.color = 'red';
    }
}

function handlePasswordReset() {
    const email = document.getElementById('loginEmail').value;
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginError'); // Reuse error div for success message

    // If email field is empty, ask for email
    if (!email) {
        const userEmail = prompt('Zadajte váš email pre reset hesla:');
        if (!userEmail) {
            return;
        }
        
        auth.sendPasswordResetEmail(userEmail)
            .then(function() {
                alert('Email na reset hesla bol odoslaný na adresu: ' + userEmail);
            })
            .catch(function(error) {
                let errorMessage = 'Chyba pri odosielaní emailu.';
                
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Používateľ s týmto emailom neexistuje.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Neplatný email.';
                        break;
                    default:
                        errorMessage = 'Chyba: ' + error.message;
                }
                
                alert(errorMessage);
            });
    } else {
        // Use email from form
        auth.sendPasswordResetEmail(email)
            .then(function() {
                errorDiv.textContent = 'Email na reset hesla bol odoslaný na adresu: ' + email;
                errorDiv.style.color = 'green';
                errorDiv.style.display = 'block';
            })
            .catch(function(error) {
                let errorMessage = 'Chyba pri odosielaní emailu.';
                
                switch(error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'Používateľ s týmto emailom neexistuje.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Neplatný email.';
                        break;
                    default:
                        errorMessage = 'Chyba: ' + error.message;
                }
                
                errorDiv.textContent = errorMessage;
                errorDiv.style.color = 'red';
                errorDiv.style.display = 'block';
            });
    }
}

