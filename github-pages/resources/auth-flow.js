(function () {
  var AUTH_KEY = "organoid-prototype-authenticated";
  var LOGIN_PAGE = "登录.html";
  var HOME_PAGE = "首页.html";

  function currentFile() {
    var path = decodeURIComponent(window.location.pathname || "");
    return path.substring(path.lastIndexOf("/") + 1) || "";
  }

  function goTo(page) {
    window.location.href = page;
  }

  function isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === "true";
  }

  function setLoggedIn(value) {
    if (value) {
      localStorage.setItem(AUTH_KEY, "true");
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  }

  function showTip(text) {
    var tip = document.createElement("div");
    tip.className = "proto-login-tip";
    tip.textContent = text;
    document.body.appendChild(tip);
    setTimeout(function () {
      tip.remove();
    }, 1600);
  }

  function bindLoginPage() {
    var password = document.getElementById("u595_input");
    var code = document.getElementById("u602_input");
    var loginButton = document.getElementById("u596");

    if (password) {
      password.type = "password";
      password.placeholder = password.placeholder || "请输入密码";
    }
    if (code) {
      code.placeholder = code.placeholder || "请输入验证码";
    }

    function login() {
      setLoggedIn(true);
      goTo(HOME_PAGE);
    }

    if (loginButton) {
      loginButton.addEventListener("click", login);
    }

    Array.prototype.forEach.call(document.querySelectorAll("input"), function (input) {
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          login();
        }
      });
    });
  }

  function bindLogoutMenu() {
    if (document.querySelector(".proto-user-trigger")) {
      return;
    }

    var trigger = document.createElement("div");
    trigger.className = "proto-user-trigger";
    trigger.title = "用户菜单";

    var menu = document.createElement("div");
    menu.className = "proto-user-menu";
    menu.innerHTML = '<div class="proto-user-menu__item" data-action="logout">退出登录</div>';

    document.body.appendChild(trigger);
    document.body.appendChild(menu);

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      menu.classList.toggle("is-open");
    });

    menu.addEventListener("click", function (event) {
      var target = event.target.closest("[data-action='logout']");
      if (!target) {
        return;
      }
      event.stopPropagation();
      logout();
    });

    document.addEventListener("click", function () {
      menu.classList.remove("is-open");
    });

    document.addEventListener("click", function (event) {
      var text = event.target && event.target.textContent ? event.target.textContent.trim() : "";
      if (text === "退出登录") {
        logout();
      }
    });
  }

  function logout() {
    setLoggedIn(false);
    showTip("已退出登录");
    setTimeout(function () {
      goTo(LOGIN_PAGE);
    }, 300);
  }

  function init() {
    var file = currentFile();
    var isLoginPage = file === LOGIN_PAGE;

    if (!isLoginPage && !isLoggedIn()) {
      goTo(LOGIN_PAGE);
      return;
    }

    if (isLoginPage) {
      bindLoginPage();
      return;
    }

    bindLogoutMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
