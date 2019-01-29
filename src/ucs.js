class Usecase {
  constructor(nodeClient, walletClient) {
    this.nodeClient = nodeClient
    this.walletClient = walletClient
  }

  async genAddress() {
    const receive = await this.walletClient.createAddress('default', 'default')
    if (receive == null) {
      throw Error('Can not create address')
    }
    return receive.address.toString()
  }

  async getTransaction(txId) {
    const tx = await this.walletClient.getTX('primary', txId)
    if (tx === null) {
      throw Error('Transaction not found')
    }
    const receiver = this.getOutput(tx.outputs)

    return {
      confirmed: tx.confirmations >= 1,
      amount: receiver.value,
      address: receiver.address,
      createdAt: tx.time,
    }
  }

  async test() {
    const acct = await this.walletClient.getAccount('primary', 'default')
    const receive = await this.walletClient.createAddress('primary', 'default')

    await this.nodeClient.execute('generatetoaddress', [ 100, receive.address ])

    await this.sendTransaction(acct.receiveAddress, 10000, 10000)
    console.log(acct.receiveAddress)

    this.fetchFees()
  }

  async listen() {
    this.walletClient.on('connect', () => {
      this.walletClient.all()
    })
    await this.walletClient.open()

    this.walletClient.bind('confirmed', (walletID, confirmed) => {
      // Todo: Replace with real wallet
      if (walletID === 'primary') {
        const receiver = this.getOutput(confirmed.outputs)

        console.log('Confirmed address:', receiver.address)
      } else {
        console.log('Not primary wallet:', confirmed)
      }
    })
  }

  async sendTransaction(addr, value, rate) {
    const options = {
      rate: rate,
      outputs: [{
        value: value,
        address: addr,
      }]
    }
    const tx = await this.walletClient.send('primary', options)
    return tx
  }

  async fetchFees() {
    const result = await this.nodeClient.execute('estimatesmartfee', [ 2 ])
    console.log(result)
    return {}
  }

  getOutput(outputs) {
    // Todo: Alter to better solution. Currently that's bullshit
    const outs = outputs.filter(
      (output) => output.path === null || output.path !== null && !output.path.change,
    )
    if (outs.length < 1 || outs.length > 1) {
      throw Error('FATAL: invalid outputs change address')
    }
    return outs[0]
  }
}

module.exports = Usecase
