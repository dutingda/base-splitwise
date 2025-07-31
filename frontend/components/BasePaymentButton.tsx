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
    if (type === 'send') {
      if (isMobile) {
        // On mobile: try to open Base app with custom URL scheme
        const baseAppUrl = `https://go.wallet.coinbase.com/send?address=${recipientAddress}&amount=${amountInEth}&asset=ETH&chainId=84532`
        window.location.href = baseAppUrl
        
        // Also try the direct base:// scheme as fallback
        setTimeout(() => {
          window.location.href = `base://send?address=${recipientAddress}&amount=${amountInEth}`
        }, 500)
      } else {
        // On desktop: open Coinbase Wallet web interface
        const coinbaseWalletUrl = `https://wallet.coinbase.com/send?address=${recipientAddress}&amount=${amountInEth}&asset=ETH&chainId=84532`
        window.open(coinbaseWalletUrl, '_blank')
      }
    } else if (type === 'request') {
      // For requesting money, share payment details
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

  return (
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
          <>💸 {isMobile ? 'Open Base App' : 'Open Coinbase Wallet'}</>
        )}
      </button>
      {showCopied && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap">
          Address copied! Open wallet app to send.
        </div>
      )}
    </div>
  )
}