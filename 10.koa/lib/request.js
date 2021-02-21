const url = require('url');
module.exports = {
  get path () {
    const { pathname } = url.parse(this.req.url);
    return pathname;
  }
};