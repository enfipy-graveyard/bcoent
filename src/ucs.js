const config = require('@/config')

class Usecase {
  constructor(nodeClient, walletClient) {
    this.nodeClient = nodeClient
    this.walletClient = walletClient
  }

  async test() {
    const account = await this.walletClient.getAccount(config.wallet, 'default')
    await this.nodeClient.execute('generatetoaddress', [ 100, account.receiveAddress ])
    await this.sendTransaction(account.receiveAddress, 10000, 10000)

    console.log(account.receiveAddress)
  }

  async sendTransaction(addr, value, rate) {
    const options = {
      rate: rate,
      outputs: [{
        value: value,
        address: addr,
      }],
    }
    const tx = await this.walletClient.send(config.wallet, options)
    return tx
  }

  async genAddress() {
    const receive = await this.walletClient.createAddress(config.wallet, 'default')
    if (receive == null) {
      throw Error('Can not create address')
    }
    return receive.address.toString()
  }

  async listen() {
    this.walletClient.on('connect', () => {
      this.walletClient.all()
    })
    await this.walletClient.open()

    this.walletClient.bind('confirmed', (walletID, confirmed) => {
      if (walletID === config.wallet) {
        const input = this.getResultIO(confirmed.inputs)
        const output = this.getResultIO(confirmed.outputs)

        console.log('Sender: %s, Reseiver: %s, Amount: %d', input.address, output.address, output.value)
        // Todo: Send to service. Handle/store result
      }
    })
  }

  async fetchFees() {
    const priority = await this.nodeClient.execute('estimatesmartfee', [ 1 ])
    const normal = await this.nodeClient.execute('estimatesmartfee', [ 6 ])
    const economic = await this.nodeClient.execute('estimatesmartfee', [ 12 ])

    return {
      economic,
      normal,
      priority,
    }
  }

  getResultIO(io) {
    const res = io.filter(
      (output) => {
        if (output.path === null) {
          return false
        }
        if (output.path.change) {
          return false
        }
        return true
      },
    )
    return res[0]
  }
}

module.exports = Usecase
