const twilio = require('twilio');
const { accountSid, authToken, number, whatsappNumber } = require('../config/enviroment')
require('dotenv').config()


const sendNewWhatsappOrder = async (to, body, sendToWhatsapp) => {
    try{ 
        const from = sendToWhatsapp ? whatsappNumber : number; 
        const sendTo = sendToWhatsapp ? `whatsapp:+54${to}` : `+54${to}`;
        const client = twilio(accountSid, authToken);
        const message = await client.messages.create({
            body: `Su pedido ${body} ha sido recibido y se encuentra en proceso`,
            from,
            to: sendTo,
        });

        return {
            result: 'success',
            messageId: message.sid,
        };
    } catch (err) {
        return {
            result: 'error',
            messageId: err.message,
        }
    }    
};
module.exports= {sendNewWhatsappOrder}