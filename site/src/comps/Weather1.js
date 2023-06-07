import React, { useState } from 'react';
import axios from 'axios';
import Chart from "react-apexcharts";


const Weather1 = () => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [forecast, setForecast] = useState(null);
  const [graph, setGraph] = useState({
    options: {
      markers: {
        size: 4
      },
      chart: {
        id: "basic-bar",
        toolbar: {
          show: false
        }
      },
      xaxis: {
        type: 'category',
        categories: [],
        tickPlacement: 'between',
        labels: {
          show: false,
          formatter: function (value) {
            return value + "$";
          }
        }
      },
      yaxis: {
        show: true
      },
      tooltip: {
        enabled: false,
    },
      theme: {
        mode: 'light', 
        palette: 'palette1', 
        monochrome: {
            enabled: false,
            color: '#255aee',
            shadeTo: 'light',
            shadeIntensity: 0.65
        },
    },
      subtitle: {
        text: undefined,
        align: 'left',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '30px',
          fontWeight:  'normal',
          fontFamily:  undefined,
          color:  '#9699a2'
        },
    },
      stroke: {
        show: true,
        curve: 'straight',
        lineCap: 'round',
        colors: undefined,
        width: 2,
        dashArray: 0,      
    },
      dataLabels: {
        enabled: true,
        position: 'bottomam',
        background: {
          enabled: true,
          foreColor: '#000',
          borderColor: '#000'
        }
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
            lines: {
                show: false
            }
        }
      },
      legend: {
        show: false,
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  });


  const handleLatChange = (event) => {
    setLat(event.target.value.trim());
  };

  const handleLonChange = (event) => {
    setLon(event.target.value.trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!lat || !lon) return;
    axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: 
      {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m'
      }
    })
      .then((response) => {
        console.log(response.data); 
        setForecast(response.data.hourly.temperature_2m[0]);
        
        // //Use sepearate series variable
        // let newNewSeries = []
        // newNewSeries.push({
        //   name: "series-1",
        //   data: response.data.hourly.temperature_2m.slice(0, 8)
        // })
        // setSeries(newNewSeries)
        // console.log(graph);

        //Use series variable in graph object

        console.log("FIRST GRAPH!!!!-----")
        console.log(graph)
        let newGraph = {...graph}
        let newSeries = []
        let newCat = []

        newSeries.push({
            name: "my-series",
            data: response.data.hourly.temperature_2m.slice(0, 8)
          })

        newCat.push(response.data.hourly.time.slice(0, 8))

        newGraph.series = newSeries;
        newGraph.options.xaxis.categories = newCat;

        setGraph(newGraph);

        console.log("GRAPH!!!!!______")
        console.log(graph)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <button name="san__diego" onClick={()=>{setLat(32.7157); setLon(-117.1611);}}>San Diego</button>
      <button name="corona" onClick={()=>{setLat(33.8753); setLon(-117.5664);}}>Corona</button>
      <button name="fremont" onClick={()=>{setLat(37.5485); setLon(-121.9886);}}>Fremont</button>
      <button name="playa__carmen" onClick={()=>{setLat(20.6296); setLon(-87.0739);}}>Playa Del Carmen</button>
      <form onSubmit={handleSubmit}>
        <input type="text" value={lat} onChange={handleLatChange} placeholder="Latitude" />
        <input type="text" value={lon} onChange={handleLonChange} placeholder="Longitude" />
        <button type="submit">Submit</button>
      </form>
      {forecast && <h1>The forecast is: {JSON.stringify(forecast)} Celcuis</h1>}

      {graph && <Chart
              options={graph.options}
              series={graph.series}
              type="line"
              width="600"
              height="150"
            />}
    </>
  );
};

export default Weather1;