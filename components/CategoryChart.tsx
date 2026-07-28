"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Transaction } from "@/types";

export function CategoryChart({ transactions }: { transactions: Transaction[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const byCat: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.amount < 0 && t.category !== "Transfer") {
        byCat[t.category || "Other"] = (byCat[t.category || "Other"] || 0) + Math.abs(t.amount);
      }
    });
    const labels = Object.keys(byCat);
    const data = labels.map((k) => +byCat[k].toFixed(2));

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: labels.length ? labels : ["No spending yet"],
        datasets: [
          {
            data: data.length ? data : [1],
            backgroundColor: [
              "#6c8cff",
              "#7be0c4",
              "#ffd166",
              "#ff6b81",
              "#b18cff",
              "#8ad3ff",
              "#f6a26b",
              "#a4adcf",
            ],
            borderColor: "#0e1535",
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: "#e8ecff", boxWidth: 12 } } },
        maintainAspectRatio: false,
      },
    });

    return () => chartRef.current?.destroy();
  }, [transactions]);

  return <canvas ref={canvasRef} />;
}
