import axios from 'axios';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState, forwardRef } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GeneralWeather = () => {
    const [data, setData] = useState({});
    const [location, setLocation] = useState('Kolkata');
    const [error, setError] = useState(false);
    const [open, setOpen] = useState(false);
    const apiKey = 'ENTER YOUR OPENWEATHER API KEY';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

    useEffect(() => {
        axios.get(apiUrl)
            .then((response) => {
                setData(response.data);
                setError(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 404) {
                    setError(true);
                    console.log('Invalid Input');
                } else {
                    console.log('Bad Request');
                    alert('You have initiated a bad request.');
                }
            });
    }, []);

    const searchLocation = (event) => {
        if (event.key === 'Enter') {
            axios.get(apiUrl)
                .then((response) => {
                    setData(response.data);
                    setError(false);
                    console.log(response.data);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setError(true);
                        console.log('Invalid Input');
                    } else {
                        console.log('Bad Request');
                        alert('You have initiated a bad request.');
                    }
                });
            setLocation('');
        }
    };

    useEffect(() => {
        setOpen(error ? true : false);
    }, [error]);

    const handleCloseSnackbar = (reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false)
    };

    const kelvinToCelcius = (k) => {
        return Math.trunc(k - 273.15);
    };

    const msToKmh = (k) => {
        return Math.trunc(k * 18 / 5);
    };

    return (
        <Card
            sx={{
                width: '75%',
                margin: "auto",
                marginTop: "40px",
                backgroundColor: "#33383e",
            }}
        >
            <CardContent style={{ backgroundColor: '#11161A' }}>
                <div className="container" >
                    <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
                        <div className="col-auto">
                            <input
                                className='city'
                                type='text'
                                placeholder='Enter City'
                                value={location}
                                onChange={(event) => setLocation(event.target.value)}
                                onKeyPress={searchLocation}
                            />
                            <h4 className='currently'>CURRENTLY</h4>
                            {data.main ? (
                                <div className='row'>
                                    <div className='mainData'>
                                        <div className='tempDesc'>
                                            <h1 className='temperature'>{kelvinToCelcius(data.main.temp)}</h1>
                                            <div className='tempPara'>
                                                <h3 className='params'>°</h3>
                                                <h3 className='params'>C</h3>
                                            </div>
                                        </div>
                                        <h2>{data.name}</h2>
                                    </div>
                                    <div className='otherData'>
                                        <h3 className='weatherType'>{data.weather[0].main}</h3>
                                        <h5 className='feelsLike'>Feels like {kelvinToCelcius(data.main.feels_like)}°</h5>
                                        <h5 className='humidity'>Humidity: {data.main.humidity}%</h5>
                                        <h5 className='wind'>Wind: {msToKmh(data.wind.speed)}km/h</h5>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </CardContent>
            <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%", backgroundColor: 'rgb(211,47,47, 0.4)' }}>
                        Enter a Valid City!
                    </Alert>
                </Snackbar>
            </Stack>
        </Card>
    );
};

export default GeneralWeather;
