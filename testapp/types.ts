
export interface Metric {
  value: number;
  trend: 'up' | 'stable' | 'down';
}

export interface MetricChange {
    timestamp: number;
    reason: string;
    metric: 'trust' | 'depth' | 'contribution';
    change: number;
    newValue: number;
}

export interface Notification {
    id: string;
    type: 'reply' | 'rating';
    fromUserId: string;
    planetId: string;
    contentId: string;
    contentType: 'argument' | 'comment';
    timestamp: number;
    read: boolean;
}


export interface User {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  pinnedContentId?: string;
  metrics: {
    contribution: Metric;
    trust: Metric;
    depth: Metric;
  };
  metricHistory: MetricChange[];
  ratedContent: {
      [contentId: string]: 'rated' | 'removed';
  };
  notifications: Notification[];
}

// This will be used internally by the auth service's mock DB
export interface UserWithPassword extends User {
  password?: string;
}

export interface Rating {
  byUserId: string;
  stance: 'agree' | 'doubt' | 'disagree';
  tags: string[];
}


export interface Argument {
  id: string;
  authorId: string;
  type: 'pro' | 'con';
  text: string;
  evidence: string; // URL or description of evidence
  editedAt?: number;
  ratings: Rating[];
}

export interface Comment {
    id: string;
    authorId: string;
    text: string;
    parentId?: string; // For nested replies
    editedAt?: number;
    ratings: Rating[];
}

export interface Planet {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  hotness: number;
  isControversial: boolean;
  icon: string;
  neutralDescription: string;
  arguments: Argument[];
  comments: Comment[];
}