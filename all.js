const registrationForm = document.querySelector("#registrationForm");
const loginForm = document.querySelector("#loginForm");

const apiURL = `https://todoo.5xcamp.us`;
let token = "";
//Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MTA4Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzA2MTA3MDM5LCJleHAiOjE3MDc0MDMwMzksImp0aSI6IjExZTAzZDdmLTc5NzAtNDJkZS04YjBjLWYxMjEyOGQxOWVhMiJ9.sxzv1zE7oVFEQduFesaKn-IwggOrOSOqwXIHT81c60U

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let name = document.querySelector("#registrationName").value;
  let email = document.querySelector("#registrationEmail").value;
  let password = document.querySelector("#registrationPassword").value;
  signUp(email, name, password);
});

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;
  login(email, password);
});

function signUp(email, nickname, password) {
  axios
    .post(`${apiURL}/users`, {
      user: {
        email,
        nickname,
        password,
      },
    })
    .then((res) => {
      let message = res.data.message;
      const showAlert = () => {
        Swal.fire({
          icon: "success",
          title: "註冊資訊",
          text: message,
        });
      };
      showAlert();
    })
    .catch((error) => {
      let errorMessage = error.response.data.message;
      let errorText = error.response.data.error[0];
      const showAlert = () => {
        Swal.fire({
          icon: "error",
          title: errorMessage,
          text: errorText,
        });
      };
      showAlert();
    });
}

function login(email, password) {
  axios
    .post(`${apiURL}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    })
    .then((res) => {
      axios.defaults.headers.common["Authorization"] =
        res.headers.authorization;
      console.log(res);
      console.log(res.data);
    })
    .catch((error) => console.log(error.response));
}

function getTodos() {
  axios
    .get(`${apiURL}/todos`)
    .then((res) => console.log(res))
    .catch((error) => console.log(error.response));
}

function addTodo(todo) {
  axios
    .post(`${apiURL}/todos`, {
      todo: {
        content: todo,
      },
    })
    .then((res) => console.log(res))
    .catch((error) => console.log(error.response));
}

function updateTodo(todo, todoId) {
  axios
    .put(`${apiURL}/todos/${todoId}`, {
      todo: {
        content: todo,
      },
    })
    .then((res) => console.log(res))
    .catch((error) => console.log(error.response));
}

function deleteTodo(todoId) {
  axios
    .delete(`${apiURL}/todos/${todoId}`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}

function toggleTodo(todoId) {
  axios
    .patch(`${apiURL}/todos/${todoId}/toggle`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
}
