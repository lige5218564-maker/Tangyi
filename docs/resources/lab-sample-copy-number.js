(function () {
  var current = decodeURIComponent((window.location.pathname || '').split('/').pop());
  var enabledPages = {
    '处理管理.html': {
      renameDetails: true,
      filter: { left: 655, top: 123, placeholder: '请输入样本复份编号' },
      table: { left: 232, top: 246, width: 1190 },
      samplePattern: /治疗前-whz\d+/,
      makeCopy: function (text, index) { return text + '-F' + String(index + 1).padStart(2, '0'); }
    },
    '模型构建.html': {
      renameDetails: true,
      filter: { left: 837, top: 101, placeholder: '请输入样本复份编号' },
      table: { left: 232, top: 208, width: 1190 },
      samplePattern: /^YB\d+$/,
      makeCopy: function (text, index) { return text + '-F' + String(index + 1).padStart(2, '0'); }
    },
    '培养记录.html': {
      table: { left: 232, top: 246, width: 1190 }
    },
    '传代管理.html': {
      table: { left: 232, top: 246, width: 1190 }
    },
    '传代审核.html': {
      table: { left: 232, top: 246, width: 1190 }
    },
    '冻存管理.html': {
      renameDetails: true,
      filter: { left: 982, top: 141, placeholder: '请输入样本复份编号' },
      table: { left: 232, top: 246, width: 1190 },
      samplePattern: /^YB\d+(?:_\d+)?$/,
      makeCopy: function (text) { return text.indexOf('-F') > -1 ? text : text + '-F01'; }
    },
    '样本复苏.html': {
      renameDetails: true,
      filter: { left: 982, top: 141, placeholder: '请输入样本复份编号' },
      table: { left: 232, top: 246, width: 1190 },
      samplePattern: /^YB\d+(?:_\d+)?$/,
      makeCopy: function (text) { return text.indexOf('-F') > -1 ? text : text + '-F01'; }
    },
    '复苏冻存.html': {
      table: { left: 232, top: 246, width: 1190 }
    },
    '病理鉴定.html': {
      table: { left: 232, top: 246, width: 1190 }
    },
    '药敏实验.html': {
      renameDetails: true,
      filter: { left: 982, top: 141, placeholder: '请输入样本复份编号' },
      table: { left: 232, top: 246, width: 1190 },
      samplePattern: /^YB\d+(?:_\d+)?$/,
      makeCopy: function (text) { return text.indexOf('-F') > -1 ? text : text + '-F01'; }
    }
  };
  var config = enabledPages[current];
  if (!config || window.__labSampleCopyNumberLoaded) return;
  window.__labSampleCopyNumberLoaded = true;

  var style = document.createElement('style');
  style.textContent = [
    '.lab-copy-filter{position:absolute;z-index:80;width:190px;height:32px;box-sizing:border-box;border:1px solid #dcdfe6;border-radius:4px;background:#fff;color:#303133;font:14px "PingFang SC","Microsoft YaHei",sans-serif;padding:0 12px;}',
    '.lab-copy-filter::placeholder{color:#c0c4cc;}',
    '.lab-copy-table-panel{position:absolute;z-index:90;box-sizing:border-box;background:#fff;border-radius:4px;box-shadow:0 0 0 1px rgba(235,238,245,.9);font-family:"PingFang SC","Microsoft YaHei",sans-serif;}',
    '.lab-copy-table-scroll{width:100%;overflow-x:auto;overflow-y:hidden;background:#fff;}',
    '.lab-copy-table-scroll::-webkit-scrollbar{height:10px;}',
    '.lab-copy-table-scroll::-webkit-scrollbar-thumb{background:#b8bec8;border-radius:8px;}',
    '.lab-copy-table{min-width:1680px;width:max-content;border-collapse:separate;border-spacing:0;color:#303133;font-size:14px;}',
    '.lab-copy-table th,.lab-copy-table td{height:46px;box-sizing:border-box;padding:0 18px;border-bottom:1px solid #ebeef5;background:#fff;text-align:left;white-space:nowrap;}',
    '.lab-copy-table th{background:#f5f7fa;font-weight:600;color:#303133;}',
    '.lab-copy-table tbody tr:hover td{background:#f8fbff;}',
    '.lab-copy-table .sticky-id{position:sticky;left:0;z-index:5;min-width:82px;max-width:82px;background:#fff;text-align:center;box-shadow:4px 0 8px rgba(31,35,41,.06);}',
    '.lab-copy-table .sticky-copy{position:sticky;left:0;z-index:4;min-width:160px;color:#315efb;box-shadow:6px 0 10px rgba(31,35,41,.08);}',
    '.lab-copy-table.has-id .sticky-copy{left:82px;}',
    '.lab-copy-table th.sticky-id,.lab-copy-table th.sticky-copy{z-index:6;background:#f5f7fa;color:#303133;}',
    '.lab-copy-table .status-dot{display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:50%;background:#ff9f43;vertical-align:1px;}',
    '.lab-copy-table .action{color:#315efb;margin-right:20px;cursor:pointer;}',
    '.lab-copy-table .danger{color:#f85959;}',
    '.lab-copy-table-panel-note{height:34px;padding:8px 14px 0;color:#909399;font-size:12px;background:#fff;}'
  ].join('');
  document.head.appendChild(style);

  function base() {
    return document.getElementById('base') || document.body;
  }

  function addFilter() {
    if (!config.filter) return;
    if (document.getElementById('labSampleCopyFilter')) return;
    var input = document.createElement('input');
    input.id = 'labSampleCopyFilter';
    input.className = 'lab-copy-filter';
    input.type = 'text';
    input.placeholder = config.filter.placeholder;
    input.style.left = config.filter.left + 'px';
    input.style.top = config.filter.top + 'px';
    base().appendChild(input);
  }

  function textOf(node) {
    return (node.innerText || '').trim().replace(/\s+/g, ' ');
  }

  function isInsideModal(node) {
    return !!node.closest('[data-label="model"]');
  }

  function renameDetailLabels() {
    if (!config.renameDetails) return;
    Array.prototype.forEach.call(document.querySelectorAll('div[id$="_text"]'), function (textNode) {
      var label = textOf(textNode);
      if (label.indexOf('样本编号') === -1 || !isInsideModal(textNode)) return;
      if (textNode.dataset.sampleCopyRenamed === '1') return;
      textNode.innerHTML = textNode.innerHTML.replace(/样本编号/g, '样本复份编号');
      textNode.dataset.sampleCopyRenamed = '1';
    });
  }

  function visibleHost(textNode) {
    var host = textNode.parentElement;
    if (!host) return null;
    var rect = host.getBoundingClientRect();
    var style = window.getComputedStyle(host);
    if (style.display === 'none' || style.visibility === 'hidden' || rect.width < 1 || rect.height < 1) return null;
    return host;
  }

  function rowsForPage() {
    if (current === '处理管理.html') {
      return [
        ['NF012', '343-治疗前-whz01-F01', '343-治疗前-whz01', '本院样本', '肿瘤组织', '1块', 'EDTA', '是', '2028-12-10 8:30', '20', '已审核', '查看|处理样本|删除'],
        ['NF012', '343-治疗前-whz01-F02', '343-治疗前-whz01', '非本院样本', '肿瘤组织', '1块', 'EDTA', '否', '-', '20', '已审核', '查看|处理样本|删除'],
        ['NF012', '343-治疗前-whz01-F03', '343-治疗前-whz01', '本院样本', '肿瘤组织', '1块', 'EDTA', '是', '2028-12-10 8:30', '20', '已审核', '查看|处理样本|删除'],
        ['NF012', '343-治疗前-whz01-F04', '343-治疗前-whz01', '非本院样本', '肿瘤组织', '1块', 'EDTA', '否', '-', '20', '已审核', '查看|处理样本|删除']
      ];
    }
    if (current === '模型构建.html') {
      return [
        ['YB98449-F01', 'YB98449', 'MD0001', 'SYS98449', 'PDO', '肿瘤组织', '2028-12-10 8:30', '已建模', '查看|编辑'],
        ['YB98449-F02', 'YB98449', 'MD0001', 'SYS98449', 'PDO', '肿瘤组织', '2028-12-10 8:30', '已建模', '查看|编辑'],
        ['YB98449-F03', 'YB98449', 'MD0001', 'SYS98449', 'PDO', '肿瘤组织', '2028-12-10 8:30', '已建模', '查看|编辑'],
        ['YB98449-F04', 'YB98449', 'MD0001', 'SYS98449', 'PDO', '肿瘤组织', '2028-12-10 8:30', '已建模', '查看|编辑']
      ];
    }
    if (current === '培养记录.html') {
      return [
        ['YB00010-F01', 'YB00010', 'MD0001', '肿瘤组织', '肿瘤类器官标准培养方案', '3D基质培养', '培养中', '2028-12-10 8:30', '培养|查看'],
        ['YB00010-F02', 'YB00010', 'MD0001', '肿瘤组织', '肿瘤类器官标准培养方案', '3D基质培养', '已完成', '2028-12-11 9:20', '查看'],
        ['YB00010-F03', 'YB00010', 'MD0001', '肿瘤组织', '肿瘤类器官标准培养方案', '悬浮培养', '培养中', '2028-12-12 10:10', '培养|查看'],
        ['YB00010-F04', 'YB00010', 'MD0001', '肿瘤组织', '肿瘤类器官标准培养方案', '3D基质培养', '待培养', '-', '培养|查看']
      ];
    }
    if (current === '传代管理.html') {
      return [
        ['YB00010-F01', 'YB00010', 'MD0001', '肿瘤组织', 'P2', '2028-12-10 8:30', '待传代', '传代|查看'],
        ['YB00010-F02', 'YB00010', 'MD0001', '肿瘤组织', 'P2', '2028-12-10 8:30', '已传代', '查看'],
        ['YB00010-F03', 'YB00010', 'MD0001', '肿瘤组织', 'P3', '2028-12-12 10:10', '待传代', '传代|查看'],
        ['YB00010-F04', 'YB00010', 'MD0001', '肿瘤组织', 'P1', '-', '待传代', '传代|查看']
      ];
    }
    if (current === '传代审核.html') {
      return [
        ['YB00010-F01', 'YB00010', 'MD0001', '肿瘤组织', 'P2', '2028-12-10 8:30', '已传代', '待审核', '查看|审核'],
        ['YB00010-F02', 'YB00010', 'MD0001', '肿瘤组织', 'P2', '2028-12-10 8:30', '已传代', '已通过', '查看'],
        ['YB00010-F03', 'YB00010', 'MD0001', '肿瘤组织', 'P3', '2028-12-12 10:10', '已传代', '待审核', '查看|审核'],
        ['YB00010-F04', 'YB00010', 'MD0001', '肿瘤组织', 'P1', '-', '未传代', '待提交', '查看']
      ];
    }
    if (current === '冻存管理.html' || current === '样本复苏.html') {
      var action = current === '冻存管理.html' ? '冻存|查看' : '复苏|查看';
      return [
        ['YB00010-F01', 'YB00010', 'SYS00001', '肿瘤组织', '是', '液氮罐A / A01 / 01', '2028-12-10 8:30', '王海志', action],
        ['YB00010_1-F01', 'YB00010_1', 'SYS00001', '肿瘤组织', '是', '液氮罐A / A01 / 02', '2028-12-10 8:30', '王海志', action],
        ['YB00010_2-F01', 'YB00010_2', 'SYS00001', '肿瘤组织', '是', '液氮罐A / A01 / 03', '2028-12-10 8:30', '王海志', action],
        ['YB00010_3-F01', 'YB00010_3', 'SYS00001', '肿瘤组织', '否', '-', '-', '王海志', action]
      ];
    }
    if (current === '复苏冻存.html') {
      return [
        ['YB00010-F01', 'YB00010', 'MD0001', '肿瘤组织', '是', '液氮罐A / A01 / 01', '2028-12-10 8:30', '王海志', '冻存|查看'],
        ['YB00010-F02', 'YB00010', 'MD0001', '肿瘤组织', '是', '液氮罐A / A01 / 02', '2028-12-11 9:20', '王海志', '冻存|查看'],
        ['YB00010-F03', 'YB00010', 'MD0001', '肿瘤组织', '否', '-', '-', '王海志', '冻存|查看'],
        ['YB00010-F04', 'YB00010', 'MD0001', '肿瘤组织', '是', '液氮罐A / A01 / 04', '2028-12-12 10:10', '王海志', '查看']
      ];
    }
    if (current === '病理鉴定.html') {
      return [
        ['YB00010-F01', 'YB00010', '肿瘤组织', 'HE染色', '恶性肿瘤', '2028-12-10 8:30', '已完成', '查看'],
        ['YB00010-F02', 'YB00010', '肿瘤组织', '免疫组化', '阳性', '2028-12-11 9:20', '已完成', '查看'],
        ['YB00010-F03', 'YB00010', '肿瘤组织', 'HE染色', '待判读', '-', '待鉴定', '鉴定|查看'],
        ['YB00010-F04', 'YB00010', '肿瘤组织', '免疫组化', '待上传', '-', '待鉴定', '鉴定|查看']
      ];
    }
    return [
      ['YB00010-F01', 'YB00010', 'SYS00001', 'MD0001', '肿瘤组织', '2028-12-10 8:30', '胡华', '已完成', '查看'],
      ['YB00010-F02', 'YB00010', 'SYS00001', 'MD0001', '肿瘤组织', '2028-12-10 8:30', '胡华', '已完成', '查看'],
      ['YB00010-F03', 'YB00010', 'SYS00001', 'MD0001', '肿瘤组织', '2028-12-10 8:30', '胡华', '已完成', '查看'],
      ['YB00010-F04', 'YB00010', 'SYS00001', 'MD0001', '肿瘤组织', '2028-12-10 8:30', '胡华', '已完成', '查看']
    ];
  }

  function columnsForPage() {
    if (current === '处理管理.html') return ['ID', '样本复份编号', '样本编号', '样本来源', '样本类型', '样本规格', '采集管类型', '是否手术样本', '离体时间', '样本数量', '状态', '操作'];
    if (current === '模型构建.html') return ['样本复份编号', '样本编号', '模型编号', '实验室编号', '模型类型', '样本类型', '建模时间', '状态', '操作'];
    if (current === '培养记录.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '培养方案', '培养方法', '培养状态', '培养时间', '操作'];
    if (current === '传代管理.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '传代次数', '上次传代时间', '传代状态', '操作'];
    if (current === '传代审核.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '传代次数', '上次传代时间', '传代状态', '审核状态', '操作'];
    if (current === '冻存管理.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '是否冻存', '冻存位置', '冻存时间', '操作人', '操作'];
    if (current === '样本复苏.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '是否冻存', '冻存位置', '冻存时间', '操作人', '操作'];
    if (current === '复苏冻存.html') return ['样本复份编号', '样本编号', '模型编号', '样本类型', '是否冻存', '冻存位置', '冻存时间', '操作人', '操作'];
    if (current === '病理鉴定.html') return ['样本复份编号', '样本编号', '样本类型', '病理类型', '病理结果', '鉴定时间', '状态', '操作'];
    return ['样本复份编号', '样本编号', '实验室编号', '模型编号', '样本类型', '药敏实验时间', '实验员', '状态', '操作'];
  }

  function formatCell(value, colIndex, isHeader) {
    if (isHeader || colIndex !== columnsForPage().length - 1) return value;
    return value.split('|').map(function (item) {
      var cls = item === '删除' ? 'action danger' : 'action';
      return '<span class="' + cls + '">' + item + '</span>';
    }).join('');
  }

  function renderInteractiveTable() {
    if (document.getElementById('labSampleCopyTablePanel')) return;
    var panel = document.createElement('section');
    panel.id = 'labSampleCopyTablePanel';
    panel.className = 'lab-copy-table-panel';
    panel.style.left = config.table.left + 'px';
    panel.style.top = config.table.top + 'px';
    panel.style.width = 'min(' + config.table.width + 'px, calc(100vw - 272px))';

    var columns = columnsForPage();
    var head = columns.map(function (col, index) {
      var stickyClass = current === '处理管理.html' && index === 0 ? 'sticky-id' : (current === '处理管理.html' && index === 1 ? 'sticky-copy' : (current !== '处理管理.html' && index === 0 ? 'sticky-copy' : ''));
      return '<th class="' + stickyClass + '">' + formatCell(col, index, true) + '</th>';
    }).join('');
    var bodyRows = rowsForPage().map(function (row) {
      return '<tr>' + row.map(function (value, index) {
        var status = columns[index] === '状态' ? '<span class="status-dot"></span>' + value : value;
        var stickyClass = current === '处理管理.html' && index === 0 ? 'sticky-id' : (current === '处理管理.html' && index === 1 ? 'sticky-copy' : (current !== '处理管理.html' && index === 0 ? 'sticky-copy' : ''));
        return '<td class="' + stickyClass + '">' + formatCell(status, index, false) + '</td>';
      }).join('') + '</tr>';
    }).join('');

    panel.innerHTML = '<div class="lab-copy-table-scroll"><table class="lab-copy-table ' + (current === '处理管理.html' ? 'has-id' : '') + '"><thead><tr>' + head + '</tr></thead><tbody>' + bodyRows + '</tbody></table></div><div class="lab-copy-table-panel-note">横向滑动查看更多字段，' + (current === '处理管理.html' ? 'ID 和样本复份编号固定。' : '首列样本复份编号固定。') + '</div>';
    base().appendChild(panel);
  }

  function apply() {
    addFilter();
    renameDetailLabels();
    renderInteractiveTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }

  document.addEventListener('click', function () {
    window.setTimeout(renameDetailLabels, 0);
    window.setTimeout(renameDetailLabels, 120);
    window.setTimeout(renameDetailLabels, 400);
  }, true);

  new MutationObserver(function () {
    window.setTimeout(renameDetailLabels, 0);
  }).observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
})();
