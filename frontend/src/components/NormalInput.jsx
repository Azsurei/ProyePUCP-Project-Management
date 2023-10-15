export default function NormalInput({
    className,
    onChangeHandler,
    placeHolder,
    maxLength,
    rows,
}) {
    // #inputBoxGeneric{
    //     width: 100%;
    //     overflow-y: auto;

    //     border-color: rgb(211, 211, 211);
    //     border-width: 1px;
    //     border-radius: 4px;
    //     padding: 0 .4rem;

    //     resize: none;
    // }

    const inputStyle = {
        width: "100%",
        overflowY: "auto",
        borderColor: "rgb(211, 211, 211)",
        borderWidth: "1px",
        borderRadius: "4px",
        padding: "0 .4rem",
        resize: "none",
    };

    return (
        <textarea
            className={className}
            rows={rows}
            id="inputBoxGeneric"
            style={inputStyle}
            placeholder={placeHolder}
            maxLength={maxLength}
            onChange={(e) => {
                onChangeHandler(e.target.value);
            }}
        />
    );
}
