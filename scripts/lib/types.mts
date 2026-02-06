export interface ValueDeliveryConfig {
  color?: string;
  headline: string;
  deliverables: { name: string; format: string; description: string }[];
  journey: { step: string; label: string; description: string }[];
  screens: { title: string; items: string[] }[];
  whyMoney: string;
}

export interface PageConfig {
  sources: string[];
  memoryDir?: string;           // 이 페이지만 다른 memory 폴더 사용할 때
  valueDelivery?: ValueDeliveryConfig;
  badges?: { text: string; color: string }[];
}

export interface ProjectConfig {
  id: string;
  memoryDir?: string;        // memory/ 폴더명 (id와 다를 때)
  title: string;
  subtitle: string;
  date: string;
  createdAt?: string;
  experts: number;
  rounds: number;
  status: string;
  tags: string[];
  color: string;
  stars: number;
  adopted: boolean;

  pages: {
    docs?: PageConfig | null;
    minutes?: PageConfig | null;
  };
}
