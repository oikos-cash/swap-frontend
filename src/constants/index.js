import { injected } from '../connectors'

import addresses from '@oikos/swap/addresses.json'

// deploy.js output in uniswap contracts repo

const toEthAddress = str => `0x${str.slice(2)}`

export const FACTORY_ADDRESSES = {
  1: toEthAddress(addresses.mainnet.factory),
  2: toEthAddress(addresses.shasta.factory)
}

export const SUPPORTED_THEMES = {
  DARK: 'DARK',
  LIGHT: 'LIGHT'
}

export const NAME = 'name'
export const SYMBOL = 'symbol'
export const DECIMALS = 'decimals'
export const EXCHANGE_ADDRESS = 'exchangeAddress'

const synthWhitelist = ['sUSD', 'sTRX', 'OKS']
const otherTokensWhitelist = ['USDJ', 'JST', 'TEWKEN', 'DCD']
const secretWhitelist = localStorage.getItem('development') ? ['CNS'] : []
// const otherTokensWhitelist = ['USDJ', 'JST', 'TEWKEN', 'DCD', "USDT"]

const exchangeWhitelist = [...synthWhitelist, ...otherTokensWhitelist, ...secretWhitelist]
const buildTokens = addrs => {
  return Object.keys(addrs.exchanges)
    .filter(symbol => exchangeWhitelist.includes(symbol))
    .map(symbol => {
      const { address, tokenAddress, decimals = 18 } = addrs.exchanges[symbol]
      return [
        toEthAddress(tokenAddress),
        {
          [NAME]: symbol,
          [SYMBOL]: symbol,
          [DECIMALS]: decimals,
          [EXCHANGE_ADDRESS]: toEthAddress(address)
        }
      ]
    })
    .reduce((acc, [tokenAddress, obj]) => {
      return { ...acc, [tokenAddress]: obj }
    }, {})
}

export const INITIAL_TOKENS_CONTEXT = {
  1: buildTokens(addresses.mainnet),
  2: buildTokens(addresses.shasta)
  /*
  2: {
    '0x056c4b3c825e6220784a640945e11a563f129722': {
      [NAME]: 'Synth sTRX',
      [SYMBOL]: 'sTRX',
      [DECIMALS]: 18, // TODO: why is sTRX 18 decimals? :/
      [EXCHANGE_ADDRESS]: toEthAddress(addresses.exchanges.sTRX)
    }
  }
  */
}
console.log(INITIAL_TOKENS_CONTEXT)

const MAINNET_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  /*
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  */
  TRONLINK: {
    connector: injected, // todo
    name: 'TronLink',
    iconName: 'tronlink.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#4196FC'
  }
}

export const SUPPORTED_WALLETS =
  process.env.REACT_APP_CHAIN_ID !== '1'
    ? MAINNET_WALLETS
    : {
        ...MAINNET_WALLETS
        /*
        ...{
          WALLET_CONNECT: {
            connector: walletconnect,
            name: 'WalletConnect',
            iconName: 'walletConnectIcon.svg',
            description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
            href: null,
            color: '#4196FC'
          },
          WALLET_LINK: {
            connector: walletlink,
            name: 'Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Use Coinbase Wallet app on mobile device',
            href: null,
            color: '#315CF5'
          },
          COINBASE_LINK: {
            name: 'Open in Coinbase Wallet',
            iconName: 'coinbaseWalletIcon.svg',
            description: 'Open in Coinbase Wallet app.',
            href: 'https://go.cb-w.com/mtUDhEZPy1',
            color: '#315CF5',
            mobile: true,
            mobileOnly: true
          },
          TRUST_WALLET_LINK: {
            name: 'Open in Trust Wallet',
            iconName: 'trustWallet.png',
            description: 'iOS and Android app.',
            href: 'https://link.trustwallet.com/open_url?coin_id=60&url=https://uniswap.exchange/swap',
            color: '#1C74CC',
            mobile: true,
            mobileOnly: true
          },
          FORTMATIC: {
            connector: fortmatic,
            name: 'Fortmatic',
            iconName: 'fortmaticIcon.png',
            description: 'Login using Fortmatic hosted wallet',
            href: null,
            color: '#6748FF',
            mobile: true
          },
          Portis: {
            connector: portis,
            name: 'Portis',
            iconName: 'portisIcon.png',
            description: 'Login using Portis hosted wallet',
            href: null,
            color: '#4A6C9B',
            mobile: true
          },
          Torus: {
            connector: torus,
            name: 'Torus',
            iconName: 'torus.png',
            description: 'Login via Google, Facebook and others',
            href: null,
            color: '#5495F7',
            mobile: true
          }
        }
        */
      }

// list of tokens that lock fund on adding liquidity - used to disable button
export const brokenTokens = [
  '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
  '0x95dAaaB98046846bF4B2853e23cba236fa394A31',
  '0x55296f69f40Ea6d20E478533C15A6B08B654E758',
  '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA',
  '0x5C406D99E04B8494dc253FCc52943Ef82bcA7D75'
]

export const NetworkContextName = 'NETWORK'
