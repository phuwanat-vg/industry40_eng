import React, { useEffect, useRef, useState } from 'react';
import mqtt from 'mqtt';
import machine_img from './images/total_machine.PNG';

function Dashboard() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [machineStatuses, setMachineStatuses] = useState({});
  const canvasRef = useRef(null);
  const imgRef = useRef(null); // Reference for the image
  const scale = 0.6; // Scale factor

  useEffect(() => {
    const mqttClient = mqtt.connect('wss://3d3c0f6a6e27435d94068590434a9ba7.s1.eu.hivemq.cloud:8884/mqtt', {
      clientId: 'clientId-' + Math.random().toString(16).substr(2, 8),
      username: 'wasp_aaa',
      password: 'Iamwasp01',
      protocolVersion: 5,
      reconnectPeriod: 1000,
      clean: true,
    });

    mqttClient.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Connected to MQTT broker');

      for (let i = 1; i <= 6; i++) {
        mqttClient.subscribe(`/station${i}/status`, (err) => {
          if (err) {
            console.error(`Failed to subscribe to /station${i}/status:`, err);
          }
        });
      }
    });

    mqttClient.on('message', (topic, message) => {
      const machineNumber = topic.split('/')[1];
      const status = message.toString();
      setMachineStatuses((prevStatuses) => ({
        ...prevStatuses,
        [machineNumber]: status,
      }));
      console.log(`Received status for ${machineNumber}: ${status}`); // Debugging line
    });

    mqttClient.on('error', (error) => {
      setConnectionStatus('Connection failed: ' + error.message);
      console.error('MQTT Connection Error:', error);
    });

    mqttClient.on('close', () => {
      setConnectionStatus('Disconnected from MQTT broker');
      console.log('MQTT Connection Closed');
    });

    // Set up an interval to check MQTT messages every 1 second
    const interval = setInterval(() => {
      mqttClient.publish('keep-alive', 'ping'); // Just to keep the connection alive, if necessary
    }, 1000);

    return () => {
      clearInterval(interval);
      mqttClient.end();
    };
  }, []);

  const getCircleColor = (status) => {
    switch (status) {
      case '0':
        return 'green';
      case '1':
        return 'yellow';
      case '2':
        return 'red';
      case '3':
        return 'blue';
      default:
        return 'gray'; // Default color for unknown statuses
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image as the background with scaling
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    // Draw circles for each machine status
    const coordinates = {
      station1: { x: 328 * scale, y: 434 * scale },
      station2: { x: 693 * scale, y: 186 * scale },
      station3: { x: 1197 * scale, y: 112 * scale },
      station4: { x: 1605 * scale, y: 436 * scale },
      station5: { x: 1351 * scale, y: 830 * scale },
      station6: { x: 989 * scale, y: 996 * scale },
    };

    for (const [station, { x, y }] of Object.entries(coordinates)) {
      const status = machineStatuses[`station${station.slice(-1)}`];
      console.log(`Station: ${station}, Status: ${status}`); // Debugging line
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2); // Circle with radius 20 pixels
      ctx.fillStyle = getCircleColor(status); // Set the fill color based on status
      ctx.fill();
      console.log(`Drawing circle at (${x}, ${y}) with color: ${getCircleColor(status)}`); // Debugging line
    }
  };

  useEffect(() => {
    drawCanvas(); // Redraw the canvas whenever machineStatuses changes
  }, [machineStatuses]);

  return (
    <div className="container-fluid mt-4" style={{ display: 'flex', height: '100vh' }}>
      {/* Left column (Image and canvas) */}
      <div className="col-8 d-flex flex-column align-items-center" style={{ padding: 0 }}>
        <img 
          ref={imgRef} // Use ref to get the image for drawing
          src={machine_img} 
          alt="Machine" 
          style={{ 
            display: 'none', // Hide the image since it will be drawn on the canvas
          }} 
        />
        <canvas 
          ref={canvasRef} 
          width={2000 * scale} // Set width according to the scaled size
          height={1080 * scale} // Set height according to the scaled size
          style={{ 
            border: '0px solid black', // Optional: add a border to see the canvas area
            width: '100%', // Full width of the column
            height: 'auto' // Maintain aspect ratio
          }}
        />
      </div>

      {/* Right column (Status text) */}
      <div className="col-4 d-flex flex-column align-items-center" style={{ padding: '20px' }}>
        <h2>Dashboard</h2>
        <p>{connectionStatus}</p>
       
        <h4>Status Color Meaning:</h4>
        <ul className="list-unstyled text-center">
          <li style={{ color: 'green' }}>0: Normal</li>
          <li style={{ color: 'yellow' }}>1: Warning</li>
          <li style={{ color: 'red' }}>2: Critical</li>
          <li style={{ color: 'blue' }}>3: Offline</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
