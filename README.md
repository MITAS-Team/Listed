# 📋 Listed
## Discord Bot for User Management

This Discord bot provides functionality for managing user lists such as Blacklist, Whitelist, and Redlist. It allows administrators to add or remove users from these lists and provides commands to retrieve information about users in each list.

## 📦 Installation
### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (or MongoDB Atlas for cloud-based database)

## 🛠️ Setup
### 1. Clone this repository
```bash
git clone https://github.com/MITAS-Team/Listed.git
```

### 2. Navigate to the project directory
```bash
cd Listed
```

### 3. Install dependencies:
```bash
npm install
```

### 4. Configure environment variables. 
#### Rename the `.env.exemple` file to `.env`
```bash
token=YOUR_BOT_TOKEN
clientId=YOUR_APP_ID
connect=YOUR_MONGODB_URI
```

### 5. Start the bot
```
npm start
```

The bot should now be online and ready to use in your Discord server.

## 📖 Usage
### Commands
#### Lists
1. Add a user to the chosen list
```bash
/add <user> <list> <reason>
```
2. Remove a user from the chosen list
```bash
/remove <user-id> <list> <reason>
```
3. Retrieve information about a user in a specific list.
```bash
/get <user-id> <list>
```

#### Moderation
1. **Kick**: Remove a user from the server.
```bash
/kick <user>
```
2. **Ban**: Permanently remove a user from the server.
```bash
/ban <user> <reason>
```
3. **Unban**: Revoke a ban on a user.
```bash
/unban <user-id>
```
4. **Clear**: Delete a specified number of messages from a channel.
```bash
/clear <number_of_message>
```

#### Utilities
1. **Ping**: Check the bot's latency.
```bash
/ping
```
2. **User Info**: Retrieve information about a user.
```bash
/user
```
3. **Server Info**: Retrieve information about the server.
```bash
/server
```

## 🤝 Contributing
Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch `(git checkout -b feature/your-feature-name)`.
3. Make your changes.
4. Commit your changes `(git commit -am 'Add new feature')`.
5. Push to the branch `(git push origin feature/your-feature-name)`.
6. Create a new pull request.

## 📝 License
This project is license under the **UNLICENSED** License - see the [License](https://github.com/MITAS-Team/Listed/blob/main/LICENSE) file for details.