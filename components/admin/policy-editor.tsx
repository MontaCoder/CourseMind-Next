"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePolicy } from "@/actions/policy";
import { Loader2, Save, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PolicyEditorProps {
  type: string;
  title: string;
  initialContent: string;
}

export function PolicyEditor({ type, title, initialContent }: PolicyEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await updatePolicy({
        type,
        title,
        content,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } catch (error) {
      setError("Failed to save policy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).length;
  const charCount = content.length;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        {/* Back Button */}
        <Link href="/admin/policies">
          <Button variant="ghost" type="button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Policies
          </Button>
        </Link>

        {/* Editor Card */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit">
              <TabsList className="mb-4">
                <TabsTrigger value="edit">
                  <Save className="w-4 h-4 mr-2" />
                  Edit
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-4">
                <div>
                  <Label htmlFor="content">Policy Content</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Supports Markdown and HTML formatting
                  </p>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={25}
                    className="font-mono text-sm"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    <span>{charCount.toLocaleString()} characters</span>
                    <span>{wordCount.toLocaleString()} words</span>
                  </div>
                  <div>
                    Last saved: {new Date().toLocaleString()}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card className="bg-background">
                  <CardContent className="pt-6">
                    <div
                      className="prose prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-2xl prose-p:mb-4 prose-p:leading-7"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded">
                Policy saved successfully!
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Link href={`/${type}`} target="_blank">
                <Button type="button" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Page
                </Button>
              </Link>
            </div>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/admin/policies")}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Formatting Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Markdown:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code># Heading 1</code> for main headings</li>
              <li><code>## Heading 2</code> for subheadings</li>
              <li><code>**bold text**</code> for bold</li>
              <li><code>- List item</code> for bullet points</li>
            </ul>
            <p className="mt-3"><strong>HTML:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><code>&lt;h1&gt;Title&lt;/h1&gt;</code> for headings</li>
              <li><code>&lt;p&gt;Paragraph&lt;/p&gt;</code> for text</li>
              <li><code>&lt;strong&gt;bold&lt;/strong&gt;</code> for bold</li>
              <li><code>&lt;ul&gt;&lt;li&gt;Item&lt;/li&gt;&lt;/ul&gt;</code> for lists</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
