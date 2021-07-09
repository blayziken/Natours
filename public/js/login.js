/* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';


// document.querySelector('.nav__el--cta').addEventListener("click", e => {
//   e.preventDefault();
//   console.log('Here!!!!!!!!!')
// });





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

// ONCLICK SUBMIT ON LOGIN FORM
document.querySelector('.form').addEventListener('submit', e => {
  console.log('form form');
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

// LOGOUT IMPLEMENTATION
const logout = async () => {
  console.log('-111111111111111111111111111111111111')

  try {
    console.log('2222222222222222222222222222222')

    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout'
    });

    if ((res.data.status = 'success')) location.reload(true);

  } catch (err) {
    console.log('-----------------------------------------')
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};

document.querySelector('.nav__el--logout').addEventListener('click', () => {
  console.log('BBBBBBBBBBBBBBBB');
  logout();
});



// document.querySelector('.nav__el--logout').addEventListener('click', () => {

//   console.log('AAAA');
// });



// document.querySelector('.nav__el').addEventListener("click", function (e) {
//   e.preventDefault();

//   alert("Hello World");
//   console.log('AAAA');
// });


// document.querySelector('.nav__el.nav__el--logout').addEventListener('click', () => {

//   console.log('FULLLLLLLLLLLLLLLLLLL');
// });



// document.querySelector('.nav__user-img').addEventListener('click', () => {

//   console.log('IMAGE!!!!!!!');
// });



// document.querySelector('.nav__el--cta').addEventListener('click', () => {

//   console.log('NO USER!!!!!!!!!!!!!');
// });

// document.querySelector('.header__logo').addEventListener('click', () => {

//   console.log('LOGO................');
// });



// TRIGGER IMPLEMENTATION WHEN LOG OUT BUTTON HIS HIT
// const logOutBtn = document.querySelector('.nav__el--logout');

// if (logOutBtn) logOutBtn.addEventListener('click', logout);


// document.querySelector('.nav__user-img').addEventListener('click', () => {
//   console.log('AAAAAAAAAAAAAAAA');
// });

// document.querySelector('.nav__el').addEventListener('click', () => {
//   console.log('CCCCCCCCCCCCCCC');

// });





// document.querySelector('.nav__el').addEventListener('click', function () {
//   console.log('DDDDDDDDDDDDDD');
// });
// a.nav__el.nav__el--logout Log out


// document.addEventListener('DOMContentLoaded', function () {
// document.querySelector('.nav__el--logout').addEventListener("click", logout);



document.querySelector('.nav__el').addEventListener('click', function () {
  console.log('DDDDDDDDDDDDDD');
});
