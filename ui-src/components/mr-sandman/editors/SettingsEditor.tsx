import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";

export function SettingsEditor() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Configure global preferences for Mr. Sandman.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Dark Mode Preview</Label>
              <p className="text-sm text-muted-foreground">
                Toggle dark mode for component previews
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Show Grid</Label>
              <p className="text-sm text-muted-foreground">
                Display grid overlay on spacing previews
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label className="text-base">Auto-save</Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes to local storage
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button variant="outline" className="w-full justify-start text-destructive">
             Reset All Data
           </Button>
           <Button variant="outline" className="w-full justify-start">
             Export Configuration (JSON)
           </Button>
        </CardContent>
      </Card>
    </div>
  );
}
