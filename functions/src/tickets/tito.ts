import * as functions from 'firebase-functions';
import * as rp from 'request-promise';

import * as helpers from './helpers';

export const getTickets = functions.https.onCall((req, res) => {
    return getTicketsFromTito()
        .then((data) => {
            return processTicketBody(data['releases']);
        }).then((tickets) => {
            return tickets;
        }).catch((error) => {
            console.error('Error in processing tickets');
            throw error;
        });
});

export const getCurrentCompanyTicket = functions.https.onCall((req, res) => {
    return findCurrentCompany().then((data) => {
        return data;
    }).catch((error) => {
        console.error('Error in getting company ticket');
        throw error;
    });
});


async function getTicketsFromTito() {
    const options = {
        method: 'GET',
        json: true,
        uri: functions.config().tito.url,
        headers: {
            'Authorization': `Token token=${functions.config().tito.key}`,
            'Accept': 'application/json'
        }
    }
    const data = await rp(options);
    return data;
}

async function findCurrentCompany() {
    const ticketsData = await getTicketsFromTito();
    const processedTickets = await processTicketBody(ticketsData['releases']);
    const onlyActiveCompany = processedTickets.filter(ticket => ticket.active === true && ticket.title.includes('Company'));
    return onlyActiveCompany[onlyActiveCompany.length - 1];
}

async function processTicketBody(ticketData) {
    const exchange = await helpers.getCurrentExchangeRate('CZK', 'EUR');
    const tickets = ticketData.filter(a => a.secret === false).map((a) => {
        return {
            title: a.title,
            price: a.price,
            eur_price: Math.round((a.price * exchange) / 5) * 5,
            active: !a.expired && !a.sold_out && !a.upcoming,
            sold_out: a.expired || a.sold_out,
            start: a.start_at,
            end: a.end_at,
            description: a.description,
            url: a.share_url,
            quantity: a.quantity
        }
    });
    return tickets
}
