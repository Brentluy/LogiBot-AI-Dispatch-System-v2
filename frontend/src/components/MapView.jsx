import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修复 Leaflet 默认图标问题
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapView({ drivers, orders, assignments }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  useEffect(() => {
    // 初始化地图（New Jersey 中心）
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([40.2, -74.7], 9);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // 清除之前的标记和路线
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    polylinesRef.current.forEach(polyline => map.removeLayer(polyline));
    polylinesRef.current = [];

    // 添加司机标记（蓝色）
    drivers.forEach(driver => {
      // 验证坐标是否存在且有效
      if (driver.lat == null || driver.lon == null || isNaN(driver.lat) || isNaN(driver.lon)) {
        console.warn(`司机 ${driver.id} 缺少有效坐标，跳过标记`);
        return;
      }
      
      const iconColor = driver.status === 'idle' ? 'blue' : 'orange';
      const marker = L.marker([driver.lat, driver.lon], {
        icon: L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${iconColor}.png`,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .addTo(map)
        .bindPopup(`<b>${driver.name}</b><br/>${driver.id}<br/>状态: ${driver.status === 'idle' ? '空闲' : '已分配'}<br/>容量: ${driver.capacity}lbs`);
      markersRef.current.push(marker);
    });

    // 添加订单标记（红色）- 使用 pickup_lat 和 pickup_lon
    orders.forEach(order => {
      // 验证坐标是否存在且有效
      const lat = order.pickup_lat || order.lat;
      const lon = order.pickup_lon || order.lon;
      
      if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) {
        console.warn(`订单 ${order.id} 缺少有效坐标，跳过标记`);
        return;
      }
      
      const priorityColor = order.priority === 'urgent' ? 'red' : order.priority === 'high' ? 'orange' : 'yellow';
      const marker = L.marker([lat, lon], {
        icon: L.icon({
          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${priorityColor}.png`,
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
        .addTo(map)
        .bindPopup(`<b>订单 ${order.id}</b><br/>${order.pickup_location || '未知地址'}<br/>重量: ${order.weight}lbs<br/>优先级: ${order.priority}<br/>状态: ${order.status === 'pending' ? '待分配' : '已分配'}`);
      markersRef.current.push(marker);
    });

    // 添加排班路线
    assignments.forEach(assignment => {
      const driver = drivers.find(d => d.id === assignment.driver_id);
      const order = orders.find(o => o.id === assignment.order_id);
      
      if (driver && order) {
        const driverLat = driver.lat;
        const driverLon = driver.lon;
        const orderLat = order.pickup_lat || order.lat;
        const orderLon = order.pickup_lon || order.lon;
        
        // 验证所有坐标都存在且有效
        if (driverLat != null && driverLon != null && orderLat != null && orderLon != null &&
            !isNaN(driverLat) && !isNaN(driverLon) && !isNaN(orderLat) && !isNaN(orderLon)) {
          const polyline = L.polyline(
            [[driverLat, driverLon], [orderLat, orderLon]],
            { color: '#3388ff', weight: 3, opacity: 0.7, dashArray: '10, 5' }
          ).addTo(map);
          polylinesRef.current.push(polyline);
        }
      }
    });

    // 调整地图视图
    if (markersRef.current.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      // 清理函数
    };
  }, [drivers, orders, assignments]);

  return (
    <div
      ref={mapRef}
      style={{ height: '500px', width: '100%' }}
      className="rounded-lg border"
    />
  );
}

export default MapView;
