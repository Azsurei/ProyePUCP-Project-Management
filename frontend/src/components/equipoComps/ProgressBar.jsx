const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    let realBgcolor;
    if (completed <= 15) {
      realBgcolor = "#F52045"
    } else if (completed <= 40) {
      realBgcolor = "#ef6c00"
    } else if (completed <= 60) {
      realBgcolor = "#A9E000"
    } else {
      realBgcolor = "#1CFF54"
    }
  
    const containerStyles = {
      height: 15,
      width: '80%',
      backgroundColor: "#e0e0de",
      borderRadius: 50,
      margin: 35,
      flexDirection: 'column',
      alignItems: 'center',
    }
  
    const fillerStyles = {
      height: '100%',
      width: `${completed}%`,
      backgroundColor: realBgcolor,
      borderRadius: 'inherit',
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center'
    }
  
    const labelStyles = {
      padding: '2px 5px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '13px',
      width: '100%'
    }
  
    return (
      <div style={containerStyles}>
        <div style={fillerStyles}>
          <span style={labelStyles}>{`${completed}%`}</span>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;