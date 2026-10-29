// utils/location.js —— 距离计算与获取当前位置

// 计算两点间距离（米），使用 Haversine 公式
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000 // 地球半径（米）
  const rad = (d) => (d * Math.PI) / 180

  const dLat = rad(lat2 - lat1)
  const dLng = rad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// 获取当前位置，返回 Promise<{ latitude, longitude }>
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        resolve({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
