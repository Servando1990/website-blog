import { useState } from 'react'
import { X } from 'lucide-react'

interface IndustryData {
  title: string
  items: string[]
}

interface Props {
  industryData: Record<string, IndustryData>
}

export default function IndustryModal({ industryData }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryData | null>(null)

  const openModal = (industryKey: string) => {
    setSelectedIndustry(industryData[industryKey])
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setSelectedIndustry(null)
  }

  // Attach function to window for use in Astro component
  if (typeof window !== 'undefined') {
    (window as any).openExpertiseModal = openModal
  }

  if (!isOpen || !selectedIndustry) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h4 className="text-lg font-medium text-black dark:text-white">
            {selectedIndustry.title}
          </h4>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <ul className="space-y-3">
            {selectedIndustry.items.map((item, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}