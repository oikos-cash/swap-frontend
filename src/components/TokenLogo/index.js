import React, { useState } from 'react'
import styled from 'styled-components'
import { isAddress } from '../../utils'
import { useWeb3React } from '@web3-react/core'

import { ReactComponent as EthereumLogo } from '../../assets/images/tron-logo.svg'

const TOKEN_ICON_API = address =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${isAddress(
    address
  )}/logo.png`
const BAD_IMAGES = {}

const Image = styled.img`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  background-color: white;
  border-radius: 1rem;
`

const Emoji = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

const StyledEthereumLogo = styled(EthereumLogo)`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`

export default function TokenLogo({ address, size = '1rem', symbol = '', ...rest }) {
  const [error, setError] = useState(false)

  let path = ''
  if (address === 'TRX') {
    return <StyledEthereumLogo size={size} />
  } else if (symbol.startsWith('s') || symbol === 'OKS') {
    // snx token
    path = `https://oikos.exchange/images/synths/${symbol}-icon.svg`
    // path = `https://raw.githubusercontent.com/oikos-cash/exchange/master/public/images/synths/${symbol}-icon.svg`
    // gettin CORB error on github raw...
  } else if (!error && !BAD_IMAGES[address]) {
    path = TOKEN_ICON_API(address.toLowerCase())
  } else {
    return (
      <Emoji {...rest} size={size}>
        <span role="img" aria-label="Thinking">
          🤔
        </span>
      </Emoji>
    )
  }

  return (
    <Image
      {...rest}
      alt={address}
      src={path}
      size={size}
      onError={() => {
        BAD_IMAGES[address] = true
        setError(true)
      }}
    />
  )
}
