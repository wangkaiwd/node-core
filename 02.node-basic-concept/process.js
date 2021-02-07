// console.log(process.platform);

// The process.cwd method return current working directory of Node.js process
// console.log(process.cwd());

// The process.chdir method change the current working directory of the Node.js process or throw an exception if doing so fail
// (for instance, if specified directory not exist)
// process.chdir('../02.node-basic-concept');
// console.log(process.cwd());

// The process.env returns an object containing the user environment
// mac: export, window: set, compatible: across-env
// console.log(process.env);
// The process.argv property return an array containing command line arguments passed when Node.js process was launched.
// First element: process.execPath：absolute pathname of the executable that started the Node.js process
// Second element: will be the path to the JavaScript file being executed.
// The remaining elements will be any additional command-line arguments
// console.log(process.argv);

// process.nextTick adds callback to the 'next tick queue'.
// This queue  is fully drained after the current operation on JavaScript stack run to completion and before the event loop is allowed to continue
process.nextTick(() => {
  console.log('nextTick');
});

