import Button from './Button';

function App() {
  return (
    <>
      <form>
        <label htmlFor="username">Nombre de usuario:</label>
        <input type="text" id="username" name="username" required />

        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" required />

        <Button type="submit" text="Iniciar sesión" />
        <Button type="submit" text="Google" />
        
      </form>
    </>
  );
}

export default App;
