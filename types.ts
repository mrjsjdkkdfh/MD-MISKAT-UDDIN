
export interface BrowserHistoryItem {
  url: string;
  title: string;
}

export interface BrowserState {
  currentUrl: string;
  history: BrowserHistoryItem[];
  currentIndex: number;
  isLoading: boolean;
  progress: number;
  isIncognito: boolean;
}
