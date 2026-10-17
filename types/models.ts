// ============== For TUser ====================

export type TWatchlistStock = {
  symbol: string;
  name: string;
  addedAt: string | Date;
};

export type TWatchlistGroup = {
  groupName: string;
  stocks: TWatchlistStock[];
};

export type TUser = {
  _id: string;
  email: string;
  password: string;
  allowToShareSettings: boolean;
  watchlist?: TWatchlistGroup[];
  createdAt: string;
  updatedAt: string;
};

export type TNotification = {
  _id?: string;
  symbol: string;
  threshold: string | number;
  direction: string;
  hasNewNotification: boolean;
};

export type TNotificationSettings = {
  _id: string;
  userId: string;
  notifications: TNotification[];
};

export type TNotificationRecord = {
  _id: string;
  userId: string;
  notificationSettingId: string;
  message: string;
  newMessage: boolean;
  createdDate: string;
};

export type TInvestment = {
  _id?: string;
  symbol: string;
  quantity: number | string;
  purchasePrice: number | string;
};

export type TPortfolio = {
  _id: string;
  userId: string;
  investments: TInvestment[];
};

// ============== For xxxxx ====================
