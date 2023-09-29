import {
    Card,
    CardBody,
    CardFooter,
    Typography,
  } from "@material-tailwind/react";
  import ProgressBar from "@/components/equipoComps/ProgressBar";
  import "@/styles/dashboardStyles/projectStyles/EquipoStyles/Equipo.css";
  
  const CardEquipo = ({
    id,
    nombre,
    coordinador,
    bgcolor,
    completed,
  }) => {
    return (
      <Card className="w-full max-w-[26rem] shadow-lg">
        <CardBody>
          <div className="mb-3 flex items-center justify-between">
            <Typography variant="h5" color="blue-gray" className="font-medium">
              {nombre}
            </Typography>
          </div>
          <Typography color="gray">{coordinador}</Typography>
        </CardBody>
        <CardFooter className="pt-3">
          <div className="cardContainer">
            <ProgressBar key={id} bgcolor={bgcolor} completed={completed} />
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  export default CardEquipo;
  