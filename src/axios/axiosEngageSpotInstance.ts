import axios from 'axios'

export const axiosEngageSpotInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENGAGESPOT_URL,
  headers: {}
})

// Alter defaults after instance has been created
axiosEngageSpotInstance.defaults.headers.common['X-ENGAGESPOT-API-KEY'] = process.env.NEXT_PUBLIC_ENGAGESPOT_KEY
axiosEngageSpotInstance.defaults.headers.common['X-ENGAGESPOT-API-SECRET'] = process.env.NEXT_PUBLIC_ENGAGESPOT_SECRET
