const registrationForm = document.querySelector("#registrationForm");
const registrationArea = document.querySelector(".registrationArea");
const loginArea = document.querySelector(".loginArea");
const cardArea = document.querySelector(".cardArea");
const loginButton = document.querySelector(".loginBtn");
const registerBtn = document.querySelector(".registerBtn");
const passRegisterBtn = document.querySelector(".passRegisterBtn");
const backSignBtn = document.querySelector(".backSignBtn");
const list_container = document.querySelector(".list_container");
const btn_add = document.querySelector(".btn_add");
const unCompleted = document.querySelector(".unCompleted");
const clearAllCompleted = document.getElementById("clearAllCompleted");

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

//切換done toggle
//編輯 以及 刪除 功能

list_container.addEventListener("click", async function (e) {
  const closestLi = e.target.closest("li");
  let id = closestLi.dataset.id;
  if (e.target.tagName.toLowerCase() === "a") {
    e.preventDefault();
    await deleteTodo(id);
  } else {
    await toggleTodo(id);
  }
});

//清除全部已完成的監聽
clearAllCompleted.addEventListener("click", async function (e) {
  e.preventDefault();
  for (const todo of data) {
    if (todo.completed_at !== null) {
      await deleteTodo(todo.id);
    }
  }
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
    .then(async (res) => {
      data = await getTodos();
      renderTodos(data);
    })
    .catch((err) => console.log(err));
}

function toggleTodo(todoId) {
  axios
    .patch(`${apiURL}/todos/${todoId}/toggle`)
    .then(async (res) => {
      data = await getTodos();
      renderTodos(data);
    })
    .catch((err) => console.log(err));
}

function renderTodos(todos) {
  let content = ``;
  let unCompletedNum = 0;
  todos.forEach(function (todo) {
    content += `
    <li class="list" data-id="${todo.id}">
      <label class="checkbox" for="">
        <input type="checkbox" ${todo.completed_at ? "checked" : ""}>
        <span class="todoContent">${todo.content}</span>
      </label>
      <a href="#" class="delete"></a>
    </li>
    `;

    if (todo.completed_at === null) {
      unCompletedNum += 1;
    }
  });
  list_container.innerHTML = content;
  unCompleted.textContent = `${unCompletedNum} 個待完成項目`;
}

// {id: 'a450eaf7e05cfe877f9b8040fea339c0', content: '加一', completed_at: null}
//"Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2MTUyIiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNzA2NzE1NTM2LCJleHAiOjE3MDgwMTE1MzYsImp0aSI6ImNhYjQ0ZmZhLTg3MzktNGY5Ni1iYTcxLWMxOGVjMDY3NThhMSJ9.66cEzBKz3oJwnLM1KInsO3lbds9acB9gH-s6tL4bW3k";
