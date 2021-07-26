<div align="center">
  <img src=".github/logo.png" alt="Nello logo" heigth="200px" width="400px">
</div>
<br/>
<h1 align="center">Nello</h1>
<h5 align="center">Not just a trello clone</h5><br/>

## 🎯 About

Nello was initially created to be a Trello clone but it just kept expanding to full fledge project.<br/>
With this project the goal was to expand my knowledge with library I had heard but never got the chance to use it (or use it in depth). Which was the case for both Next API routes and websockets, with both I had some familiarity but never tried to bend this far to see what were they capable.

PS: If you're looking at this because you're interested in DnD, you might want to check [this other repo](https://github.com/Rawallon/kanban-board-react-context) where I implement it without any external library.<br/><br/>
Go try it and please let me know if you enjoyed it with a ⭐️, I would appreciate it a lot.
<br/>

## :sparkles: Functionality

:heavy_check_mark: &nbsp;&nbsp;User auth (Sign In/Sign out)<br />
:heavy_check_mark: &nbsp;&nbsp;Social login<br />
:heavy_check_mark: &nbsp;&nbsp;No back-end needs (uses Next API Routes)<br />
:heavy_check_mark: &nbsp;&nbsp;Real-time updates with websockets<br />
:heavy_check_mark: &nbsp;&nbsp;Trello-like kanban board<br />
:heavy_check_mark: &nbsp;&nbsp;Fully implemented board, lists and cards CRUD <br />
:heavy_check_mark: &nbsp;&nbsp;Server-side rendering<br />

## 📸 Video
	
https://user-images.githubusercontent.com/39421317/118188625-0ec57080-b417-11eb-9d90-0f7016b36501.mp4

### Websocket in action

https://user-images.githubusercontent.com/68453900/126524179-63af364f-02bc-4982-b91c-17e4fae7e00d.mp4


## ▶️ Demo

Here you can find the demo link:

<a title="Deployed with Vercel" href="https://nello.vercel.app/">
<img alt="Deployed with Vercel" src="https://img.shields.io/badge/Deployed%20with%20Vercel-%23ea4335?style=plastic&logo=vercel&logoColor=white" width="200px" />
</a> 

PS: Websockets are not supported in this demo.

## :rocket: Technologies

### Front end
- [ReactJS](https://reactjs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NextJS](https://nextjs.org/)
- [Marked](https://marked.js.org/)
- [Next Auth](https://next-auth.js.org/)
- [React Beautiful DnD](https://react-beautiful-dnd.netlify.app/)

### Back end
- [MongoDB](https://github.com/mongodb/node-mongodb-native)
- [Socket.io](https://socket.io/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
<br/>

- [Vercel](https://vercel.com/) for the deploy and CI.

### Deploy configuration steps

1. Connect your GitHub account
2. Select the project
3. In Settings → Environment Variables → Set **Environment variables**.
<br/>

<br/>


## 👨🏻‍💻 Run Locally

### :white_check_mark: Requirements

Before starting :checkered_flag:, you need to have [Git](https://git-scm.com) and [Node](https://nodejs.org/en/) installed.
<br/>

```bash

# Clone and access the folder
$ git clone https://github.com/Rawallon/trello-clone-next.git && cd trello-clone-next

# Install the dependencies
$ npm install

# Configure your .env.local following the .env.exemple

# Run the web server
$ npm start
```

Since you've made this far don't forget to ⭐️ to let me know if you enjoyed! 🤗 