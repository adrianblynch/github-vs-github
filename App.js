import React from 'react'
import ReactDOM from 'react-dom'

/*
	Todos/Notes:
		- Implement redux
		- Move the username field into its own component
		- Add the `warn` class in a better(?) way: http://www.chloechen.io/react-animation-done-in-two-ways/
		- Are `handleReposResponse` and `handleReposFailure` worth it?
*/

class App extends React.Component {

	constructor() {
		super()
		this.state = { users: [] }
		this.handleKeyPress = this.handleKeyPress.bind(this)
	}

	addUserIfNotPresent(user) {
		if (this.state.users.find(item => item.username === user.username) === undefined) {
			this.setState({ users: [...this.state.users, user] })
		}
	}

	handleKeyPress(event) { // Note: Because `event` is sythetic, we can't use native onSubmit and stop form submission without some magic
		if (event.key === 'Enter') {
			const node = ReactDOM.findDOMNode(this.refs.username)
			const username = node.value
			fetch('https://api.github.com/users/' + username + '/repos')
				.then(res => res.json())
				.then(json => this.handleReposResponse(json, username)) // Note: Why am I passing `username` through? Because `mapReposToUser` needs it! This is nasty!
				.catch(err => this.handleReposFailure(node, 'warn'))
				.then(() => node.value = '')
		}
	}

	handleReposResponse(repos, username) {
		this.addUserIfNotPresent(this.mapReposToUser(repos, username))
	}

	handleReposFailure(node, className) {
		node.classList.remove(className)
		setTimeout(() => node.classList.add(className), 0)
	}

	mapReposToUser(repos, username) {
		return {
			username: username,
			starCount: repos.reduce((count, repo) => count + repo.stargazers_count, 0)
		}
	}

	render() {
		return (
			<div>
				<h1>GitHub vs GitHub</h1>
				<input
					ref="username"
					type="text"
					placeholder="GitHub usernames..."
					onKeyPress={this.handleKeyPress}
				/>
				<Scoreboard users={this.state.users} />
			</div>
		)
	}

}

class ScoreboardItem extends React.Component {

	render() {
		const item = this.props.item
		const position = this.props.position
		return (
			<li>
				<span>#{ position } </span>
				<span>{ item.username } </span>
				<span>{ item.starCount } star{ item.starCount !== 1 ? 's' : '' }</span>
			</li>
		)
	}

}

class Scoreboard extends React.Component {

	render() {

		const users = this.props.users.map((item, index) => {
			return (
				<ScoreboardItem
					position={index + 1}
					item={item}
					key={index}
				/>
			)
		})

		return (
			<ul>
				{users}
			</ul>
		)
	}

}

export default App
