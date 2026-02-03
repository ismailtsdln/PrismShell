use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub key_path: Option<String>,
}

pub struct StorageManager {
    base_path: PathBuf,
}

impl StorageManager {
    pub fn new(app_data_dir: PathBuf) -> Self {
        Self {
            base_path: app_data_dir,
        }
    }

    fn profiles_path(&self) -> PathBuf {
        self.base_path.join("profiles.json")
    }

    pub fn save_profile(&self, profile: &Profile) -> Result<()> {
        let mut profiles = self.load_profiles().unwrap_or_default();
        profiles.retain(|p| p.id != profile.id); // Update existing
        profiles.push(profile.clone());

        let data = serde_json::to_string_pretty(&profiles)?;
        fs::create_dir_all(&self.base_path)?;
        fs::write(self.profiles_path(), data)?;
        Ok(())
    }

    pub fn load_profiles(&self) -> Result<Vec<Profile>> {
        if !self.profiles_path().exists() {
            return Ok(Vec::new());
        }
        let data = fs::read_to_string(self.profiles_path())?;
        let profiles: Vec<Profile> = serde_json::from_str(&data)?;
        Ok(profiles)
    }
}
