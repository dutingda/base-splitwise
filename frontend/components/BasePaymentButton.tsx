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
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const amountInEth = formatEther(amount)
  
  const handlePayment = () => {
    if (type === 'request') {
      // For requesting money, create a shareable message
      const message = `Please send ${amountInEth} ETH to ${recipientAddress} for: ${description}\n\nNetwork: Base Sepolia`
      
      if (isMobile && navigator.share) {
        // Use native share on mobile
        navigator.share({
          title: 'Payment Request',
          text: message
        }).catch(() => {
          // Fallback to clipboard
          copyToClipboard(message)
        })
      } else {
        // Copy to clipboard on desktop or if share fails
        copyToClipboard(message)
      }
    } else {
      // For sending money, copy the recipient address
      const message = `Send ${amountInEth} ETH to:\n${recipientAddress}\n\nNetwork: Base Sepolia\nMemo: ${description}`
      copyToClipboard(message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    })
  }

  return (
    <div className="relative">
      <button
        onClick={handlePayment}
        className={`mt-2 px-4 py-2 text-white text-sm rounded-lg font-medium transition ${
          type === 'request' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {type === 'request' ? '📲 Request Payment' : '💸 Copy Payment Info'}
      </button>
      {showCopied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
          Copied!
        </div>
      )}
    </div>
  )
}