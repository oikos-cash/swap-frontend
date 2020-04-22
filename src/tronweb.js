const TronWeb = require('tronweb')

const createTronWeb = () => {
  const HttpProvider = TronWeb.providers.HttpProvider
  const fullNode = new HttpProvider('https://api.trongrid.io')
  const solidityNode = new HttpProvider('https://api.trongrid.io')
  const eventServer = 'https://api.trongrid.io'
  const privateKey = process.env.PRIVATE_KEY || '0000000000000000000000000000000000000000000000000000000000000001'
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey)
  return tronWeb
}

// createTronWeb()

export default createTronWeb
