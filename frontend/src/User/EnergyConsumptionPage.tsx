import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Container, Box, TextField } from '@mui/material';
import { useParams } from "react-router";
import { DeviceProvider, useDevice } from '../Context/DeviceContext';
import {useNavigate} from "react-router-dom";

interface EnergyData {
    id: string;
    deviceId: string;
    hour: number; // Assuming this is a timestamp in milliseconds
    measurementValue: number;
}

const EnergyConsumptionPage: React.FC = () => {
    const [energyData, setEnergyData] = useState<EnergyData[]>([]);
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const { username } = useParams<{ username: string }>();
    const { device, deviceList } = useDevice();
    const navigate = useNavigate();

    useEffect(() => {
        const endpointUrl = `http://localhost:8082/monitoring/getHourlyEnergyConsumption`;
        fetch(endpointUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data: EnergyData[]) => {
                const filteredDevices = deviceList.filter(obj => obj.personUsername === username);
                const filteredData = data.filter(obj => filteredDevices.some(obj2 => obj2.id === obj.deviceId));
                setEnergyData(filteredData);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [device]);

    // Function to preprocess data for the chart
    const preprocessData = (data: EnergyData[]) => {
        const hourlyData: { hour: number; measurementValue: number }[] = Array.from({ length: 24 }, (_, hour) => {
            const hourStart = new Date(selectedDay);
            hourStart.setHours(hour, 0, 0, 0);
            const hourEnd = new Date(selectedDay);
            hourEnd.setHours(hour + 1, 0, 0, 0);

            const valuesInHour = data.filter(
                (entry) => entry.hour >= hourStart.getTime() && entry.hour < hourEnd.getTime()
            );
            const sum = valuesInHour.reduce((acc, entry) => acc + entry.measurementValue, 0);

            return {
                hour: hour,
                measurementValue: sum,
            };
        });

        return hourlyData;
    };

    const handleLogout = () => {
        navigate('/client');
    }

    const filteredData = selectedDay ? preprocessData(energyData) : energyData;

    return (
        <DeviceProvider>
            <Container>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" mb={2}>
                            Energy Consumption Line Chart
                        </Typography>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <TextField
                                id="date-picker"
                                label="Select Date"
                                type="date"
                                value={selectedDay?.toISOString().split('T')[0] || ''}
                                onChange={(e) => setSelectedDay(new Date(e.target.value))}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Box>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart
                                data={filteredData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="hour"
                                    type="number"
                                    domain={['auto', 'auto']}
                                    tickFormatter={(value) => new Date(value).toLocaleTimeString(undefined, { hour12: false })}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="measurementValue"
                                    stroke="#1976D2"
                                    dot={{ stroke: '#1976D2', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <button onClick={handleLogout} className="logout-button">
                    Back
                </button>
            </Container>
        </DeviceProvider>
    );
};

export default EnergyConsumptionPage;
