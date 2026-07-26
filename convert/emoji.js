(() => {
  const DATA = [
    ['😀','笑脸','表情','开心 高兴 smile'],['😃','大笑','表情','开心 笑'],['😄','眯眼笑','表情','开心'],['😁','露齿笑','表情','高兴'],
    ['😂','笑哭','表情','眼泪 开心'],['🤣','笑翻','表情','打滚'],['😊','微笑','表情','开心 害羞'],['🙂','淡淡微笑','表情','友好'],
    ['😉','眨眼','表情','调皮'],['😍','花痴','表情','爱 喜欢'],['🥰','幸福','表情','爱 喜欢'],['😘','飞吻','表情','亲亲 爱'],
    ['😎','墨镜笑脸','表情','酷'],['🤩','星星眼','表情','惊喜 崇拜'],['🥳','派对','表情','庆祝 生日'],['🤔','思考','表情','疑问'],
    ['🤨','挑眉','表情','怀疑'],['😐','无语','表情','平静'],['😴','睡觉','表情','困'],['😭','大哭','表情','伤心 眼泪'],
    ['😡','生气','表情','愤怒'],['😱','惊恐','表情','害怕'],['🤯','震惊','表情','爆炸'],['🥺','恳求','表情','可怜'],
    ['👍','赞','手势','好 同意 yes'],['👎','踩','手势','不好 不同意 no'],['👌','好的','手势','ok'],['✌️','胜利','手势','耶'],
    ['🤞','祝好运','手势','幸运'],['👏','鼓掌','手势','赞扬'],['🙌','庆祝','手势','万岁'],['🙏','合十','手势','谢谢 拜托'],
    ['💪','力量','手势','加油 肌肉'],['👋','挥手','手势','你好 再见'],['🤝','握手','手势','合作'],['🫶','爱心手','手势','爱'],
    ['❤️','红心','符号','爱 喜欢'],['🧡','橙心','符号','爱'],['💛','黄心','符号','爱'],['💚','绿心','符号','爱'],
    ['💙','蓝心','符号','爱'],['💜','紫心','符号','爱'],['💔','心碎','符号','伤心'],['✨','闪亮','符号','星星'],
    ['⭐','星星','符号','收藏'],['🔥','火焰','符号','热门 厉害'],['💯','满分','符号','一百分'],['✅','勾选','符号','正确 完成'],
    ['❌','叉号','符号','错误 取消'],['⚠️','警告','符号','注意 危险'],['❓','问号','符号','问题'],['💡','灯泡','物品','想法 创意'],
    ['🎉','庆祝彩带','活动','派对 恭喜'],['🎂','生日蛋糕','食物','生日'],['🎁','礼物','物品','赠送'],['🏆','奖杯','活动','冠军 胜利'],
    ['🚀','火箭','交通','发射 快速'],['✈️','飞机','交通','旅行'],['🚗','汽车','交通','开车'],['🚲','自行车','交通','骑行'],
    ['☀️','太阳','自然','晴天 天气'],['🌙','月亮','自然','夜晚'],['🌈','彩虹','自然','颜色'],['🌸','樱花','自然','花 春天'],
    ['🌹','玫瑰','自然','花 爱情'],['🍀','四叶草','自然','幸运'],['🌍','地球','自然','世界'],['🐶','狗','动物','小狗 宠物'],
    ['🐱','猫','动物','小猫 宠物'],['🐼','熊猫','动物','国宝'],['🦊','狐狸','动物',''],['🦁','狮子','动物',''],
    ['🍎','苹果','食物','水果'],['🍉','西瓜','食物','水果'],['🍕','披萨','食物','快餐'],['🍔','汉堡','食物','快餐'],
    ['☕','咖啡','食物','饮料'],['🍺','啤酒','食物','饮料 干杯'],['📌','图钉','物品','标记'],['📅','日历','物品','日期'],
    ['📧','邮件','物品','信箱'],['📱','手机','物品','电话'],['💻','电脑','物品','工作 编程'],['🔒','锁','物品','安全'],
  ];
  const grid = document.getElementById('emojiGrid');
  const search = document.getElementById('emojiSearch');
  const count = document.getElementById('emojiCount');
  const tabs = document.getElementById('emojiTabs');
  const categories = ['全部', ...new Set(DATA.map(x => x[2]))];
  let active = '全部';
  const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const codePoints = value => [...value].filter(ch => ch !== '\uFE0F').map(ch => `U+${ch.codePointAt(0).toString(16).toUpperCase()}`).join(' ');

  categories.forEach(category => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = category;
    button.classList.toggle('active', category === active);
    button.addEventListener('click', () => {
      active = category;
      tabs.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === button));
      render();
    });
    tabs.appendChild(button);
  });

  function render() {
    const keyword = search.value.trim().toLowerCase();
    const items = DATA.filter(item =>
      (active === '全部' || item[2] === active) &&
      (!keyword || `${item[0]} ${item[1]} ${item[2]} ${item[3]} ${codePoints(item[0])}`.toLowerCase().includes(keyword))
    );
    grid.innerHTML = items.length ? items.map(item => `
      <button class="emoji-card" type="button" data-emoji="${escapeHtml(item[0])}" title="点击复制 ${escapeHtml(item[0])}">
        <span class="glyph">${escapeHtml(item[0])}</span>
        <span class="emoji-name">${escapeHtml(item[1])}</span>
        <span class="emoji-code">${codePoints(item[0])}</span>
      </button>`).join('') : '<div class="empty-state">没有找到匹配的 Emoji</div>';
    count.textContent = `${items.length} 个结果`;
  }
  grid.addEventListener('click', event => {
    const card = event.target.closest('.emoji-card');
    if (card) window.copyText(card.dataset.emoji, `已复制 ${card.dataset.emoji}`);
  });
  search.addEventListener('input', render);
  render();
  search.focus();
})();
