newFunction();
function newFunction() {
    document.addEventListener("DOMContentLoaded", () => {
        // 1. LINHAS SUBSTITUÍDAS: Agora cada número tem um nome E um link de foto (fotoUrl)
        const candidatosData = {
            federal: {
                titulo: "Deputado Federal",
                lista: {
                    "2208": { nome: "Mario Farias (PL)", fotoUrl: "https://camara.leg.br" },
                    "2200": { nome: "José Augusto Rosa (PL)", fotoUrl: "https://camara.leg.br" }
                }
            },
            estadual: {
                titulo: "Deputado Estadual",
                lista: {
                    "22090": { nome: "Nina Braga (PL)", fotoUrl: "https://ninabraga.com.br" },
                    "22422": { nome: "Paulo Mansur (PL)", fotoUrl: "https://al.sp.gov.br    " }
                }
            },
            senador1: {
                titulo: "Senador (1ª vaga)",
                lista: {
                    "111": { nome: "Guilherme Derrite (PP)", fotoUrl: "https://brasildefato.com.br" },
                    "232": { nome: "Soninha Francine (Cidadania)", fotoUrl: "https://brasildefato.com.br" }
                }
            },
            senador2: {
                titulo: "Senador (2ª vaga)",
                lista: {
                    "222": { nome: "André do Prado (PL)", fotoUrl: "https://diariodejacarei.com.br" },
                    "400": { nome: "Simone Tebet (PSB)", fotoUrl: "https://senado.leg.br" }
                }
            },
            governador: {
                titulo: "Governador",
                lista: {
                    "10": { nome: "Tarcísio de Freitas (Republicanos)", fotoUrl: "https://gettyimages.com" },
                    "13": { nome: "Fernando Haddad (PT)", fotoUrl: "https://gettyimages.com" }
                }
            },
            presidente: {
                titulo: "Presidente da República",
                lista: {
                    "22": { nome: "Fávio Bolsonaro (PL)", fotoUrl: "https://gettyimages.com" },
                    "13": { nome: "Lula Inácio da Silva (PT)", fotoUrl: "https://gettyimages.com" }
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

        // 2. LINHAS SUBSTITUÍDAS: Nova função que aplica o link da fotoUrl no quadrado do HTML com validação de número inválido
        function verificarFoto(inputs, cargoType, container, img) {
            let numero = "";
            let completo = true;
            inputs.forEach(i => { if (!i.value) completo = false; numero += i.value; });

            if (completo) {
                const candidato = candidatosData[cargoType].lista[numero];

                if (candidato) {
                    img.src = candidato.fotoUrl; // Aplica o link real da imagem configurada acima
                    container.classList.add("active");
                } else {
                    // Alerta caso o número digitado não exista na tabela/código
                    alert("Número inválido! Tente os numeros na tabela a esquerda!");
                    
                    // Limpa apenas as caixas do bloco atual para redigitação
                    inputs.forEach(i => i.value = "");
                    
                    // Coloca o cursor de volta na primeira caixinha do bloco
                    if (inputs.length > 0) inputs[0].focus();
                    
                    container.classList.remove("active");
                }
            } else {
                container.classList.remove("active");
            }
        }

        // Ação ao clicar em CADASTRAR VOTO
        btnCadastrar.addEventListener("click", () => {
            let erroDetectado = false;

            cargoGroups.forEach(group => {
                const cargoType = group.getAttribute("data-cargo");
                const inputs = group.querySelectorAll(".inputs input");
                let numero = "";

                inputs.forEach(i => numero += i.value);

                if (numero) {
                    const candidatoObj = candidatosData[cargoType].lista[numero];
                    
                    // Trava de segurança: se o número digitado não existir, impede o cadastro do bloco
                    if (!candidatoObj) {
                        erroDetectado = true;
                        return;
                    }

                    const nomeCandidato = candidatoObj.nome;

                    if (!votosComputados[cargoType].candidatos[nomeCandidato]) {
                        votosComputados[cargoType].candidatos[nomeCandidato] = 0;
                    }

                    votosComputados[cargoType].candidatos[nomeCandidato]++;
                    votosComputados[cargoType].total++;
                }
            });

            // Se houver algum número inválido não corrigido, não limpa a tela e interrompe o envio
            if (erroDetectado) {
                alert("Por favor, corrija os números inválidos antes de cadastrar!");
                return;
            }

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
