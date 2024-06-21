import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import App from './App'

jest.mock('axios')

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('displays fetched data on success', async () => {
    jest
      .mocked(axios.get)
      .mockResolvedValue({ status: 200, data: [{ id: 1, toAddress: '0x482BeBdE8dAE14106D0A8c7AE291883F8BaA53f3', block: 7861, date: '2024-06-04 03:57:38'}]})

    render(<App />)

    await waitFor(() => expect(screen.getByText('Block 7,861')).toBeVisible())
  })

  it('handles fetch error', async () => {
    jest.mocked(axios.get).mockResolvedValue({ status: 500 })

    render(<App />)

    await waitFor(() =>
      expect(screen.getByText(/Error fetching data/i)).toBeTruthy(),
    )
  })
})
