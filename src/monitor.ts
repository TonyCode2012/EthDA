import { AppContext, Task } from './types';
import { makeIntervalTask, listenEVMOrderEvents, logger } from './utils';
import { 
  OP_ENDPOINT_URL,
  OP_STORAGE_CONTRACT_ADDRESS,
  ETH_DA_EVM_ABI,
  ETH_DA_EVM_TOPICS,
  EVMChainType
} from './consts';

async function handleMonitorOP(
  context: AppContext
): Promise<void> {
  await listenEVMOrderEvents(
    context,
    OP_ENDPOINT_URL,
    OP_STORAGE_CONTRACT_ADDRESS,
    ETH_DA_EVM_ABI,
    ETH_DA_EVM_TOPICS,
    EVMChainType.OPTIMISM,
  );
}

export async function createMonitorTask(
  context: AppContext
): Promise<Task> {
  logger.info(`---> Optimism contract address:${OP_STORAGE_CONTRACT_ADDRESS}`);
  logger.info(`---> Optimism endpoint:${OP_ENDPOINT_URL}`);
  const monitorInterval = 15 * 1000;
  return makeIntervalTask(
    monitorInterval,
    monitorInterval,
    'Monitor-optimism',
    context,
    handleMonitorOP,
  );
}
