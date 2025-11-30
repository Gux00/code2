// --- Estado inicial da cidade --- //
const estadoInicial = {
    energia: { tendencia: [20, 22, 21, 19, 18, 17] },       // Energia ruim!
    transporte: { veiculos: { Carros: 1500, Ônibus: 400, Caminhões: 200, Motos: 900 } },
    comunicacao: { uptime: 80 },                            // Comunicação ruim!
    saude: { estados: { Saudáveis: 60, Doentes: 25, Hospitalizados: 15 } }, // Saúde ruim!
    investimentos: { total: 5000000, energia: 3500000, transporte: 750000, comunicacao: 500000, saude: 250000 }
};

// Estado atual
let estado = JSON.parse(JSON.stringify(estadoInicial));

// ---------- Atualiza os textos e gráficos ---------- //
function updateTextIndicators(d) {
    document.getElementById("energy-main").textContent = d.energia.tendencia.at(-1) + " MW";
    document.getElementById("transport-main").textContent = Object.values(d.transporte.veiculos).reduce((a,b)=>a+b) + " viagens";
    document.getElementById("comm-main").textContent = d.comunicacao.uptime + "%";
    document.getElementById("health-main").textContent = d.saude.estados.Saudáveis + "% saudáveis";

    document.getElementById("invest-total").textContent = "EVC " + d.investimentos.total;
    document.getElementById("inv-energy").textContent = "EVC " + d.investimentos.energia;
    document.getElementById("inv-transport").textContent = "EVC " + d.investimentos.transporte;
    document.getElementById("inv-comm").textContent = "EVC " + d.investimentos.comunicacao;
    document.getElementById("inv-health").textContent = "EVC " + d.investimentos.saude;
}

function applyData(jsonData) {
    updateTextIndicators(jsonData);
    updateCharts(jsonData); // charts.js já faz tudo!
}

// ---------- Aplica um novo ciclo de investimento (6 meses) ---------- //
function aplicarInvestimento() {
    // +5 milhões para investir
    const valorNovo = 5000000;
    estado.investimentos.total += valorNovo;

    // Distribuição: Energia (70%), Saúde (15%), Transporte (10%), Comunicação (5%)
    let energia      = Math.round(valorNovo * 0.7);
    let saude        = Math.round(valorNovo * 0.15);
    let transporte   = Math.round(valorNovo * 0.10);
    let comunicacao  = valorNovo - energia - saude - transporte; // garante o total exato

    estado.investimentos.energia      += energia;
    estado.investimentos.saude        += saude;
    estado.investimentos.transporte   += transporte;
    estado.investimentos.comunicacao  += comunicacao;

    // Melhora indicadores:
    estado.energia.tendencia = estado.energia.tendencia.map(v => v + 10); // Energia melhora muito!
    estado.saude.estados.Saudáveis = Math.min(estado.saude.estados.Saudáveis + 6, 100);
    estado.saude.estados.Doentes = Math.max(estado.saude.estados.Doentes - 3, 0);
    estado.saude.estados.Hospitalizados = Math.max(estado.saude.estados.Hospitalizados - 2, 0);
    estado.comunicacao.uptime = Math.min(estado.comunicacao.uptime + 4, 100);
    estado.transporte.veiculos = Object.fromEntries(
        Object.entries(estado.transporte.veiculos).map(([k, v]) => [k, Math.round(v * 0.98)])
    );

    applyData(estado);
}

// ---------- Reverter ao início ---------- //
function reverterCidade() {
    estado = JSON.parse(JSON.stringify(estadoInicial));
    applyData(estado);
}

// ---------- Inicialização ---------- //
document.addEventListener("DOMContentLoaded", () => {
    applyData(estado);

    document.getElementById("btn-invest").addEventListener("click", aplicarInvestimento);
    document.getElementById("btn-revert").addEventListener("click", reverterCidade);
});