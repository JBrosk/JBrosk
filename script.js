(function () {
  'use strict';

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });

  // Pen test phase tabs
  var tabs = document.querySelectorAll('#phaseTabs .tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      t.classList.add('active');
      document.getElementById(t.dataset.tab).classList.add('active');
    });
  });

  // Hardening checklist counter
  var boxes = document.querySelectorAll('#checklist input');
  var countEl = document.getElementById('checkCount');
  function updateCount() {
    var n = 0;
    boxes.forEach(function (b) { if (b.checked) n++; });
    countEl.textContent = n;
  }
  boxes.forEach(function (b) { b.addEventListener('change', updateCount); });

  // Password strength checker (runs locally, nothing is sent anywhere)
  var pw = document.getElementById('pw');
  var bar = document.getElementById('meterBar');
  var pwText = document.getElementById('pwText');
  var common = ['password', '123456', 'qwerty', 'admin', 'letmein', 'welcome', 'iloveyou', 'abc123', '111111'];
  pw.addEventListener('input', function () {
    var v = pw.value;
    if (!v) { bar.style.width = '0'; pwText.textContent = 'Start typing to see feedback.'; return; }
    var score = 0, tips = [];
    if (v.length >= 8) score++; else tips.push('use at least 8 characters');
    if (v.length >= 14) score++; else tips.push('aim for 14+ characters (a passphrase works well)');
    if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score++; else tips.push('mix upper and lower case');
    if (/\d/.test(v)) score++; else tips.push('add numbers');
    if (/[^A-Za-z0-9]/.test(v)) score++; else tips.push('add a symbol');
    var lower = v.toLowerCase();
    if (common.some(function (c) { return lower.indexOf(c) !== -1; })) {
      score = Math.min(score, 1);
      tips.unshift('avoid common words like "password" or "123456"');
    }
    if (/(.)\1{2,}/.test(v)) { score = Math.max(0, score - 1); tips.push('avoid repeated characters'); }
    var labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
    var colors = ['#ef4444', '#ef4444', '#f59e0b', '#eab308', '#22d3a6', '#22d3a6'];
    bar.style.width = ((score + 1) / 6 * 100) + '%';
    bar.style.background = colors[score];
    pwText.textContent = labels[score] + (tips.length ? ' - tip: ' + tips[0] + '.' : '. Great job!');
  });

  // Phishing red-flag spotter
  var rules = [
    { re: /\b(urgent|immediately|act now|within 24 hours|final notice|last warning)\b/i, msg: 'Urgency or pressure language.' },
    { re: /\b(verify|confirm|update|validate)\b.{0,40}\b(account|password|bank|identity|details)\b/i, msg: 'Asks you to verify or update account details.' },
    { re: /\b(suspended|locked|disabled|unusual activity|unauthorized)\b/i, msg: 'Threatens account suspension or reports "suspicious activity".' },
    { re: /\b(winner|won|prize|lottery|reward|free gift|claim)\b/i, msg: 'Offers a prize or reward you did not ask for.' },
    { re: /\b(otp|pin|one[- ]time (code|password)|cvv|security code)\b/i, msg: 'Asks for a PIN, OTP, or security code. Legitimate staff never ask for these.' },
    { re: /\b(gift ?card|wire transfer|western union|bitcoin|crypto|send money)\b/i, msg: 'Requests payment by gift card, wire, or crypto.' },
    { re: /https?:\/\/(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly)/i, msg: 'Uses a shortened link that hides the real destination.' },
    { re: /https?:\/\/\d{1,3}(\.\d{1,3}){3}/i, msg: 'Link points to a raw IP address.' },
    { re: /\b(dear (customer|user|client|sir|madam))\b/i, msg: 'Generic greeting instead of your name.' },
    { re: /\b(click (here|the link|below)|open the attachment|download the attached)\b/i, msg: 'Pushes you to click a link or open an attachment.' }
  ];
  document.getElementById('phishBtn').addEventListener('click', function () {
    var text = document.getElementById('phishInput').value;
    var out = document.getElementById('phishOut');
    out.innerHTML = '';
    if (!text.trim()) { out.innerHTML = '<li>Paste a message first.</li>'; return; }
    var hits = rules.filter(function (r) { return r.re.test(text); });
    if (!hits.length) {
      out.innerHTML = '<li>No common red flags found, but stay cautious. Verify the sender through an official channel if the message asks for anything sensitive.</li>';
      return;
    }
    var head = document.createElement('li');
    head.innerHTML = '<strong>' + hits.length + ' red flag' + (hits.length > 1 ? 's' : '') + ' found:</strong>';
    out.appendChild(head);
    hits.forEach(function (h) {
      var li = document.createElement('li');
      li.textContent = '⚠ ' + h.msg;
      out.appendChild(li);
    });
  });

  // Quiz
  var questions = [
    { q: 'You get an SMS saying your mobile money account is locked and asks for your PIN. What do you do?',
      o: ['Reply with the PIN to unlock it', 'Ignore it and contact your provider through its official number', 'Click the link to check'],
      a: 1, e: 'Providers never ask for your PIN. Contact them through an official channel.' },
    { q: 'Which is the strongest password approach?',
      o: ['P@ssw0rd1', 'A long random passphrase stored in a password manager', 'Your birthday'],
      a: 1, e: 'Length and uniqueness matter most. A password manager makes unique passphrases practical.' },
    { q: 'What is the FIRST requirement before a penetration test?',
      o: ['Download tools', 'Written authorization and a defined scope', 'Scan the target quietly'],
      a: 1, e: 'Without written permission, testing is illegal. Scope and rules of engagement come first.' },
    { q: 'Which team primarily detects and responds to attacks?',
      o: ['Red team', 'Blue team', 'Marketing team'],
      a: 1, e: 'The blue team defends: monitoring, detection, response and hardening.' },
    { q: 'The 3-2-1 backup rule means:',
      o: ['3 copies, 2 media types, 1 offsite or offline', '3 passwords, 2 devices, 1 account', '3 antivirus, 2 firewalls, 1 router'],
      a: 0, e: 'Multiple copies on different media with one kept offsite protect against ransomware and hardware failure.' },
    { q: 'Which is the best protection for an email account beyond a password?',
      o: ['A longer username', 'Multi-factor authentication', 'Changing the font'],
      a: 1, e: 'MFA blocks most account takeovers even when a password leaks.' },
    { q: 'Which tool is commonly used for network discovery and port scanning (on authorized systems)?',
      o: ['Nmap', 'Photoshop', 'Excel'],
      a: 0, e: 'Nmap maps hosts and open services. Use it only on networks you are permitted to scan.' }
  ];
  var box = document.getElementById('quizBox');
  var idx = 0, score = 0;
  function render() {
    if (idx >= questions.length) {
      box.innerHTML = '<div class="quiz-q">Your score: ' + score + ' / ' + questions.length + '</div>' +
        '<p class="small">' + (score >= 6 ? 'Excellent. You think like a defender.' : score >= 4 ? 'Good start. Review the sections above and try again.' : 'Keep learning. Read through the sections and retry.') + '</p>' +
        '<button class="btn" id="retry">Try again</button>';
      document.getElementById('retry').addEventListener('click', function () { idx = 0; score = 0; render(); });
      return;
    }
    var item = questions[idx];
    box.innerHTML = '<p class="small">Question ' + (idx + 1) + ' of ' + questions.length + '</p>';
    var q = document.createElement('div');
    q.className = 'quiz-q';
    q.textContent = item.q;
    box.appendChild(q);
    item.o.forEach(function (text, i) {
      var b = document.createElement('button');
      b.className = 'quiz-opt';
      b.textContent = text;
      b.addEventListener('click', function () { answer(i, item); });
      box.appendChild(b);
    });
  }
  function answer(i, item) {
    var btns = box.querySelectorAll('.quiz-opt');
    btns.forEach(function (b, n) {
      b.disabled = true;
      if (n === item.a) b.classList.add('right');
      else if (n === i) b.classList.add('wrong');
    });
    if (i === item.a) score++;
    var exp = document.createElement('div');
    exp.className = 'quiz-exp';
    exp.textContent = (i === item.a ? 'Correct. ' : 'Not quite. ') + item.e;
    box.appendChild(exp);
    var next = document.createElement('button');
    next.className = 'btn';
    next.style.marginTop = '14px';
    next.textContent = idx + 1 < questions.length ? 'Next question' : 'See score';
    next.addEventListener('click', function () { idx++; render(); });
    box.appendChild(next);
  }
  render();
})();
