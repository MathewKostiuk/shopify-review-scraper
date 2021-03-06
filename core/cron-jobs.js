const cron = require('node-cron');

class CronJobs {
  constructor(interval, task, obj, brand_id) {
    this.interval = interval;
    this.task = task;
    this.obj = obj;
    this.brand_id = brand_id
  }

  run() {
    cron.schedule(this.interval, async () => {
      const object = new this.obj(this.brand_id);
      await object.init();
      const date = new Date();
      this.message = `Last crawled ${this.task} on ${date.toLocaleDateString()} at ${date.toLocaleTimeString('en-US')}`
      console.log(this.message);
    });
  }
}

module.exports = CronJobs;
