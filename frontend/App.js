
import PopUpEliminate from './componentes/PopUpEliminate';
import { useState } from "react";
function App() {

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  
  return (
    <div className="App">
      <div className='contenedor-principal'>
        
      </div>

      <button onClick={toggleModal} className="btn-modal">
        Eliminar
      </button>

      <PopUpEliminate
        modal = {modal} 
        toggle = {toggleModal}
      />
    </div>
  );
}

export default App;