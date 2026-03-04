
emailjs.init("2SR4Gft5axhHlCnfV");

const form = document.getElementById("conteiner-formulario");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        await emailjs.sendForm(
            "service_teste",
            "template_k31s2la",
            form
        );

        alert("Email enviado com sucesso!");
        form.reset();

    } catch (error) {
        console.error(error);
        alert("Erro ao enviar.");
    }
});