import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Bell, Check } from 'lucide-react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { apiClient as api } from '@/lib/apiClient'
import { useNavigate } from 'react-router-dom'

interface NotificationDto {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  relatedCaseId?: string
}

export const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?.userId

  // Fetch unread notifications for current authenticated user
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      return
    }

    try {
      const response = await api.get<NotificationDto[]>(`/api/Notifications/my/unread?userId=${userId}`)
      if (Array.isArray(response.data)) {
        setNotifications(response.data)
      } else {
        setNotifications([])
      }
    } catch {
      // Gracefully handle if notifications service or endpoint is unavailable
      setNotifications([])
    }
  }, [userId])

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds only if user is logged in
    if (!userId) return

    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications, userId])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      await api.put(`/api/Notifications/${id}/read`)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleNotificationClick = (notification: NotificationDto) => {
    markAsRead(notification.id)
    setIsOpen(false)
    if (notification.relatedCaseId) {
      navigate(`/cases/${notification.relatedCaseId}`)
    }
  }

  const markAllAsRead = async () => {
    if (!userId) return
    try {
      await api.put(`/api/Notifications/read-all?userId=${userId}`)
      setNotifications([])
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[500px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-cbe-purple hover:text-cbe-purple-700 transition cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <Bell className="w-8 h-8 text-slate-300 mb-2" />
                <span className="text-xs">No new notifications</span>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className="p-4 hover:bg-slate-50 transition cursor-pointer flex gap-3 group relative"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => markAsRead(notif.id, e)}
                      title="Mark as read"
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
