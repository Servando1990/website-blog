import { useState, useEffect } from 'react'

interface TestimonialProps {
  text: string
  authorName: string
  authorTitle: string
  companyName: string
  companyDomain: string
  featured?: boolean
}

export default function TestimonialCard({ 
  text, 
  authorName, 
  authorTitle, 
  companyName, 
  companyDomain,
  featured = false 
}: TestimonialProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [truncatedText, setTruncatedText] = useState('')
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (text.length > 200) {
      setTruncatedText(text.substring(0, 200) + '...')
      setShowButton(true)
    } else {
      setTruncatedText(text)
      setShowButton(false)
    }
  }, [text])

  return (
    <div className={`p-6 rounded-xl border transition-all duration-200 ${
      featured 
        ? 'bg-accent-gold/5 dark:bg-accent-amber/5 border-accent-gold/20 dark:border-accent-amber/20' 
        : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600'
    }`}>
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
          "{isExpanded ? text : truncatedText}"
        </p>
        
        {showButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-sm text-accent-gold dark:text-accent-amber hover:underline"
          >
            {isExpanded ? 'See less' : 'See more'}
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <img 
          src={`https://www.google.com/s2/favicons?domain=${companyDomain}&sz=128`}
          alt={`${companyName} logo`}
          className="w-6 h-6 rounded"
          loading="lazy"
        />
        <div>
          <div className="font-medium text-black dark:text-white">
            {authorName}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {authorTitle} at <span className="font-medium">{companyName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}