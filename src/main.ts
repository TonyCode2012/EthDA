import Bluebird from 'bluebird';
import { loadDb } from "./db";
import { AppContext, Task } from "./types";
import _ from 'lodash';
import MainnetApi from "./chain";
import { logger, timeout, Dayjs } from './utils';
import { createMonitorTask } from "./monitor";

const MaxNoNewBlockDuration = Dayjs.duration({
  minutes: 30,
});

async function main() {
  const db = await loadDb();
  const mainnetApi: MainnetApi = await startCrustChain()

  const context :AppContext = {
    database: db,
    mainnetApi: mainnetApi,
  };

  const task = await createMonitorTask(context);

  try {
    task.start(context);
    await doEventLoop(context);
  } catch(e) {
    logger.error(`unexpected error occurs, message:${e}`);
    throw e;
  } finally {
    await timeout(db.close(), 5 * 1000, null);
    mainnetApi.stop();
    logger.info('stopping tasks');
    await timeout(
      task.stop(),
      5 * 1000,
      null,
    );
  }
}

async function startCrustChain() {
  const mainnetApi: MainnetApi = new MainnetApi();
  await mainnetApi.initApi();
  return mainnetApi;
}

async function doEventLoop(context: AppContext): Promise<void> {
  const { mainnetApi } = context;
  let lastBlock = await mainnetApi.latestFinalizedBlock();
  let lastBlockTime = Dayjs();
  logger.info('running event loop');
  do {
    const curBlock = await mainnetApi.latestFinalizedBlock();
    if (lastBlock >= curBlock) {
      const now = Dayjs();
      const diff = Dayjs.duration(now.diff(lastBlockTime));
      if (diff.asSeconds() > MaxNoNewBlockDuration.asSeconds()) {
        logger.error(
          'no new block for %d seconds, quiting smanager!',
          diff.asSeconds(),
        );
        throw new Error('block not updating');
      }
      await Bluebird.delay(3 * 1000);
      continue;
    }
    await Bluebird.delay(10 * 1000);
  } while (true); // eslint-disable-line
}

main()
  .catch((e: any) => {
    logger.error(e.message);
    process.exit(1);
  })
