export default function DateInput({
    className,
    isInvalid,
    value,
    onChangeHandler,
    isEditable,
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
        backgroundColor: "rgb(244, 244, 245)",
        borderColor: "rgb(244, 244, 245)",
    };

    const twStyle1 =
        "transition-all ease-in duration-[0.2s] w-full overflow-y-auto border-2 rounded-[8px] py-[.2rem] px-[.4rem] resize-none bg-inherit " +
        (isInvalid ? "border-danger " : "border-[#e4e4e7] ") +
        "dark:border-solid " +
        (isInvalid ? "dark:border-danger" : "dark:border-default-200");

    const twStyle2 =
        "transition-all ease-in duration-[0.2s] w-full overflow-y-auto border-2 rounded-[8px] py-[.2rem] px-[.4rem] resize-none bg-default-100 " +
        (isInvalid ? "border-danger " : "border-default-100 ") +
        "dark:border-solid " +
        (isInvalid ? "dark:border-danger" : "dark:border-default-100");

    return (
        <input
            className={isEditable ? twStyle1 : twStyle2}
            type="date"
            //id="inputBoxGeneric"
            //style={isEditable===true ? inputStyle : viewOnly}
            readOnly={isEditable === true ? false : true}
            name="datepicker"
            value={value}
            onChange={onChangeHandler}
        ></input>
    );
}
