const Sequelize = require('sequelize');
const dbConfig = require('./devConfig');


const sequelize = new Sequelize(
    dbConfig.mysql.database,
    dbConfig.mysql.user,
    dbConfig.mysql.password,
    {
    host: dbConfig.mysql.host,
    dialect: dbConfig.mysql.dialect,
    operatorsAliases: false,
    port: dbConfig.mysql.port,
    pool: {
        max: 10,
        min: 3,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00' //东八时区
});

//测试数据库链接
// sequelize.authenticate().then(function() {
//     console.log("数据库连接成功");
// }).catch(function(err) {
//     //数据库连接失败时打印输出
//     console.error(err);
//     throw err;
// });

exports.sequelize = sequelize;
