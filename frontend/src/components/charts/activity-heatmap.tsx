'use client';

import * as React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';

const DAYS = ['Mon', 'Wed', 'Fri', 'Sun'];
const WEEKS = 24; // Number of weeks to show

export default function ActivityHeatmap({ data = [] }: { data?: { date: string, count: number }[] }) {
  // Generate a 24x7 matrix filled with 0s
  const WEEKS = 24;
  const grid = Array.from({ length: WEEKS }, () => Array(7).fill(0));

  // Today's date to calculate offsets
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  data.forEach((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    // Difference in days
    const diffTime = today.getTime() - entryDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Today's day index (Mon=0, ..., Sun=6)
    const todayDayIdx = (today.getDay() + 6) % 7;
    
    // Total days offset from the start of the current week (which starts on Monday)
    const daysSinceMonday = todayDayIdx;
    
    // Which week ago? 0 is current week
    const weeksAgo = Math.floor((diffDays - daysSinceMonday + 6) / 7);
    
    if (weeksAgo >= 0 && weeksAgo < WEEKS) {
      const entryDayIdx = (entryDate.getDay() + 6) % 7;
      const weekIdx = WEEKS - 1 - weeksAgo;
      
      // Determine level based on count (0 to 4)
      let level = 0;
      if (entry.count > 0) level = 1;
      if (entry.count > 3) level = 2;
      if (entry.count > 7) level = 3;
      if (entry.count > 12) level = 4;
      
      grid[weekIdx][entryDayIdx] = level;
    }
  });

  const activityData = grid;

const getColor = (level: number) => {
  switch (level) {
    case 1: return '#0e4429';
    case 2: return '#006d32';
    case 3: return '#26a641';
    case 4: return '#39d353';
    default: return '#161b22'; // Empty state
  }
};


  return (
    <Box sx={{ width: '100%', overflowX: 'auto', pb: 1 }}>
      <Box sx={{ display: 'flex', gap: 1, minWidth: 'max-content' }}>
        {/* Days Column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', mt: '24px', mr: 1 }}>
          <Typography variant="caption" sx={{ height: 12, lineHeight: '12px', fontSize: 10, color: 'text.secondary' }}>Mon</Typography>
          <Box sx={{ height: 12 }} /> {/* Tue placeholder */}
          <Typography variant="caption" sx={{ height: 12, lineHeight: '12px', fontSize: 10, color: 'text.secondary' }}>Wed</Typography>
          <Box sx={{ height: 12 }} /> {/* Thu placeholder */}
          <Typography variant="caption" sx={{ height: 12, lineHeight: '12px', fontSize: 10, color: 'text.secondary' }}>Fri</Typography>
          <Box sx={{ height: 12 }} /> {/* Sat placeholder */}
          <Typography variant="caption" sx={{ height: 12, lineHeight: '12px', fontSize: 10, color: 'text.secondary' }}>Sun</Typography>
        </Box>
        
        {/* Heatmap Grid */}
        <Box sx={{ display: 'flex', gap: '4px' }}>
          {activityData.map((week, weekIdx) => (
            <Box key={weekIdx} sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Only show month label roughly every 4 weeks */}
              <Typography variant="caption" sx={{ height: 20, fontSize: 10, color: 'text.secondary' }}>
                {weekIdx % 4 === 0 ? 'Month' : ''}
              </Typography>
              {week.map((level, dayIdx) => (
                <Tooltip key={`${weekIdx}-${dayIdx}`} title={`${level} submissions`} placement="top" arrow>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      bgcolor: getColor(level),
                      borderRadius: '2px',
                      '&:hover': {
                        outline: '1px solid #fff'
                      }
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2, gap: 1 }}>
        <Typography variant="caption" color="text.secondary">Less</Typography>
        {[0, 1, 2, 3, 4].map(level => (
          <Box key={`legend-${level}`} sx={{ width: 12, height: 12, bgcolor: getColor(level), borderRadius: '2px' }} />
        ))}
        <Typography variant="caption" color="text.secondary">More</Typography>
      </Box>
    </Box>
  );
}
