export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'development',
    mysqlDB: process.env.MYSQL_DATABASE,
    mysqlUser: process.env.MYSQL_USER,
    mysqlUserRoot: process.env.MYSQL_USER_ROOT,
    mysqlPassword: process.env.MYSQL_PASSWORD,
    hostApi: process.env.HOST_API,
    mysqlRootPassword: process.env.MYSQL_ROOT_PASSWORD,
    mysqlPort: parseInt(process.env.MYSQL_PORT, 10) || 8080,
    portServer: parseInt(process.env.PORT_SERVER, 10) || 3002,
})