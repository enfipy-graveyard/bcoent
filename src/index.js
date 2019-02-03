require('module-alias/register')

const usecase = require('@/ucs')
const initBcoin = require('@/bcoin')


const start = async () => {
  const bcoin = await initBcoin()

  // const test = require('@/test')
  // To generate mock transactions for testing
  // await test(bcoin.nodeClient, bcoin.walletClient)

  const ucs = new usecase(bcoin.nodeClient, bcoin.walletClient)

  await ucs.listen()
  await ucs.test()
  console.log(await ucs.genAddress())
}

start()
