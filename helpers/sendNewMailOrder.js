const nodemailer = require('nodemailer')
require('dotenv').config()


const sendNewMailOrder = async (productsInCart, user) => {

    const transporter = nodemailer.createTransport({
        host: process.env.HOST,
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });
    
    let info = await transporter.sendMail({
        from: `"Raul Lindgren" <${process.env.EMAIL}>`, // sender address
        to: process.env.EMAIL, // list of receivers
        subject: `Nuevo Pedido de ${user.firstname} ${user.email} ✔`, // Subject line
        text: `Productos comprados: ${productsInCart.name}
                Cantidad: ${productsInCart.amount}
        `, // plain text body
        html: `<p><b>Productos comprados:</b> ${productsInCart.name}</p>
                <p><b>Cantidad:</b> ${productsInCart.amount}</p>
        `, // html body
    });
    
    console.log(`done ${info}`);
    
}
module.exports= { sendNewMailOrder };