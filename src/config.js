module.exports = {
  bcoin: {
    apiKey: process.env.BCOIN_API_KEY || 'secretpw',
    network: process.env.BCOIN_NETWORK || 'regtest',
    host: process.env.BCOIN_HOST || 'bcoin',

    rescan: process.env.RESCAN === 'true'
  },
  wallet: process.env.BITCOIN_WALLET || 'primary',
}
