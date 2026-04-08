function calcularNota(porcentaje) {
    porcentaje = Number(porcentaje);

    if (porcentaje >= 0 && porcentaje <= 5) return 1.0;
    if (porcentaje > 5) return porcentaje*0.2;
}

function procesarDatos() {
    const input = document.getElementById("inputData").value.trim();
    const lineas = input.split("\n");

    let tabla = `
<tr>
    <th>Nombre</th>
    <th>Nota</th>
    <th>% Realizado </th>
    <th>% Correctamente</th>
</tr>
`;

    lineas.forEach(linea => {
        if (!linea.includes(";")) return;

        const [nombre, modo, orientacion, tiempo_dedicado, porcentaje_realizado, procentaje_correcto] = linea.split(";").map(v => v.trim());
        const nota = calcularNota(porcentaje_realizado);

        tabla += `
    <tr>
        <td>${nombre}</td>
        <td>${nota}</td>
        <td>${porcentaje_realizado}%</td>
        <td>${procentaje_correcto}%</td>
    </tr>
`;
    });

    document.getElementById("tablaResultados").innerHTML = tabla;
}
