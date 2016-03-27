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
			this.setState({ users: [...this.state.users, user].sort(this.sortByStarCount) })
		}
	}

	sortByStarCount(a, b) {
		return b.starCount - a.starCount
	}

	handleKeyPress(event) { // Note: Because `event` is sythetic, we can't use native onSubmit and stop form submission without some magic
		if (event.key === 'Enter') {
			const node = ReactDOM.findDOMNode(this.refs.username)
			const username = node.value.trim()
			fetch('https://api.github.com/users/' + username + '/repos?per_page=100')
				.then(res => res.json())
				.then(json => this.handleReposResponse(json, username)) // Note: Why am I passing `username` through? Because `mapReposToUser` needs it! This is nasty!
				.catch(err => this.handleReposFailure(node, 'warn'))
				.then(() => node.value = '')
		}
	}

	handleReposResponse(repos) {
		this.addUserIfNotPresent(this.mapReposToUser(repos))
	}

	handleReposFailure(node, className) {
		node.classList.remove(className)
		setTimeout(() => node.classList.add(className), 0) // Note: http://stackoverflow.com/questions/17296576/css3-transition-doesnt-work-when-i-remove-class-of-newly-created-element
	}

	mapReposToUser(repos) {
		return {
			username: repos[0].owner.login,
			avatarUrl: repos[0].owner.avatar_url,
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
				<img src="http://lorempixum.com/100/100/nature/1" width="100" />
				<h3>{ item.username }</h3>
				<p>{ item.starCount } star{ item.starCount !== 1 ? 's' : '' }</p>
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
