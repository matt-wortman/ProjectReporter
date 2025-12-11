import React from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';

function App() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            Project Reporter
          </h1>
          <Button variant="outline" size="sm">
            + New Project
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome message for empty state */}
        <Card className="mb-8 bg-gradient-to-br from-peach-50 to-tan-50 border-peach-200">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to Project Reporter</CardTitle>
            <CardDescription className="text-base">
              Track your projects and add quick updates. Get started by creating your first project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter project name..."
                className="max-w-xs"
              />
              <Button className="bg-sage-500 hover:bg-sage-600">
                Create Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Example project cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-peach-100 to-peach-50 border-peach-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Sample Project</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-sage-100 text-sage-700">
                  Active
                </span>
              </div>
              <CardDescription>
                This is an example of how your projects will look.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="Quick update..."
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Last updated: Just now
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-sage-100 to-sage-50 border-sage-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Another Project</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-tan-100 text-tan-700">
                  On Hold
                </span>
              </div>
              <CardDescription>
                Projects can have different status colors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="Quick update..."
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Last updated: 2 hours ago
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-tan-100 to-tan-50 border-tan-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Completed Work</CardTitle>
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  Completed
                </span>
              </div>
              <CardDescription>
                Completed projects are still accessible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  placeholder="Quick update..."
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Last updated: Yesterday
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
