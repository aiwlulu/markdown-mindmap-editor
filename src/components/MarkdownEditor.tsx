import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";

interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  value?: string; // For backward compatibility
}

const MarkdownEditor = ({
  content = "",
  onChange = () => {},
  onSave = () => {},
  value,
}: MarkdownEditorProps) => {
  // Support both content and value props for backward compatibility
  const initialContent = value || content;
  const [markdownContent, setMarkdownContent] =
    useState<string>(initialContent);
  const [fileName, setFileName] = useState<string>("untitled.md");

  useEffect(() => {
    setMarkdownContent(initialContent);
  }, [initialContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setMarkdownContent(newContent);
    onChange(newContent);
  };

  const handleSave = () => {
    onSave(markdownContent);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor?")) {
      setMarkdownContent("");
      onChange("");
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end);
    const beforeText = markdownContent.substring(0, start);
    const afterText = markdownContent.substring(end);

    const newContent = `${beforeText}${prefix}${selectedText}${suffix}${afterText}`;
    setMarkdownContent(newContent);
    onChange(newContent);

    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <Card className="h-full flex flex-col bg-white">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText size={18} />
          </CardTitle>
        </div>
      </CardHeader>

      <div className="px-6 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("**", "**")}
                >
                  <Bold size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bold</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("*", "*")}
                >
                  <Italic size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Italic</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("# ")}
                >
                  <Heading1 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 1</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("## ")}
                >
                  <Heading2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 2</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("### ")}
                >
                  <Heading3 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Heading 3</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("- ")}
                >
                  <List size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bullet List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => insertMarkdown("1. ")}
                >
                  <ListOrdered size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Numbered List</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardContent className="flex-grow p-0 px-6 pb-6">
        <Textarea
          className="h-full min-h-[500px] font-mono resize-none border-gray-200"
          placeholder="# Type your markdown here..."
          value={markdownContent}
          onChange={handleContentChange}
        />
      </CardContent>
    </Card>
  );
};

export default MarkdownEditor;
