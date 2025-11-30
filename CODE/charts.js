// ================================================================
// charts.js
// Responsável apenas por criar e atualizar os gráficos do dashboard
// ================================================================

// Instâncias dos gráficos (para permitir destruir/redesenhar)
let energyChart = null;
let transportChart = null;
let commGauge = null;
let healthPie = null;


// ================================================================
// 1) Gráfico de Linha — Energia
// ================================================================
function drawEnergyChart(values) {
    const ctx = document.getElementById("energyChart");

    if (energyChart) energyChart.destroy(); // evita gráficos duplicados

    energyChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: values.map((_, i) => `Mês ${i + 1}`),
            datasets: [{
                label: "Energia",
                data: values,
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}


// ================================================================
// 2) Gráfico de Barras — Transporte
// ================================================================
function drawTransportChart(values) {
    const area = document.querySelectorAll("#charts-area > div")[1];

    // recria o container para inserir o novo gráfico
    area.innerHTML = `
        <h4 class="muted" style="margin:0 0 8px">Transporte</h4>
        <canvas id="transportChart"></canvas>
    `;

    const ctx = document.getElementById("transportChart");

    transportChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(values),
            datasets: [{
                data: Object.values(values)
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}


// ================================================================
// 3) Gauge — Comunicação (meia pizza)
// ================================================================
function drawCommGauge(value) {
    const area = document.querySelectorAll("#charts-area > div")[2];

    area.innerHTML = `
        <h4 class="muted" style="margin:0 0 8px">Comunicação</h4>
        <canvas id="commGauge"></canvas>
    `;

    const ctx = document.getElementById("commGauge");

    commGauge = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Disponível", "Indisponível"],
            datasets: [{
                data: [value, 100 - value],
                cutout: "70%"
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            rotation: -90,
            circumference: 180
        }
    });
}


// ================================================================
// 4) Gráfico de Pizza — Saúde
// ================================================================
// Gráfico de Pizza — Saúde
function drawHealthPie(values) {
    const area = document.querySelectorAll("#charts-area > div")[3];

    area.innerHTML = `
        <h4 class="muted" style="margin:0 0 8px">Saúde</h4>
        <canvas id="healthPie"></canvas>
    `;

    const ctx = document.getElementById("healthPie");

    healthPie = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(values),
            datasets: [{
                data: Object.values(values),
                backgroundColor: [
                    "#3b82f6", // Saudáveis
                    "#f43f5e", // Doentes
                    "#f59e42"  // Hospitalizados
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom', // Coloca legenda embaixo do gráfico
                    labels: {
                        boxWidth: 20,
                        font: { size: 14 },
                        padding: 20
                    }
                }
            }
        }
    });
}


// ================================================================
// 5) Atualiza todos os gráficos de uma vez
// ================================================================
function updateCharts(data) {
    drawEnergyChart(data.energia.tendencia);
    drawTransportChart(data.transporte.veiculos);
    drawCommGauge(data.comunicacao.uptime);
    drawHealthPie(data.saude.estados);
}
