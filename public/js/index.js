/* eslint-disable */

// DESIGN FRONTEND LOGIC FOR ALERT !!! 
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};
//------------------------------------------------------------

// SUBMIT BUTTON ON LOGIN FORM
var loginSubmitButton = document.querySelector('.form--login');

// LOG OUT CLICK
var logOutClick = document.querySelector('.nav__el--logout');

// SUBMIT BUTTON ON SIGNUP FORM
var signupSubmitButton = document.querySelector('.form--signup');

// SUBMIT BUTTON ON UPDATE ACCOUNT SETTINGS FORM
var userUpdateDataForm = document.querySelector('.form-user-data');
var userPasswordUpdateForm = document.querySelector('.form-user-password');

// FOR STRIPE
const bookButton = document.getElementById('book-tour');

// EVENT LISTENERS: ONCLICK SUBMIT ON LOGIN FORM
if (loginSubmitButton) {
    loginSubmitButton.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        login(email, password);
    });
}

// EVENT LISTENERS: TRIGGER IMPLEMENTATION WHEN LOG OUT BUTTON HIS HIT
if (logOutClick) {
    logOutClick.addEventListener('click', () => {
        logout();
    });
}

// EVENT LISTENERS: ONCLICK SUBMIT ON SIGNUP FORM
if (signupSubmitButton) {
    signupSubmitButton.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;

        signup(name, email, password, passwordConfirm);
    });
}

// EVENT LISTENERS: ONSUBMIT ON UPDATE ME FORM
if (userUpdateDataForm) {
    userUpdateDataForm.addEventListener('submit', e => {
        e.preventDefault();

        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // console.log(form);

        updateData(form);

        // FOR SOME REASON, THE PHOTO UPLOAD ONLY WORKS WITH FORMDATA()

        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        // const photo = document.getElementById('photo').files[0];
        // // const photoName = photo.name
        // console.log(photo);
        // // console.log(photo.name);
        // updateData(name, email, photo);
    });
}

// EVENT LISTENERS: UPDATE PASSWORD FORM
if (userPasswordUpdateForm) {
    userPasswordUpdateForm.addEventListener('submit', async e => {
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent = 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updatePassword(passwordCurrent, password, passwordConfirm);

        document.querySelector('.btn--save-password').textContent = 'SAVE PASSWORD';

        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}

if (bookButton) {
    bookButton.addEventListener('click', e => {

        e.target.textContent = 'Processing...';

        const tourId = e.target.dataset.tourId; // to get the tour id from the button in the html page
        // Using destructuring:
        // const { tourId } = e.target.dataset;

        bookTour(tourId);

    })
}