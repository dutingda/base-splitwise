'use client'

import { formatEther } from 'viem'
import { useState, useEffect } from 'react'
import PaymentQRModal from './PaymentQRModal'

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
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
  }, [])

  const amountInEth = formatEther(amount)
  const amountInWei = amount.toString()
  
  // Standard Ethereum payment URL
  const ethereumUrl = `ethereum:${recipientAddress}@84532?value=${amountInWei}`
  
  const handleButtonClick = () => {
    if (!isMobile) {
      // Desktop: show QR code
      setShowQR(true)
    } else if (type === 'request') {
      // Mobile request: share payment details
      const message = `💸 Payment Request\n\nPlease send ${amountInEth} ETH to:\n${recipientAddress}\n\nFor: ${description}\nNetwork: Base Sepolia`
      
      if (navigator.share) {
        navigator.share({
          title: 'Payment Request',
          text: message
        }).catch(() => {
          copyToClipboard(recipientAddress)
        })
      } else {
        copyToClipboard(recipientAddress)
      }
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 3000)
    }).catch(() => {
      // Fallback
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 3000)
    })
  }

  // For mobile send button, use a direct link
  if (isMobile && type === 'send') {
    return (
      <div className="relative">
        <a
          href={ethereumUrl}
          className="mt-2 px-4 py-2 text-white text-sm rounded-lg font-medium transition bg-green-600 hover:bg-green-700 flex items-center gap-2 inline-block"
        >
          💸 Open Wallet
        </a>
        {showCopied && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
            Address copied!
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className={`mt-2 px-4 py-2 text-white text-sm rounded-lg font-medium transition ${
            type === 'request' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-green-600 hover:bg-green-700'
          } flex items-center gap-2`}
        >
          {type === 'request' ? (
            <>📲 Request Payment</>
          ) : (
            <>💸 Show QR Code</>
          )}
        </button>
        {showCopied && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
            Address copied!
          </div>
        )}
      </div>
      
      <PaymentQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        recipientAddress={recipientAddress}
        amount={amount}
        description={description}
      />
    </>
  )
}