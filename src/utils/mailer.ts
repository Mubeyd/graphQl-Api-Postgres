import nodemailer, { SendMailOptions } from 'nodemailer'
import config from 'config'
import log from './logger'

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
  user: string
  pass: string
  host: string
  port: number
  secure: boolean
}>('smtp')

const smtpZoho = config.get<{
  user: string
  pass: string
  host: string
  port: number
  secure: boolean
}>('smtpZoho')

const transporter = nodemailer.createTransport({
  ...smtpZoho,
  auth: { user: smtpZoho.user, pass: smtpZoho.pass }
})

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, 'Error sending email')
      return
    }

    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
  })
}

export default sendEmail
