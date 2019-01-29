require('module-alias/register')

const usecase = require('@/ucs')
const initBcoin = require('@/bcoin')
const test = require('@/pagination-test-wallets')


const start = async () => {
  const bcoin = await initBcoin()

  await test(bcoin.nodeClient, bcoin.walletClient)

  const ucs = new usecase(bcoin.nodeClient, bcoin.walletClient)
  await ucs.listen()
  await ucs.test()
}

start()
