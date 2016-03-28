import React from 'react'

class ScoreboardItem extends React.Component {

	constructor() {
		super()
	}

	render() {
		const user = this.props.user
		const position = this.props.position
		return (
			<li>
				<img src={ user.avatarUrl } width="100" height="100" />
				<button onClick={ this.props.removeUser } value={ user.username }>X</button> {/* I can't believe I'm passing the username in the event via the value */}
				<h3><a href={ user.homeUrl } target="_blank">{ user.username }</a></h3>
				<p>
					{ user.starCount } star{ user.starCount !== 1 ? 's' : '' }
				</p>
			</li>
		)
	}

}

export default ScoreboardItem
