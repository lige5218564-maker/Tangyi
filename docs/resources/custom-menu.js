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
      element.href = item.href;
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
