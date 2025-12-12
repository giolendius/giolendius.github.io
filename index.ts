function helloWorld() {
  const element = document.getElementById('hello-world')
//   const secrettt = process.env.SUPER_SECRET;
//   console.log(secrettt);
  if (element) {
    element.textContent = 'Hello, World!'
    }

}

helloWorld();