// Archivo script.js
// Import the functions you need from the SDKs you need
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqvsm-5MPjJo4LaPmDHQVaUvkDy3s7anY",
  authDomain: "database-d53ab.firebaseapp.com",
  projectId: "database-d53ab",
  storageBucket: "database-d53ab.appspot.com",
  messagingSenderId: "687277748539",
  appId: "1:687277748539:web:ad4d5665ab80bb8500071e",
  measurementId: "G-2CKZZPX4M2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const notas = [];

async function agregarNota(titulo, descripcion, imagenUrl) {
  try {
    const docRef = await addDoc(collection(db, "notas"), {
      titulo,
      descripcion,
      imagenUrl,
    });
    console.log("Nota agregada con ID: ", docRef.id);
  } catch (error) {
    console.error("Error al agregar la nota: ", error);
  }
}
async function actualizarListaNotas() {
  const listaNotasElement = document.getElementById("lista-notas");

  // Limpiar la lista de notas existente
  listaNotasElement.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "notas"));
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row"); // Agrega una fila Bootstrap

    querySnapshot.forEach((doc) => {
      const nota = doc.data();
      const notaDiv = document.createElement("div");
      notaDiv.classList.add("col-md-4", "mb-4"); // 3 columnas en pantallas medianas, Bootstrap crea automáticamente nuevas filas

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");

      const imagenElement = document.createElement("img");
      imagenElement.src = nota.imagenUrl;
      imagenElement.classList.add("card-img-top");
      imagenElement.onerror = function() {
        imagenElement.src = "img/nofound.jpg"; // Reemplaza "imagen_error.jpg" con la URL de tu imagen de marcador de posición o mensaje de error
        imagenElement.alt = "Imagen no disponible"; // Cambia el texto alternativo según tu preferencia
      };

      const cardBodyDiv = document.createElement("div");
      cardBodyDiv.classList.add("card-body");

      const tituloElement = document.createElement("h5");
      tituloElement.classList.add("card-title");
      tituloElement.textContent = nota.titulo;

      const descripcionElement = document.createElement("p");
      descripcionElement.classList.add("card-text");
      descripcionElement.textContent = nota.descripcion;

      const editarBtn = document.createElement("button");
      editarBtn.textContent = "Editar";
      editarBtn.classList.add("btn", "btn-primary", "mr-2");

      editarBtn.addEventListener("click", () => {
        // Aquí puedes abrir un formulario de edición de la nota
        // Puedes usar un modal, un formulario en la misma página, etc.
        // Cuando se complete la edición, actualiza la nota en Firestore
      });

      const borrarBtn = document.createElement("button");
      borrarBtn.textContent = "Borrar";
      borrarBtn.classList.add("btn", "btn-danger");

      borrarBtn.addEventListener("click", async () => {
        try {
          // Borra la nota de Firestore utilizando el ID del documento
          await deleteDoc(doc(db, "notas", doc.id));
          // Remueve la nota de la interfaz de usuario
          listaNotasElement.removeChild(notaDiv);
        } catch (error) {
          console.error("Error al borrar la nota: ", error);
        }
      });

      cardBodyDiv.appendChild(tituloElement);
      cardBodyDiv.appendChild(descripcionElement);
      cardBodyDiv.appendChild(editarBtn);
      cardBodyDiv.appendChild(borrarBtn);

      cardDiv.appendChild(imagenElement);
      cardDiv.appendChild(cardBodyDiv);

      notaDiv.appendChild(cardDiv);

      rowDiv.appendChild(notaDiv);
    });

    // Agrega la fila completa al elemento contenedor
    listaNotasElement.appendChild(rowDiv);
  } catch (error) {
    console.error("Error al obtener las notas: ", error);
  }
}



const formularioCrearNota = document.getElementById("formulario");
formularioCrearNota?.addEventListener("submit", (e) => {
  alert("You clicked the button");
  e.preventDefault();
  const titulo = document.getElementById("titulo").value;
  const descripcion = document.getElementById("descripcion").value;
  const imagenUrl = document.getElementById("imagenUrl").value;
  // Agregar la nueva nota al array de notas
  agregarNota(titulo, descripcion, imagenUrl);

  // Limpiar el formulario
  formularioCrearNota.reset();
});

if (window.location.pathname === "/index.html") {
  // Ejecutar la función para actualizar la lista de notas
  document.addEventListener("DOMContentLoaded", actualizarListaNotas);

}
