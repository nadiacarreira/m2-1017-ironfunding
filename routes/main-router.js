const indexRouter = require('./index');
const authRouter = require('./auth');
const campaignRouter =  require('./campaign');

module.exports = (app) => {
  app.use('/auth',authRouter);
  app.use('/campaign',campaignRouter);
  app.use('/',indexRouter);
};
