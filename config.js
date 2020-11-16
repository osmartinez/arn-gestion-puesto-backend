var config = {
    development: {
        server: {
            host: '192.168.0.109',
            port: 9090,
        },
        rest:{
            host: '192.168.0.109',
            port: 3000,
        },
        database:{
            host:'192.168.0.104',
            port: 27017,
            name: 'test',
        }
    },
    production: {
        server: {
            host: 'localhost',
            port: 9090
        },
        rest:{
            host: '192.168.0.104',
            port: 3000,
        },
        database:{
            host:'192.168.0.104',
            port: 27017,
            name: 'prod',
        }
    },
};
module.exports = config;