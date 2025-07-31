'use client'

import { formatEther } from 'viem'
import { useState, useEffect } from 'react'

interface BasePaymentButtonProps {
  type: 'request' | 'send'
  recipientAddress: string
  amount: bigint
  description?: string
}

export default function BasePaymentButton({ 
  type, 
  recipientAddress, 
  amount,
  description = 'Splitwise payment'
}: BasePaymentButtonProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const amountInEth = formatEther(amount)
  
  // Base app payment request URL format
  // For requesting money: base://pay?request=true&recipient={address}&amount={amount}&description={description}
  // For sending money: base://pay?recipient={address}&amount={amount}&description={description}
  
  const handlePayment = () => {
    let url: string
    
    if (type === 'request') {
      // Request money from someone
      url = `base://pay?request=true&recipient=${recipientAddress}&amount=${amountInEth}&description=${encodeURIComponent(description)}`
    } else {
      // Send money to someone
      url = `base://pay?recipient=${recipientAddress}&amount=${amountInEth}&description=${encodeURIComponent(description)}`
    }
    
    if (isMobile) {
      // On mobile, try to open the Base app directly
      window.location.href = url
    } else {
      // On desktop, show a message to use mobile
      alert('Please use your mobile device with the Base app installed to complete this payment.')
    }
  }

  return (
    <button
      onClick={handlePayment}
      className={`mt-2 px-4 py-2 text-white text-sm rounded-lg font-medium transition ${
        type === 'request' 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-green-600 hover:bg-green-700'
      }`}
    >
      {type === 'request' ? '📲 Request via Base' : '💸 Send via Base'}
    </button>
  )
}