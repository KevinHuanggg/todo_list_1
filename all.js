const apiURL = `https://todoo.5xcamp.us`;
let test = "測試git";

function signUp(email, nickname, password) {
  axios
    .post(`${apiURL}/users`, {
      user: {
        email,
        nickname,
        password,
      },
    })
    .then((res) => console.log(res))
    .catch((error) => console.log(error.response));
}
