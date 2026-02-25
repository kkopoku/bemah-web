"use client";

import { Check, Circle, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TaskItemProps {
  title: string;
  description: string;
  completed: boolean;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function TaskItem({
  title,
  description,
  completed,
  open,
  onToggle,
  children,
}: Readonly<TaskItemProps>) {
  return (
    <Collapsible open={open && !completed} onOpenChange={onToggle}>
      <CollapsibleTrigger
        className="flex w-full items-center gap-3 rounded-lg border bg-primary p-4 text-left text-white transition-colors hover:bg-primary/80"
        disabled={completed}
      >
        {completed ? (
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
            <Check className="size-4" />
          </div>
        ) : (
          <div className="flex size-6 shrink-0 items-center justify-center">
            <Circle className="text-slate-400 size-5" />
          </div>
        )}
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${completed ? "text-slate-500 line-through" : "text-white"}`}
          >
            {title}
          </p>
          <p className="text-slate-400 text-xs">{description}</p>
        </div>
        {!completed && (
          <ChevronDown
            className={`text-slate-400 size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-x border-b rounded-b-lg p-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
