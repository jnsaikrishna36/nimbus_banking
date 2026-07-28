"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Account, Transaction } from "@/types";

export function BalanceChart({
  accounts,
  transactions,
}: {
  accounts: Account[];
  transactions: Transaction[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sorted = [...transactions].sort((a, b) => a.date - b.date);
    const currentNet = accounts.reduce((s, a) => s + a.balance, 0);
    const flowsTotal = sorted.reduce((s, t) => s + t.amount, 0);
    let running = currentNet - flowsTotal;
    const points = [
      { x: sorted.length ? new Date(sorted[0].date - 86400000) : new Date(), y: +running.toFixed(2) },
    ];
    sorted.forEach((t) => {
      running += t.amount;
      points.push({ x: new Date(t.date), y: +running.toFixed(2) });
    });
    if (points.length === 1) points.push({ x: new Date(), y: currentNet });

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "line",
      data: {
        labels: points.map((p) => p.x.toLocaleDateString()),
        datasets: [
          {
            label: "Net balance (USD)",
            data: points.map((p) => p.y),
            borderColor: "#7be0c4",
            backgroundColor: "rgba(123,224,196,0.15)",
            fill: true,
            tension: 0.3,
            pointRadius: 3,
            pointBackgroundColor: "#7be0c4",
          },
        ],
      },
      options: {
        plugins: { legend: { labels: { color: "#e8ecff" } } },
        scales: {
          x: { ticks: { color: "#a4adcf" }, grid: { color: "rgba(255,255,255,.05)" } },
          y: {
            ticks: { color: "#a4adcf", callback: (v) => "$" + v },
            grid: { color: "rgba(255,255,255,.05)" },
          },
        },
        maintainAspectRatio: false,
      },
    });

    return () => chartRef.current?.destroy();
  }, [accounts, transactions]);

  return <canvas ref={canvasRef} />;
}
