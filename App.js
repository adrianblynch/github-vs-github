import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import Scoreboard from './Scoreboard'
import fixtures from 'json!./fixtures.json'

/*
	Todos/Notes:
		- Implement redux
		- Move the username field into its own component - Forcing us to implement comms between components
		- Add the `warn` class in a better(?) way: http://www.chloechen.io/react-animation-done-in-two-ways/
		- Are `handleReposResponse` and `handleReposFailure` worth it?
*/

class App extends React.Component {

	constructor() {
		super()
		this.state = { users: [] }
		this.handleSearch = this.handleSearch.bind(this)
		this.removeUser = this.removeUser.bind(this)
		this.sortByStarCount = this.sortByStarCount.bind(this)
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this.refs.username).focus();
		fixtures.users.sort(this.sortByStarCount)
		this.setState(fixtures)
	}

	addUserIfNotPresent(user) {
		if (!this.userExists(user)) {
			this.setState({
				users: [...this.state.users, user].sort(this.sortByStarCount)
			})
		}
	}

	userExists(userToAdd) {
		return this.state.users.find(user => user.username === userToAdd.username) !== undefined
	}

	sortByStarCount(a, b) {
		return b.starCount - a.starCount
	}

	handleSearch(event) {
		if (event.key === 'Enter' || event.type === 'click') { // Note: I don't like this...
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
			starCount: repos.reduce((count, repo) => count + repo.stargazers_count, 0),
			ownReposCount: repos.length,
			homeUrl: repos[0].owner.html_url
		}
	}

	removeUser(event) { // Note: Go see the comment in ScoreboardItem to read my disgust on passing the event and not something more meaningful
		const username = event.target.value
		const users = [...this.state.users.filter(user => user.username !== username)]
		this.setState({ users: users })
	}

	render() {
		return (
			<div>
				<h1>GitHub vs GitHub</h1>
				<div className="border" id="search">
					<input
						ref="username"
						type="text"
						placeholder="GitHub username..."
						onKeyPress={ this.handleSearch }
					/>
					<button onClick={ this.handleSearch }>Go</button>
				</div>
				{/*
					Note: removeUser is bound to this component in the constructor above. Without this, we lose the abililty to access
					the state. Still not happy with the signature of removeUser above.
				*/}
				<Scoreboard users={ this.state.users } removeUser={ this.removeUser } />
			</div>
		)
	}

}

export default App
