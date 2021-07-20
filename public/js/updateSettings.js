// /* eslint-disable */

const updateData = async (form) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: form
    });

    if (res.data.status === 'success') {
      showAlert('success', 'updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

const updatePassword = async (passwordCurrent, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        passwordCurrent,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'updated successfully!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

