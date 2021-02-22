module.exports = {
  _body: '',
  set body (val) { // ctx.response.body, this => ctx.response
    this.res.statusCode = 200;
    this._body = val;
  },
  // set body (value) {
  //   this.res.write = value;
  //   // 那应该什么时候执行end?
  // },
  get body () { // 返回的是ctx.response上的_body,并不是当前对象中定义的_body
    return this._body;
  }
};