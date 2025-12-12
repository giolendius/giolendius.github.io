function helloWorld() {
  const element = document.getElementById('hello-world')

  if (element) {
    element.textContent = 'Hello, World!'+process.env.SUPER_SECRET
    }

}

helloWorld();