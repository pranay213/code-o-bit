'use client';

import * as React from 'react';
import { 
  Box, Container, Typography, Paper, Grid, Avatar, List, 
  ListItem, ListItemText, ListItemIcon, ListItemButton, Button, Chip, Divider
} from '@mui/material';
import AppLayout from '@/components/layout/app-layout';
import { 
  Forum as ForumIcon, 
  Campaign as AnnouncementIcon,
  Work as InterviewIcon,
  Help as QuestionIcon
} from '@mui/icons-material';

const categories = [
  { id: 'announcements', name: 'Announcements', description: 'Official news and updates from Code-o-Bit', icon: <AnnouncementIcon color="primary" />, count: 12 },
  { id: 'interview-experiences', name: 'Interview Experiences', description: 'Share and read interview experiences', icon: <InterviewIcon color="secondary" />, count: 345 },
  { id: 'general', name: 'General Discussion', description: 'Discuss anything related to competitive programming', icon: <ForumIcon color="action" />, count: 1204 },
  { id: 'questions', name: 'Q&A', description: 'Ask questions and get help from the community', icon: <QuestionIcon color="success" />, count: 890 },
];

const trendingTopics = [
  { id: 1, title: 'How to prepare for Google Interviews in 3 months?', author: 'pranay', replies: 42, views: 1200 },
  { id: 2, title: 'Dynamic Programming Patterns you must know', author: 'tourist', replies: 156, views: 5400 },
  { id: 3, title: 'Code-o-Bit Weekly Contest 45 Discussion', author: 'admin', replies: 89, views: 3200 },
  { id: 4, title: 'Why is my solution getting TLE on Question 2?', author: 'newbie_coder', replies: 12, views: 340 },
];

export default function DiscussPage() {
  return (
    <AppLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', width: 56, height: 56 }}>
              <ForumIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>Discussion Forums</Typography>
          </Box>
          <Button variant="contained" size="large" sx={{ borderRadius: 2 }}>New Topic</Button>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Categories</Typography>
              </Box>
              <List disablePadding>
                {categories.map((cat, index) => (
                  <ListItem 
                    key={cat.id} 
                    disablePadding
                    sx={{ 
                      borderBottom: index !== categories.length - 1 ? '1px solid' : 'none', 
                      borderColor: 'divider' 
                    }}
                  >
                    <ListItemButton sx={{ py: 3 }}>
                      <ListItemIcon sx={{ minWidth: 56 }}>
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                          {cat.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography variant="h6">{cat.name}</Typography>} 
                        secondary={<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{cat.description}</Typography>} 
                      />
                      <Box sx={{ textAlign: 'center', ml: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{cat.count}</Typography>
                        <Typography variant="caption" color="text.secondary">Topics</Typography>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ borderRadius: 2, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Trending Topics</Typography>
              <List disablePadding>
                {trendingTopics.map((topic, index) => (
                  <React.Fragment key={topic.id}>
                    <ListItem disablePadding sx={{ py: 1.5 }}>
                      <ListItemText 
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 'bold', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>
                            {topic.title}
                          </Typography>
                        } 
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">by {topic.author}</Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Typography variant="caption" color="text.secondary">{topic.replies} replies</Typography>
                              <Typography variant="caption" color="text.secondary">{topic.views} views</Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index !== trendingTopics.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
            
            <Paper sx={{ borderRadius: 2, p: 3, bgcolor: 'primary.dark', color: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Community Guidelines</Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                Please be respectful and follow our community guidelines when participating in discussions.
              </Typography>
              <Button variant="outlined" color="inherit" fullWidth>Read Guidelines</Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AppLayout>
  );
}
