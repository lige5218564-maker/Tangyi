(function () {
  if (window.__manualInboundLoaded) return;
  window.__manualInboundLoaded = true;

  var samples = [
    { code: 'SD009-006-血浆-25021656', tube: '88474774', type: '血浆', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', remark: 'T0', location: '' },
    { code: 'SD009-006-血清-25021657', tube: '18474774', type: '血清', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', remark: 'T0', location: '' },
    { code: 'SD009-006-全血-25021658', tube: '58474774', type: '全血', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', remark: 'T0', location: '' },
    { code: 'SD009-006-白膜层-25021659', tube: '83474774', type: '白膜层', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', remark: 'T0', location: '' }
  ];

  var locationTargetIndex = 0;
  var selectedMap = {};
  var currentRows = samples.slice();
  var DOC_KEY = 'organoid-document-records';

  function buildPage() {
    if (document.getElementById('manualInboundPage')) return;
    document.documentElement.classList.add('manual-inbound-lock');

    var page = document.createElement('div');
    page.id = 'manualInboundPage';
    page.className = 'manual-inbound-page';
    page.innerHTML =
      '<div class="mi-topbar">' +
        '<button type="button" class="mi-back" id="miBack">‹ 返回</button>' +
        '<div class="mi-title">样本入库</div>' +
        '<div></div>' +
      '</div>' +
      '<main class="mi-shell">' +
        '<section class="mi-section">' +
          '<div class="mi-section-header">' +
            '<div class="mi-section-title">入库信息</div>' +
            '<div class="mi-help">填写本次入库单据基本信息</div>' +
          '</div>' +
          '<div class="mi-form">' +
            '<label class="mi-field"><span class="mi-label"><b class="mi-required">*</b>申请单号</span><input class="mi-input" id="miApplyNo" placeholder="请输入申请单号" value="SQ-RK-20260701001"/></label>' +
            '<label class="mi-field"><span class="mi-label"><b class="mi-required">*</b>入库人</span><input class="mi-input" id="miOperator" value="MD0001"/></label>' +
            '<label class="mi-field"><span class="mi-label"><b class="mi-required">*</b>实际入库时间</span><input class="mi-input" id="miInboundTime" value="2026-07-01 10:00"/></label>' +
            '<label class="mi-field mi-field-wide"><span class="mi-label">备注</span><input class="mi-input" id="miRemark" placeholder="请输入备注"/></label>' +
          '</div>' +
        '</section>' +
        '<section class="mi-section">' +
          '<div class="mi-section-header">' +
            '<div class="mi-section-title">待入库样本</div>' +
            '<div class="mi-help">先逐条选择位置，再批量勾选确认入库</div>' +
          '</div>' +
          '<div class="mi-table-wrap">' +
            '<div class="mi-table-toolbar">' +
              '<div class="mi-search-group"><input class="mi-search" id="miSearch" placeholder="搜索样本复份编号 / 预置管编号 / 姓名"/><button type="button" class="mi-btn mi-btn-primary" id="miQuery">查询</button></div>' +
              '<div class="mi-selected-tip" id="miSelectedTip"></div>' +
            '</div>' +
            '<table class="mi-table">' +
              '<thead><tr><th style="width:54px;"><input type="checkbox" class="mi-check" id="miCheckAll"/></th><th>样本复份编号</th><th>预置管编号</th><th>样本类型</th><th>规格</th><th>来源类型</th><th>ID</th><th>姓名</th><th>耗材来源</th><th>采样单位</th><th>样本位置</th><th style="width:128px;">操作</th></tr></thead>' +
              '<tbody id="miRows"></tbody>' +
            '</table>' +
          '</div>' +
        '</section>' +
      '</main>' +
      '<div class="mi-footer">' +
        '<button type="button" class="mi-btn mi-btn-ghost" id="miCancel">取消</button>' +
        '<button type="button" class="mi-btn mi-btn-primary" id="miSubmit">确认入库</button>' +
      '</div>' +
      '<div class="mi-toast" id="miToast"></div>';

    document.body.appendChild(page);
    bindEvents();
    renderRows(samples);
  }

  function bindEvents() {
    document.getElementById('miBack').addEventListener('click', function () {
      history.back();
    });

    document.getElementById('miCancel').addEventListener('click', function () {
      showToast('已取消本次入库编辑');
    });

    document.getElementById('miSubmit').addEventListener('click', submitInbound);

    document.getElementById('miSearch').addEventListener('input', function (event) {
      if (!event.target.value.trim()) queryRows();
    });

    document.getElementById('miQuery').addEventListener('click', queryRows);

    document.getElementById('miCheckAll').addEventListener('change', function (event) {
      currentRows.forEach(function (sample) {
        selectedMap[samples.indexOf(sample)] = event.target.checked;
      });
      renderRows(currentRows);
    });

    document.addEventListener('storage-location:selected', function (event) {
      var path = event.detail && event.detail.path ? event.detail.path : '';
      samples[locationTargetIndex].location = path;
      renderRows(currentRows);
    });
  }

  function queryRows() {
    var keyword = document.getElementById('miSearch').value.trim();
    currentRows = samples.filter(function (sample) {
      return !keyword || [sample.code, sample.tube, sample.name, sample.type].some(function (value) {
        return value.indexOf(keyword) !== -1;
      });
    });
    renderRows(currentRows);
  }

  function renderRows(rows) {
    currentRows = rows;
    var tbody = document.getElementById('miRows');
    tbody.innerHTML = '';

    rows.forEach(function (sample) {
      var index = samples.indexOf(sample);
      var locationText = sample.location || '未选择';
      var locationClass = sample.location ? 'mi-location-ready' : 'mi-location-empty';
      var actions = '<button type="button" class="mi-link-btn" data-action="pick" data-index="' + index + '">选择位置</button>';
      if (sample.location) actions += '<button type="button" class="mi-link-btn mi-link-danger" data-action="clear" data-index="' + index + '">清空位置</button>';
      var row = document.createElement('tr');
      row.className = sample.location ? 'is-located' : '';
      row.innerHTML =
        '<td><input type="checkbox" class="mi-check mi-row-check" data-index="' + index + '" ' + (selectedMap[index] ? 'checked' : '') + '/></td>' +
        '<td title="' + sample.code + '">' + sample.code + '</td>' +
        '<td>' + sample.tube + '</td>' +
        '<td>' + sample.type + '</td>' +
        '<td>' + sample.spec + '</td>' +
        '<td>' + sample.source + '</td>' +
        '<td>' + sample.id + '</td>' +
        '<td>' + sample.name + '</td>' +
        '<td>' + sample.material + '</td>' +
        '<td>' + sample.hospital + '</td>' +
        '<td title="' + locationText + '"><span class="' + locationClass + '">' + locationText + '</span></td>' +
        '<td><div class="mi-action-group">' + actions + '</div></td>';

      row.addEventListener('click', function (event) {
        var action = event.target.getAttribute('data-action');
        var check = event.target.classList.contains('mi-row-check');
        if (action === 'pick') {
          event.stopPropagation();
          openLocationPicker(index);
          return;
        }
        if (action === 'clear') {
          event.stopPropagation();
          clearLocation(index);
          return;
        }
        if (check) {
          selectedMap[index] = event.target.checked;
          updateSelectedTip();
          syncCheckAll();
          event.stopPropagation();
          return;
        }
      });

      tbody.appendChild(row);
    });

    syncCheckAll();
    updateSelectedTip();
  }

  function openLocationPicker(index) {
    locationTargetIndex = index;

    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.textContent = '手工挑选';
    trigger.style.display = 'none';
    document.body.appendChild(trigger);
    trigger.click();
    trigger.remove();
  }

  function clearLocation(index) {
    samples[index].location = '';
    renderRows(currentRows);
    showToast('已清空该样本位置');
  }

  function checkedIndexes() {
    return Object.keys(selectedMap).filter(function (key) {
      return selectedMap[key];
    }).map(function (key) {
      return Number(key);
    });
  }

  function updateSelectedTip() {
    var checked = checkedIndexes();
    var ready = samples.filter(function (sample) {
      return !!sample.location;
    });
    var tip = document.getElementById('miSelectedTip');
    if (tip) tip.textContent = '已勾选 ' + checked.length + ' 条，已选位置 ' + ready.length + ' 条';
  }

  function syncCheckAll() {
    var checkAll = document.getElementById('miCheckAll');
    if (!checkAll) return;
    checkAll.checked = currentRows.length > 0 && currentRows.every(function (sample) {
      return !!selectedMap[samples.indexOf(sample)];
    });
  }

  function submitInbound() {
    var applyNo = document.getElementById('miApplyNo').value.trim();
    var operator = document.getElementById('miOperator').value.trim();
    var inboundTime = document.getElementById('miInboundTime').value.trim();
    var remark = document.getElementById('miRemark').value.trim();
    if (!applyNo) {
      showToast('请填写申请单号');
      return;
    }
    if (!operator) {
      showToast('请填写入库人');
      return;
    }
    if (!inboundTime) {
      showToast('请填写实际入库时间');
      return;
    }

    var checked = checkedIndexes();
    if (!checked.length) {
      showToast('请先勾选需要入库的样本');
      return;
    }

    var missing = checked.filter(function (index) {
      return !samples[index].location;
    });
    if (missing.length) {
      showToast('有 ' + missing.length + ' 条已勾选样本未选择位置');
      return;
    }

    saveDocumentRecord({
      applyNo: applyNo,
      docNo: createDocNo('RK', applyNo),
      type: '入库单',
      count: checked.length,
      status: '已入库',
      operator: operator,
      createdAt: inboundTime,
      remark: remark
    });
    showToast('确认入库成功，共 ' + checked.length + ' 条样本');
  }

  function createDocNo(prefix, applyNo) {
    var suffix = applyNo.replace(/[^0-9A-Za-z]/g, '').slice(-10);
    return prefix + '-' + (suffix || Date.now());
  }

  function saveDocumentRecord(record) {
    var records = [];
    try {
      records = JSON.parse(localStorage.getItem(DOC_KEY) || '[]');
    } catch (error) {
      records = [];
    }
    records = records.filter(function (item) {
      return !(item.applyNo === record.applyNo && item.type === record.type);
    });
    records.unshift(record);
    localStorage.setItem(DOC_KEY, JSON.stringify(records));
  }

  function showToast(text) {
    var toast = document.getElementById('miToast');
    toast.textContent = text;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPage);
  } else {
    buildPage();
  }
})();
