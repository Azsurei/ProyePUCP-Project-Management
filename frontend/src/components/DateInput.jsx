export default function DateInput({
    className,
    isInvalid,
    value,
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
        borderColor: isInvalid ? "red" : "rgb(211, 211, 211)",
        borderWidth: "2px",
        borderRadius: "8px",
        padding: ".2rem .4rem",
        resize: "none",
    };

    return (
        <input
            className={className}
            type="date"
            id="inputBoxGeneric"
            style={inputStyle}
            name="datepicker"
            defaultValue={value}
            onChange={onChangeHandler}
        ></input>
    );
}
