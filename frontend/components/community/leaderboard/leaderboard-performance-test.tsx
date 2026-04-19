/**
 * Leaderboard Performance Testing Component
 * Dùng để kiểm tra performance và tương tác
 */

'use client';

import { LeaderboardExpanded } from './leaderboard-expanded';
import { mockLeaderboard } from '@/lib/community-mock-data';
import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  memoryUsed: string;
}

export function LeaderboardPerformanceTest() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    renderTime: 0,
    memoryUsed: '0 MB',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        setMetrics((prev) => ({
          ...prev,
          fps: frameCount,
        }));
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    // Measure memory
    const measureMemory = () => {
      const perfMemory = (performance as unknown as {memory?: {usedJSHeapSize: number; totalJSHeapSize: number}}).memory;

      if (perfMemory) {
        const used = perfMemory.usedJSHeapSize;
        const total = perfMemory.totalJSHeapSize;
        setMetrics((prev) => ({
          ...prev,
          memoryUsed: `${(used / 1048576).toFixed(2)} MB / ${(total / 1048576).toFixed(2)} MB`,
        }));
      }
    };

    const memoryInterval = setInterval(measureMemory, 1000);
    measureFPS();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(memoryInterval);
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-slate-800 rounded-lg border border-cyan-400/20">
        <div>
          <p className="text-xs text-gray-400">FPS</p>
          <p className={`text-lg font-bold ${metrics.fps >= 50 ? 'text-green-400' : metrics.fps >= 30 ? 'text-yellow-400' : 'text-red-400'}`}>
            {metrics.fps}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Memory</p>
          <p className="text-sm font-mono text-blue-400">{metrics.memoryUsed}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Status</p>
          <p className={`text-sm font-bold ${metrics.fps >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
            {metrics.fps >= 50 ? '✓ Mịn' : '⚠ Lag'}
          </p>
        </div>
      </div>

      {/* Leaderboard Component */}
      <div className="rounded-xl bg-white/5 border border-cyan-400/20 backdrop-blur-sm p-6 md:p-8">
        <LeaderboardExpanded 
          users={mockLeaderboard}
          onUserClick={(userId) => {
            console.log('User clicked:', userId);
          }}
        />
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg text-xs text-gray-300">
        <p className="font-semibold mb-2">💡 Performance Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• FPS &gt; 50 là tốt, &lt; 30 là lag</li>
          <li>• Tương tác: hover items, search, filter</li>
          <li>• Mở DevTools → Performance để chi tiết hơn</li>
          <li>• Xem OPTIMIZATION.md để thêm tuning options</li>
        </ul>
      </div>
    </div>
  );
}
