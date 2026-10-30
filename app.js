const form = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");
const userName = document.querySelector("#user-name");
const loginButton = document.querySelector("#login-button");
const views = document.querySelectorAll("[data-view]");

function showView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("d-none", view.dataset.view !== viewName);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const user = username.value.trim();
  const pass = password.value.trim();

  if (!user || !pass) {
    message.textContent = "Preencha os dois campos.";
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    const foundUser = users.find((item) =>
      item.username.toLowerCase() === user.toLowerCase()
      && item.email.toLowerCase() === pass.toLowerCase()
    );

    if (!foundUser) {
      message.textContent = "Usuário ou senha incorretos.";
      return;
    }

    userName.textContent = foundUser.name;
    showView("gallery");
  } catch (error) {
    console.error(error);
    message.textContent = "Não foi possível acessar a API.";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
  }
});

document.querySelector("#logout-button").addEventListener("click", () => {
  form.reset();
  message.textContent = "";
  showView("login");
  username.focus();
});
