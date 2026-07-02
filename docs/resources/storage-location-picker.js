(function () {
  if (window.__storageLocationPickerLoaded) return;
  window.__storageLocationPickerLoaded = true;

  var rooms = [
    {
      name: '样本库A区-101',
      containers: [
        {
          code: 'CT-LN-001',
          name: '1号液氮罐',
          type: '液氮罐',
          boxes: [
            { code: 'BX-A01-001', name: 'A区冻存盒001', location: '1架 / 1层', rows: 10, cols: 10, used: 84, locked: ['J10'] },
            { code: 'BX-A01-002', name: 'A区冻存盒002', location: '1架 / 2层', rows: 10, cols: 10, used: 100, locked: [] }
          ]
        }
      ]
    },
    {
      name: '样本库B区-102',
      containers: [
        {
          code: 'CT-FR-002',
          name: '-80℃冰箱2号',
          type: '超低温冰箱',
          boxes: [
            { code: 'BX-B02-006', name: 'B区冻存盒006', location: '3层 / 6位', rows: 9, cols: 9, used: 34, locked: ['D4', 'D5'] }
          ]
        }
      ]
    },
    {
      name: '培养室-201',
      containers: [
        {
          code: 'CT-INC-003',
          name: '培养箱3号',
          type: '培养箱',
          boxes: [
            { code: 'BX-P01-001', name: '培养架001', location: '2层 / 1位', rows: 4, cols: 10, used: 18, locked: ['B7'] }
          ]
        }
      ]
    }
  ];

  var state = {
    roomIndex: 0,
    containerIndex: 0,
    boxIndex: 0,
    position: null
  };

  function currentRoom() {
    return rooms[state.roomIndex];
  }

  function currentContainer() {
    return currentRoom().containers[state.containerIndex];
  }

  function currentBox() {
    return currentContainer().boxes[state.boxIndex];
  }

  function labelFor(row, col) {
    return String.fromCharCode(64 + row) + col;
  }

  function buildPositions(box) {
    var cells = [];
    var occupiedLeft = box.used;
    for (var row = 1; row <= box.rows; row += 1) {
      for (var col = 1; col <= box.cols; col += 1) {
        var label = labelFor(row, col);
        var status = 'empty';
        if (occupiedLeft > 0) {
          status = 'used';
          occupiedLeft -= 1;
        }
        if (box.locked.indexOf(label) !== -1) status = 'locked';
        cells.push({ label: label, status: status });
      }
    }
    return cells;
  }

  function buildPicker() {
    if (document.getElementById('storageLocationPicker')) return;

    var picker = document.createElement('div');
    picker.id = 'storageLocationPicker';
    picker.className = 'sl-picker-mask';
    picker.innerHTML =
      '<div class="sl-picker-panel" role="dialog" aria-modal="true" aria-label="选择入库位置">' +
        '<div class="sl-picker-header">' +
          '<div class="sl-picker-title">选择入库位置</div>' +
          '<button type="button" class="sl-picker-close" data-sl-close>×</button>' +
        '</div>' +
        '<div class="sl-picker-body">' +
          '<div class="sl-picker-left">' +
            '<div class="sl-section-title">按房间 / 容器 / 盒子选择</div>' +
            '<div id="slTree"></div>' +
          '</div>' +
          '<div class="sl-picker-right">' +
            '<div class="sl-current">' +
              '<div class="sl-current-main" id="slCurrentTitle"></div>' +
              '<div class="sl-current-sub" id="slCurrentSub"></div>' +
            '</div>' +
            '<div class="sl-box-meta">' +
              '<div class="sl-meta-item"><div class="sl-meta-label">盒子规格</div><div class="sl-meta-value" id="slSpec"></div></div>' +
              '<div class="sl-meta-item"><div class="sl-meta-label">已用/总孔位</div><div class="sl-meta-value" id="slUsed"></div></div>' +
              '<div class="sl-meta-item"><div class="sl-meta-label">当前孔位</div><div class="sl-meta-value" id="slPosition">未选择</div></div>' +
            '</div>' +
            '<div class="sl-section-title">选择空孔位</div>' +
            '<div class="sl-grid" id="slGrid"></div>' +
            '<div class="sl-legend">' +
              '<span><i class="sl-legend-dot empty"></i>空孔位可选</span>' +
              '<span><i class="sl-legend-dot used"></i>已占用不可选</span>' +
              '<span><i class="sl-legend-dot locked"></i>已锁定不可选</span>' +
            '</div>' +
            '<div class="sl-empty-tip" id="slEmptyTip">当前盒子没有可用空孔位，请切换其他盒子。</div>' +
          '</div>' +
        '</div>' +
        '<div class="sl-picker-footer">' +
          '<button type="button" class="sl-btn" data-sl-close>取消</button>' +
          '<button type="button" class="sl-btn sl-btn-primary" id="slConfirm" disabled>确定</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(picker);
    picker.addEventListener('click', function (event) {
      if (event.target === picker || event.target.hasAttribute('data-sl-close')) closePicker();
    });
    document.getElementById('slConfirm').addEventListener('click', confirmLocation);
    renderPicker();
  }

  function renderPicker() {
    renderTree();
    renderSummary();
    renderGrid();
  }

  function renderTree() {
    var tree = document.getElementById('slTree');
    if (!tree) return;
    tree.innerHTML = '';

    rooms.forEach(function (room, roomIndex) {
      var group = document.createElement('div');
      group.className = 'sl-tree-group';
      group.innerHTML = '<div class="sl-tree-room">' + room.name + '</div>';

      room.containers.forEach(function (container, containerIndex) {
        var containerBtn = document.createElement('button');
        containerBtn.type = 'button';
        containerBtn.className = 'sl-tree-container' + (roomIndex === state.roomIndex && containerIndex === state.containerIndex ? ' is-active' : '');
        containerBtn.textContent = container.name + '（' + container.type + '）';
        containerBtn.addEventListener('click', function () {
          state.roomIndex = roomIndex;
          state.containerIndex = containerIndex;
          state.boxIndex = 0;
          state.position = null;
          renderPicker();
        });
        group.appendChild(containerBtn);

        container.boxes.forEach(function (box, boxIndex) {
          var boxBtn = document.createElement('button');
          boxBtn.type = 'button';
          boxBtn.className = 'sl-tree-box' + (roomIndex === state.roomIndex && containerIndex === state.containerIndex && boxIndex === state.boxIndex ? ' is-active' : '');
          boxBtn.textContent = box.name + ' / ' + box.location;
          boxBtn.addEventListener('click', function () {
            state.roomIndex = roomIndex;
            state.containerIndex = containerIndex;
            state.boxIndex = boxIndex;
            state.position = null;
            renderPicker();
          });
          group.appendChild(boxBtn);
        });
      });

      tree.appendChild(group);
    });
  }

  function renderSummary() {
    var room = currentRoom();
    var container = currentContainer();
    var box = currentBox();
    document.getElementById('slCurrentTitle').textContent = room.name + ' / ' + container.name + ' / ' + box.name;
    document.getElementById('slCurrentSub').textContent = '容器编号：' + container.code + '；盒子编号：' + box.code + '；位置：' + box.location;
    document.getElementById('slSpec').textContent = box.rows + ' × ' + box.cols;
    document.getElementById('slUsed').textContent = box.used + ' / ' + (box.rows * box.cols);
    document.getElementById('slPosition').textContent = state.position || '未选择';
    document.getElementById('slConfirm').disabled = !state.position;
  }

  function renderGrid() {
    var box = currentBox();
    var grid = document.getElementById('slGrid');
    var emptyCount = 0;
    grid.style.gridTemplateColumns = 'repeat(' + box.cols + ', minmax(28px, 1fr))';
    grid.innerHTML = '';

    buildPositions(box).forEach(function (cell) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'sl-cell';
      button.textContent = cell.label;
      if (cell.status === 'used') button.classList.add('is-used');
      if (cell.status === 'locked') button.classList.add('is-locked');
      if (cell.label === state.position) button.classList.add('is-selected');
      if (cell.status === 'empty') {
        emptyCount += 1;
        button.addEventListener('click', function () {
          state.position = cell.label;
          renderSummary();
          renderGrid();
        });
      } else {
        button.disabled = true;
      }
      grid.appendChild(button);
    });

    document.getElementById('slEmptyTip').classList.toggle('is-visible', emptyCount === 0);
  }

  function openPicker(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    buildPicker();
    document.getElementById('storageLocationPicker').classList.add('is-open');
    renderPicker();
  }

  function closePicker() {
    var picker = document.getElementById('storageLocationPicker');
    if (picker) picker.classList.remove('is-open');
  }

  function selectedPath() {
    var room = currentRoom();
    var container = currentContainer();
    var box = currentBox();
    return '/' + room.name + '/' + container.name + '/' + box.name + '/孔位' + state.position;
  }

  function confirmLocation() {
    if (!state.position) return;
    updateLocationText(selectedPath());
    closePicker();
    showToast('已选择入库位置：' + selectedPath());
  }

  function updateLocationText(path) {
    var spans = Array.prototype.slice.call(document.querySelectorAll('span'));
    var target = document.getElementById('manualStoragePath') || spans.find(function (span) {
      return span.textContent && span.textContent.indexOf('位置:') === 0;
    });
    if (target) target.textContent = '位置:' + path;
    document.dispatchEvent(new CustomEvent('storage-location:selected', { detail: { path: path } }));
  }

  function showToast(message) {
    var toast = document.getElementById('slToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'slToast';
      toast.className = 'sl-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2200);
  }

  function isPickerTrigger(target) {
    var text = (target.textContent || '').trim();
    return text === '手工挑选';
  }

  document.addEventListener('click', function (event) {
    var node = event.target;
    while (node && node !== document.body) {
      if (node.tagName && isPickerTrigger(node)) {
        openPicker(event);
        return;
      }
      node = node.parentNode;
    }
  }, true);

  document.addEventListener('DOMContentLoaded', buildPicker);
})();
