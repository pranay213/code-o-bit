'use client';

import * as React from 'react';
import { Box, useTheme, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RatingChart({ data = [] }: { data?: { name: string; rating: number }[] }) {
  const theme = useTheme();
  
  return (
    <Box sx={{ width: '100%', height: 200, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke={theme.palette.text.secondary} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke={theme.palette.text.secondary} 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: theme.palette.background.paper, border: 'none', borderRadius: 8 }}
            itemStyle={{ color: theme.palette.success.main, fontWeight: 'bold' }}
          />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke={theme.palette.success.main} 
            strokeWidth={3} 
            dot={{ r: 4, fill: theme.palette.success.main, strokeWidth: 0 }}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
