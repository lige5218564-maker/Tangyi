(function () {
  if (window.__sampleOutboundFixLoaded) return;
  window.__sampleOutboundFixLoaded = true;

  var rows = [
    ['SD009-00625021657', '88474774', '本院样本', '肿瘤组织', '5g', 'EDTA', '是', '2028-12-10 8:30', '2028-12-23 12:10', '样本库A区-101/1号液氮罐/A区冻存盒001/孔位B11'],
    ['SD009-00625021656', '18474774', '非本院样本', '肿瘤组织', '5g', 'EDTA', '否', '-', '2028-12-23 12:10', '样本库A区-101/1号液氮罐/A区冻存盒001/孔位B12'],
    ['SD009-006-5021658', '58474774', '本院样本', '肿瘤组织', '5g', 'EDTA', '是', '2028-12-10 8:30', '2028-12-23 12:10', '样本库B区-102/-80℃冰箱2号/B区冻存盒006/孔位C08'],
    ['SD009-006-25021659', '83474774', '非本院样本', '肿瘤组织', '5g', 'EDTA', '否', '-', '2028-12-23 12:10', '样本库B区-102/-80℃冰箱2号/B区冻存盒006/孔位C09']
  ];
  var DOC_KEY = 'organoid-document-records';

  function buildModal() {
    if (document.getElementById('sampleOutboundModal')) return;
    var modal = document.createElement('div');
    modal.id = 'sampleOutboundModal';
    modal.className = 'so-mask';
    modal.innerHTML =
      '<div class="so-modal" role="dialog" aria-modal="true" aria-label="样本出库">' +
        '<div class="so-header"><div class="so-title">样本出库</div><button type="button" class="so-close" data-so-close>×</button></div>' +
        '<div class="so-body">' +
          '<div class="so-form">' +
            '<label class="so-field"><span class="so-label"><b class="so-required">*</b>申请单号</span><input class="so-input" id="soApplyNo" placeholder="请输入申请单号" value="SQ-CK-20260701001"/></label>' +
            '<label class="so-field"><span class="so-label"><b class="so-required">*</b>样本出库人员</span><select class="so-select"><option>MD0001</option><option>李医生</option><option>王医生</option></select></label>' +
            '<label class="so-field"><span class="so-label"><b class="so-required">*</b>样本出库时间</span><input class="so-input" value="2026-03-23 13:16"/></label>' +
            '<label class="so-field"><span class="so-label">联系电话</span><input class="so-input" value="MD0001"/></label>' +
            '<label class="so-field"><span class="so-label"><b class="so-required">*</b>保留位置</span><span class="so-radio-row"><label><input type="radio" name="keepPosition" checked/> 否</label><label><input type="radio" name="keepPosition"/> 是</label></span></label>' +
            '<label class="so-field" style="grid-column: span 2;"><span class="so-label"><b class="so-required">*</b>备注</span><input class="so-input" value="YB0001"/></label>' +
          '</div>' +
          '<div class="so-table-wrap">' +
            '<table class="so-table">' +
              '<thead><tr><th>样本复份编号</th><th>预置管编号</th><th>样本来源</th><th>样本类型</th><th>样本规格</th><th>采集管类型</th><th>是否手术样本</th><th>离体时间</th><th>入库时间</th><th>样本位置</th></tr></thead>' +
              '<tbody id="sampleOutboundRows"></tbody>' +
            '</table>' +
          '</div>' +
        '</div>' +
        '<div class="so-footer"><button type="button" class="so-btn" data-so-close>取消</button><button type="button" class="so-btn so-btn-primary" id="sampleOutboundConfirm">确认出库</button></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.hasAttribute('data-so-close')) closeModal();
    });
    document.getElementById('sampleOutboundConfirm').addEventListener('click', function () {
      var applyNo = document.getElementById('soApplyNo').value.trim();
      if (!applyNo) {
        showToast('请填写申请单号');
        return;
      }
      saveDocumentRecord({
        applyNo: applyNo,
        docNo: createDocNo('CK', applyNo),
        type: '出库单',
        count: rows.length,
        status: '已出库',
        operator: 'MD0001',
        createdAt: '2026-03-23 13:16',
        remark: 'YB0001'
      });
      closeModal();
      showToast('确认出库成功');
    });
    renderRows();
  }

  function renderRows() {
    var body = document.getElementById('sampleOutboundRows');
    if (!body) return;
    body.innerHTML = rows.map(function (row) {
      return '<tr>' + row.map(function (cell) {
        return '<td title="' + cell + '">' + cell + '</td>';
      }).join('') + '</tr>';
    }).join('');
  }

  function openModal(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
      if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    }
    buildModal();
    hideLegacyModal();
    document.body.classList.add('so-modal-open');
    document.getElementById('sampleOutboundModal').classList.add('is-open');
  }

  function closeModal() {
    var modal = document.getElementById('sampleOutboundModal');
    if (modal) modal.classList.remove('is-open');
    document.body.classList.remove('so-modal-open');
    hideLegacyModal();
  }

  function hideLegacyModal() {
    var legacy = document.getElementById('u17026');
    if (!legacy) return;
    legacy.style.setProperty('display', 'none', 'important');
    legacy.style.setProperty('visibility', 'hidden', 'important');
  }

  function watchLegacyModal() {
    var legacy = document.getElementById('u17026');
    if (!legacy || legacy.__sampleOutboundObserved) return;
    legacy.__sampleOutboundObserved = true;
    new MutationObserver(function () {
      var display = legacy.style.display;
      var visibility = legacy.style.visibility;
      if (display !== 'none' || visibility !== 'hidden') openModal();
      hideLegacyModal();
    }).observe(legacy, { attributes: true, attributeFilter: ['style', 'class'] });
    hideLegacyModal();
  }

  function showToast(text) {
    var toast = document.getElementById('sampleOutboundToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'sampleOutboundToast';
      toast.className = 'so-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 1800);
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

  function isOutboundTrigger(node) {
    var text = (node.textContent || '').trim();
    if (text === '出库' && !node.closest('[data-label*="Menu_item"]')) return true;
    if (text === '样本出库' && node.id === 'u16867') return true;
    if (node.id === 'u16867' || node.id === 'u16868') return true;
    return false;
  }

  function interceptOutbound(event) {
    var node = event.target;
    while (node && node !== document.body) {
      if (isOutboundTrigger(node)) {
        openModal(event);
        return;
      }
      node = node.parentNode;
    }
  }

  ['pointerdown', 'mousedown', 'click'].forEach(function (type) {
    document.addEventListener(type, interceptOutbound, true);
  });

  window.setInterval(function () {
    watchLegacyModal();
    hideLegacyModal();
  }, 300);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildModal();
      watchLegacyModal();
    });
  } else {
    buildModal();
    watchLegacyModal();
  }
})();
