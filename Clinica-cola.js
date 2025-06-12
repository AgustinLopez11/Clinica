const agregar_a_colaBtn = document.querySelector('.agregar_a_colaBtn');
const siguiente_paciente_btn = document.querySelector('.siguiente_paciente_btn');
const input_nombre = document.querySelector('#input_nombre')
const input_edad = document.querySelector('#input_edad')
const input_sintoma = document.querySelector('#input_sintoma')
const display_nombre = document.querySelector('.display_nombre')
const display_edad_sintoma = document.querySelector('.display_edad_sintoma')
const display_nombre_siguiente = document.querySelector('.display_nombre_siguiente')
const pacientes_agregados_tabla = document.querySelector('.pacientes_agregados_tabla')
let recorrer;


agregar_a_colaBtn.addEventListener('click', () => {
  let nombre = input_nombre.value
  let edad = input_edad.value
  let sintoma = input_sintoma.value
  if (nombre != "" && edad != "" && sintoma != "") {
    NuevoPaciente.enqueue(nombre, edad, sintoma)
    NuevoPaciente.printQueue()//Me lo pinta de una vez
    display_nombre_siguiente.textContent=="-----" || display_nombre_siguiente.textContent=="No hay pacientes próximos"? display_nombre_siguiente.innerHTML=nombre:""
    input_nombre.value = ""
    input_edad.value = ""
    input_sintoma.value = ""
  } else {
    console.log("Todos los campos deben estar completos")
    alert("Todos los campos son obligatorios")
  }
})

siguiente_paciente_btn.addEventListener('click', () => {
  NuevoPaciente.peek()
  NuevoPaciente.dequeue()//Me eliminar el primer paciente
  NuevoPaciente.printQueue()//Me los vuelve a pintar
})


class Node {
  constructor(nombre, edad, sintoma) {
    this.nombre = nombre;
    this.edad = edad;
    this.sintoma = sintoma
    this.next = null;
    this.tiempo = tiempo()
  }
}


class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }
  peek() { //Me muestra el paciente que esta primero
    recorrer = this.first
    if (recorrer?.nombre == undefined) {
      display_nombre.innerHTML = "No hay pacientes que atender"
      display_edad_sintoma.innerHTML = ""
    } else {
      mensaje()
      display_nombre.innerHTML = recorrer.nombre
      speak(recorrer.nombre)
      display_edad_sintoma.innerHTML = `${recorrer.edad} años -- ${recorrer.sintoma}`
    }
    
    if (recorrer?.next?.nombre == undefined) {
      display_nombre_siguiente.innerHTML = "No hay pacientes próximos"
    } else {
      display_nombre_siguiente.innerHTML = recorrer.next.nombre
    }
  }
  enqueue(nombre, edad, sintoma) {//Me coloca al nuevo paciente
    const newNode = new Node(nombre, edad, sintoma);
    if (this.length === 0) {
      this.first = newNode;
      this.last = newNode;
    } else {
      this.last.next = newNode;
      this.last = newNode;
    }
    this.length++;
    recorrer = this.first
    localStorage.setItem("Pacientes", JSON.stringify(recorrer))
    return this;
  }
  dequeue() { //Elimnina el primer valor entrado
    if (!this.first) {
      recorrer = this.first
      return null;
    }
    if (this.first === this.last) {
      this.last = null;
    }
    this.first = this.first.next;
    this.length--;
    recorrer = this.first
    localStorage.setItem("Pacientes", JSON.stringify(recorrer))
    return this;
  }
  printQueue() {
    let htmls = ""
    for (let i = 0; i < this.length; i++) {
      htmls += crearFila(recorrer,i)
      recorrer = recorrer.next
    }
    pacientes_agregados_tabla.innerHTML = htmls;
  }
}
const NuevoPaciente = new Queue()

const crearFila = (paciente,i) => {
  return `<tr>
          <th scope="row">${i+1} </th>
          <td>${paciente.nombre}</td>
          <td>${paciente.edad} años</td>
          <td>${paciente.sintoma}</td>
          <td>${paciente.tiempo} </td>
        </tr>  
  `
}

const tiempo = () => {
  const date = new Date();
  const [hour, minutes, seconds] = [
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  return `${hour <= 12 ? hour : hour - 12}:${minutes}:${seconds} ${hour <= 12 ? "AM" : "PM"}`
}

const mensaje=()=>{
  const mensaje=document.querySelector('#mensaje')
  mensaje.style="animation: mover linear 0.1s infinite alternate;"
  setTimeout(()=>{
    mensaje.style="animation: mover linear 0.1s infinite alternate; animation-play-state: paused;"
  },1000)
}

function speak(nombre) {
  const utterance = new SpeechSynthesisUtterance(`Es turno de ${nombre}`);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[0]; 
  speechSynthesis.speak(utterance);
}