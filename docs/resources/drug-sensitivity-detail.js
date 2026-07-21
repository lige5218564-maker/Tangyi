(function () {
  var units = ['μM', 'nM', 'mg/mL', 'µg/mL'];

  function unitSelect(name) {
    return '<select aria-label="' + name + '单位">' + units.map(function (unit) {
      return '<option value="' + unit + '">' + unit + '</option>';
    }).join('') + '</select>';
  }

  function field(label, inputHtml) {
    return '<div class="ds-field"><label><span class="ds-required">*</span>' + label + '</label>' + inputHtml + '</div>';
  }

  function pairTemplate(index) {
    var remove = index > 1 ? '<button class="ds-circle-btn remove" type="button" aria-label="删除浓度' + index + '和药物抑制率">删除</button>' : '';
    return '<div class="ds-pair" data-index="' + index + '">' +
      field('药物浓度' + index, '<input class="ds-control" type="text" inputmode="decimal" aria-label="药物浓度' + index + '">') +
      field('药物抑制率', '<input class="ds-control" type="text" inputmode="decimal" aria-label="药物浓度' + index + '对应药物抑制率">') +
      '<div class="ds-pair-actions">' +
        '<button class="ds-circle-btn add" type="button" aria-label="添加一组药物浓度和药物抑制率">添加</button>' +
        remove +
      '</div>' +
    '</div>';
  }

  function renumber(container) {
    Array.prototype.forEach.call(container.querySelectorAll('.ds-pair'), function (pair, position) {
      var index = position + 1;
      pair.dataset.index = index;
      var labels = pair.querySelectorAll('label');
      labels[0].innerHTML = '<span class="ds-required">*</span>药物浓度' + index;
      pair.querySelectorAll('input')[0].setAttribute('aria-label', '药物浓度' + index);
      pair.querySelectorAll('input')[1].setAttribute('aria-label', '药物浓度' + index + '对应药物抑制率');

      var actions = pair.querySelector('.ds-pair-actions');
      var remove = actions.querySelector('.remove');
      if (index === 1 && remove) remove.remove();
      if (index > 1 && !remove) {
        actions.insertAdjacentHTML('beforeend', '<button class="ds-circle-btn remove" type="button" aria-label="删除浓度' + index + '和药物抑制率">删除</button>');
      }
    });
  }

  function build() {
    var host = document.getElementById('u15193_state0_content');
    if (!host || document.getElementById('drugSensitivityDetail')) return;

    var panel = document.createElement('section');
    panel.id = 'drugSensitivityDetail';
    panel.innerHTML =
      '<div class="ds-section-title">药敏试验</div>' +
      '<div class="ds-card-row">' +
        '<div class="ds-card">' +
          '<div class="ds-form-grid">' +
            field('药物名称', '<input class="ds-control" type="text" value="">') +
            field('IC50值', '<div class="ds-unit-field"><input type="text" inputmode="decimal" aria-label="IC50值">' + unitSelect('IC50值') + '</div>') +
            '<div></div>' +
            '<div class="ds-pair-list">' + pairTemplate(1) + pairTemplate(2) + '</div>' +
          '</div>' +
        '</div>' +
        '<button class="ds-add-drug" type="button">添加药品</button>' +
      '</div>' +
      '<div class="ds-section-title ds-result-title">实验结果</div>' +
      '<div class="ds-result-wrap">' +
        '<table class="ds-result-table">' +
          '<thead><tr><th>药物名称</th><th>IC50值(μM)</th><th>浓度（μM）</th><th>抑制率（%）</th><th>耐药情况</th><th>耐药基因</th><th>耐药类型</th><th>操作</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>YB00010</td><td>26</td><td>60</td><td>10%</td><td>敏感</td><td>1</td><td>多药耐药</td><td><button class="ds-delete" type="button">删除</button></td></tr>' +
            '<tr><td>YB00010_1</td><td>26</td><td>60</td><td>10%</td><td>敏感</td><td>1</td><td>多药耐药</td><td><button class="ds-delete" type="button">删除</button></td></tr>' +
            '<tr><td>YB00010_2</td><td>26</td><td>60</td><td>10%</td><td>敏感</td><td>2</td><td>多药耐药</td><td><button class="ds-delete" type="button">删除</button></td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +
      '<div class="ds-upload-row"><span>上传图片:</span><button class="ds-upload" type="button"><span class="ds-upload-icon">☁</span>上传图片</button></div>' +
      '<div class="ds-upload-row"><span>上传附件:</span><button class="ds-upload" type="button"><span class="ds-upload-icon">☁</span>上传附件</button></div>' +
      '<div class="ds-bottom-actions"><button class="ds-save" type="button">保存</button><button class="ds-cancel" type="button">取消</button></div>';

    host.appendChild(panel);

    var pairs = panel.querySelector('.ds-pair-list');
    pairs.addEventListener('click', function (event) {
      var add = event.target.closest('.add');
      var remove = event.target.closest('.remove');
      if (add) {
        var count = pairs.querySelectorAll('.ds-pair').length;
        pairs.insertAdjacentHTML('beforeend', pairTemplate(count + 1));
      }
      if (remove) {
        remove.closest('.ds-pair').remove();
        renumber(pairs);
      }
    });

    panel.querySelector('.ds-result-table tbody').addEventListener('click', function (event) {
      if (event.target.classList.contains('ds-delete')) {
        event.target.closest('tr').remove();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
