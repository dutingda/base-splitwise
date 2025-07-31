'use client'

import { formatEther } from 'viem'
import dynamic from 'next/dynamic'

const QRCode = dynamic(() => import('react-qr-code'), {
  ssr: false,
})

interface PaymentQRModalProps {
  isOpen: boolean
  onClose: () => void
  recipientAddress: string
  amount: bigint
  description: string
}

export default function PaymentQRModal({
  isOpen,
  onClose,
  recipientAddress,
  amount,
  description
}: PaymentQRModalProps) {
  if (!isOpen) return null

  const amountInEth = formatEther(amount)
  const paymentUrl = `ethereum:${recipientAddress}?value=${amount.toString()}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan to Pay</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4 flex justify-center">
          <QRCode
            value={paymentUrl}
            size={200}
          />
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="font-medium">Payment Details:</p>
          <p className="text-gray-600">Amount: {amountInEth} ETH</p>
          <p className="text-gray-600 break-all">To: {recipientAddress}</p>
          <p className="text-gray-600">Memo: {description}</p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-700">
          Scan with Coinbase Wallet or any Ethereum wallet app
        </div>
      </div>
    </div>
  )
}