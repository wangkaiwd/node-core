const fs = require('fs').promises;

async function read () {
  const name = await fs.readFile('./name.txt');

  const age = await fs.readFile(name, 'utf8');

  return age;
}

read().then((result) => {
  console.log(result);
}, (err) => {
  console.log(err);
});

