'use client';

import { Button } from "@/components/ui/button";
import { LoadingText } from "@/components/ui/loading-text";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoadingDemo() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000); // Reset after 5 seconds
  };

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Loading Text Demo</h1>
          <p className="text-muted-foreground">Click the button to see different loading animations</p>
          <Button 
            onClick={handleDemo}
            disabled={isLoading}
            className="w-40"
          >
            {isLoading ? "Loading..." : "Start Demo"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading Animation */}
          <Card>
            <CardHeader>
              <CardTitle>Load Animation</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <LoadingText speed={2000} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 