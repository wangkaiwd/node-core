// 后端声明大小的数量，都是字节数，这里是6个字节
// buffer声明出来后固定大小，不能随意改变
// const buf1 = Buffer.alloc(6);
// const buf2 = Buffer.from('张三李四');
//
// console.log(buf1, buf2);
// console.log(buf2.length); // length为字节数
//
// console.log(buf2.toString()); // utf8,base64

// 改buffer:
// 1. 通过索引更改
// 2. 重新声明一个空间，将结果拷贝过去
// buf1[1] = 100;
// console.log(buf1);

const buf3 = Buffer.alloc(12);
const buf4 = Buffer.from('张三');
const buf5 = Buffer.from('李四');
buf4.copy(buf3, 0, 0, 6);
buf5.copy(buf3, 6, 0, 6);
console.log(buf3.toString());