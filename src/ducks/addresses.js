const token = require("../build/contracts/ERC20Mock.json");
const exchange = require("../build/contracts/UniswapExchange.json");
const factory = require("../build/contracts/UniswapFactory.json");
const { SynthetixJs } = require("@oikos/oikos-js");
const snxJS = new SynthetixJs({ networkId: 2 });

const sUSDAddress = snxJS.sUSD.contract.address;
const sBTTAddress = snxJS.sBTT.contract.address;
const oksAddress = "41e90ca52ebf82c295d79024076d37b6c5c604e172"; //snxJS.Synthetix.contract.address;

const RINKEBY = null;
const networkId = 2;

const factoryAddress = factory.networks[networkId].address;
const exchangeAddress = exchange.networks[networkId].address;

const MAIN = {
  factoryAddress: factoryAddress,
  exchangeAddresses: {
    addresses: [
      ["sUSD", "TQWkJqpnx9iuanoTqYMiPyc6PDVmU8HUAZ"],
      ["sBTT", "THQbsSwQdR4NgzAzoucrMeiWgChHBfBGzJ"],
      ["OKS", "THoTAowyt2N51ctGxPKLbEoxX9Gwy2BHzK"],
    ],
    fromToken: {
      [sUSDAddress]: "TQWkJqpnx9iuanoTqYMiPyc6PDVmU8HUAZ",
      [sBTTAddress]: "THQbsSwQdR4NgzAzoucrMeiWgChHBfBGzJ",
      [oksAddress]: "THoTAowyt2N51ctGxPKLbEoxX9Gwy2BHzK",
    },
  },
  tokenAddresses: {
    addresses: [
      ["sUSD", sUSDAddress],
      ["sBTT", sBTTAddress],
      ["OKS", oksAddress],
    ],
  },
};

const SET_ADDRESSES = "app/addresses/setAddresses";
const ADD_EXCHANGE = "app/addresses/addExchange";

const initialState = RINKEBY;

export const addExchange = ({ label, exchangeAddress, tokenAddress }) => (
  dispatch,
  getState
) => {
  const {
    addresses: { tokenAddresses, exchangeAddresses },
  } = getState();

  if (tokenAddresses.addresses.filter(([symbol]) => symbol === label).length) {
    return;
  }

  if (exchangeAddresses.fromToken[tokenAddresses]) {
    return;
  }

  dispatch({
    type: ADD_EXCHANGE,
    payload: {
      label,
      exchangeAddress,
      tokenAddress,
    },
  });
};

export const setAddresses = (networkId) => {
  switch (networkId) {
    // Main Net
    case 1:
    case "1":
      return {
        type: SET_ADDRESSES,
        payload: MAIN,
      };
    // Rinkeby
    case 4:
    case "4":
    default:
      return {
        type: SET_ADDRESSES,
        payload: RINKEBY,
      };
  }
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ADDRESSES:
      return payload;
    case ADD_EXCHANGE:
      return handleAddExchange(state, { payload });
    default:
      return state;
  }
};

function handleAddExchange(state, { payload }) {
  const { label, tokenAddress, exchangeAddress } = payload;

  if (!label || !tokenAddress || !exchangeAddress) {
    return state;
  }

  return {
    ...state,
    exchangeAddresses: {
      ...state.exchangeAddresses,
      addresses: [
        ...state.exchangeAddresses.addresses,
        [label, exchangeAddress],
      ],
      fromToken: {
        ...state.exchangeAddresses.fromToken,
        [tokenAddress]: exchangeAddress,
      },
    },
    tokenAddresses: {
      ...state.tokenAddresses,
      addresses: [...state.tokenAddresses.addresses, [label, tokenAddress]],
    },
  };
}
