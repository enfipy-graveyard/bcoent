require('module-alias/register')

const usecase = require('@/ucs')
const initBcoin = require('@/bcoin')


const start = async () => {
  const bcoin = await initBcoin()

  const ucs = new usecase(bcoin.nodeClient, bcoin.walletClient)
  ucs.listen()

  // Todo: Remove this. Only for test
  ucs.test()
}

start()
