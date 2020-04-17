import React from 'react'
import styled from 'styled-components'

import { Link } from '../../theme'
import Web3Status from '../Web3Status'
import { darken } from 'polished'

const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const HeaderElement = styled.div`
  margin: 1.25rem;
  display: flex;
  min-width: 0;
  display: flex;
  align-items: center;
`

const Nod = styled.span`
  transform: rotate(0deg);
  transition: transform 150ms ease-out;

  :hover {
    transform: rotate(-10deg);
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  #link {
    text-decoration-color: ${({ theme }) => theme.UniswapPink};
  }

  #title {
    display: inline;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.wisteriaPurple};
    :hover {
      color: ${({ theme }) => darken(0.1, theme.wisteriaPurple)};
    }
  }
`
const Logo = styled.img`
  content:url("${({ theme }) => theme.logoImg}");
  height:36px;
`
const LogoTitle = styled.h1`
  color: ${({ theme }) => theme.logoTitle};
  font-size: 18px;
`
 
export default function Header() {
  return (
    <HeaderFrame>
      <HeaderElement>
        <Title>
          <Nod>
            <Link id="link" href="/">
            <span role="img" aria-label="logo">
                <Logo></Logo>
            </span>
            </Link>
          </Nod>
          <Link id="link" href="/" style={{ marginLeft: '20px' }}>
            <LogoTitle>SWAP</LogoTitle>
          </Link>
        </Title>
      </HeaderElement>
      <HeaderElement>
        <Web3Status />
      </HeaderElement>
    </HeaderFrame>
  )
}
