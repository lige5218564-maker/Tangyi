(function () {
  if (window.__roleManagementFixLoaded) {
    return;
  }
  window.__roleManagementFixLoaded = true;

  var modal;
  var toast;

  function buildModal() {
    if (modal) {
      return;
    }

    modal = document.createElement('div');
    modal.className = 'role-modal-mask';
    modal.id = 'roleAddModal';
    modal.innerHTML = [
      '<div class="role-modal" role="dialog" aria-modal="true" aria-labelledby="roleAddTitle">',
      '  <div class="role-modal-header">',
      '    <h3 id="roleAddTitle">新增角色</h3>',
      '    <button class="role-modal-close" type="button" aria-label="关闭">×</button>',
      '  </div>',
      '  <div class="role-modal-body">',
      '    <div class="role-form">',
      '      <label><span class="role-required">*</span>名称</label>',
      '      <input class="role-input" id="roleNameInput" placeholder="请输入角色名称" />',
      '      <label>备注</label>',
      '      <textarea class="role-textarea" placeholder="请输入备注"></textarea>',
      '      <label>排序</label>',
      '      <div>',
      '        <input class="role-input" id="roleSortInput" placeholder="请输入排序" />',
      '        <div class="role-help">默认从0开始，数值越大排序越靠前</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <div class="role-modal-footer">',
      '    <button class="role-btn role-cancel" type="button">取消</button>',
      '    <button class="role-btn role-btn-primary role-save" type="button">保存</button>',
      '  </div>',
      '</div>'
    ].join('');

    toast = document.createElement('div');
    toast.className = 'role-toast';
    toast.textContent = '角色已新增';

    document.body.appendChild(modal);
    document.body.appendChild(toast);

    modal.querySelector('.role-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.role-cancel').addEventListener('click', closeModal);
    modal.querySelector('.role-save').addEventListener('click', function () {
      closeModal();
      toast.classList.add('is-open');
      setTimeout(function () {
        toast.classList.remove('is-open');
      }, 1600);
    });
    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        closeModal();
      }
    });
  }

  function openModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) {
        event.stopImmediatePropagation();
      }
    }
    buildModal();
    document.body.classList.add('role-modal-open');
    modal.classList.add('is-open');
    setTimeout(function () {
      var input = document.getElementById('roleNameInput');
      if (input) {
        input.focus();
      }
    }, 0);
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.classList.remove('is-open');
    document.body.classList.remove('role-modal-open');
  }

  function isAddRoleTrigger(node) {
    if (!node || node.closest && node.closest('#roleAddModal')) {
      return false;
    }
    var text = (node.textContent || '').replace(/\s+/g, '');
    return text === '新增角色' || text === '+新增角色';
  }

  function bindTrigger(event) {
    var node = event.target;
    while (node && node !== document.body) {
      if (isAddRoleTrigger(node)) {
        openModal(event);
        return;
      }
      node = node.parentNode;
    }
  }

  ['pointerdown', 'mousedown', 'click'].forEach(function (type) {
    document.addEventListener(type, bindTrigger, true);
  });
})();
