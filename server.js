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
    { accountId: '001We00000fQ3rsIAC', ContactKey: '5193123-8', ContactID: 'Jhon Barrie Mackenzie Haynes', EmailAddress: 'jhon.mackenzie@email.com', cantidad: 65 },
    { accountId: '001We00000fQ3sFIAS', ContactKey: '0054256205', ContactID: 'Eduardo Gaston Uribe Tapia', EmailAddress: 'eduardo.uribe@email.com', cantidad: 45 },
    { accountId: '001We00000fR2hGIAS', ContactKey: '0061115129', ContactID: 'Lilian Del Carmen Urrutia Romero', EmailAddress: 'lilian.urrutia@email.com', cantidad: 21 },
    { accountId: '001We00000fR2htIAC', ContactKey: '0032921418', ContactID: 'Adriana Isabel Guerra Inostroza', EmailAddress: 'adriana.guerra@email.com', cantidad: 20 },
    { accountId: '001We00000fR2hxIAC', ContactKey: '0044300400', ContactID: 'Blanca Anelida Parada Flores', EmailAddress: 'blanca.parada@email.com', cantidad: 5 },
];

const registros = [];

cuentas.forEach(cuenta => {
    for (let i = 1; i <= cuenta.cantidad; i++) {
        const mes = meses[i % meses.length];
        const dia = String((i % 28) + 1).padStart(2, '0');
        const sendDate = `${mes}-${dia}`;
        const abierto = i % 2 === 0;
        const rebote = i % 5 === 0;
        const hizoClick = i % 3 === 0;
        const desuscrito = i % 15 === 0;

        registros.push({
            accountId: cuenta.accountId,
            ContactKey: cuenta.ContactKey,
            ContactID: cuenta.ContactID,
            JobID: `JOB_${cuenta.accountId.slice(-4)}_${String(i).padStart(3, '0')}`,
            EmailAddress: cuenta.EmailAddress,
            EmailName: `${asuntos[i % asuntos.length]} ${i}`,
            Asunto: asuntos[i % asuntos.length],
            SendDate: sendDate,
            SendDateUTC: `${sendDate}T12:00:00.000Z`,
            SendSource: i % 2 === 0 ? 'Journey Builder' : 'Email Studio',
            FromName: 'SURA Investments',
            FromEmail: i % 2 === 0 ? 'noreply.cl@comunicacion.surainvestments.com' : 'comunicaciones.cl@comunicacion.surainvestments.com',
            JourneyName: i % 2 === 0 ? journeys[i % journeys.length] : null,
            VersionNumber: i % 2 === 0 ? (i % 3) + 1 : null,
            BatchID: String(i * 10),
            ListID_Send: i % 2 === 0 ? String(3000 + i) : null,
            ListName_Send: listas[i % listas.length],
            ListSubscriberStatus: desuscrito ? 'unsubscribed' : 'active',
            OpenDate: abierto ? `${sendDate}T13:00:00.000Z` : null,
            CantidadApertura: abierto ? (i % 4) + 1 : 0,
            FechaConcatenadoOpen: abierto ? `${sendDate} 1:00PM` : null,
            ClickDate: hizoClick ? `${sendDate}T14:00:00.000Z` : null,
            CantidadClick: hizoClick ? (i % 3) + 1 : 0,
            BounceDate: rebote ? `${sendDate}T12:30:00.000Z` : null,
            BounceCategory: rebote ? (i % 2 === 0 ? 'Soft' : 'Hard') : null,
            BounceType: rebote ? (i % 2 === 0 ? 'Soft' : 'Hard') : null,
            SMTPBounceReason: rebote ? 'Mailbox full' : null,
            SMTPCode: rebote ? '452' : null,
            SMTPMessage: rebote ? 'Insufficient storage' : null,
            UnsubscribeDate: desuscrito ? sendDate : null
        });
    }
});

app.get('/historico', (req, res) => {
    const contactKey = req.query.contactKey;
    const fechaInicio = req.query.startDate;
    const fechaFin = req.query.endDate;
    const paginaActual = parseInt(req.query.page) || 1;
    const registrosPorPagina = parseInt(req.query.pageSize) || 20;

    console.log('Parámetros recibidos:', req.query);

    let resultados = registros.filter(r => r.accountId === contactKey);

    if (fechaInicio && fechaFin) {
        resultados = resultados.filter(r =>
            r.SendDate >= fechaInicio && r.SendDate <= fechaFin
        );
    }

    const registrosSinId = resultados.map(({ accountId, ...resto }) => resto);

    const totalRegistros = registrosSinId.length;
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina) || 1;
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const pagina = registrosSinId.slice(inicio, fin);

    res.json({
        response: true,
        data: {
            total: totalRegistros,
            totalPages: totalPaginas,
            totalInPage: pagina.length,
            results: pagina
        }
    });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));
