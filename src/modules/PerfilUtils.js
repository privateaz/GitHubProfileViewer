import axios from "axios";

export default class PerfilUtils {
  constructor() {
    this.inputName = document.getElementById("username");
    this.searchBtn = document.getElementById("searchBtn");
    this.resultDiv = document.getElementById("result");
    this.avatarImg = document.getElementById("avatarImg");

    this.searchBtn.addEventListener("click", this.getInfoUser.bind(this));
  }

  getInfoUser() {
    const username = this.inputName.value.trim();
    if (username === "") {
      this.createErrorMessage("Please enter a username");
      return;
    }

    this.fetchUserInfo(username);
  }

  fetchUserInfo(username) {
    axios
      .get(`https://api.github.com/users/${username}`)
      .then((response) => {
        const user = response.data;
        this.processUserInfo(user);
      })
      .catch((error) => {
        this.handleAPIError(error);
      });
  }

  processUserInfo(user) {
    const { login, description, public_repos, avatar_url, followers } = user;
    this.showInfo(login, description, public_repos, avatar_url, followers);
  }

  handleAPIError(error) {
    if (error.response) {
      if (error.response.status === 404) {
        this.createErrorMessage("User not found");
      } else if (error.response.status === 403) {
        this.createErrorMessage("API rate limit exceeded");
      } else {
        this.createErrorMessage("An error occurred");
      }
    } else {
      this.createErrorMessage("Network error");
    }
  }

  showInfo(username, description, publicRepos, avatarUrl, followersQuantity) {
    this.resultDiv.innerHTML = `
            <img src="${avatarUrl}" alt="Avatar Image">
            <p>Username: ${username}</p>
            ${description ? `<p>Description: ${description}</p>` : ""}
            <p>${followersQuantity} Followers</p>
            <p>${publicRepos} Public Repositories</p>
        `;
  }

  createErrorMessage(message) {
    this.resultDiv.innerHTML = `
      <p class="user-info error404">ERROR</p>
      <p class="user-info errorMessage">${message}</p>
    `;
  }
}
