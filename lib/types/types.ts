export interface ScheduledCall {
  id: string;
  name: string;
  number: string;
  location: string;
  image: string;
  scheduledDate: Date;
  screenType: "samsung" | "iphone" | "pixel";
  isActive: boolean;
  repeatDays: string[];
}

export interface ScreenComponent {
  id: string;
  iconComponent: (color?: string) => React.ReactNode;
  name: string;
  component: React.ComponentType<any>;
  defaultProps: any;
}
