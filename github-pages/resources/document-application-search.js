(function () {
  if (window.__documentApplicationSearchLoaded) return;
  window.__documentApplicationSearchLoaded = true;

  var DOC_KEY = 'organoid-document-records';
  var seedRecords = [
    { applyNo: 'SQ-RK-20260701001', docNo: 'RK-20260701001', type: '入库单', count: 2, status: '已入库', operator: 'MD0001', createdAt: '2026-07-01 10:00', remark: '原型示例' },
    { applyNo: 'SQ-CK-20260701001', docNo: 'CK-20260701001', type: '出库单', count: 4, status: '已出库', operator: 'MD0001', createdAt: '2026-03-23 13:16', remark: 'YB0001' }
  ];

  function buildPage() {
    if (document.getElementById('docApplicationPage')) return;

    var page = document.createElement('div');
    page.id = 'docApplicationPage';
    page.className = 'doc-app-page';
    page.innerHTML =
      '<section class="doc-app-card">' +
        '<div class="doc-app-header">' +
          '<div class="doc-app-title">单据管理</div>' +
          '<div class="doc-app-help">支持按入库/出库申请单号查询</div>' +
        '</div>' +
        '<div class="doc-app-search">' +
          '<input class="doc-app-input" id="docApplySearch" placeholder="请输入申请单号"/>' +
          '<button type="button" class="doc-app-btn doc-app-btn-primary" id="docApplyQuery">查询</button>' +
          '<button type="button" class="doc-app-btn" id="docApplyReset">重置</button>' +
        '</div>' +
      '</section>' +
      '<section class="doc-app-card">' +
        '<div class="doc-app-table-wrap">' +
          '<table class="doc-app-table">' +
            '<thead><tr><th>申请单号</th><th>单据编号</th><th>单据类型</th><th>样本数量</th><th>状态</th><th>操作人</th><th>创建时间</th><th>备注</th></tr></thead>' +
            '<tbody id="docApplyRows"></tbody>' +
          '</table>' +
        '</div>' +
      '</section>';

    document.body.appendChild(page);
    document.getElementById('docApplyQuery').addEventListener('click', queryRecords);
    document.getElementById('docApplyReset').addEventListener('click', function () {
      document.getElementById('docApplySearch').value = '';
      renderRows(readRecords());
    });
    document.getElementById('docApplySearch').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') queryRecords();
    });
    renderRows(readRecords());
  }

  function queryRecords() {
    var keyword = document.getElementById('docApplySearch').value.trim();
    var rows = readRecords().filter(function (record) {
      return !keyword || record.applyNo.indexOf(keyword) !== -1;
    });
    renderRows(rows);
  }

  function readRecords() {
    var stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(DOC_KEY) || '[]');
    } catch (error) {
      stored = [];
    }
    var merged = stored.concat(seedRecords);
    var seen = {};
    return merged.filter(function (record) {
      var key = record.type + '|' + record.applyNo;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    });
  }

  function renderRows(rows) {
    var body = document.getElementById('docApplyRows');
    if (!body) return;
    if (!rows.length) {
      body.innerHTML = '<tr><td class="doc-app-empty" colspan="8">暂无匹配的单据</td></tr>';
      return;
    }
    body.innerHTML = rows.map(function (record) {
      return '<tr>' +
        '<td title="' + record.applyNo + '">' + record.applyNo + '</td>' +
        '<td title="' + record.docNo + '">' + record.docNo + '</td>' +
        '<td>' + record.type + '</td>' +
        '<td>' + record.count + '</td>' +
        '<td><span class="doc-app-status">' + record.status + '</span></td>' +
        '<td>' + (record.operator || '-') + '</td>' +
        '<td>' + (record.createdAt || '-') + '</td>' +
        '<td title="' + (record.remark || '-') + '">' + (record.remark || '-') + '</td>' +
      '</tr>';
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPage);
  } else {
    buildPage();
  }
})();
