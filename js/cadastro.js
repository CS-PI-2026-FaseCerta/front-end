document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const btnSubmit = document.querySelector('.btn-primary');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm-password');
    const infoText = document.querySelector('.info-text');
    const inputs = form.querySelectorAll('input');

    // LÓGICA DE MOSTRAR/ESCONDER SENHA
    // Selecionamos todos os ícones com a classe toggle-password
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.style.cursor = 'pointer';

        icon.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');

            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // VALIDAÇÃO DE CAMPOS E COMPARAÇÃO DE SENHAS
    function validateForm() {
        let allFilled = true;

        // Verifica se algum campo está vazio
        inputs.forEach(input => {
            if (input.value.trim() === '') {
                allFilled = false;
            }
        });

        const pass = passwordInput.value;
        const confirmPass = confirmInput.value;

        // Erro visual se as senhas forem diferentes (e se o campo de confirmação não estiver vazio)
        if (confirmPass.length > 0 && pass !== confirmPass) {
            confirmInput.style.border = "1px solid var(--error-color)";
            infoText.style.color = "var(--error-color)";
            infoText.innerHTML = '<i class="fas fa-times-circle"></i> As senhas não coincidem!';
        } else {
            confirmInput.style.border = "1px solid transparent";
            infoText.style.color = "var(--text-secondary)";
            infoText.innerHTML = '<i class="fas fa-info-circle"></i> As senhas devem coincidir para prosseguir.';
        }

        // Habilita o botão apenas se tudo estiver ok
        if (allFilled && pass === confirmPass) {
            btnSubmit.disabled = false;
        } else {
            btnSubmit.disabled = true;
        }
    }

    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
});