## `Node`基础概念

* this
  * top level this
  * function inner this
* [Global objects](https://nodejs.org/dist/latest-v14.x/docs/api/globals.html#globals_global_objects)
  * Buffer
  * process

* [the module wrapper](https://nodejs.org/dist/latest-v14.x/docs/api/modules.html#modules_the_module_wrapper)

process:

* [platform](https://devdocs.io/node~14_lts/process#process_process_platform)
* [cwd](https://devdocs.io/node~14_lts/process#process_process_cwd/)
* [chdir](https://devdocs.io/node~14_lts/process#process_process_chdir_directory)
* [env](https://devdocs.io/node~14_lts/process#process_process_env)
  * windows: set, mac: export
  * cross-env
* [argv](https://devdocs.io/node~14_lts/process#process_process_argv)
* [nextTick](https://devdocs.io/node~14_lts/process#process_process_nexttick_callback_args)

commander

module:

* module.exports
* require

核心模块：

* fs
  * fs.existsSync
* path
  * path.resolve
  * path.join
  * path.extname
  * path.relative
  * path.dirname
* vm
  * runInThisContext

自定义模块：

第三方模块：

implement commonjs:

* source code debug
* implement by myself

step:

* cache(don't again execute code)

find:

* 查找js文件 -> -> json文件 -> 件夹下的index.js文件 -> package.json中的main字段(版本不同可能查找方式会不同)
* 不是绝对路径或相对路径(非核心模块)回去node_modules下查找
* 如果当前node_modules找不到会继续向上层node_modules中查找，直到根目录
