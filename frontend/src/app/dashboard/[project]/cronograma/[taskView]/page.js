function TaskView() {
    return (
        <div className={toggleNew ? "divRight open" : "divRight"}>
            <div className="containerGeneralRight">
                <div className="flex flex-row items-end">
                    <HeaderWithButtonsSamePage
                        haveReturn={stateSecond === 2 ? true : false}
                        haveAddNew={false}
                        handlerReturn={() => {
                            setToggleNew(false);
                        }}
                        breadcrump={
                            "Inicio / Proyectos / " +
                            projectName +
                            " / Cronograma"
                        }
                        btnText={"Nueva tarea"}
                    >
                        {stateSecond === 1 && "Nueva tarea"}
                        {stateSecond === 2 && "Ver detalle de tarea"}
                        {stateSecond === 3 && "Editar tarea"}
                        {stateSecond === 4 && "Agregar tarea hija"}
                    </HeaderWithButtonsSamePage>

                    {stateSecond === 2 && (
                        <Button
                            color="primary"
                            size="md"
                            radius="sm"
                            onClick={() => {
                                setStateSecond(3);
                            }}
                            className="bg-F0AE19 h-[35px] mb-1 w-[115px]"
                            startContent={<UpdateIcon />}
                        >
                            Editar
                        </Button>
                    )}
                </div>

                {stateSecond === 4 && (
                    <p>
                        Esta tarea sera hija de la tarea "
                        {tareaPadre.sumillaTarea}"
                    </p>
                )}

                <div className="contFirstRow">
                    <div className="contNombre">
                        <p>Nombre de tarea</p>

                        <Textarea
                            variant={stateSecond === 2 ? "flat" : "bordered"}
                            readOnly={stateSecond === 2 ? true : false}
                            aria-label="name-lbl"
                            isInvalid={!validName}
                            errorMessage={!validName ? msgEmptyField : ""}
                            labelPlacement="outside"
                            label=""
                            placeholder="Escriba aquí"
                            classNames={{ label: "pb-0" }}
                            value={tareaName}
                            onValueChange={setTareaName}
                            minRows={1}
                            size="sm"
                            onChange={() => {
                                setValidName(true);
                            }}
                        />
                    </div>
                    <div className="contEstado">
                        <p>Estado</p>
                        <Select
                            //variant="bordered"
                            isDisabled={stateSecond === 2 ? true : false}
                            aria-label="cbo-lbl"
                            label=""
                            placeholder="Selecciona"
                            labelPlacement="outside"
                            classNames={{ trigger: "h-10" }}
                            size="sm"
                            color={colorDropbox[parseInt(tareaEstado, 10) - 1]}
                            onChange={(e) => {
                                // const state = {
                                //     id: dropBoxItems.find(item => item.itemKey === e.target.value).id,
                                //     itemKey: e.target.value
                                // }
                                setTareaEstado([e.target.value]);
                                console.log(tareaEstado);
                            }}
                            selectedKeys={tareaEstado}
                        >
                            {dropBoxItems.map((items) => (
                                <SelectItem
                                    key={items.itemKey}
                                    value={items.itemKey}
                                    color={items.color}
                                >
                                    {items.texto}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="contDescripcion">
                    <p>Descripcion</p>

                    <Textarea
                        variant={stateSecond === 2 ? "flat" : "bordered"}
                        readOnly={stateSecond === 2 ? true : false}
                        aria-label="desc-lbl"
                        isInvalid={!validDescripcion}
                        errorMessage={!validDescripcion ? msgEmptyField : ""}
                        labelPlacement="outside"
                        placeholder="Escriba aquí"
                        classNames={{ label: "pb-0" }}
                        value={tareaDescripcion}
                        onValueChange={setTareaDescripcion}
                        minRows={4}
                        size="sm"
                        onChange={() => {
                            setValidDescripcion(true);
                        }}
                    />
                </div>

                <div className="containerFechas">
                    <div className="horizontalFechas">
                        <div className="contFechaInicio">
                            <p className="headerFInicio">Fecha de inicio</p>
                            <DateInput
                                value={fechaInicio}
                                isEditable={stateSecond === 2 ? false : true}
                                className={""}
                                isInvalid={validFechas === true ? false : true}
                                onChangeHandler={(e) => {
                                    setFechaInicio(e.target.value);
                                    setValidFechas(true);
                                }}
                            ></DateInput>
                        </div>

                        <div className="contFechaFin">
                            <p className="headerFFin">Fecha de fin</p>
                            <DateInput
                                value={fechaFin}
                                isEditable={stateSecond === 2 ? false : true}
                                className={""}
                                isInvalid={validFechas === true ? false : true}
                                onChangeHandler={(e) => {
                                    //verificamos que sea menor a todas las fechas de las posteriores
                                    const isEarlierThanAll =
                                        listPosteriores.every(
                                            (tareaPost) =>
                                                e.target.value <
                                                tareaPost.fechaFin
                                        );
                                    console.log(isEarlierThanAll);
                                    if (isEarlierThanAll === true) {
                                        setFechaFin(e.target.value);
                                    } else {
                                        toast.error(
                                            "La fecha no puede ser mayor a la de una tarea posterior",
                                            { position: "top-center" }
                                        );
                                    }

                                    setValidFechas(true);
                                }}
                            ></DateInput>
                        </div>
                    </div>
                    {validFechas === "isEmpty" && (
                        <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                            <p className="text-tiny text-danger">
                                Estos campos no pueden estar vacios
                            </p>
                        </div>
                    )}
                    {validFechas === "isFalse" && (
                        <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                            <p className="text-tiny text-danger">
                                La fecha fin no puede ser antes que la fecha
                                inicio
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <p>Entregable Asociado</p>
                    <Select
                        items={listEntregables}
                        variant="bordered"
                        isInvalid={!validEntregable}
                        errorMessage={!validEntregable ? msgEmptyField : ""}
                        isDisabled={stateSecond === 2 ? true : false}
                        aria-label="cbo-lbl-ent"
                        label=""
                        placeholder="Selecciona un entregable"
                        labelPlacement="outside"
                        classNames={{ trigger: "h-10" }}
                        size="md"
                        //color={}
                        onChange={(e) => {
                            // const state = {
                            //     id: dropBoxItems.find(item => item.itemKey === e.target.value).id,
                            //     itemKey: e.target.value
                            // }
                            if (e.target.value === "") {
                                console.log("caso 1");
                                setTareaEntregable(new Set([]));
                            } else {
                                console.log(
                                    "caso 2 con " +
                                        e.target.value +
                                        " " +
                                        tareaEntregable[0]
                                );
                                setTareaEntregable([e.target.value]);
                                setValidEntregable(true);
                                console.log(tareaEntregable);
                            }
                        }}
                        selectedKeys={tareaEntregable}
                    >
                        {listEntregables.map((items) => (
                            <SelectItem
                                key={items.idEntregable}
                                value={items.idEntregableString}
                            >
                                {items.nombre}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div className="containerPosteriores mt-3">
                    <div className="posterioresHeader">
                        <p>Tareas posteriores</p>
                        {stateSecond !== 2 && (
                            <div
                                className="btnToPopUp bg-mainSidebar"
                                onClick={() => {
                                    if (fechaFin !== "") {
                                        onModalPosteriorOpen();
                                    } else {
                                        toast.warning(
                                            "Primero añade una fecha de fin a la tarea",
                                            { position: "top-center" }
                                        );
                                    }
                                }}
                            >
                                <p>Añadir</p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm">
                        Esta tarea sera asignada a los mismos usuarios que la
                        tarea previa y su fecha de inicio sera en la fecha fin
                        de la previa.
                    </p>
                    <div className="posterioresViewContainer bg-mainSidebar">
                        {listPosteriores.length === 0 && (
                            <p className="noUsersMsg">
                                No ha creado tareas posteriores
                            </p>
                        )}
                        {listPosteriores.map((tPost, index) => {
                            return (
                                // <div
                                //     className="cardTareasPosteriores bg-mainBackground"
                                //     key={index}
                                // >
                                //     <div className="flex flex-row justify-between">
                                //         <p>
                                //             {tPost.sumillaTarea}
                                //             {" | Concluirá el "}
                                //             {inputDateToDisplayDate(
                                //                 tPost.fechaFin
                                //             )}
                                //         </p>

                                //         {stateSecond !== 2 && (
                                //             <img
                                //                 src="/icons/icon-crossBlack.svg"
                                //                 onClick={() => {
                                //                     removeTareaPosterior(
                                //                         index + 1
                                //                     );
                                //                 }}
                                //             ></img>
                                //         )}
                                //     </div>

                                //     <p className="pl-5">
                                //         {"Descripción: " +
                                //             tPost.descripcion}
                                //     </p>
                                // </div>
                                <div
                                    key={index}
                                    className="
                                        cardTareasPosteriores
                                        bg-mainBackground
                                        flex
                                        flex-row
                                        items-center
                                        space-x-4
                                        "
                                >
                                    <div className="flex flex-col flex-1">
                                        <p className="text-large font-medium">
                                            {tPost.sumillaTarea}
                                        </p>
                                        <p className="pl-2">
                                            {tPost.descripcion}
                                        </p>
                                    </div>

                                    <div className="flex flex-col flex-1 justify-start items-start">
                                        <p className="text-large font-medium">
                                            Fecha fin
                                        </p>
                                        <p>
                                            {inputDateToDisplayDate(
                                                tPost.fechaFin
                                            )}
                                        </p>
                                    </div>

                                    {stateSecond !== 2 && (
                                        <CrossIcon
                                            handlerOnClick={() => {
                                                removeTareaPosterior(index + 1);
                                            }}
                                        ></CrossIcon>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p style={{ paddingTop: ".7rem" }}>
                    Asigna miembros a tu tarea
                </p>
                <div className="containerTab">
                    <div className="flex flex-wrap gap-4">
                        <Tabs
                            isDisabled={stateSecond === 2 ? true : false}
                            color={"primary"}
                            aria-label="Tabs colors"
                            radius="full"
                            classNames={{
                                cursor: "w-full bg-[#F0AE19]",
                            }}
                            selectedKey={tabSelected}
                            onSelectionChange={setTabSelected}
                        >
                            <Tab key="users" title="Usuarios" />
                            <Tab key="subteams" title="Subequipos" />
                        </Tabs>
                    </div>

                    {tabSelected === "users"
                        ? stateSecond !== 2 && (
                              <div
                                  className="btnToPopUp bg-mainSidebar"
                                  onClick={() => {
                                      setModal(true);
                                  }}
                              >
                                  <p>Buscar un miembro</p>
                                  <img
                                      src="/icons/icon-searchBar.svg"
                                      alt=""
                                      className="icnSearch"
                                  />
                              </div>
                          )
                        : stateSecond !== 2 && (
                              <div
                                  className="btnToPopUp bg-mainSidebar"
                                  onClick={onModalSubEOpen}
                              >
                                  <p>Buscar un subequipo</p>
                                  <img
                                      src="/icons/icon-searchBar.svg"
                                      alt=""
                                      className="icnSearch"
                                  />
                              </div>
                          )}
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                    <ul
                        className={
                            validAsigned === true &&
                            validSelectedSubteamUsers === true
                                ? "contUsers bg-mainSidebar"
                                : "contUsers invalid bg-mainSidebar"
                        }
                    >
                        {tabSelected === "users" ? (
                            selectedUsers.length !== 0 ? (
                                selectedUsers.map((component) => (
                                    <CardSelectedUser
                                        key={component.idUsuario}
                                        isEditable={
                                            stateSecond === 2 ? false : true
                                        }
                                        usuarioObject={component}
                                        removeHandler={removeUser}
                                    ></CardSelectedUser>
                                ))
                            ) : (
                                <p className="noUsersMsg">
                                    No ha seleccionado ningun usuario
                                </p>
                            )
                        ) : selectedSubteam !== null ? (
                            <div className="cardSubteam bg-mainBackground">
                                <div className="cardSubteam_Header">
                                    <div className="flex gap-[1rem]">
                                        <div className="cardLeftSide">
                                            <img src="/icons/sideBarDropDown_icons/sbdd14.svg"></img>
                                            <p
                                                style={{
                                                    fontFamily: "Roboto",
                                                }}
                                                className="text-mainHeaders"
                                            >
                                                {selectedSubteam.nombre}
                                            </p>
                                        </div>

                                        {/* {stateSecond !== 2 && (
                                                <div className="flex items-center">
                                                    <div
                                                        className="membersSelectAll"
                                                        onClick={() => {
                                                            let newUsrLst = [];
                                                            for (const user of selectedSubteam.participantes) {
                                                                newUsrLst.push(
                                                                    user.idUsuario
                                                                );
                                                            }
                                                            setSelectedSubteamUsers(
                                                                newUsrLst
                                                            );
                                                            setValidSelectedSubteamUsers(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        Seleccionar todos
                                                    </div>
                                                </div>
                                            )} */}
                                    </div>

                                    {stateSecond !== 2 && (
                                        <img
                                            src="/icons/icon-crossBlack.svg"
                                            onClick={() => {
                                                setSelectedSubteam(null);
                                                //setSelectedSubteamUsers([]);
                                            }}
                                        ></img>
                                    )}
                                </div>

                                {/* <div className="SubTeamUsersContainerSelected"> */}
                                {/* <CheckboxGroup
                                        isDisabled={
                                            stateSecond === 2 ? true : false
                                        }
                                        color={
                                            stateSecond === 2
                                                ? "default"
                                                : "primary"
                                        }
                                        value={selectedSubteamUsers}
                                        onChange={setSelectedSubteamUsers}
                                        orientation="horizontal"
                                        classNames={{
                                            base: "pl-[1.6rem]",
                                            wrapper: "gap-[1.8rem] ",
                                        }}
                                    > */}
                                <div className="flex flex-row gap-x-[1.8rem] gap-y-[.5rem] pl-[1.6rem] flex-wrap pb-2">
                                    {selectedSubteam.participantes.map(
                                        (user) => {
                                            return (
                                                <div
                                                    className="SingleUserIconContainerSelected"
                                                    key={user.idUsuario}
                                                >
                                                    {/* <Checkbox
                                                                value={
                                                                    user.idUsuario
                                                                }
                                                                onChange={() => {
                                                                    setValidSelectedSubteamUsers(
                                                                        true
                                                                    );
                                                                }}
                                                            ></Checkbox> */}

                                                    <Avatar
                                                        //isBordered
                                                        //as="button"
                                                        className="transition-transform w-[40px] min-w-[40px] h-[40x] min-h-[40px] bg-mainUserIcon"
                                                        src={user.imgLink}
                                                        fallback={
                                                            <p className="SingleUserIconSelected bg-mainUserIcon">
                                                                {user
                                                                    .nombres[0] +
                                                                    (user.apellidos !==
                                                                    null
                                                                        ? user
                                                                              .apellidos[0]
                                                                        : "")}
                                                            </p>
                                                        }
                                                    />

                                                    <div className="">
                                                        {user.nombres +
                                                            " " +
                                                            user.apellidos}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                                {/* </CheckboxGroup> */}
                                {/* </div> */}
                            </div>
                        ) : (
                            <p className="noUsersMsg">
                                No ha seleccionado ningun subequipo
                            </p>
                        )}
                    </ul>
                    {!validAsigned && (
                        <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                            <p className="text-tiny text-danger">
                                Debe asignar la tarea a un usuario o equipo!
                            </p>
                        </div>
                    )}
                    {!validSelectedSubteamUsers && (
                        <div className="flex relative flex-col gap-1.5 pt-1 px-1">
                            <p className="text-tiny text-danger">
                                Debe seleccionar usuarios asignados dentro del
                                subequipo!
                            </p>
                        </div>
                    )}
                </div>

                {stateSecond !== 2 && (
                    <div className="twoButtonsEnd pb-8">
                        <BtnToModal
                            nameButton="Descartar"
                            textHeader={
                                stateSecond === 3
                                    ? "Descartar Actualización"
                                    : "Descartar Registro"
                            }
                            textBody={
                                stateSecond === 3
                                    ? "¿Seguro que quiere descartar la actualizacion de esta tarea?"
                                    : "¿Seguro que quiere descartar el registro de esta tarea?"
                            }
                            headerColor="red"
                            colorButton="w-36 bg-slate-100 text-black"
                            oneButton={false}
                            leftBtnText="Cancelar"
                            rightBtnText="Confirmar"
                            doBeforeClosing={() => {
                                setToggleNew(false);
                            }}
                            //verifyFunction = {}       sin verificacion
                        />
                        <BtnToModal
                            nameButton="Aceptar"
                            textHeader="Registrar Tarea"
                            textBody={
                                stateSecond === 3
                                    ? "¿Seguro que quiere actualizar esta tarea?"
                                    : "¿Seguro que desea registrar esta tarea?"
                            }
                            //headerColor
                            colorButton="w-36 bg-blue-950 text-white"
                            oneButton={false}
                            leftBtnText="Cancelar"
                            rightBtnText="Confirmar"
                            doBeforeClosing={() => {
                                if (stateSecond === 1 || stateSecond === 4) {
                                    registrarTarea();
                                } else if (stateSecond === 3) {
                                    editarTarea();
                                }
                            }}
                            verifyFunction={() => {
                                let allValid = true;
                                if (tareaName === "") {
                                    setValidName(false);
                                    allValid = false;
                                }
                                if (tareaDescripcion === "") {
                                    setValidDescripcion(false);
                                    allValid = false;
                                }
                                if (fechaFin < fechaInicio) {
                                    setValidFechas("isFalse");
                                    allValid = false;
                                }
                                if (fechaInicio === "" || fechaFin === "") {
                                    setValidFechas("isEmpty");
                                    allValid = false;
                                }
                                if (
                                    tareaEntregable[0] === undefined ||
                                    tareaEntregable[0] === null
                                ) {
                                    setValidEntregable(false);
                                    allValid = false;
                                }
                                if (
                                    selectedSubteam === null &&
                                    selectedUsers.length === 0
                                ) {
                                    setValidAsigned(false);
                                    allValid = false;
                                }
                                if (
                                    selectedSubteam === null &&
                                    selectedUsers.length !== 0
                                ) {
                                    setTabSelected("users");
                                } else if (
                                    selectedSubteam !== null &&
                                    selectedUsers.length === 0
                                ) {
                                    setTabSelected("subteams");
                                }

                                if (allValid) {
                                    return true;
                                }
                            }}
                        />
                    </div>
                )}
            </div>
            {modal && (
                <ModalUser
                    handlerModalClose={() => {
                        setModal(false);
                    }}
                    handlerModalFinished={returnListOfUsers}
                    excludedUsers={selectedUsers}
                    idProyecto={projectId}
                    listAllUsers={false}
                ></ModalUser>
            )}

            <Toaster
                richColors
                closeButton={true}
                toastOptions={{
                    style: { fontSize: "1rem" },
                }}
            />
        </div>
    );
}
export default TaskView;
