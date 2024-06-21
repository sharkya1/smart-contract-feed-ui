import axios from 'axios'
import { useEffect, useState } from 'react'
import { VITE_API_ENDPOINT_URL } from './env'
import './App.css'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface Mint {
  id: number
  toAddress: string
  block: number
  date: Date
}

type Mints = Mint[]

function App() {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<Mints>([])
  const [newData, setNewData] = useState<Mints>([])
  const [isAnimating, setIsAnimating] = useState<boolean>(true)

  const fetchData = async () => {
    try {
      const response = await axios.get<Mints>(VITE_API_ENDPOINT_URL || 'http://localhost:3000/mints')
      if (response.status !== 200) throw new Error('Error fetching data')

      setData((prevData) => {
        const uniqueData = response.data.filter((newMint) => !prevData.some((existingMint) => existingMint.id === newMint.id))

        if (uniqueData.length) {
          setNewData(uniqueData)
          setIsAnimating(true)
          return [...uniqueData, ...prevData].slice(0, 5)
        }

        return prevData
      })

      setStatus('success')
    } catch {
      if (!data.length) setStatus('error')
    }
  }

  useEffect(() => {
    setStatus('loading')
    //Load data immediately
    fetchData()
    //Load data every 5 sec
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isAnimating) {
      const animationTimer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(animationTimer)
    }
  }, [isAnimating])

  return (
    <>
      <h1>Most Recent Mints</h1>
      <div className="card">
        {status === 'loading' && <p>Loading...</p>}
        {status === 'error' && <p>Error fetching data</p>}
        {status === 'success' &&
          data.map((mint) => (
            <div key={mint.id} className={`row ${isAnimating && newData.includes(mint) ? 'fade-in' : 'slide-down'}`}>
              <div className="address" title={mint.toAddress}>
                {mint.toAddress.slice(0, 5)}...{mint.toAddress.slice(-6)}
              </div>
              <div className="block">Block {mint.block.toLocaleString()}</div>
            </div>
          ))}
      </div>
    </>
  )
}

export default App
