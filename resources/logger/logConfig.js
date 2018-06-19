const log4js = require('log4js');
/**
 * log4js配置
 */
log4js.configure({
  appenders: {
    ruleStdout: {
      type: 'stdout', //控制台输出
      category: "console"
    },
    ruleFile: {
      type: 'dateFile', //文件输出
      filename: '/data/logs/vote-logs/',
      pattern: 'love520-yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 5,
      alwaysIncludePattern: true,
      category: 'normal'
    }
  },
  categories: {
    default: {appenders: ['ruleStdout', 'ruleFile'], level: log4js.levels.INFO}
  }
});

const dateFileLog = log4js.getLogger('normal');
dateFileLog.info("~~~~~~日志启动成功~~~~~~");

exports.logger = dateFileLog;
exports.use = function(app) {
  //页面请求日志,用auto的话,默认级别是WARN
  app.use(log4js.connectLogger(dateFileLog, {level: log4js.levels.INFO, format: ':method :url :status - :res[content-length] - :response-time ms -'}));
};
