const express = require('express');
const app = express();

const meses = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
const journeys = ['SI_Bienvenida', 'SI_Fondos', 'SI_Alerta', 'SI_Newsletter', 'SI_Rentabilidad', 'SI_Campaña'];
const listas = ['Lista Principal', 'Lista Fondos', 'Lista Alertas', 'Lista Newsletter', 'Lista VIP'];
const asuntos = [
    'Bienvenido a SURA Investments',
    'Tu resumen mensual de inversiones',
    'Alerta de rentabilidad',
    'Novedades SURA este mes',
    'Conoce nuestros fondos mutuos',
    'Tu portafolio este mes',
    'Actualización de tu perfil de inversión',
    'Nuevas oportunidades de inversión',
    'Reporte trimestral',
    'Campaña fondos de renta fija'
];

const cuentas = [
    { accountId: '001We00000XRFZaIAP', contactID: 'Alejandro Walker Cerda', rutCliente: '12.345.678', dvCliente: '9', emailAddress: 'alejandro.walker@email.com', cantidad: 65 },
    { accountId: '001We00000ZFPkEIAX', contactID: 'María González López', rutCliente: '9.876.543', dvCliente: '2', emailAddress: 'maria.gonzalez@email.com', cantidad: 45 },
    { accountId: '001We00000ZFPLaIAP', contactID: 'Carlos Pérez Soto', rutCliente: '15.432.876', dvCliente: '5', emailAddress: 'carlos.perez@email.com', cantidad: 30 }
];

const registros = [];

cuentas.forEach(cuenta => {
    for (let i = 1; i <= cuenta.cantidad; i++) {
        const mes = meses[i % meses.length];
        const dia = String((i % 28) + 1).padStart(2, '0');
        const sendDate = `${mes}-${dia}`;
        const abierto = i % 2 === 0 ? 'SI' : 'NO';
        const rebote = i % 5 === 0 ? 'SI' : 'NO';
        const hizoClick = i % 3 === 0 ? 'SI' : 'NO';
        const desuscrito = i % 15 === 0 ? 'SI' : 'NO';

        registros.push({
            accountId: cuenta.accountId,
            jobId: `JOB_${cuenta.accountId.slice(-4)}_${String(i).padStart(3, '0')}`,
            rutCliente: cuenta.rutCliente,
            dvCliente: cuenta.dvCliente,
            contactID: cuenta.contactID,
            abierto: abierto,
            openDate: abierto === 'SI' ? sendDate : null,
            cantidadApertura: abierto === 'SI' ? (i % 4) + 1 : 0,
            fechaConcatenadoOpen: abierto === 'SI' ? sendDate : null,
            rebote: rebote,
            bounceDate: rebote === 'SI' ? sendDate : null,
            bounceCategory: rebote === 'SI' ? (i % 2 === 0 ? 'Soft' : 'Hard') : null,
            emailName: `${asuntos[i % asuntos.length]} ${i}`,
            asunto: asuntos[i % asuntos.length],
            emailAddress: cuenta.emailAddress,
            sendDate: sendDate,
            fromName: 'SURA Investments',
            fromEmail: 'no-reply@sura.cl',
            listNameSend: listas[i % listas.length],
            desuscrito: desuscrito,
            unsubscribeDate: desuscrito === 'SI' ? sendDate : null,
            hizoClick: hizoClick,
            clickDate: hizoClick === 'SI' ? sendDate : null,
            cantidadClick: hizoClick === 'SI' ? (i % 3) + 1 : 0,
            journeyName: journeys[i % journeys.length],
            versionNumber: String((i % 3) + 1),
            origen: i % 2 === 0 ? 'Masivo' : 'Transaccional',
            smtpBounceReason: rebote === 'SI' ? 'Mailbox full' : null,
            bounceType: rebote === 'SI' ? (i % 2 === 0 ? 'Soft' : 'Hard') : null,
            smtpCode: rebote === 'SI' ? '452' : null,
            smtpMessage: rebote === 'SI' ? 'Insufficient storage' : null
        });
    }
});

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
