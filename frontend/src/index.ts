import '../style/style.css';
import '../style/home-style.css';

function helloWorld() {
  const element = document.getElementById('hello-world')
  if (element) {
    element.textContent = 'Learning vite is cool'
    }

}



console.log('Hello Vite!');
helloWorld();