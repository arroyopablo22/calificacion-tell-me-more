const nivelesPorGrado = {
    "5": "Principiante sin nociones",
    "6": "Principiante",
    "7": "Principiante",
    "8": "Inglés Americano2",
    "9": "Inglés Americano2",
    "10": "Inglés Americano2+",
    "11": "Inglés Americano2+"
};

function mostrarNivel() {
    const grado = document.getElementById("grado").value;
    const nivelInfo = document.getElementById("nivelInfo");

    if (!grado) {
        nivelInfo.innerHTML = "Selecciona un grado para ver el nivel de inglés correspondiente.";
        return;
    }

    nivelInfo.innerHTML = `
      <strong>Grado seleccionado:</strong> ${obtenerNombreGrado(grado)}<br>
      <strong>Nivel de inglés correspondiente:</strong> ${nivelesPorGrado[grado]}
    `;
}

function obtenerNombreGrado(grado) {
    const nombres = {
        "5": "Quinto",
        "6": "Sexto",
        "7": "Séptimo",
        "8": "Octavo",
        "9": "Noveno",
        "10": "Décimo",
        "11": "Undécimo"
    };
    return nombres[grado] || grado;
}

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function calcularNota(porcentajeCorrecto) {
    const p = parseFloat(porcentajeCorrecto);

    if (isNaN(p)) return "N/A";
    if (p < 25) return 1.0;
    if (p >= 25 && p <= 50) return Number((1 + ((porcentaje - 25) * 0.16)).toFixed(1));
    if (p > 50 && p <= 100) return 5.0;

    return "N/A";
}

function obtenerClaseNota(nota) {
    switch (nota) {
        case nota > 1.0 && nota < 2.0: return "nota-1";
        case nota >= 2.0 && nota < 3.0: return "nota-2";
        case nota >= 3.0 && nota < 4.0: return "nota-3";
        case nota >= 4.0 && nota < 4.5: return "nota-4";
        case 5.0: return "nota-5";
        default: return "";
    }
}

function coincideNivel(orientacion, nivelEsperado) {
    const orientacionNormalizada = normalizarTexto(orientacion);
    const nivelNormalizado = normalizarTexto(nivelEsperado);

    return orientacionNormalizada.includes(nivelNormalizado);
}

function procesarDatos() {
    const grado = document.getElementById("grado").value;
    const datosTexto = document.getElementById("datos").value.trim();
    const tabla = document.getElementById("tablaResultados");
    const mensaje = document.getElementById("mensaje");
    const resumen = document.getElementById("resumen");

    tabla.innerHTML = "";
    mensaje.innerHTML = "";
    resumen.style.display = "none";

    if (!grado) {
        mensaje.innerHTML = `<div class="alerta">⚠️ Debes seleccionar un grado antes de procesar los datos.</div>`;
        return;
    }

    if (!datosTexto) {
        mensaje.innerHTML = `<div class="alerta">⚠️ Debes pegar el reporte antes de procesar.</div>`;
        return;
    }

    const nivelEsperado = nivelesPorGrado[grado];
    const lineas = datosTexto.split("\n").map(l => l.trim()).filter(l => l !== "");

    let registrosValidos = [];

    for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i];

        // Solo procesar líneas con separador ;
        if (!linea.includes(";")) continue;

        const columnas = linea.split(";").map(c => c.trim());

        // Deben venir 6 columnas
        if (columnas.length < 6) continue;

        const [nombre, modo, orientacion, tiempo, realizado, realizadoCorrecto] = columnas;

        // Ignorar encabezado
        if (normalizarTexto(nombre) === "nombre") continue;

        // Filtrar por nivel según el grado
        if (coincideNivel(orientacion, nivelEsperado)) {
            const nota = calcularNota(realizado);

            registrosValidos.push({
                nombre,
                modo,
                orientacion,
                tiempo,
                realizado: parseFloat(realizado).toFixed(2),
                realizadoCorrecto: parseFloat(realizadoCorrecto).toFixed(2),
                nota: parseFloat(nota).toFixed(2)
            });
        }
    }

    if (registrosValidos.length === 0) {
        mensaje.innerHTML = `
        <div class="alerta">
          ⚠️ No se encontraron registros para el grado <strong>${obtenerNombreGrado(grado)}</strong>
          con el nivel <strong>${nivelEsperado}</strong>.
        </div>
      `;
        return;
    }

    // Ordenar por nombre
    registrosValidos.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    // Crear tabla
    let html = `
      <tr>
        <th>Nombre</th>
        <th>Grado</th>
        <th>Nivel</th>
        <th>Modo</th>
        <th>Tiempo dedicado</th>
        <th>% Realizado</th>
        <th>% Realizado correctamente</th>
        <th>Nota</th>
      </tr>
    `;

    registrosValidos.forEach(registro => {
        html += `
        <tr class="${obtenerClaseNota(registro.nota)}">
          <td>${registro.nombre}</td>
          <td>${obtenerNombreGrado(grado)}</td>
          <td>${nivelEsperado}</td>
          <td>${registro.modo}</td>
          <td>${registro.tiempo}</td>
          <td>${registro.realizado}%</td>
          <td>${registro.realizadoCorrecto}%</td>
          <td><strong>${registro.nota}</strong></td>
        </tr>
      `;
    });

    tabla.innerHTML = html;

    // Resumen
    const promedio = (
        registrosValidos.reduce((acc, r) => acc + (typeof r.nota === "number" ? r.nota : 0), 0) / registrosValidos.length
    ).toFixed(2);

    resumen.style.display = "block";
    resumen.innerHTML = `
      <strong>Resumen:</strong><br>
      Grado evaluado: <strong>${obtenerNombreGrado(grado)}</strong><br>
      Nivel filtrado: <strong>${nivelEsperado}</strong><br>
      Total de estudiantes encontrados: <strong>${registrosValidos.length}</strong><br>
      Promedio de notas: <strong>${promedio}</strong>
    `;
}