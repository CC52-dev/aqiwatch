"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Share2, Plus, MoreVertical, Download } from "lucide-react"

export function PWAInstallGuide() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-xl">Install as App</CardTitle>
        <CardDescription>
          Get quick access to AQIWatch by installing it on your device
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* iOS Installation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">iOS (iPhone/iPad)</h4>
                <p className="text-xs text-muted-foreground">Safari Browser</p>
              </div>
            </div>
            
            <div className="space-y-3 ml-1">
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Open <span className="font-medium">aqi.watch</span> in Safari
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">
                    Tap the <span className="font-medium">Share</span> button
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit">
                    <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Share Icon</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">
                    Scroll and tap <span className="font-medium">"Add to Home Screen"</span>
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit">
                    <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Add to Home Screen</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap <span className="font-medium">"Add"</span> to confirm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Android Installation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Android</h4>
                <p className="text-xs text-muted-foreground">Chrome Browser</p>
              </div>
            </div>
            
            <div className="space-y-3 ml-1">
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Open <span className="font-medium">aqi.watch</span> in Chrome
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">
                    Tap the <span className="font-medium">three-dot menu</span> (⋮)
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg w-fit">
                    <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Menu</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-foreground">
                    Select <span className="font-medium">"Install app"</span> or <span className="font-medium">"Add to Home screen"</span>
                  </p>
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg w-fit">
                    <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Install app</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Tap <span className="font-medium">"Install"</span> to confirm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h5 className="font-medium text-foreground mb-2 text-sm">Benefits of Installing:</h5>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>Quick access from your home screen</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>Works offline with cached data</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>Faster loading times</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
              <span>Full-screen app experience</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

