// const sendGridAPI = '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'
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SEND_GRID_API)

const sendEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'manavgarg272@gmail.com',
        subject:'this is my first creation',
        text:'i hope you understand ${name}'
    })
}

const sendCancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from:'manavgarg272@gmail.com',
        subject:'this is my first creation',
        text:'i hope you understand ${name}'
    })
}

module.exports={
    sendEmail,
    sendCancelEmail
}
