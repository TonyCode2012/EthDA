import { ethers } from "ethers";
// Load env
// eslint-disable-next-line node/no-extraneous-require
require('dotenv').config();

const getParamOrExit = (name: string) => {
  const param = process.env[name];
  if (!param) {
    console.error(`Required config param '${name}' missing`);
    process.exit(1);
  }
  return param;
};

/**
 * @param {string} name
 * @param {boolean} except if true not exit
 * @returns param or null
 */
const getParamOrExitExcept = (name: string, except: boolean) => {
  const param = process.env[name];
  if (!param && !except) {
    console.error(`Required config param '${name}' missing`);
    process.exit(1);
  }
  return param ? param : "";
}

const getParam = (name: string) => {
  const param = process.env[name];
  if (!param) {
    return null;
  }
  return param;
};

const getTopics = (tags: string[]) => {
  const res: string[] = [];
  for (const tag of tags) {
    res.push(ethers.utils.id(tag));
  }
  return res;
}

export enum EVMChainType {
  ETHEREUM = 'ethereum',
  ARB1 = 'arb1',
  OPTIMISM = 'optimism',
  ZKSYNC = 'zksync',
  STARKNET = 'starknet',
  POLYGONZK = 'polygonzk',
  POLYGON = 'polygon',
};

export const EVMChain2Token = new Map<string,string>([
  [EVMChainType.ETHEREUM, 'eth'],
  [EVMChainType.ARB1, 'eth'],
  [EVMChainType.OPTIMISM, 'eth'],
  [EVMChainType.ZKSYNC, 'eth'],
  [EVMChainType.STARKNET, 'eth'],
  [EVMChainType.POLYGONZK, 'eth'],
  [EVMChainType.POLYGON, 'matic'],
]);

export const CRUST_SEEDS = getParamOrExit("CRUST_SEEDS");
export const CRUST_CHAIN_URL = getParamOrExit("CRUST_CHAIN_URL");
export const DB_PATH = getParamOrExit("DB_PATH");
export const API_PORT = parseInt(getParamOrExit("API_PORT"));

export const OP_TASK_ENABLE = process.env.OP_TASK_ENABLE as string !== 'false';
export const OP_ENDPOINT_URL = getParamOrExitExcept("OP_ENDPOINT_URL", OP_TASK_ENABLE);
export const OP_STORAGE_CONTRACT_ADDRESS = getParamOrExitExcept("OP_STORAGE_CONTRACT_ADDRESS", OP_TASK_ENABLE);

export const TRYOUT = 10;

export const ETH_DA_EVM_ABI = [
  "event EthDAEvent(string message)"
]
const ethDAEVMTopics = [
  "EthDAEvent(string)"
]
export const ETH_DA_EVM_TOPICS = getTopics(ethDAEVMTopics);
