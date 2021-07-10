/* eslint-disable */

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



