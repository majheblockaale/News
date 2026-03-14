"use client";

import { useState, useEffect } from "react";
import { timeAgo } from "@/lib/utils";

interface LiveTimeAgoProps {
  date: string;
  className?: string;
  interval?: number;
}

export function LiveTimeAgo({ date, className, interval = 60000 }: LiveTimeAgoProps) {
  const [text, setText] = useState(timeAgo(date));

  useEffect(() => {
    const timer = setInterval(() => {
      setText(timeAgo(date));
    }, interval);

    return () => clearInterval(timer);
  }, [date, interval]);

  return (
    <time dateTime={date} className={className} title={new Date(date).toLocaleString()}>
      {text}
    </time>
  );
}
