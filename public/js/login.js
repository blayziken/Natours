/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';


var loginSubmitButton = document.querySelector('.form--login');
var logOutClick = document.querySelector('.nav__el--logout');


// Design Frontend Logic for 'Alert'
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

//----------------------------------------------------------------------------------------------//

// LOGIN IMPLEMENTATION
const login = async (email, password) => {
  console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      },
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/')
      }, 1500);
    }
    // console.log(res);
  }
  catch (err) {
    showAlert('error', 'Error logging out! Try again.');
    console.log(err.response.data);
    // console.log(err);
  }
}

// LOGOUT IMPLEMENTATION
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout'
    });

    // if ((res.data.status = 'success')) location.reload(true);

    if (res.data.status = 'success') {
      window.setTimeout(() => {
        location.assign('/') //Redirect back to Home Screen after logging out
      }, 1000);
    }
  }

  catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};


// EVENT LISTENERS FOR LOGIN AND LOG OUT

// ONCLICK SUBMIT ON LOGIN FORM
if (loginSubmitButton) {
  loginSubmitButton.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

// TRIGGER IMPLEMENTATION WHEN LOG OUT BUTTON HIS HIT
if (logOutClick) {
  logOutClick.addEventListener('click', () => {
    logout();
  });
}