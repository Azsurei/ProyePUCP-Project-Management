export default function DateInput({
    className,
    isInvalid,
    value,
    onChangeHandler,
    isEditable
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
        borderWidth: "2px",
        borderRadius: "8px",
        padding: ".2rem .4rem",
        resize: "none",
    };

    const viewOnly = {
        width: "100%",
        overflowY: "auto",
        borderWidth: "2px",
        borderRadius: "8px",
        padding: ".2rem .4rem",
        resize: "none",
        backgroundColor: 'rgb(244, 244, 245)',
        borderColor: 'rgb(244, 244, 245)'
    };

    const str = " bg-inherit border-solid border" + (isInvalid ? "-danger ":"-[#e4e4e7] ") + "dark:border-solid dark:border" + (isInvalid ? "-danger":"-default-200");
    return (
        <input
            className={className + str}
            type="date"
            id="inputBoxGeneric"
            style={isEditable===true ? inputStyle : viewOnly}
            readOnly={isEditable===true ? false : true}
            name="datepicker"
            value={value}
            onChange={onChangeHandler}
        ></input>
    );
}
