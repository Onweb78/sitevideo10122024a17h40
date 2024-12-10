export interface Ad {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  link?: string;
  isActive: boolean;
  displayDuration: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}