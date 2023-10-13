import { Database } from 'sqlite';
import * as config from '../consts';
import { DbOperator } from '../types';

export function createRecordOperator(db: Database): DbOperator {
  const setMonitorBlkNum = async (
    blockNumber: number,
    chainType: string
  ): Promise<void> => {
    await db.run(
      'insert or replace into monitor ' + '(`blockNumber`, `chainType`)' + ' values (?, ?)',
      [blockNumber, chainType]
    );
  }

  const getMonitorBlkNum = async (chainType: string): Promise<number> => {
    const records = await db.all(
      'select blockNumber from monitor where chainType = ?',
      [chainType],
    );
    if (records.length > 0) {
      return records[0].blockNumber;
    }
    return -1;
  }

  return {
    getMonitorBlkNum,
    setMonitorBlkNum
  };
}
