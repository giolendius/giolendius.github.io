# HOW TO FRONTEND


## Needs:

You need Node.js which comes with npm, node package manager.
On windows: install choco
``` commandline
choco install nodejs
```
On Unix/mac you can use 

``` commandline
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"

# Download and install Node.js:
nvm install 24
```
Then check installation with:
```node -v``` or ```node --version```

## Initial Configuration

- you need node (see above)
- Run 'npm init' to create a package.json
- 'npm i typescript' will install typescript and write it on the dependencies
- in the future npm install will install what is there
- create a tsconfig.json, which give ts basic configuration

## Using vite

A different option is to use vite. Create the package.json as:

```` json
{ 
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
},

````
you can run in the terminal "npm run dev" to easily preview and develop the website
Running "npm run build" and then "nmp run preview" will allow to preview the build step used in deployment
In deployment, only the "nom run build" will be necessary

### Vite config file

In the root of the (frontend) project, i.e. where package.json and package-lock are
located, create
a file called ``vite.config.js``. Here you can insert configuration lines such as:

``` js
module.exports = {
  root: 'src',
  build: {
    outDir: '../build',
    emptyOutDir: true, // also necessary
  },
  preview: {
  port: 3000}
}
```
Root: allows to choose the folder of source file, i.e. subfolder of root folder where `index.html` is placed.
build.outDir: allows to choose where all output files are placed
preview.port: you get it


