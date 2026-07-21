(function () {
  var temporaryStorage = [
    {
      name: '培养箱3号',
      purpose: '暂存',
      levels: {
        '第1层': ['培养箱3号-暂存盒01', '培养箱3号-暂存盒02'],
        '第2层': ['培养箱3号-暂存盒03'],
        '第3层': ['培养箱3号-暂存盒04', '培养箱3号-暂存盒05'],
        '第4层': ['培养箱3号-暂存盒06']
      }
    },
    {
      name: '临时冻存罐A',
      purpose: '暂存',
      levels: {
        '第1层': ['临时冻存盒A01', '临时冻存盒A02'],
        '第2层': ['临时冻存盒A03', '临时冻存盒A04'],
        '第3层': ['临时冻存盒A05']
      }
    }
  ];

  function setLabel(id, text) {
    var target = document.getElementById(id + '_text');
    if (target) {
      target.innerHTML = '<p><span style="color:#F85959;">*</span><span style="color:#606366;">' + text + ':</span></p>';
    }
  }

  function createSelect(hostId, id, placeholder) {
    var host = document.getElementById(hostId + '_state0_content');
    if (!host) return null;
    var select = document.createElement('select');
    select.id = id;
    select.className = 'freezing-location-select';
    select.innerHTML = '<option value="">' + placeholder + '</option>';
    host.appendChild(select);
    return select;
  }

  function fill(select, placeholder, values) {
    select.innerHTML = '<option value="">' + placeholder + '</option>';
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function init() {
    setLabel('u14328', '冻存容器');
    setLabel('u14304', '所在层');
    setLabel('u14316', '盒子名称');

    var container = createSelect('u14329', 'temporaryContainer', '请选择冻存容器');
    var level = createSelect('u14305', 'temporaryLevel', '请先选择冻存容器');
    var box = createSelect('u14317', 'temporaryBox', '请先选择所在层');
    if (!container || !level || !box) return;

    var availableContainers = temporaryStorage.filter(function (item) {
      return item.purpose === '暂存';
    });
    fill(container, '请选择冻存容器', availableContainers.map(function (item) {
      return item.name;
    }));
    level.disabled = true;
    box.disabled = true;

    container.addEventListener('change', function () {
      var selected = availableContainers.find(function (item) {
        return item.name === container.value;
      });
      fill(level, selected ? '请选择所在层' : '请先选择冻存容器', selected ? Object.keys(selected.levels) : []);
      fill(box, '请先选择所在层', []);
      level.disabled = !selected;
      box.disabled = true;
    });

    level.addEventListener('change', function () {
      var selected = availableContainers.find(function (item) {
        return item.name === container.value;
      });
      var boxes = selected && selected.levels[level.value] ? selected.levels[level.value] : [];
      fill(box, level.value ? '请选择盒子名称' : '请先选择所在层', boxes);
      box.disabled = !level.value;
    });
  }

  window.addEventListener('load', init);
})();
