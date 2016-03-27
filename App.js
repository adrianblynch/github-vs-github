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
		this.handleSearch = this.handleSearch.bind(this)
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this.refs.username).focus();
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
		if (event.key === 'Enter' || event.type === 'click') { // Note: I don't think this...
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
					placeholder="GitHub username..."
					onKeyPress={ this.handleSearch }
				/>
				<button onClick={ this.handleSearch }>Go</button>
				<Scoreboard users={ this.state.users } />
			</div>
		)
	}

}

class ScoreboardItem extends React.Component {

	render() {
		const user = this.props.user
		const position = this.props.position
		return (
			<li>
				<img src={ user.avatarUrl } width="100" height="100" />
				<h3>{ user.username }</h3>
				<p>{ user.starCount } star{ user.starCount !== 1 ? 's' : '' }</p>
			</li>
		)
	}

}

class Scoreboard extends React.Component {

	render() {

		const users = this.props.users.map((item, index) => {
			return (
				<ScoreboardItem
					position={ index + 1 }
					user={ item }
					key={ index }
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
