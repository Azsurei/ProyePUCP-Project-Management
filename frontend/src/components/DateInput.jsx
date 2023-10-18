export default function DateInput({
    className,
    onChangeHandler,
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
        <input
            className={className}
            type="date"
            id="inputBoxGeneric"
            style={inputStyle}
            name="datepicker"
            onChange={onChangeHandler}
        ></input>
    );
}
