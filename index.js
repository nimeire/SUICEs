/*
    index.js
    Cria uma "aba de login" (painel deslizante) e injeta no DOM.
    Salve este arquivo e inclua em sua página HTML.
*/
document.getElementById("login-link").addEventListener("click", function(event) {
  event.preventDefault(); // impede abrir login.html
  window.open("cadastro.html", "_blank"); // abre cadastro.html em nova guia
});

(function () {
    // CSS do componente
    const css = `
    .login-tab-toggle {
        position: fixed;
        right: 16px;
        bottom: 16px;
        background: #2563eb;
        color: #fff;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(37,99,235,0.25);
        font-weight: 600;
        z-index: 9999;
    }
    .login-panel {
        position: fixed;
        right: 16px;
        bottom: 72px;
        width: 320px;
        max-width: calc(100% - 32px);
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(2,6,23,0.2);
        transform: translateY(12px);
        opacity: 0;
        transition: transform 240ms ease, opacity 240ms ease;
        z-index: 9999;
        overflow: hidden;
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    .login-panel.open {
        transform: translateY(0);
        opacity: 1;
    }
    .login-panel header {
        background: linear-gradient(90deg,#2563eb,#3b82f6);
        color: #fff;
        padding: 14px;
        font-weight: 700;
    }
    .login-panel .content {
        padding: 14px;
    }
    .login-panel label {
        display:block;
        margin-top:8px;
        font-size:12px;
        color:#374151;
    }
    .login-panel input[type="email"],
    .login-panel input[type="password"] {
        width:100%;
        padding:8px 10px;
        margin-top:6px;
        border:1px solid #e5e7eb;
        border-radius:6px;
        box-sizing:border-box;
    }
    .login-panel .row {
        display:flex;
        align-items:center;
        justify-content:space-between;
        margin-top:12px;
    }
    .login-panel .actions {
        display:flex;
        gap:8px;
        margin-top:12px;
    }
    .login-panel button.primary {
        background:#2563eb;
        color:#fff;
        border:0;
        padding:8px 12px;
        border-radius:8px;
        cursor:pointer;
        flex:1;
    }
    .login-panel button.ghost {
        background:transparent;
        color:#374151;
        border:1px solid #e5e7eb;
        padding:8px 12px;
        border-radius:8px;
        cursor:pointer;
        flex:1;
    }
    .login-panel .error {
        margin-top:10px;
        color:#b91c1c;
        font-size:13px;
    }
    .login-panel .success {
        margin-top:10px;
        color:#065f46;
        font-size:13px;
    }
    .login-panel .toggle-pass {
        background:transparent;
        border:0;
        color:#2563eb;
        cursor:pointer;
        font-size:12px;
        margin-left:8px;
    }
    .login-panel .small {
        font-size:12px;
        color:#6b7280;
    }
    `;

    // Injeta estilo
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Marcações
    const toggle = document.createElement('button');
    toggle.className = 'login-tab-toggle';
    toggle.type = 'button';
    toggle.textContent = 'Entrar';

    const panel = document.createElement('aside');
    panel.className = 'login-panel';
    panel.innerHTML = `
        <header>Login</header>
        <div class="content">
            <form id="loginForm" novalidate>
                <label for="email">Email</label>
                <input id="email" name="email" type="email" placeholder="seu@exemplo.com" autocomplete="username" required>

                <label for="password">Senha</label>
                <div style="display:flex;align-items:center;">
                    <input id="password" name="password" type="password" placeholder="*******" autocomplete="current-password" required style="flex:1">
                    <button type="button" class="toggle-pass" aria-label="mostrar senha">Mostrar</button>
                </div>

                <div class="row">
                    <label class="small"><input id="remember" name="remember" type="checkbox"> Lembrar-me</label>
                    <a href="#" id="forgot" class="small">Esqueci a senha</a>
                </div>

                <div class="actions">
                    <button type="submit" class="primary">Entrar</button>
                    <button type="button" class="ghost" id="registerBtn">Criar conta</button>
                </div>

                <div id="msg" aria-live="polite"></div>
            </form>
        </div>
    `;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    // Estado e utilitários
    const openPanel = () => panel.classList.add('open');
    const closePanel = () => panel.classList.remove('open');
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) openPanel(); else closePanel();
    });

    // Fecha painel ao clicar fora
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            isOpen = false;
            closePanel();           
        }
    });

    // Toggle mostrar senha
    const passInput = panel.querySelector('#password');
    const passToggle = panel.querySelector('.toggle-pass');
    passToggle.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        passToggle.textContent = isPass ? 'Ocultar' : 'Mostrar';
    });

    // Mensagens
    const msgEl = panel.querySelector('#msg');
    function showError(text) {
        msgEl.innerHTML = `<div class="error">${text}</div>`;
    }
    function showSuccess(text) {
        msgEl.innerHTML = `<div class="success">${text}</div>`;
    }
    function clearMsg() {
        msgEl.innerHTML = '';
    }



    
    // Validação simples
    function validateEmail(email) {
        // regex simples
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Submissão (simula autenticação)
    const form = panel.querySelector('#loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearMsg();

        const email = form.email.value.trim();
        const password = form.password.value;

        if (!validateEmail(email)) {
            showError('Insira um email válido.');
            return;
        }
        if (password.length < 6) {
            showError('A senha deve ter ao menos 6 caracteres.');
            return;
        }

        // Feedback enquanto "processa"
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';

        // Simula chamada assíncrona (substitua por fetch real)
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Entrar';

            // Exemplo de autenticação fictícia:
            if (email === 'teste@exemplo.com' && password === 'senha123') {
                showSuccess('Login realizado com sucesso.');
                // Executar callback global opcional
                if (typeof window.onLogin === 'function') {
                    try { window.onLogin({ email, remember: form.remember.checked }); }
                    catch (err) { console.error(err); }
                }
                // Fecha painel depois de 1s
                setTimeout(() => { isOpen = false; closePanel(); }, 900);
            } else {
                showError('Email ou senha incorretos.');
            }
        }, 900);
    });

    // Botão criar conta (exemplo)
    panel.querySelector('#registerBtn').addEventListener('click', () => {
        clearMsg();
        showSuccess('Redirecionando para criação de conta...');
        // Aqui você pode abrir outra aba, modal, ou chamar rota:
        // location.href = '/registro';
    });

    // Link esqueci a senha
    panel.querySelector('#forgot').addEventListener('click', (e) => {
        e.preventDefault();
        clearMsg();
        showSuccess('Envie um email de recuperação (exemplo).');
        // Implemente envio real conforme sua API
    });

    // Exponha controle opcional
    window.LoginTab = {
        open: () => { isOpen = true; openPanel(); },
        close: () => { isOpen = false; closePanel(); }
    };
})();
























