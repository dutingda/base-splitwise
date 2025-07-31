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
  
  const handlePayment = () => {
    if (type === 'send' && !isMobile) {
      // On desktop for sending, show QR code
      setShowQR(true)
      return
    }
    
    if (isMobile && type === 'send') {
      // Try to open wallet app with ethereum: URL
      const paymentUrl = `ethereum:${recipientAddress}?value=${amount.toString()}`
      
      // First, try direct navigation
      window.location.href = paymentUrl
      
      // Also try creating a link element
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = paymentUrl
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 100)
      
      // Show copied message as fallback after delay
      setTimeout(() => {
        if (document.hasFocus()) {
          copyToClipboard(recipientAddress)
        }
      }, 2000)
    } else if (type === 'request') {
      // For requesting money, share or copy
      const message = `💸 Payment Request\n\nPlease send ${amountInEth} ETH to:\n${recipientAddress}\n\nFor: ${description}\nNetwork: Base Sepolia`
      
      if (isMobile && navigator.share) {
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
      // Fallback for older browsers
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

  return (
    <>
      <div className="relative">
        <button
          onClick={handlePayment}
          className={`mt-2 px-4 py-2 text-white text-sm rounded-lg font-medium transition ${
            type === 'request' 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-green-600 hover:bg-green-700'
          } flex items-center gap-2`}
        >
          {type === 'request' ? (
            <>📲 Request Payment</>
          ) : (
            <>💸 {isMobile ? 'Open Wallet' : 'Show QR Code'}</>
          )}
        </button>
        {showCopied && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
            Address copied! Open wallet app to send.
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