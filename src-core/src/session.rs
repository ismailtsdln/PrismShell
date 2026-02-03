use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Session {
    pub id: String,
    pub name: String,
    pub host: String,
    pub status: SessionStatus,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum SessionStatus {
    Connected,
    Disconnected,
    Connecting,
    Error(String),
}

pub struct SessionManager {
    pub sessions: HashMap<String, Session>,
}

impl SessionManager {
    pub fn new() -> Self {
        Self {
            sessions: HashMap::new(),
        }
    }

    pub fn add_session(&mut self, session: Session) {
        self.sessions.insert(session.id.clone(), session);
    }
}
