export interface MetricCard {
  id: string
  title: string
  value: number | string
  unit: string
  status: 'normal' | 'warning' | 'critical'
  icon: string
  lastUpdated: string
}

export interface Alert {
  id: string
  type: string
  message: string
  timestamp: string
  status: 'active' | 'resolved'
}

export interface DeviceStatus {
  id: string
  name: string
  status: 'connected' | 'offline'
  lastSynced: string
}

export function getMockMetrics(): MetricCard[] {
  const baseTemp = 28
  const baseLight = 75
  const baseTDS = 1200
  
  // Simulate real-time variation
  const tempVariation = Math.sin(Date.now() / 10000) * 2
  const lightVariation = Math.cos(Date.now() / 8000) * 5
  const tdsVariation = Math.sin(Date.now() / 12000) * 50

  return [
    {
      id: 'temperature',
      title: 'Temperature',
      value: Math.round((baseTemp + tempVariation) * 10) / 10,
      unit: '°C',
      status: baseTemp + tempVariation > 32 ? 'critical' : baseTemp + tempVariation > 30 ? 'warning' : 'normal',
      icon: '🌡️',
      lastUpdated: 'Just now',
    },
    {
      id: 'light',
      title: 'Light Intensity',
      value: Math.round(baseLight + lightVariation),
      unit: '%',
      status: baseLight + lightVariation > 90 ? 'critical' : baseLight + lightVariation < 20 ? 'warning' : 'normal',
      icon: '💡',
      lastUpdated: 'Just now',
    },
    {
      id: 'tds',
      title: 'TDS Level',
      value: Math.round(baseTDS + tdsVariation),
      unit: 'ppm',
      status: baseTDS + tdsVariation > 1500 ? 'critical' : baseTDS + tdsVariation < 800 ? 'warning' : 'normal',
      icon: '💧',
      lastUpdated: 'Just now',
    },
    {
      id: 'system',
      title: 'System Status',
      value: 'Running',
      unit: '',
      status: 'normal',
      icon: '⚙️',
      lastUpdated: 'Active',
    },
  ]
}

export function getMockAlerts(): Alert[] {
  return [
    {
      id: '1',
      type: 'TDS Low',
      message: 'TDS Level Low → Nutrient Pump Activated',
      timestamp: '2 minutes ago',
      status: 'active',
    },
    {
      id: '2',
      type: 'High Temp',
      message: 'Temperature High → Cooling Fan Running',
      timestamp: '5 minutes ago',
      status: 'active',
    },
    {
      id: '3',
      type: 'Light Adjustment',
      message: 'Low Light Detected → LED Lights Increased',
      timestamp: '10 minutes ago',
      status: 'resolved',
    },
  ]
}

export function getMockDevices(): DeviceStatus[] {
  return [
    {
      id: '1',
      name: 'Temperature Sensor',
      status: 'connected',
      lastSynced: '10 seconds ago',
    },
    {
      id: '2',
      name: 'Light Intensity Sensor',
      status: 'connected',
      lastSynced: '10 seconds ago',
    },
    {
      id: '3',
      name: 'TDS Probe',
      status: 'connected',
      lastSynced: '15 seconds ago',
    },
    {
      id: '4',
      name: 'Water Pump',
      status: 'connected',
      lastSynced: '5 seconds ago',
    },
  ]
}
