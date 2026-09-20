newFunction();
function newFunction() {
    document.addEventListener("DOMContentLoaded", () => {
        // 1. LINHAS SUBSTITUÍDAS: Agora cada número tem um nome E um link de foto (fotoUrl)
        const candidatosData = {
            federal: {
                titulo: "Deputado Federal",
                lista: {
                    "1234": { nome: "Ana Silva (PFLA)", fotoUrl: "https://unsplash.com" },
                    "5678": { nome: "Carlos Lima (PTEC)", fotoUrl: "https://unsplash.com" }
                }
            },
            estadual: {
                titulo: "Deputado Estadual",
                lista: {
                    "12345": { nome: "Julia Costa (PUNI)", fotoUrl: "https://unsplash.com" },
                    "67890": { nome: "Roberto Dias (PFLA)", fotoUrl: "https://unsplash.com" }
                }
            },
            senador1: {
                titulo: "Senador (1ª vaga)",
                lista: {
                    "123": { nome: "Ricardo Oliveira (PLOG)", fotoUrl: "https://unsplash.com" },
                    "789": { nome: "Sandra Melo (PTEC)", fotoUrl: "https://unsplash.com" }
                }
            },
            senador2: {
                titulo: "Senador (2ª vaga)",
                lista: {
                    "222": { nome: "André do Prado (PL)", fotoUrl: "https://diariodejacarei.com.br/images/a/6059/b2ap3_large_Plenrio-Andr-do-Prado-site.jpg" },
                    "400": { nome: "Simode Tebet (PSB)", fotoUrl: "https://www12.senado.leg.br/noticias/materias/2022/02/15/simone-tebet-se-despede-da-lideranca-da-bancada-feminina-e-cobra-politicas-em-defesa-das-mulheres/20220215_01036jr.jpg/" }
                }
            },
            governador: {
                titulo: "Governador",
                lista: {
                    "10": { nome: "Tarcísio de Freitas (Republicanos)", fotoUrl: "https://media.gettyimages.com/id/2275918993/pt/foto/tarcisio-de-freitas-governor-of-so-paulo-speaks-during-a-campaign-launch-for-guilherme-derrite.jpg?s=594x594&w=gi&k=20&c=BaO1cmWaNTMIiMy8KKyg_JmcLK3HNsJB_Qz9rDH5qoQ=" },
                    "13": { nome: "Fernando Haddad (PT)", fotoUrl: "https://media.gettyimages.com/id/2248000821/pt/foto/the-president-of-brazil-luiz-inacio-lula-da-silva-and-the-minister-of-finance-fernando-haddad.jpg?s=594x594&w=gi&k=20&c=_WEstkDzsPylqKA4tjMH_UBV2QxKACgbFVuGsr98my8=" }
                }
            },
            presidente: {
                titulo: "Presidente da República",
                lista: {
                    "22": { nome: "Fávio Bolsonaro (PL)", fotoUrl: "https://media.gettyimages.com/id/2281624229/pt/foto/brazilian-senator-and-presidential-hopeful-flavio-bolsonaro-presents-a-proposal-to-combat.jpg?s=594x594&w=gi&k=20&c=jcvUpIOeE_7MNr4Johfl9KDwGqgLTP2ubpIwkxR2jq4=" },
                    "13": { nome: "Lula Inácio da Silva (PT)", fotoUrl: "https://media.gettyimages.com/id/2185130946/pt/foto/rio-de-janeiro-brazil-president-of-brazil-luis-in%C3%A1cio-lula-da-silva-gestures-during-the.jpg?s=594x594&w=gi&k=20&c=j5b8c1sbrwNJMZYRBqNr5-MD8iefJY6mdkaSrhmOWXQ=" }
                }
            }
        };

        // Objeto para armazenar a contagem total acumulada de votos computados
        const votosComputados = {
            federal: { total: 0, candidatos: {} },
            estadual: { total: 0, candidatos: {} },
            senador1: { total: 0, candidatos: {} },
            senador2: { total: 0, candidatos: {} },
            governador: { total: 0, candidatos: {} },
            presidente: { total: 0, candidatos: {} }
        };

        const cargoGroups = document.querySelectorAll(".cargo-group");
        const chartsContainer = document.getElementById("charts-container");
        const btnCadastrar = document.getElementById("btn-cadastrar");

        // Lógica do teclado e navegação dos inputs
        cargoGroups.forEach((group) => {
            const cargoType = group.getAttribute("data-cargo");
            const inputs = group.querySelectorAll(".inputs input");
            const photoContainer = group.querySelector(".candidate-photo");
            const photoImg = photoContainer.querySelector("img");

            inputs.forEach((input, index) => {
                input.addEventListener("input", (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");

                    if (e.target.value.length === 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    verificarFoto(inputs, cargoType, photoContainer, photoImg);
                });

                input.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
                        inputs[index - 1].focus();
                        photoContainer.classList.remove("active");
                    }
                });
            });
        });

        // 2. LINHAS SUBSTITUÍDAS: Nova função que aplica o link da fotoUrl no quadrado do HTML
        function verificarFoto(inputs, cargoType, container, img) {
            let numero = "";
            let completo = true;
            inputs.forEach(i => { if (!i.value) completo = false; numero += i.value; });

            if (completo) {
                const candidato = candidatosData[cargoType].lista[numero];

                if (candidato) {
                    img.src = candidato.fotoUrl; // Aplica o link real da imagem configurada acima
                } else {
                    img.src = "https://placeholder.com"; // Link de fallback para voto nulo
                }
                container.classList.add("active");
            } else {
                container.classList.remove("active");
            }
        }

        // Ação ao clicar em CADASTRAR VOTO
        btnCadastrar.addEventListener("click", () => {
            cargoGroups.forEach(group => {
                const cargoType = group.getAttribute("data-cargo");
                const inputs = group.querySelectorAll(".inputs input");
                let numero = "";

                inputs.forEach(i => numero += i.value);

                if (numero) {
                    // 3. LINHA AJUSTADA: Como agora lista é um objeto, pegamos apenas a propriedade .nome dele
                    const candidatoObj = candidatosData[cargoType].lista[numero];
                    const nomeCandidato = candidatoObj ? candidatoObj.nome : "Brancos/Nulos/Outros";

                    if (!votosComputados[cargoType].candidatos[nomeCandidato]) {
                        votosComputados[cargoType].candidatos[nomeCandidato] = 0;
                    }

                    votosComputados[cargoType].candidatos[nomeCandidato]++;
                    votosComputados[cargoType].total++;
                }
            });

            document.querySelectorAll(".inputs input").forEach(input => input.value = "");
            document.querySelectorAll(".candidate-photo").forEach(p => p.classList.remove("active"));

            atualizarPainelApuracao();
        });

        function atualizarPainelApuracao() {
            chartsContainer.innerHTML = "";
            document.querySelector(".instruction-text").style.display = "none";

            Object.keys(votosComputados).forEach(cargo => {
                const dadosCargo = votosComputados[cargo];
                if (dadosCargo.total === 0) return;

                const section = document.createElement("div");
                section.className = "chart-section";

                const title = document.createElement("h4");
                title.textContent = candidatosData[cargo].titulo;
                section.appendChild(title);

                Object.keys(dadosCargo.candidatos).forEach(cand => {
                    const qtdVotos = dadosCargo.candidatos[cand];
                    const porcentagem = ((qtdVotos / dadosCargo.total) * 100).toFixed(1);

                    const barContainer = document.createElement("div");
                    barContainer.className = "bar-container";
                    barContainer.innerHTML = `
                    <div class="bar-info">
                        <span>${cand} (${qtdVotos} v)</span>
                        <span>${porcentagem}%</span>
                    </div>
                    <div class="progress-bg">
                        <div class="progress-fill" style="width: ${porcentagem}%"></div>
                    </div>
                `;
                    section.appendChild(barContainer);
                });

                chartsContainer.appendChild(section);
            });
        }
    });
}

