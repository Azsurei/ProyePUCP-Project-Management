export default function InConstruction() {
    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <img src="/gifs/underConstruction.gif" alt="help me" className="" />
            <p style={{ fontFamily: "Montserrat", fontSize: "2rem", color: 'rgba(23, 43, 77, 0.55)'}}>
                Estamos trabajando en ello!
            </p>
        </div>
    );
}
