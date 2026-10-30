const form = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const message = document.querySelector("#message");
const userName = document.querySelector("#user-name");
const loginButton = document.querySelector("#login-button");
const views = document.querySelectorAll("[data-view]");
const photoList = document.querySelector("#photo-list");
const photosStatus = document.querySelector("#photos-status");
const photoTitle = document.querySelector("#photo-title");
const photoImage = document.querySelector("#photo-image");

const PHOTOS_API_URL = "https://jsonplaceholder.typicode.com/photos";
const PHOTOS_LIMIT = 30;

function showView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("d-none", view.dataset.view !== viewName);
  });
}

async function loadPhotos() {
  photosStatus.textContent = "Carregando fotos...";
  photoList.innerHTML = "";

  try {
    const response = await fetch(PHOTOS_API_URL);

    if (!response.ok) {
      throw new Error(`A API respondeu com o status ${response.status}.`);
    }

    const photos = await response.json();
    photos.slice(0, PHOTOS_LIMIT).forEach((photo) => {
      const item = document.createElement("button");
      const thumbnail = document.createElement("img");
      const title = document.createElement("span");

      item.type = "button";
      item.className = "list-group-item list-group-item-action photo-item";
      thumbnail.src = photo.thumbnailUrl;
      thumbnail.alt = "";
      thumbnail.width = 32;
      thumbnail.height = 32;
      title.textContent = photo.title;

      item.append(thumbnail, title);
      item.addEventListener("click", () => {
        photoTitle.textContent = photo.title;
        photoImage.src = photo.url;
        photoImage.alt = photo.title;
        showView("photo-detail");
      });
      photoList.appendChild(item);
    });

    photosStatus.textContent = `${Math.min(photos.length, PHOTOS_LIMIT)} fotos disponíveis.`;
  } catch (error) {
    console.error("Não foi possível carregar as fotos:", error);
    photosStatus.textContent = "Não foi possível carregar as fotos. Tente novamente.";
  }
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
    loadPhotos();
  } catch (error) {
    console.error(error);
    message.textContent = "Não foi possível acessar a API.";
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
  }
});

document.querySelector("#back-button").addEventListener("click", () => {
  showView("gallery");
});

document.querySelector("#logout-button").addEventListener("click", () => {
  form.reset();
  message.textContent = "";
  showView("login");
  username.focus();
});
