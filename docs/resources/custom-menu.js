(function() {
  if (window.__prototypeMenuRedesignLoaded) return;
  window.__prototypeMenuRedesignLoaded = true;

  var menu = [
    { label: '首页', href: '首页.html', icon: 'images/首页/u17.svg' },
    {
      label: '容器管理',
      icon: 'images/首页/u51.svg',
      children: [
        { label: '容器管理', href: '容器管理.html' },
        { label: '房间管理', href: '房间管理.html' },
        { label: '盒子管理', href: '盒子管理.html' }
      ]
    },
    {
      label: '样本管理',
      icon: 'images/首页/u56.svg',
      children: [
        { label: '样本列表', href: '样本列表.html' },
        { label: '样本登记', href: '样本登记.html', aliases: ['新增.html'] },
        { label: '样本审核', href: '样本审核.html' },
        { label: '样本入库', href: '样本入库.html', aliases: ['样本入库_子.html'] },
        { label: '样本出库', href: '样本库出.html' },
        { label: '单据管理', href: '单据管理.html' }
      ]
    },
    {
      label: '实验室管理',
      icon: 'images/首页/u67.svg',
      children: [
        { label: '样本处理', href: '处理管理.html' },
        { label: '模型构建', href: '模型构建.html' },
        { label: '培养方案', href: '培养方案.html', aliases: ['培养方案__菌株）.html'] },
        { label: '培养记录', href: '培养记录.html', aliases: ['新增培养.html', '新增培养_1.html', '培养记录__菌株_.html'] },
        { label: '样本传代', href: '传代管理.html', aliases: ['新增传代.html', '新增传代_1.html', '传代管理__菌株_.html'] },
        { label: '传代审核', href: '传代审核.html' },
        { label: '冻存管理', href: '冻存管理.html' },
        { label: '样本复苏', href: '样本复苏.html' },
        { label: '复苏冻存', href: '复苏冻存.html' },
        { label: '病理鉴定', href: '病理鉴定.html' },
        { label: '药敏试验', href: '药敏实验.html' }
      ]
    },
    {
      label: '系统管理',
      icon: 'images/首页/u39.svg',
      children: [
        { label: '菜单管理', href: '菜单管理.html' },
        { label: '用户管理', href: '用户管理.html' },
        { label: '角色管理', href: '角色管理.html' }
      ]
    }
  ];
  var previewVersion = '20260720-copy8';

  function versionedHref(href) {
    if (!href || href.indexOf('?') !== -1) return href;
    return href + '?v=' + previewVersion;
  }

  function currentFileName() {
    var path = decodeURIComponent(window.location.pathname || '');
    var file = path.split('/').pop();
    return file || '首页.html';
  }

  function isCurrent(item, current) {
    if (item.href === current) return true;
    return item.aliases && item.aliases.indexOf(current) !== -1;
  }

  function groupHasCurrent(group, current) {
    return group.children.some(function(item) {
      return isCurrent(item, current);
    });
  }

  function makeIcon(src) {
    var icon = document.createElement('span');
    icon.className = 'prototype-menu-icon';
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = '';
      icon.appendChild(img);
    }
    return icon;
  }

  function makeItem(item, current, nested) {
    var element = document.createElement(item.href ? 'a' : 'div');
    element.className = 'prototype-menu-item' + (nested ? ' prototype-menu-sub-item' : '');
    if (isCurrent(item, current)) element.className += ' is-current';
    if (item.href) {
      element.href = versionedHref(item.href);
    } else {
      element.className += ' is-disabled';
    }
    if (!nested) {
      element.appendChild(makeIcon(item.icon));
    }
    var text = document.createElement('span');
    text.textContent = item.label;
    element.appendChild(text);
    return element;
  }

  function makeGroup(group, current) {
    var wrap = document.createElement('div');
    var isOpen = groupHasCurrent(group, current);
    wrap.className = 'prototype-menu-group' + (isOpen ? ' is-open' : '');

    var title = document.createElement('div');
    title.className = 'prototype-menu-group-title';
    var text = document.createElement('span');
    text.textContent = group.label;
    var arrow = document.createElement('span');
    arrow.className = 'prototype-menu-arrow';
    arrow.textContent = '⌄';
    title.appendChild(makeIcon(group.icon));
    title.appendChild(text);
    title.appendChild(arrow);
    wrap.appendChild(title);

    var sub = document.createElement('div');
    sub.className = 'prototype-menu-sub';
    group.children.forEach(function(item) {
      sub.appendChild(makeItem(item, current, true));
    });
    wrap.appendChild(sub);

    title.addEventListener('click', function() {
      wrap.classList.toggle('is-open');
    });

    return wrap;
  }

  function hideOriginalSidebar() {
    var selectors = [
      '[data-label="left-左侧"]',
      '[data-label="菜单"]'
    ];
    selectors.forEach(function(selector) {
      Array.prototype.forEach.call(document.querySelectorAll(selector), function(node) {
        if (node.closest('.prototype-menu-redesign')) return;
        node.style.setProperty('display', 'none', 'important');
        node.style.setProperty('visibility', 'hidden', 'important');
        node.style.setProperty('pointer-events', 'none', 'important');
      });
    });
  }

  function isVisible(node) {
    var style = window.getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && node.offsetWidth > 0 && node.offsetHeight > 0;
  }

  function getModalNaturalWidth(node) {
    var dataWidth = parseFloat(node.getAttribute('data-width'));
    if (dataWidth) return dataWidth;

    var previousTransform = node.style.transform;
    node.style.transform = 'none';
    var width = node.offsetWidth || node.getBoundingClientRect().width || 1212;
    node.style.transform = previousTransform;
    return width;
  }

  function fitAxureModals() {
    var modals = Array.prototype.slice.call(document.querySelectorAll('[data-label="model"]'));
    var visibleModals = modals.filter(isVisible);
    document.body.classList.toggle('prototype-modal-open', visibleModals.length > 0);

    visibleModals.forEach(function(modal) {
      var naturalWidth = getModalNaturalWidth(modal);
      var sideSafeLeft = 220;
      var horizontalPadding = 20;
      var availableWidth = window.innerWidth - sideSafeLeft - horizontalPadding;
      var scale = Math.min(1, Math.max(0.72, availableWidth / naturalWidth));
      var parentLeft = modal.offsetParent ? modal.offsetParent.getBoundingClientRect().left : 0;
      var localLeft = Math.max(0, sideSafeLeft - parentLeft);

      modal.style.setProperty('left', localLeft + 'px', 'important');

      if (scale < 1) {
        modal.style.setProperty('transform-origin', 'left top', 'important');
        modal.style.setProperty('transform', 'scale(' + scale + ')', 'important');
      } else {
        modal.style.removeProperty('transform-origin');
        modal.style.removeProperty('transform');
      }
    });
  }

  function initDrugSensitivityPage(current) {
    if (current !== '药敏实验.html' || document.querySelector('.drug-sensitivity-redesign')) return;

    for (var index = 15244; index <= 15332; index += 1) {
      var legacyNode = document.getElementById('u' + index);
      if (legacyNode) legacyNode.style.setProperty('display', 'none', 'important');
    }

    var anchor = document.getElementById('u15244');
    var host = anchor && anchor.parentElement;
    if (!host) return;

    var panel = document.createElement('section');
    panel.className = 'drug-sensitivity-redesign';
    panel.innerHTML = [
      '<div class="ds-primary-row">',
        '<label class="ds-field ds-drug"><span><b>*</b> 药物名称</span><input type="text" value="YB0001"></label>',
        '<label class="ds-field ds-value-unit"><span><b>*</b> IC50值</span><span class="ds-control"><input type="text" value="26"><select aria-label="IC50单位"><option>μM</option><option>nM</option><option>mg/mL</option><option>µg/mL</option></select></span></label>',
        '<button class="ds-icon-button ds-add" type="button" title="添加浓度和抑制率" aria-label="添加浓度和抑制率">+</button>',
      '</div>',
      '<div class="ds-pairs"></div>',
      '<div class="ds-secondary-row">',
        '<label class="ds-field"><span><b>*</b> 耐药基因</span><input type="text" value="YB0001"></label>',
        '<label class="ds-field"><span><b>*</b> 耐药类型</span><select><option value="">请选择耐药类型</option><option>单药耐药</option><option>多药耐药</option><option>交叉耐药</option></select></label>',
        '<button class="ds-submit" type="button">添加药品</button>',
      '</div>',
      '<div class="ds-summary-title">实验结果汇总</div>',
      '<div class="ds-table-wrap">',
        '<table><thead><tr><th>药物名称</th><th>IC50值</th><th>浓度及抑制率</th><th>耐药基因</th><th>耐药类型</th><th>操作</th></tr></thead>',
        '<tbody>',
          '<tr><td>YB00010</td><td>26 μM</td><td><span class="ds-result-pair">浓度1：60 μM / 抑制率：10%</span></td><td>1</td><td>多药耐药</td><td><button class="ds-link-delete" type="button">删除</button></td></tr>',
          '<tr><td>YB00010_1</td><td>26 μM</td><td><span class="ds-result-pair">浓度1：60 μM / 抑制率：10%</span><span class="ds-result-pair">浓度2：30 μM / 抑制率：6%</span></td><td>1</td><td>多药耐药</td><td><button class="ds-link-delete" type="button">删除</button></td></tr>',
          '<tr><td>YB00010_2</td><td>26 μM</td><td><span class="ds-result-pair">浓度1：60 μM / 抑制率：10%</span></td><td>2</td><td>多药耐药</td><td><button class="ds-link-delete" type="button">删除</button></td></tr>',
        '</tbody></table>',
      '</div>'
    ].join('');
    host.appendChild(panel);

    var pairs = panel.querySelector('.ds-pairs');
    var addButton = panel.querySelector('.ds-add');
    var shiftedNodes = ['u15221', 'u15222', 'u15229', 'u15230', 'u15333', 'u15334'];

    function syncFollowingContent() {
      var extraRows = Math.max(0, pairs.children.length - 1);
      var offset = extraRows * 48;
      shiftedNodes.forEach(function(id) {
        var node = document.getElementById(id);
        if (node) node.style.transform = 'translateY(' + offset + 'px)';
      });
      var base = document.getElementById('base');
      if (base) base.style.minHeight = (768 + offset) + 'px';
    }

    function renumberPairs() {
      Array.prototype.forEach.call(pairs.children, function(row, pairIndex) {
        var number = pairIndex + 1;
        row.querySelector('.ds-concentration-label').innerHTML = '<b>*</b> 浓度' + number;
        row.querySelector('.ds-inhibition-label').innerHTML = '<b>*</b> 抑制率';
        var remove = row.querySelector('.ds-remove');
        remove.style.visibility = number === 1 ? 'hidden' : 'visible';
        remove.setAttribute('aria-label', '删除浓度' + number + '和抑制率');
        remove.title = '删除浓度' + number + '和抑制率';
      });
      syncFollowingContent();
    }

    function addPair(concentration, inhibition, unit) {
      var row = document.createElement('div');
      row.className = 'ds-pair-row';
      row.innerHTML = [
        '<label class="ds-field ds-value-unit"><span class="ds-concentration-label"></span><span class="ds-control"><input type="text" value="' + (concentration || '') + '" placeholder="请输入浓度"><select aria-label="浓度单位"><option' + (unit === 'μM' ? ' selected' : '') + '>μM</option><option' + (unit === 'nM' ? ' selected' : '') + '>nM</option><option' + (unit === 'mg/mL' ? ' selected' : '') + '>mg/mL</option><option' + (unit === 'µg/mL' ? ' selected' : '') + '>µg/mL</option></select></span></label>',
        '<label class="ds-field ds-inhibition"><span class="ds-inhibition-label"></span><span class="ds-control ds-percent"><input type="text" value="' + (inhibition || '') + '" placeholder="请输入抑制率"><i>%</i></span></label>',
        '<button class="ds-icon-button ds-remove" type="button">−</button>'
      ].join('');
      row.querySelector('.ds-remove').addEventListener('click', function() {
        row.remove();
        renumberPairs();
      });
      pairs.appendChild(row);
      renumberPairs();
    }

    addButton.addEventListener('click', function() {
      addPair('', '', 'μM');
    });
    panel.addEventListener('click', function(event) {
      if (event.target.classList.contains('ds-link-delete')) {
        event.target.closest('tr').remove();
      }
    });
    addPair('60', '10', 'μM');
  }

  function render() {
    hideOriginalSidebar();

    var old = document.querySelector('.prototype-menu-redesign');
    if (old) old.remove();

    var nav = document.createElement('nav');
    nav.className = 'prototype-menu-redesign';

    var org = document.createElement('div');
    org.className = 'prototype-menu-org';
    var orgIcon = document.createElement('div');
    orgIcon.className = 'prototype-menu-org-icon';
    orgIcon.textContent = '医';
    var orgText = document.createElement('div');
    orgText.textContent = '河北医科大';
    org.appendChild(orgIcon);
    org.appendChild(orgText);
    nav.appendChild(org);

    var current = currentFileName();
    menu.forEach(function(entry) {
      nav.appendChild(entry.children ? makeGroup(entry, current) : makeItem(entry, current, false));
    });

    document.body.appendChild(nav);
    hideOriginalSidebar();
    initDrugSensitivityPage(current);
    fitAxureModals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

  window.addEventListener('resize', fitAxureModals);
  document.addEventListener('click', function() {
    window.setTimeout(fitAxureModals, 0);
    window.setTimeout(fitAxureModals, 80);
    window.setTimeout(fitAxureModals, 320);
  }, true);

  var observer = new MutationObserver(function() {
    window.setTimeout(fitAxureModals, 0);
  });
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['style', 'class']
  });
})();
