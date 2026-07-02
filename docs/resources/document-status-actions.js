(function () {
  function setText(id, text) {
    var target = document.querySelector("#" + id + "_text span");
    if (target) target.textContent = text;
  }

  function openAuditModal() {
    var modal = document.querySelector("#u17548");
    if (!modal) return;
    modal.style.display = "";
    modal.style.visibility = "visible";
  }

  function addRejectButton() {
    var content = document.querySelector("#u17548_state0_content");
    if (!content || content.querySelector(".doc-audit-reject-btn")) return;

    var btn = document.createElement("div");
    btn.className = "doc-audit-reject-btn";
    btn.textContent = "撤销";
    btn.title = "审核不通过";
    btn.addEventListener("click", function () {
      var modal = document.querySelector("#u17548");
      if (modal) {
        modal.style.display = "none";
        modal.style.visibility = "hidden";
      }
    });
    content.appendChild(btn);
  }

  function bindAction(id, handler) {
    var el = document.querySelector("#" + id);
    if (!el || el.dataset.docActionBound === "1") return;
    el.dataset.docActionBound = "1";
    el.style.cursor = "pointer";
    el.addEventListener("click", handler);
  }

  function applyStatusActions() {
    setText("u17504", "审核");
    setText("u17505", "打印单据");
    setText("u17506", "查看");

    setText("u17509", "查看");
    setText("u17512", "查看");
    setText("u17515", "查看");

    setText("u17558", "确定");
    addRejectButton();

    bindAction("u17504", openAuditModal);
    bindAction("u17506", openAuditModal);
    bindAction("u17509", openAuditModal);
    bindAction("u17512", openAuditModal);
    bindAction("u17515", openAuditModal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyStatusActions);
  } else {
    applyStatusActions();
  }

  window.addEventListener("load", applyStatusActions);
})();
