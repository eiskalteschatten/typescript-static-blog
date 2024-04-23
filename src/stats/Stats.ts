import path from 'node:path';
import fs from 'node:fs';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

import { PageStat } from '@/interfaces/stats.interface';
import logger from '@/lib/logger';

const execPromise = promisify(exec);

export default class Stats {
  private statsDirectory = path.resolve(process.cwd(), 'data', 'stats');
  static excludeFromStats = /^(\/css\/|\/libs\/|\/scripts\/|\/images\/|\/fonts\/|\/favicon\.ico\/)/;

  constructor() {
    if (!fs.existsSync(this.statsDirectory)) {
      fs.mkdirSync(this.statsDirectory, { recursive: true });
    }
  }

  async addPageHit(url: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const statsToday = await this.readStatsForDay(today);

    statsToday[url] = statsToday[url] || 0;
    statsToday[url]++;

    try {
      const statsFile = path.resolve(this.statsDirectory, `${today}.json`);
      const statsFileExisted = fs.existsSync(statsFile);

      await fs.promises.writeFile(
        statsFile,
        JSON.stringify(statsToday, null, 2),
        'utf8'
      );

      // Only commit and push stats files if the file didn't exist before so that it is only committed and pushed at most once a day
      if (process.env.NODE_ENV !== 'development' && !statsFileExisted) {
        await this.commitAndPushStats();
      }
    }
    catch (error) {
      logger.error(error);
    }
  }

  async readStatsForDay(date: string): Promise<PageStat> {
    try {
      const statsFile = path.resolve(this.statsDirectory, `${date}.json`);

      if (!fs.existsSync(statsFile)) {
        return {};
      }

      const contents = await fs.promises.readFile(statsFile, 'utf8');
      return contents ? JSON.parse(contents) : {};
    }
    catch (error) {
      logger.error(error);
    }
  }

  private async commitAndPushStats(): Promise<void> {
    try {
      await execPromise('git add ./data/stats');
      await execPromise('git commit -m "Update page stats"');
      await execPromise('git push');
    }
    catch (error) {
      logger.error(error);
    }
  }
}
