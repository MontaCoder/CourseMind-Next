"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sendChatMessage } from "@/actions/chat";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatbotProps {
  courseId: string;
  courseName: string;
}

export function AIChatbot({ courseId, courseName }: AIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI tutor for "${courseName}". I'm here to help you understand the course material, answer questions, and guide you through your learning journey. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setIsLoading(true);

    // Add user message immediately
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);

    try {
      const formData = new FormData();
      formData.append("courseId", courseId);
      formData.append("message", userMessage);
      formData.append("chatHistory", JSON.stringify(messages));

      const result = await sendChatMessage(formData);

      if (result.error) {
        setError(result.error);
        // Remove the user message since it failed
        setMessages(messages);
      } else if (result.response) {
        // Add AI response
        setMessages([
          ...newMessages,
          { role: "assistant", content: result.response },
        ]);
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
      setMessages(messages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hello! I'm your AI tutor for "${courseName}". I'm here to help you understand the course material, answer questions, and guide you through your learning journey. What would you like to know?`,
      },
    ]);
    setError("");
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              AI Course Tutor
            </CardTitle>
            <CardDescription>
              Ask questions about the course and get instant help
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={isLoading}
          >
            Clear Chat
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 items-start",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "rounded-full p-2 shrink-0",
                  message.role === "user"
                    ? "bg-primary/10"
                    : "bg-accent/10"
                )}
              >
                {message.role === "user" ? (
                  <User className="h-4 w-4 text-primary" />
                ) : (
                  <Sparkles className="h-4 w-4 text-accent" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={cn(
                  "rounded-lg px-4 py-3 max-w-[80%]",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="rounded-full bg-accent/10 p-2 shrink-0">
                <Sparkles className="h-4 w-4 text-accent" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about the course..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          AI responses may not always be accurate. Always verify important
          information.
        </p>
      </CardContent>
    </Card>
  );
}
