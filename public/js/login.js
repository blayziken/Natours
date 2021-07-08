/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';

// export const login = async (email, password) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: 'http://127.0.0.1:8000/api/v1/users/login',
//       data: {
//         email,
//         password
//       }
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', 'Logged in successfully!');
//       window.setTimeout(() => {
//         location.assign('/');
//       }, 1500);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

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
// ONCLICK SUBMIT ON LOGIN FORM
document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

// LOGOOUT IMPLEMENTATION
const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout'
    });

    if ((res.data.status = 'success')) location.reload(true);

  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
// TRIGGER IMPLEMENTATION WHEN LOG OUT BUTTON HIS HIT
document.querySelector('.nav__el--logout').addEventListener('click', logout);


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
