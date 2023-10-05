import "@/styles/recoverPassword.css";
import "@/styles/resetPassword.css";

export default function RootLayout({ children }) {
    return (
        <div className="App">
            <div>
                <img src="/images/LogoPUCPwhite.png" className="logoPucp"></img>
                <img
                    src="/images/LogoProyePUCPwhite.png"
                    className="logoProyePucp"
                ></img>
            </div>
            <div className="contenedor-principal">
                {children}
            </div>
        </div>
    );
}
