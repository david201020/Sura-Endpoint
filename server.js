const express = require('express');
const app = express();

const registros = [];

// 65 registros para Alejandro Walker
for (let i = 1; i <= 65; i++) {
    registros.push({
        accountId: '001We00000XRFZaIAP',
        jobId: `JOB${String(i).padStart(3, '0')}`,
        rutCliente: '12.345.678',
        dvCliente: '9',
        contactID: 'Alejandro Walker',
        abierto: i % 2 === 0 ? 'SI' : 'NO',
        openDate: i % 2 === 0 ? `2026-01-${String((i % 28) + 1).padStart(2, '0')}` : null,
        cantidadApertura: i % 2 === 0 ? Math.floor(Math.random() * 5) + 1 : 0,
        fechaConcatenadoOpen: i % 2 === 0 ? `2026-01-${String((i % 28) + 1).padStart(2, '0')}` : null,
        rebote: i % 3 === 0 ? 'SI' : 'NO',
        bounceDate: i % 3 === 0 ? `2026-02-${String((i % 28) + 1).padStart(2, '0')}` : null,
        bounceCategory: i % 3 === 0 ? 'Soft' : null,
        emailName: `Correo Prueba ${i}`,
        asunto: `Asunto de prueba número ${i}`,
        emailAddress: 'alejandro@email.com',
        sendDate: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
        fromName: 'SURA Investments',
        fromEmail: 'no-reply@sura.cl',
        listNameSend: i % 2 === 0 ? 'Lista Principal' : 'Lista Fondos',
        desuscrito: i % 10 === 0 ? 'SI' : 'NO',
        unsubscribeDate: i % 10 === 0 ? '2026-03-01' : null,
        hizoClick: i % 4 === 0 ? 'SI' : 'NO',
        clickDate: i % 4 === 0 ? `2026-01-${String((i % 28) + 1).padStart(2, '0')}` : null,
        cantidadClick: i % 4 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
        journeyName: i % 2 === 0 ? 'SI_Bienvenida' : 'SI_Fondos',
        versionNumber: '1',
        origen: i % 2 === 0 ? 'Masivo' : 'Transaccional',
        smtpBounceReason: i % 3 === 0 ? 'Mailbox full' : null,
        bounceType: i % 3 === 0 ? 'Soft' : null,
        smtpCode: i % 3 === 0 ? '452' : null,
        smtpMessage: i % 3 === 0 ? 'Insufficient storage' : null
    });
}

app.get('/historico', (req, res) => {
    const accountId = req.query.accountId;
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
    const paginaActual = parseInt(req.query.page) || 1;
    const registrosPorPagina = 20;

    let resultados = registros.filter(r => r.accountId === accountId);

    if (fechaInicio && fechaFin) {
        resultados = resultados.filter(r =>
            r.sendDate >= fechaInicio && r.sendDate <= fechaFin
        );
    }

    const registrosSinId = resultados.map(({ accountId, ...resto }) => resto);

    const totalRegistros = registrosSinId.length;
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;

    res.json({
        totalRegistros: totalRegistros,
        totalPaginas: totalPaginas,
        registros: registrosSinId.slice(inicio, fin)
    });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));