const config = require('@/config')
const helpers = require('@/helpers')

class Usecase {
  constructor(nodeClient, walletClient) {
    this.nodeClient = nodeClient
    this.walletClient = walletClient
  }

  async test() {
    const account = await this.walletClient.getAccount(config.wallet, 'default')
    if (config.bcoin.network === 'regtest') {
      await this.nodeClient.execute('generatetoaddress', [ 100, account.receiveAddress ])
    }
    await this.sendTransaction('2N5QP5eHXPWx85NdqG2i6krk3tbpajGZyER', 10000, 10000)

    const wallet = await this.walletClient.wallet(config.wallet)
    const balance = await wallet.getBalance('default')

    console.log('Address: %s\nBalance: %j', account.receiveAddress, balance)
  }

  async rescanIfEnvPassed() {
    if (!config.bcoin.rescan) {
      return
    }
    const height = helpers.getHeight()
    const result = await this.walletClient.rescan(height)
    if (result.success) {
      console.log(`Successfully rolled back to the ${height} height`)
    } else {
      console.log('Failed to roll back')
      process.exit(1)
    }
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

    console.log('Setup listening')

    this.walletClient.bind('confirmed', async (walletID, confirmed) => {
      if (walletID === config.wallet) {
        const inputs = this.filterIORelatedToWallet(confirmed.inputs, true)
        const outputs = this.filterIORelatedToWallet(confirmed.outputs)

        if (inputs.length > 0) {
          console.log('Withdraw confirmed: %s', confirmed.hash)
          return
        }

        if (outputs.length <= 0) {
          console.log('Invalid confirmed transaction: %s', JSON.stringify(confirmed))
          return
        }

        for (var output of outputs) {
          console.log('Sender: %s, Receiver: %s, Amount: %d', confirmed.inputs[0].address, output.address, output.value)
        }
        // Todo: Send to service all outputs values and validate address in database
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

  filterIORelatedToWallet(io, ignoreChange = false) {
    const res = io.filter(
      (item) => {
        if (item.path === null) {
          return false
        }
        if (!ignoreChange && item.path.change) {
          return false
        }
        return true
      },
    )
    return res
  }
}

module.exports = Usecase
