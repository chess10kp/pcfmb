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

export  interface ScreenComponent {
    name: "samsung" | "iphone" | "pixel";
    component: React.ComponentType<any>;
    defaultProps: any;
  }
