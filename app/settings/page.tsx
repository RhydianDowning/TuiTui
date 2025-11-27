'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Settings {
  notificationsEnabled: boolean
  team: string
  availableTeams: string[]
  markdownFile: { name: string; content: string } | null
}

export default function SettingsPage() {
  const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('tuitui-settings') : null
  const initialSettings = savedSettings ? (() => {
    const parsed = JSON.parse(savedSettings)
    return {
      notificationsEnabled: parsed.notificationsEnabled || false,
      team: parsed.team || '',
      availableTeams: parsed.availableTeams || ['Syntax Swing', 'Marvels'],
      markdownFile: parsed.markdownFile || null
    }
  })() : {
    notificationsEnabled: false,
    team: '',
    availableTeams: ['Syntax Swing', 'Marvels'],
    markdownFile: null,
  }

  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [saved, setSaved] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [fileContent, setFileContent] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [teamDialogOpen, setTeamDialogOpen] = useState(false)
  const [teamLoading, setTeamLoading] = useState(false)
  const [teamInfo, setTeamInfo] = useState<string[]>([])

  useEffect(() => {
    const loadDefaults = async () => {
      if (!settings.markdownFile) {
        try {
          const response = await fetch('/tuitui.md')
          const content = await response.text()
          setSettings(prev => ({
            ...prev,
            markdownFile: { name: 'tuitui.md', content }
          }))
        } catch (error) {
          console.error('Failed to load default markdown file:', error)
        }
      }
    }
    loadDefaults()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('tuitui-settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateSetting = (key: keyof Settings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAddTeam = () => {
    if (newTeamName.trim() && !settings.availableTeams.includes(newTeamName.trim())) {
      const updatedTeams = [...settings.availableTeams, newTeamName.trim()]
      setSettings(prev => ({ ...prev, availableTeams: updatedTeams, team: newTeamName.trim() }))
      setNewTeamName('')
    }
  }

  const handleViewFile = () => {
    if (settings.markdownFile) {
      setFileContent(settings.markdownFile.content)
      setDialogOpen(true)
    }
  }

  const handleViewTeamInfo = async () => {
    setTeamLoading(true)
    setTeamDialogOpen(true)
    try {
      const response = await fetch('/list.txt')
      const content = await response.text()
      const links = content.split('\n').filter(line => line.trim() !== '')
      // Add a delay to maintain loading experience
      setTimeout(() => {
        setTeamInfo(links)
        setTeamLoading(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to load team info:', error)
      setTimeout(() => {
        setTeamInfo(['Error loading team information'])
        setTeamLoading(false)
      }, 2000)
    }
  }

  return (
    <div className="tui-page">
      <div className="tui-page-content">
        <h1 className="tui-heading-lg mb-8">Settings</h1>
        <p className="tui-text-body mb-8">
          Manage your TuiTui preferences and account settings.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-tui-white p-6 rounded-lg shadow-md">
            <h2 className="tui-heading-md mb-4">Notification Settings</h2>
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSetting('notificationsEnabled', checked)}
              />
              <Label htmlFor="notifications" className="text-tui-blue-500">Enable notifications</Label>
            </div>
          </div>
          <div className="bg-tui-white p-6 rounded-lg shadow-md">
            <h2 className="tui-heading-md mb-4">TuiTui Markdown</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="markdown-file" className="text-tui-blue-500">Upload Markdown File</Label>
                <Input
                  id="markdown-file"
                  type="file"
                  accept=".md"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const content = event.target?.result as string
                        setSettings(prev => ({ ...prev, markdownFile: { name: file.name, content } }))
                      }
                      reader.readAsText(file)
                    } else {
                      setSettings(prev => ({ ...prev, markdownFile: null }))
                    }
                  }}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {settings.markdownFile ? (
                    <>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-tui-blue-500">Markdown file uploaded: {settings.markdownFile.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-tui-blue-500">No markdown file uploaded</span>
                    </>
                  )}
                </div>
                {settings.markdownFile && (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" onClick={handleViewFile}>
                        View File
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{settings.markdownFile.name}</DialogTitle>
                      </DialogHeader>
                      <pre className="whitespace-pre-wrap text-sm">{fileContent}</pre>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
          <div className="bg-tui-white p-6 rounded-lg shadow-md">
            <h2 className="tui-heading-md mb-4">Team Settings</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-tui-blue-500">Select Team</Label>
                <Select
                  value={settings.team}
                  onValueChange={(value) => updateSetting('team', value)}
                >
                  <SelectTrigger className="mt-1 w-full">
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.availableTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                    <SelectItem value="add-new">Add New Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {settings.team === 'add-new' && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="new-team-name" className="text-tui-blue-500">New Team Name</Label>
                    <Input
                      id="new-team-name"
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      className="mt-1"
                      placeholder="Enter new team name"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTeam()
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={handleAddTeam} variant="outline">
                      Add Team
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {settings.team && settings.team !== 'add-new' ? (
                    <>
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-tui-blue-500">Team selected: {settings.team}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-tui-blue-500">No team selected</span>
                    </>
                  )}
                </div>
                {settings.team && settings.team !== 'add-new' && (
                  <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" onClick={handleViewTeamInfo}>
                        View Team Information
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Team Information: {settings.team}</DialogTitle>
                      </DialogHeader>
                      {teamLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tui-blue-500"></div>
                          <span className="ml-2">Loading team information...</span>
                        </div>
                       ) : (
                         <div className="space-y-3">
                           {teamInfo.map((item, index) => (
                             <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                               <div className="text-sm text-gray-900 dark:text-gray-100 break-all">
                                 {item}
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button type="submit" className="tui-button-primary">
              Save Settings
            </Button>
            {saved && <span className="text-green-600 self-center">Settings saved!</span>}
            <Link href="/tuitui" className="ml-auto">
              <Button variant="outline">
                Back to TuiTui
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}