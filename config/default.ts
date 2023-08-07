export default {
  port: 4000,
  host: '0.0.0.0',
  logLevel: 'info',
  accessTokenPrivateKey: '',
  refreshTokenPrivateKey: '',
  smtp: {
    user: 'xxxxxx@ethereal.email',
    pass: 'xxxxxx',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false
  },
  smtpZoho: {
    user: 'info@your-domain.com',
    pass: 'HbdexwtUmSza',
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true
    // port: 587,
    // secure: false,
    // tls: {
    //   ciphers: 'SSLv3'
    // }
  }
}
