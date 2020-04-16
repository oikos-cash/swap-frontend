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
    warning(false, 'chainId not implemented, defaulting to shasta')
    const chainId = 2
    return chainId
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
