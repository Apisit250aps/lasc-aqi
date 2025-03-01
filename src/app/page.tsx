'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Swal from 'sweetalert2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

// Types
interface DeviceData {
  name: string
}

interface AQIRecord {
  deviceData: DeviceData
  temperature: number
  humidity: number
  pm1: number
  pm25: number
  pm10: number
  createdAt: Date
  updatedAt: Date
}

const Home: React.FC = () => {
  // State
  const [deviceId, setDeviceId] = useState<string>('AQM-8742')
  const [currentData, setCurrentData] = useState<AQIRecord>({
    deviceData: { name: 'Bangkok Station #3' },
    temperature: 32.5,
    humidity: 65,
    pm1: 15,
    pm25: 38,
    pm10: 49,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  const [historicalData, setHistoricalData] = useState<AQIRecord[]>([])
  const [activeTab, setActiveTab] = useState<'pm' | 'temp'>('pm')

  const pmChartRef = useRef<ChartJS<'line'>>(null)
  const thChartRef = useRef<ChartJS<'line'>>(null)

  // Calculate AQI from PM2.5 value
  const calculateAQI = (pm25: number = currentData.pm25): number => {
    if (pm25 <= 12) return Math.round((50 / 12) * pm25)
    if (pm25 <= 35.4)
      return Math.round(50 + ((100 - 50) / (35.4 - 12)) * (pm25 - 12))
    if (pm25 <= 55.4)
      return Math.round(100 + ((150 - 100) / (55.4 - 35.4)) * (pm25 - 35.4))
    if (pm25 <= 150.4)
      return Math.round(150 + ((200 - 150) / (150.4 - 55.4)) * (pm25 - 55.4))
    if (pm25 <= 250.4)
      return Math.round(200 + ((300 - 200) / (250.4 - 150.4)) * (pm25 - 150.4))
    if (pm25 <= 350.4)
      return Math.round(300 + ((400 - 300) / (350.4 - 250.4)) * (pm25 - 250.4))
    return Math.round(400 + ((500 - 400) / (500.4 - 350.4)) * (pm25 - 350.4))
  }

  // Get AQI level based on calculated value
  const getAQILevel = (aqi: number): string => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  // Get AQI status text
  const getAQIStatus = (aqi: number): string => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Unhealthy (Sensitive)'
    if (aqi <= 200) return 'Unhealthy'
    if (aqi <= 300) return 'Very Unhealthy'
    return 'Hazardous'
  }

  // Get color class based on AQI
  const getAQIColorClass = (aqi: number): string => {
    if (aqi <= 50) return 'text-success'
    if (aqi <= 100) return 'text-warning'
    if (aqi <= 150) return 'text-orange-500'
    if (aqi <= 200) return 'text-error'
    if (aqi <= 300) return 'text-purple-700'
    return 'text-rose-700'
  }

  // Get badge class based on AQI
  const getAQIBadgeClass = (aqi: number): string => {
    if (aqi <= 50) return 'badge-success'
    if (aqi <= 100) return 'badge-warning'
    if (aqi <= 150) return 'badge-warning'
    if (aqi <= 200) return 'badge-error'
    if (aqi <= 300) return 'badge-error'
    return 'badge-error'
  }

  // Format date
  const formatDate = (date: Date | string): string => {
    const d = new Date(date)
    return `${d.toLocaleDateString()} ${d.getHours()}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  // Format time
  const formatTime = (date: Date | string): string => {
    const d = new Date(date)
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
  }

  // Generate mock historical data
  const generateMockData = (): AQIRecord[] => {
    const mockData: AQIRecord[] = []
    const now = new Date()

    for (let i = 0; i < 5; i++) {
      const pastTime = new Date(now.getTime() - (i + 1) * 3600000) // each hour back
      mockData.push({
        deviceData: { name: 'Bangkok Station #3' },
        temperature: Math.round((30 + Math.random() * 5) * 10) / 10,
        humidity: Math.round(50 + Math.random() * 30),
        pm1: Math.round(10 + Math.random() * 20),
        pm25: Math.round(25 + Math.random() * 40),
        pm10: Math.round(35 + Math.random() * 40),
        createdAt: pastTime,
        updatedAt: pastTime
      })
    }

    return mockData
  }

  // Refresh data
  const refreshData = () => {
    // Simulate data refresh
    const newData: AQIRecord = {
      deviceData: { name: 'Bangkok Station #3' },
      temperature: Math.round((30 + Math.random() * 5) * 10) / 10,
      humidity: Math.round(50 + Math.random() * 30),
      pm1: Math.round(10 + Math.random() * 20),
      pm25: Math.round(25 + Math.random() * 40),
      pm10: Math.round(35 + Math.random() * 40),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCurrentData(newData)

    // Add current data to history and keep only 5 records
    setHistoricalData((prev) => {
      const updated = [newData, ...prev]
      return updated.slice(0, 5)
    })

    // Show success message
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Data refreshed',
      showConfirmButton: false,
      timer: 1500,
      background: '#2A303C',
      iconColor: '#36D399',
      color: '#A6ADBB'
    })
  }

  // Load devices (mock implementation)
  const loadDevices = async () => {
    try {
      // This would be replaced with real API call
      // const response = await axios.get('/api/device');
      // setDevices(response.data.data);
      // setDeviceId(response.data.data[0]._id);
    } catch (error) {
      console.error(error)
    }
  }

  // Initialize on component mount
  useEffect(() => {
    setDeviceId('AQM-8742')
    loadDevices()
    setHistoricalData(generateMockData())
  }, [])

  // Prepare data for PM chart
  const getPMChartData = (): ChartData<'line'> => {
    const allData = [currentData, ...historicalData].reverse()
    const labels = allData.map((d) => formatTime(d.createdAt))

    return {
      labels,
      datasets: [
        {
          label: 'PM 1.0',
          data: allData.map((d) => d.pm1),
          borderColor: 'rgba(156, 163, 175, 1)',
          backgroundColor: 'rgba(156, 163, 175, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'PM 2.5',
          data: allData.map((d) => d.pm25),
          borderColor: 'rgba(96, 165, 250, 1)',
          backgroundColor: 'rgba(96, 165, 250, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'PM 10',
          data: allData.map((d) => d.pm10),
          borderColor: 'rgba(14, 116, 144, 1)',
          backgroundColor: 'rgba(14, 116, 144, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    }
  }

  // Prepare data for Temperature/Humidity chart
  const getTHChartData = (): ChartData<'line'> => {
    const allData = [currentData, ...historicalData].reverse()
    const labels = allData.map((d) => formatTime(d.createdAt))

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: allData.map((d) => d.temperature),
          borderColor: 'rgba(239, 68, 68, 1)',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y'
        },
        {
          label: 'Humidity (%)',
          data: allData.map((d) => d.humidity),
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1'
        }
      ]
    }
  }

  // Chart options for PM chart
  const pmChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'µg/m³'
        }
      }
    }
  }

  // Chart options for Temperature/Humidity chart
  const thChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        title: {
          display: true,
          text: 'Humidity (%)'
        }
      }
    }
  }

  // Computed values
  const aqi = calculateAQI()
  const aqiLevel = getAQILevel(aqi)
  const aqiStatus = getAQIStatus(aqi)
  const aqiColorClass = getAQIColorClass(aqi)
  const aqiStatusBadgeClass = getAQIBadgeClass(aqi)

  return (
    <div className="min-h-screen bg-base-300 font-sans">
      <div className="navbar bg-base-100 shadow-lg mb-4">
        <div className="container mx-auto px-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center">
              <i className="bx bx-planet text-3xl text-primary mr-2"></i>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                AQI Monitor
              </span>
            </h1>
          </div>
          <div className="flex-none">
            <span className="badge badge-outline">
              {currentData.deviceData?.name || deviceId}
            </span>
            <button
              onClick={refreshData}
              className="btn btn-square btn-ghost ml-2"
            >
              <i className="bx bx-refresh text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {/* Main Stats */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 mb-6">
          {/* Current AQI */}
          <div className="card w-full lg:w-1/3 glass shadow-xl overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-30 ${
                aqiLevel === 'Good'
                  ? 'from-green-500 to-green-700'
                  : aqiLevel === 'Moderate'
                  ? 'from-yellow-500 to-yellow-700'
                  : aqiLevel === 'Unhealthy for Sensitive Groups'
                  ? 'from-orange-500 to-orange-700'
                  : aqiLevel === 'Unhealthy'
                  ? 'from-red-500 to-red-700'
                  : aqiLevel === 'Very Unhealthy'
                  ? 'from-purple-500 to-purple-700'
                  : 'from-rose-700 to-rose-900'
              }`}
            ></div>
            <div className="card-body z-10 p-6 flex flex-col items-center justify-center">
              <div
                className={`radial-progress text-5xl font-bold ${aqiColorClass}`}
                style={
                  {
                    '--value': `${Math.min(aqi / 5, 100)}`,
                    '--size': '12rem',
                    '--thickness': '1rem'
                  } as React.CSSProperties
                }
              >
                {aqi}
              </div>
              <div className="mt-4 text-center">
                <div className={`text-xl font-bold ${aqiColorClass}`}>
                  {aqiStatus}
                </div>
                <div className={`badge badge-lg mt-2 ${aqiStatusBadgeClass}`}>
                  {aqiLevel}
                </div>
              </div>
              <div className="text-sm text-base-content/70 mt-2">
                Updated: {formatTime(currentData.updatedAt)}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="card w-full lg:w-2/3 bg-base-100 shadow-xl">
            <div className="card-body p-6">
              <div className="tabs tabs-boxed mb-4">
                <a
                  className={`tab ${activeTab === 'pm' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('pm')}
                >
                  PM Values
                </a>
                <a
                  className={`tab ${activeTab === 'temp' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('temp')}
                >
                  Temperature & Humidity
                </a>
              </div>
              <div
                className={`h-64 ${activeTab === 'pm' ? 'block' : 'hidden'}`}
              >
                <Line
                  data={getPMChartData()}
                  options={pmChartOptions}
                  ref={pmChartRef}
                />
              </div>
              <div
                className={`h-64 ${activeTab === 'temp' ? 'block' : 'hidden'}`}
              >
                <Line
                  data={getTHChartData()}
                  options={thChartOptions}
                  ref={thChartRef}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Readings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 text-center">
              <div className="stat-title">Temperature</div>
              <div className="flex items-center justify-center my-2">
                <i className="bx bxs-thermometer text-3xl text-orange-500"></i>
              </div>
              <div className="stat-value text-2xl">
                {currentData.temperature}°C
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 text-center">
              <div className="stat-title">Humidity</div>
              <div className="flex items-center justify-center my-2">
                <i className="bx bx-droplet text-3xl text-blue-500"></i>
              </div>
              <div className="stat-value text-2xl">{currentData.humidity}%</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 text-center">
              <div className="stat-title">PM 1.0</div>
              <div className="flex items-center justify-center my-2">
                <i className="bx bx-wind text-3xl text-slate-400"></i>
              </div>
              <div className="stat-value text-2xl">{currentData.pm1}</div>
              <div className="stat-desc">µg/m³</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 text-center">
              <div className="stat-title">PM 2.5</div>
              <div className="flex items-center justify-center my-2">
                <i className="bx bx-wind text-3xl text-slate-500"></i>
              </div>
              <div className="stat-value text-2xl">{currentData.pm25}</div>
              <div className="stat-desc">µg/m³</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-4 text-center">
              <div className="stat-title">PM 10</div>
              <div className="flex items-center justify-center my-2">
                <i className="bx bx-wind text-3xl text-slate-600"></i>
              </div>
              <div className="stat-value text-2xl">{currentData.pm10}</div>
              <div className="stat-desc">µg/m³</div>
            </div>
          </div>
        </div>

        {/* Historical Data */}
        <div className="card bg-base-100 shadow-xl overflow-hidden">
          <div className="card-body p-0">
            <div className="bg-base-200 p-4">
              <h2 className="card-title text-base-content flex items-center">
                <i className="bx bx-history text-2xl mr-2"></i>
                Historical Data
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>PM 1.0</th>
                    <th>PM 2.5</th>
                    <th>PM 10</th>
                    <th>Temp</th>
                    <th>Humidity</th>
                    <th>AQI</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalData.map((record, index) => {
                    const recordAqi = calculateAQI(record.pm25)
                    return (
                      <tr key={index}>
                        <td>{formatDate(record.createdAt)}</td>
                        <td>{record.pm1} µg/m³</td>
                        <td>{record.pm25} µg/m³</td>
                        <td>{record.pm10} µg/m³</td>
                        <td>{record.temperature}°C</td>
                        <td>{record.humidity}%</td>
                        <td>
                          <div
                            className={`badge badge-lg ${getAQIBadgeClass(
                              recordAqi
                            )}`}
                          >
                            {recordAqi}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
