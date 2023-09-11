const Logger = require('../../../logs/discord.log.v2');

const pushToLogDiscord = async (req, res, next) => {
  // console.log(`${req.get('host')}${req.originalUrl}`);
  try {
    Logger.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`,
    });
    return next();
  } catch (error) {
    next(error);
  }
  return next();
};

module.exports = {
  pushToLogDiscord,
};
