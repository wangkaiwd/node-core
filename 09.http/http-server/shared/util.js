function getProtocol (req) {
  return req.socket.encrypted ? 'https' : 'http';
}

function getFullUrl (req) {
  const { host } = req.headers;
  return getProtocol(req) + '://' + host + req.url;
}

module.exports = {
  getProtocol,
  getFullUrl
};