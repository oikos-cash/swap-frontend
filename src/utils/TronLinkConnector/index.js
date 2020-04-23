import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

const tron2ethAddr = str => `0x${str.slice(2).toLowerCase()}`

export class NoTronProviderError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No TronLink provider was found on window.tronWeb.'
  }
}
export class UserRejectedRequestError extends Error {
  constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

// taken from exchange code
export const SUPPORTED_NETWORKS = {
  1: 'mainnet',
  2: 'shasta'
}

// taken from exchange code
export async function getTronNetwork() {
  const defaultNetwork = { name: 'mainnet', networkId: 1 }

  if (!window.tronWeb) {
    return defaultNetwork
  }
  const apiHost = window.tronWeb.fullNode.host
  const matches = apiHost.match(/https:\/\/api\.([^.]*)\.trongrid.io/)

  if (!matches) return defaultNetwork
  const name = matches[1]

  const networkId = Object.keys(SUPPORTED_NETWORKS).find(networkId => SUPPORTED_NETWORKS[networkId] === name)

  return { name, networkId }
}

export class TronLinkConnector extends AbstractConnector {
  constructor(kwargs) {
    super(kwargs)
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  handleChainChanged(chainId) {
    this.emitUpdate({ chainId, provider: window.tronWeb })
  }
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }
  handleClose(code, reason) {
    this.emitDeactivate()
  }

  handleNetworkChanged(networkId) {
    this.emitUpdate({ chainId: networkId, provider: window.tronWeb })
  }
  async activate() {
    if (!window.tronWeb) {
      throw new NoTronProviderError()
    }
    // try to activate + get account via eth_requestAccounts
    const account = tron2ethAddr(window.tronWeb.defaultAddress.hex)
    return Object.assign({ provider: window.tronWeb }, account ? { account } : {})
  }
  async getProvider() {
    return window.tronWeb
  }
  async getChainId() {
    if (!window.tronWeb) {
      throw new NoTronProviderError()
    }
    // warning(false, 'chainId not implemented, defaulting to shasta')
    const { networkId } = await getTronNetwork()
    return networkId
  }
  async getAccount() {
    if (!window.tronWeb) {
      throw new NoTronProviderError()
    }
    const account = tron2ethAddr(window.tronWeb.defaultAddress.base58)
    return account
  }
  deactivate() {
    // noop with tronlink
  }
  async isAuthorized() {
    if (!window.tronWeb) {
      return false
    }
    return true
  }
}
