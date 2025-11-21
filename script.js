function calcularNota(porcentaje) {
    porcentaje = Number(porcentaje);

    if (porcentaje < 80) return 1.0;
    if (porcentaje <= 84) return 2.0;
    if (porcentaje <= 89) return 3.0;
    if (porcentaje <= 94) return 4.0;
    return 5.0; // 95 - 100
}

function procesarDatos() {
    const input = document.getElementById("inputData").value.trim();
    const lineas = input.split("\n");

    let tabla = `
<tr>
    <th>Nombre</th>
    <th>Nota</th>
    <th>% Realizado Correctamente</th>
</tr>
`;

    lineas.forEach(linea => {
        if (!linea.includes(";")) return;

        const [nombre, modo, orientacion, tiempo_dedicado, porcentaje_realizado, procentaje_correcto] = linea.split(";").map(v => v.trim());
        const nota = calcularNota(procentaje_correcto);

        tabla += `
    <tr>
        <td>${nombre}</td>
        <td>${nota}</td>
        <td>${procentaje_correcto}%</td>
    </tr>
`;
    });

    document.getElementById("tablaResultados").innerHTML = tabla;
}