// Objetivo:
// Enviar um texto de um formulário para uma API do n8n e exibir o resultado o código html, css e colocar a animação no fundo da tela do site.

//função criada para verificar se o background está sendo carregado?
function setLoading(isLoading) {
        //captura o botão
        const btnSpan = document.getElementById('generate-btn');

        //verifica se está carregando, com base na variável de estado
        if (isLoading) {
                // se sim, troca o texto do botão     
                btnSpan.innerHTML = "Gerando Background...";
        } else {
                //senão, mantem o texto original
                btnSpan.innerHTML = "Gerar Background Mágico";
        }

}


document.addEventListener('DOMContentLoaded', function () {
       
        const form = document.querySelector(".form-group");
        const textArea = document.getElementById("description");
        const htmlCode = document.getElementById("html-code");
        const cssCode = document.getElementById("css-code");
        const preview = document.getElementById("preview-section");

         // 1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página.
        form.addEventListener('submit', async function (event) {
                event.preventDefault();

                // 2. Obter o valor digitado pelo usuário no campo de texto removendo os espaços em branco.
                const description = textArea.value.trim();

                // se não houver texto digitado, pare a execução
                if (!description) {
                        return;
                }
                console.log(description);

                // 3. Exibir um indicador de carregamento enquanto a requisição está sendo processada.
                setLoading(true);

                // 4. Fazer uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato JSON.
                try {
                        const response = await fetch("https://murilodev.app.n8n.cloud/webhook/gerador-fundo", {
                                method: "POST",
                                headers: { "Content-type": "application/json" },
                                body: JSON.stringify({ description }),
                        });
                        // 5. Receber a resposta da API do n8n (esperando um JSON com o código HTML/CSS do background).
                        const data = await response.json();
                        // 6. Se a resposta for válida, exibir o código HTML/CSS retornado na tela:
                        htmlCode.textContent = data.code || "";
                        cssCode.textContent = data.style || "";
                        //    - Mostrar o HTML gerado em uma área de preview.
                        preview.style.display = "block";
                        preview.innerHTML = data.code || "";

                        let styleTag = document.getElementById("dynamic-style");

                        if (styleTag) styleTag.remove();
                        if (data.style) {
                                styleTag = document.createElement("style");
                                styleTag.id = "dynamic-style";

                                styleTag.textContent = data.style;
                                //- Inserir o CSS retornado dinamicamente na página para aplicar o background.
                                document.head.appendChild(styleTag);
                        }

                } catch (error) {
                        console.log("Erro ao gerar o fundo: ", error);
                        htmlCode.textContent = "Não consegui gerar o código HTML, favor tentar novamente";
                        cssCode.textContent = "Não consegui gerar o código CSS, favor tentar novamente";
                        preview.innerHTML = "";

                } finally {
                        // 7. Remover o indicador de carregamento após o recebimento da resposta.
                        setLoading(false);
                }

        });
});