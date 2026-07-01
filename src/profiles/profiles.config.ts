import type { ChildId, Theme } from '../content/types';

export interface ProfileConfig {
  id: ChildId;
  name: string;
  dob: string;
  theme: Theme;
  avatarEmoji: string;
  tagline: string;
}

export const PROFILES: Record<ChildId, ProfileConfig> = {
  timur: {
    id: 'timur',
    name: 'Тимур',
    dob: '2021-02-14',
    theme: 'space',
    avatarEmoji: '🚀',
    tagline: 'Исследователь галактик',
  },
  samira: {
    id: 'samira',
    name: 'Самира',
    dob: '2021-12-24',
    theme: 'cosmetics',
    avatarEmoji: '💄',
    tagline: 'Юный доктор и стилист',
  },
};

export const PROFILE_LIST = Object.values(PROFILES);
