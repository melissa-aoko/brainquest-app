export type Screen = 'welcome' | 'signup' | 'home' | 'lesson' | 'rewards' | 'shop' | 'settings' | 'teacher' | 'community' | 'battle' | 'study';
export type NavigateFn = (screen: Screen, subject?: string) => void;
