// /* eslint-disable */
// import axios from 'axios';
// import { showAlert } from './alerts';

var userUpdateDataForm = document.querySelector('.form-user-data');

// // Design Frontend Logic for 'Alert'
// const hideAlert = () => {
//   const el = document.querySelector('.alert');
//   if (el) el.parentElement.removeChild(el);
// };

// // type is 'success' or 'error'
// const showAlert = (type, msg) => {
//   hideAlert();
//   const markup = `<div class="alert alert--${type}">${msg}</div>`;
//   document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//   window.setTimeout(hideAlert, 5000);
// };

// type is either 'password' or 'data'
// const updateSettings = async (data, type) => {
//   try {
//     const url =
//       type === 'password'
//         ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
//         : 'http://127.0.0.1:3000/api/v1/users/updateMe';

//     const res = await axios({
//       method: 'PATCH',
//       url,
//       data
//     });

//     if (res.data.status === 'success') {
//       showAlert('success', `${type.toUpperCase()} updated successfully!`);
//     }
//   } catch (err) {
//     showAlert('error', err.response.data.message);
//   }
// };

const updateSettings = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};



if (userUpdateDataForm) {
  userUpdateDataForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Hereeeeeeeeeeeee');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings(name, email);
  });
}
