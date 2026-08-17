const form = document.getElementById("legalForm");
const resultPanel = document.getElementById("resultPanel");
const themeToggle = document.getElementById("themeToggle");
const demoScore = document.getElementById("demoScore");

// Pequeña animación del ejemplo visual.
let demo = 72;
setInterval(() => {
    demo += Math.random() > 0.5 ? 1 : -1;
    demo = Math.max(68, Math.min(76, demo));
    demoScore.textContent = demo;
}, 1200);

// Tema claro/oscuro con almacenamiento local.
const savedTheme = localStorage.getItem("lexiruta-theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const dark = document.body.classList.contains("dark");
    themeToggle.textContent = dark ? "☀" : "☾";
    localStorage.setItem("lexiruta-theme", dark ? "dark" : "light");
});

function getCheckedValue(name) {
    const element = document.querySelector(`input[name="${name}"]:checked`);
    return element ? Number(element.value) : null;
}

function areaText(area) {
    const areas = {
        laboral: "laboral",
        familiar: "familiar",
        penal: "penal",
        civil: "civil",
        administrativa: "administrativa"
    };

    return areas[area] || "jurídica";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const area = document.getElementById("area").value;
    const deadline = Number(document.getElementById("deadline").value);
    const risk = getCheckedValue("risk");
    const evidence = getCheckedValue("evidence");

    if (!area || Number.isNaN(deadline) || risk === null || evidence === null) {
        showValidation();
        return;
    }

    // Algoritmo de clasificación:
    // riesgo inmediato = mayor prioridad;
    // plazo próximo = aumenta prioridad;
    // evidencia disponible = no elimina la urgencia, solo mejora la preparación.
    let score = 20;

    score += deadline;
    score += risk;
    score += evidence;

    // Ajuste por área para demostrar una segunda estructura de decisión.
    if (area === "penal" || area === "familiar") {
        score += 10;
    } else if (area === "laboral") {
        score += 5;
    }

    score = Math.max(0, Math.min(100, score));

    const result = classify(score, area);
    renderResult(result);
});

function classify(score, area) {
    if (score >= 65) {
        return {
            score,
            level: "ALTA PRIORIDAD",
            className: "priority-high",
            title: "Conviene buscar orientación profesional con prontitud.",
            explanation:
                `La información proporcionada muestra factores que justifican una atención prioritaria en el área ${areaText(area)}.`,
            checklist: [
                "Reunir documentos, mensajes, fotografías o notificaciones relacionadas.",
                "Anotar fechas, personas involucradas y una cronología breve.",
                "Identificar cualquier audiencia, plazo o notificación pendiente."
            ]
        };
    }

    if (score >= 40) {
        return {
            score,
            level: "PRIORIDAD MEDIA",
            className: "priority-mid",
            title: "Conviene organizar la información y valorar orientación.",
            explanation:
                `La situación parece requerir seguimiento en el área ${areaText(area)}, especialmente para evitar que cambie su nivel de urgencia.`,
            checklist: [
                "Ordenar los hechos cronológicamente.",
                "Guardar evidencia relevante en un solo lugar.",
                "Verificar si existe algún plazo o documento pendiente."
            ]
        };
    }

    return {
        score,
        level: "PRIORIDAD BAJA",
        className: "priority-low",
        title: "Puedes comenzar por organizar la información.",
        explanation:
            `No aparecen indicadores fuertes de urgencia en las respuestas, pero la situación en el área ${areaText(area)} debe analizarse con información completa.`,
        checklist: [
            "Escribir un resumen breve de lo ocurrido.",
            "Conservar documentos y comunicaciones relacionadas.",
            "Buscar orientación profesional si la situación cambia o aparece un plazo."
        ]
    };
}

function renderResult(result) {
    resultPanel.classList.remove("empty");

    resultPanel.innerHTML = `
        <div class="result-main">
            <div class="result-icon">✓</div>
            <span class="priority-pill ${result.className}">${result.level}</span>
            <h3>${result.title}</h3>
            <div class="score-bar">
                <div class="score-fill"></div>
            </div>
            <strong>Índice orientativo: ${result.score}/100</strong>
            <p style="margin-top:10px;">${result.explanation}</p>
        </div>

        <div>
            <p class="eyebrow">CHECKLIST</p>
            <div class="checklist">
                ${result.checklist.map(item => `
                    <div class="check-item">
                        <b>✓</b>
                        <span>${item}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        const fill = resultPanel.querySelector(".score-fill");
        fill.style.width = `${result.score}%`;
    });

    resultPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showValidation() {
    resultPanel.classList.remove("empty");
    resultPanel.innerHTML = `
        <div class="result-icon">!</div>
        <p class="eyebrow">FALTA INFORMACIÓN</p>
        <h3>Completa todos los apartados</h3>
        <p>
            Selecciona un área, indica si existe una fecha límite y responde las dos preguntas
            de riesgo y evidencia para ejecutar el algoritmo.
        </p>
    `;
}

// Preguntas frecuentes.
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        answer.classList.toggle("open");

        const symbol = question.querySelector("span");
        symbol.textContent = answer.classList.contains("open") ? "−" : "+";
    });
});
