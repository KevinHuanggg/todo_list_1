const registrationForm = document.querySelector("#registrationForm");
const registrationArea = document.querySelector(".registrationArea");
const loginArea = document.querySelector(".loginArea");
const cardArea = document.querySelector(".cardArea");
const loginButton = document.querySelector(".loginBtn");
const registerBtn = document.querySelector(".registerBtn");
const passRegisterBtn = document.querySelector(".passRegisterBtn");
const backSignBtn = document.querySelector(".backSignBtn");
const list = document.querySelector(".list");
const btn_add = document.querySelector(".btn_add");
const unCompleted = document.querySelector(".unCompleted");

const apiURL = `https://todoo.5xcamp.us`;
let token = "";
let data;

let state = "login";

passRegisterBtn.addEventListener("click", function (e) {
  e.preventDefault();
  let userName = document.querySelector("#registrationName").value;
  let userEmail = document.querySelector("#registrationEmail").value;
  let userPassword = document.querySelector("#registrationPassword").value;
  signUp(userEmail, userName, userPassword);
});

backSignBtn.addEventListener("click", function (e) {
  e.preventDefault();
  stateChange("login");
});

loginButton.addEventListener("click", function (e) {
  e.preventDefault();
  let userEmail = document.querySelector("#email").value;
  let userPassword = document.querySelector("#password").value;
  login(userEmail, userPassword);
});

registerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  stateChange("sign");
});

btn_add.addEventListener("click", function (e) {
  e.preventDefault();
  let todoInput = document.querySelector(".todoInput");
  addTodo(todoInput.value);
  todoInput.value = "";
});

function stateChange(state) {
  if (state === "sign") {
    registrationArea.classList.remove("none");
    loginArea.classList.add("none");
    cardArea.classList.add("none");
  } else if (state === "login") {
    // Add conditions for other states if needed
    registrationArea.classList.add("none");
    loginArea.classList.remove("none");
    cardArea.classList.add("none");
  } else if (state === "card") {
    registrationArea.classList.add("none");
    loginArea.classList.add("none");
    cardArea.classList.remove("none");
  }
}

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
      document.querySelector("#registrationName").value = "";
      document.querySelector("#registrationEmail").value = "";
      document.querySelector("#registrationPassword").value = "";
      stateChange("login");
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

async function login(email, password) {
  try {
    const res = await axios.post(`${apiURL}/users/sign_in`, {
      user: {
        email: email,
        password: password,
      },
    });
    axios.defaults.headers.common["Authorization"] = res.headers.authorization;
    const showAlert = () => {
      Swal.fire({
        icon: "success",
        title: "登入成功",
        text: `歡迎回來${res.data.nickname}`,
      });
    };
    showAlert();
    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
    data = await getTodos();
    renderTodos(data);
    stateChange("card");
  } catch (error) {
    console.log(error);
    const showAlert = () => {
      Swal.fire({
        icon: "error",
        title: "登入失敗",
        text: "請重新輸入",
      });
    };
    showAlert();
  }
}

async function getTodos() {
  try {
    const response = await axios.get(`${apiURL}/todos`);
    return response.data.todos;
  } catch (error) {
    console.log(error.response);
    throw error;
  }
}

async function addTodo(todo) {
  try {
    const res = await axios.post(`${apiURL}/todos`, {
      todo: {
        content: todo,
      },
    });
    data = await getTodos();
    renderTodos(data);
  } catch (error) {
    console.log(error.response);
    throw error;
  }
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

function renderTodos(todos) {
  let content = ``;
  let unCompletedNum = 0;
  todos.forEach(function (todo) {
    content += `
    <li>
      <label class="checkbox" for="" id=${todo.id}>
        <input type="checkbox" />
        <span>${todo.content}</span>
      </label>
      <a href="#" class="delete"></a>
    </li>
    `;

    if (todo.completed_at === null) {
      unCompletedNum += 1;
    }
  });
  list.innerHTML = content;
  unCompleted.textContent = `${unCompletedNum} 個待完成項目`;
}
