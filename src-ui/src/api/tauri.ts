import { invoke } from '@tauri-apps/api/tauri';

export interface Profile {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  key_path?: string;
}

export const connectSsh = async (host: string, port: number, username: string) => {
  return invoke('connect_ssh', { host, port, username });
};

export const getProfiles = async (): Promise<Profile[]> => {
  return invoke('get_profiles');
};

export const createProfile = async (profile: Profile) => {
  return invoke('create_profile', { profile });
};
