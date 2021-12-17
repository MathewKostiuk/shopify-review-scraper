const cron = require('node-cron');

class CronJobs {
  constructor(interval, task, obj) {
    this.interval = interval;
    this.task = task;
    this.obj = obj;
  }

  run() {
    cron.schedule(this.interval, async () => {
      const object = new this.obj();
      await object.init();
      const date = new Date();
      this.message = `Last crawled ${this.task} on ${date.toLocaleDateString()} at ${date.toLocaleTimeString('en-US')}`
      console.log(this.message);
    });
  }
}

module.exports = CronJobs;
