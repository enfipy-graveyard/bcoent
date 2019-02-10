require('module-alias/register')

const usecase = require('@/ucs')
const initBcoin = require('@/bcoin')


const start = async () => {
  const bcoin = await initBcoin()

  if (config.bcoin.network === 'regtest') {
    // To generate mock transactions for regtest node
    const test = require('@/test')
    await test(bcoin.nodeClient, bcoin.walletClient)
  }

  const ucs = new usecase(bcoin.nodeClient, bcoin.walletClient)

  await ucs.listen()
  console.log(await ucs.genAddress())

  // await ucs.test()
}

start()
