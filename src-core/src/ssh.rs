use anyhow::Result;
use async_trait::async_trait;
use russh::*;
use russh_keys::*;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct ClientHandler;

#[async_trait]
impl client::Handler for ClientHandler {
    type Error = anyhow::Error;

    async fn check_server_key(
        &mut self,
        _server_public_key: &key::PublicKey,
    ) -> Result<bool, Self::Error> {
        // In a real app, verify against known_hosts
        Ok(true)
    }
}

pub struct SshClient {
    session: Option<client::Handle<ClientHandler>>,
}

impl SshClient {
    pub fn new() -> Self {
        Self { session: None }
    }

    pub async fn connect(
        &mut self,
        host: &str,
        port: u16,
        username: &str,
        key_path: Option<&str>,
    ) -> Result<()> {
        let config = client::Config::default();
        let config = Arc::new(config);
        let sh = ClientHandler;

        let mut session = client::connect(config, (host, port), sh).await?;

        let auth_res = if let Some(path) = key_path {
            let key_pair = load_secret_key(path, None)?;
            session
                .authenticate_publickey(username, Arc::new(key_pair))
                .await?
        } else {
            // Fallback or error (agent auth not implemented yet)
            return Err(anyhow::anyhow!("No private key provided"));
        };

        if !auth_res {
            return Err(anyhow::anyhow!("Authentication failed"));
        }

        self.session = Some(session);
        Ok(())
    }

    pub async fn open_channel(&mut self) -> Result<Channel<ClientHandler>> {
        if let Some(ref mut session) = self.session {
            let channel = session.channel_open_session().await?;
            Ok(channel)
        } else {
            Err(anyhow::anyhow!("Not connected"))
        }
    }
}
