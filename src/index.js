import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { ethers } from 'ethers'

import { NetworkContextName } from './constants'
import { isMobile } from 'react-device-detect'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
import BalancesContextProvider, { Updater as BalancesContextUpdater } from './contexts/Balances'
import TokensContextProvider from './contexts/Tokens'
import AllowancesContextProvider from './contexts/Allowances'
import App from './pages/App'
import ThemeProvider, { GlobalStyle } from './theme'
import promiseRetry from 'promise-retry'
import './i18n'

import { EventEmitter } from 'events'
import createTronWeb from './tronweb'

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

function getLibrary(provider_) {
  let provider = provider_
  if (!provider || !provider.trx) {
    provider = window.tronWeb || createTronWeb()
  }
  const tronWeb = provider
  const getBlockNumber = async () => {
    const block = await tronWeb.trx.getCurrentBlock()
    return block.block_header.raw_data.number
  }
  const emitter = new EventEmitter()
  const on = (...args) => {
    emitter.on(...args)
  }
  const removeListener = (...args) => {
    emitter.removeListener(...args)
  }
  const lookupAddress = async (...args) => {
    console.warn('library.lookupAddress() not implemented', args)
  }
  const getBalance = async address => {
    try {
      const balance = await tronWeb.trx.getBalance(toTronAddr(address))
      //console.log('getBalance', address, balance.toString())
      // console.log(`${address} balance is`, balance)
      return balance
    } catch (err) {
      console.error('error getting balance from tronweb', { address })
      throw err
    }
  }

  /*
   *  retry versioni
  const getTransactionReceipt = async hash => {
    const res = await promiseRetry(async retry => {
      console.log({ hash, tronWeb })
      const info = await tronWeb.trx.getTransactionInfo(hash)
      if (!info.id) {
        retry()
      }
      return info
    })
    console.log(res)
    return res
  }
  */

  const getTransactionReceipt = async hash => {
    const info = await tronWeb.trx.getTransactionInfo(hash)
    if (!info.id) {
      return null
    }
    return info
  }

  const toTronAddr = str => {
    return tronWeb.address.fromHex(`41${str.slice(2)}`)
  }

  // poll for new blocks
  let lastBlockNumber
  setInterval(async () => {
    // query new block
    const block = await promiseRetry(async retry => {
      try {
        const b = await tronWeb.trx.getCurrentBlock()
        if (!b || !b.block_header || !b.block_header.raw_data) {
          return retry()
        }
        return b
      } catch (err) {
        console.error({ tronWeb, err })
        return retry()
      }
    })
    const blockNumber = block.block_header.raw_data.number
    if (lastBlockNumber !== blockNumber) {
      // console.log(`new block ${blockNumber}`, block)
      lastBlockNumber = blockNumber
      emitter.emit('block', block)
    }
  }, 1000)

  return {
    provider,
    getBlockNumber,
    getBalance,
    on,
    lookupAddress,
    removeListener,
    getTransactionReceipt,
    toTronAddr
  }
}

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-todo')
  ReactGA.set({
    customBrowserType: !isMobile ? 'desktop' : window.web3 || window.ethereum ? 'mobileWeb3' : 'mobileRegular'
  })
} else {
  ReactGA.initialize('test', { testMode: true })
}

ReactGA.pageview(window.location.pathname + window.location.search)

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TransactionContextProvider>
          <TokensContextProvider>
            <BalancesContextProvider>
              <AllowancesContextProvider>{children}</AllowancesContextProvider>
            </BalancesContextProvider>
          </TokensContextProvider>
        </TransactionContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
      <TransactionContextUpdater />
      <BalancesContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <ContextProviders>
        <Updaters />
        <ThemeProvider>
          <>
            <GlobalStyle />
            <App />
          </>
        </ThemeProvider>
      </ContextProviders>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById('root')
)
