"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockSettings } from "@/lib/mockup-data"
import { toast } from "sonner"

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings)

  const handleSaveSettings = () => {
    // In a real app, you would save the settings to a database or local storage
    toast.success("Settings saved", {
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your game preferences and account settings.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Game Settings</CardTitle>
            <CardDescription>Configure your gameplay experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1">
                  <span>Notifications</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Receive notifications about game events
                  </span>
                </Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="soundEffects" className="flex flex-col gap-1">
                  <span>Sound Effects</span>
                  <span className="font-normal text-xs text-muted-foreground">
                    Enable sound effects during gameplay
                  </span>
                </Label>
                <Switch
                  id="soundEffects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave" className="flex flex-col gap-1">
                  <span>Auto Save</span>
                  <span className="font-normal text-xs text-muted-foreground">Automatically save your progress</span>
                </Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSave: checked })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="musicVolume">Music Volume: {settings.musicVolume}%</Label>
              <Slider
                id="musicVolume"
                min={0}
                max={100}
                step={1}
                value={[settings.musicVolume]}
                onValueChange={(value) => setSettings({ ...settings, musicVolume: value[0] })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={settings.difficulty}
                onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                  <SelectItem value="Nightmare">Nightmare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="textSize">Text Size</Label>
              <Select
                value={settings.textSize}
                onValueChange={(value) => setSettings({ ...settings, textSize: value })}
              >
                <SelectTrigger id="textSize">
                  <SelectValue placeholder="Select text size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">adventurer@example.com</div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">••••••••</div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="destructive" size="sm">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
