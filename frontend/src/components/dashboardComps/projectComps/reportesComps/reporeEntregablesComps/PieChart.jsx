import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Legend, plugins } from "chart.js/auto";

function PieChart({ data }) {
    const options = {
        plugins: {
            legend: {
                position: "left",
            },
        },
        layout: {
            padding: {
                left: 0, // Add padding to the left
                right: 0, // Add padding to the right
            },
            margin: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            }
        },
    };

    return <Doughnut data={data} options={options} width={"100%"} />;
}

export default PieChart;
