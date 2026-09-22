import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Clock, MessageSquare, Send, Shield } from 'lucide-react'
import { getCaseStatusByKey } from '../api/getCaseStatus'
import type { CaseStatusInfo } from '../types/caseTracking.types'
import { CASE_STATUSES, CASE_PRIORITIES } from '@/constants/caseStatus'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export const CaseTracker: React.FC = () => {
  const [searchParams] = useSearchParams()
  const initialKey = searchParams.get('case') || ''

  const [inputKey, setInputKey] = useState(initialKey)
  const [isLoading, setIsLoading] = useState(false)
  const [caseInfo, setCaseInfo] = useState<CaseStatusInfo | null>(null)
  const [newMessage, setNewMessage] = useState('')

  const handleLookup = async (keyToSearch: string) => {
    if (!keyToSearch.trim()) return
    setIsLoading(true)
    try {
      const data = await getCaseStatusByKey(keyToSearch)
      setCaseInfo(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (initialKey) {
      handleLookup(initialKey)
    }
  }, [initialKey])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !caseInfo) return

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'REPORTER' as const,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    setCaseInfo({
      ...caseInfo,
      messages: [...caseInfo.messages, userMsg],
    })
    setNewMessage('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Anonymous Case Status Tracker
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Look up report progress, communicate anonymously with lead investigators, and furnish additional evidence.
        </p>
      </div>

      {/* Case Key Input Bar */}
      <Card className="p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleLookup(inputKey)
          }}
          className="flex flex-col sm:flex-row gap-3 items-end"
        >
          <div className="flex-1 w-full">
            <Input
              label="Enter Confidential Case Reference Key"
              placeholder="e.g. WB-892144"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="font-mono uppercase tracking-wider"
            />
          </div>
          <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
            <Search className="w-4 h-4" />
            <span>Look Up Status</span>
          </Button>
        </form>
      </Card>

      {/* Case Overview & Status */}
      {caseInfo && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Case Record
                </span>
                <h2 className="text-xl font-mono font-bold text-slate-900">
                  {caseInfo.referenceKey}
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">{caseInfo.category}</p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="warning">
                  {CASE_PRIORITIES[caseInfo.priority]?.label || caseInfo.priority} Priority
                </Badge>
                <Badge variant="default">
                  {CASE_STATUSES[caseInfo.status]?.label || caseInfo.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Date Filed: {new Date(caseInfo.submittedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span>Assigned: {caseInfo.assignedInvestigator || 'Under Triage'}</span>
              </div>
            </div>
          </Card>

          {/* 2-Way Anonymous Communication */}
          <Card
            header={
              <div className="flex items-center gap-2 font-semibold text-sm text-slate-800">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Encrypted Direct Messaging with Investigator</span>
              </div>
            }
            className="p-6 space-y-4"
          >
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {caseInfo.messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl text-xs max-w-[85%] ${
                    m.sender === 'REPORTER'
                      ? 'ml-auto bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <p className="font-semibold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                    {m.sender === 'REPORTER' ? 'You (Whistleblower)' : 'Ethics Investigator'}
                  </p>
                  <p className="leading-relaxed">{m.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a confidential message or clarification..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <Button type="submit" size="sm">
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
