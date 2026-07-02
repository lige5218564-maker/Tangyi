(function () {
  if (window.__sampleListLoaded) return;
  window.__sampleListLoaded = true;

  var samples = [
    { code: 'SD009-006-血浆-25021656', tube: '88474774', type: '血浆', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', status: '已登记', location: '', auditStatus: '审核通过' },
    { code: 'SD009-006-血清-25021657', tube: '18474774', type: '血清', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', status: '在库', location: '样本库A区-101/1号液氮罐/A区冻存盒001/孔位B11', auditStatus: '审核通过' },
    { code: 'SD009-006-全血-25021658', tube: '58474774', type: '全血', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', status: '已处理', location: '样本库A区-101/1号液氮罐/A区冻存盒001/孔位B12', auditStatus: '审核通过' },
    { code: 'SD009-006-白膜层-25021659', tube: '83474774', type: '白膜层', spec: '10ml', source: '门诊', id: '756773', name: '张晚', material: '项目组', hospital: '南方医院', status: '已出库', location: '样本库B区-102/-80℃冰箱2号/B区冻存盒006/孔位C09', auditStatus: '审核通过' },
    { code: 'SD010-002-组织-25030012', tube: '77240118', type: '肿瘤组织', spec: '5g', source: '住院', id: '820196', name: '李晨', material: '项目组', hospital: '河北医科大学第二医院', status: '在库', location: '样本库B区-102/-80℃冰箱2号/B区冻存盒006/孔位C08', auditStatus: '审核通过' },
    { code: 'SD010-003-血浆-25030013', tube: '77240119', type: '血浆', spec: '10ml', source: '住院', id: '820197', name: '李晨', material: '项目组', hospital: '河北医科大学第二医院', status: '未处理', location: '', auditStatus: '审核通过' },
    { code: 'SD011-001-血清-25030101', tube: '67295814', type: '血清', spec: '5ml', source: '门诊', id: '910234', name: '赵敏', material: '项目组', hospital: '河北省人民医院', status: '在库', location: '样本库A区-101/1号液氮罐/A区冻存盒002/孔位A03', auditStatus: '审核通过' },
    { code: 'SD011-001-全血-25030102', tube: '67295815', type: '全血', spec: '10ml', source: '门诊', id: '910234', name: '赵敏', material: '项目组', hospital: '河北省人民医院', status: '已处理', location: '样本库A区-101/1号液氮罐/A区冻存盒002/孔位A04', auditStatus: '审核通过' },
    { code: 'SD012-004-组织-25030221', tube: '51934027', type: '肿瘤组织', spec: '3g', source: '住院', id: '780442', name: '王磊', material: '项目组', hospital: '石家庄市人民医院', status: '在库', location: '样本库B区-102/-80℃冰箱2号/B区冻存盒007/孔位D02', auditStatus: '审核通过' },
    { code: 'SD012-004-白膜层-25030222', tube: '51934028', type: '白膜层', spec: '2ml', source: '住院', id: '780442', name: '王磊', material: '项目组', hospital: '石家庄市人民医院', status: '已出库', location: '样本库B区-102/-80℃冰箱2号/B区冻存盒007/孔位D03', auditStatus: '审核通过' }
  ];

  function bindEvents() {
    document.getElementById('sampleQuery').addEventListener('click', query);
    document.getElementById('sampleReset').addEventListener('click', reset);
    ['sampleCodeFilter', 'hospitalFilter'].forEach(function (id) {
      document.getElementById(id).addEventListener('keydown', function (event) {
        if (event.key === 'Enter') query();
      });
    });
  }

  function query() {
    var code = document.getElementById('sampleCodeFilter').value.trim();
    var hospital = document.getElementById('hospitalFilter').value.trim();
    var type = document.getElementById('sampleTypeFilter').value;
    var status = document.getElementById('sampleStatusFilter').value;

    var rows = samples.filter(function (sample) {
      var codeMatched = !code || sample.code.indexOf(code) !== -1 || sample.tube.indexOf(code) !== -1;
      var hospitalMatched = !hospital || sample.hospital.indexOf(hospital) !== -1;
      var typeMatched = !type || sample.type === type;
      var statusMatched = !status || sample.status === status;
      return codeMatched && hospitalMatched && typeMatched && statusMatched;
    });
    renderRows(rows);
  }

  function reset() {
    document.getElementById('sampleCodeFilter').value = '';
    document.getElementById('hospitalFilter').value = '';
    document.getElementById('sampleTypeFilter').value = '';
    document.getElementById('sampleStatusFilter').value = '';
    renderRows(samples);
  }

  function statusClass(status) {
    if (status === '已登记') return 'sl-status-registered';
    if (status === '未处理') return 'sl-status-pending';
    if (status === '已处理') return 'sl-status-processed';
    if (status === '在库') return 'sl-status-stock';
    return 'sl-status-out';
  }

  function renderRows(rows) {
    var body = document.getElementById('sampleListRows');
    var count = document.getElementById('sampleCount');
    count.textContent = '共 ' + rows.length + ' 条';

    if (!rows.length) {
      body.innerHTML = '<tr><td class="sl-empty" colspan="12">暂无匹配的样本</td></tr>';
      return;
    }

    body.innerHTML = rows.map(function (sample) {
      var location = sample.location || '未选择';
      var locationClass = sample.location ? '' : ' class="sl-location-empty"';
      return '<tr>' +
        '<td title="' + sample.code + '">' + sample.code + '</td>' +
        '<td>' + sample.tube + '</td>' +
        '<td>' + sample.type + '</td>' +
        '<td>' + sample.spec + '</td>' +
        '<td>' + sample.source + '</td>' +
        '<td>' + sample.id + '</td>' +
        '<td>' + sample.name + '</td>' +
        '<td>' + sample.material + '</td>' +
        '<td title="' + sample.hospital + '">' + sample.hospital + '</td>' +
        '<td><span class="sl-status ' + statusClass(sample.status) + '">' + sample.status + '</span></td>' +
        '<td title="' + location + '"><span' + locationClass + '>' + location + '</span></td>' +
        '<td><span class="sl-action-disabled">查看</span></td>' +
      '</tr>';
    }).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindEvents();
      renderRows(samples);
    });
  } else {
    bindEvents();
    renderRows(samples);
  }
})();
