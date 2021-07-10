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
// SUBMIT BUTTON ON UPDATE ACCOUNT SETTINGS FORM
var userUpdateDataForm = document.querySelector('.form-user-data');


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

// EVENT LISTENERS: ONSUBMIT ON UPDATE ME FORM
if (userUpdateDataForm) {
    userUpdateDataForm.addEventListener('submit', e => {
        e.preventDefault();
        console.log('Hereeeeeeeeeeeee');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings(name, email);
    });
}