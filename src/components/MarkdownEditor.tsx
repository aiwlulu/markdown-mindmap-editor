import React, { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface MarkdownEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  value?: string; // For backward compatibility
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content = "",
  onChange,
  value,
}) => {
  const initialContent = value ?? content;
  const [markdownContent, setMarkdownContent] =
    useState<string>(initialContent);

  useEffect(() => {
    setMarkdownContent(initialContent);
  }, [initialContent]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      setMarkdownContent(newContent);
      onChange?.(newContent);
    },
    [onChange]
  );

  return (
    <Card className="h-full flex flex-col bg-white">
      <CardContent className="flex-grow p-4">
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
