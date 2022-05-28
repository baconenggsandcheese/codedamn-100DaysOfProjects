import './App.css'

export default function App() {
  fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => console.log(json))
  return (
    <div>
      This is a change  New timeline feature didn't work
    </div>
  )
}

