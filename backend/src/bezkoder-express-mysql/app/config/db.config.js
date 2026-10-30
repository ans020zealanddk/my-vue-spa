module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "YourNewPassword123!", // Leave blank if you didn't set a password for root during apt install
  DB: "smk_wayfinder",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
