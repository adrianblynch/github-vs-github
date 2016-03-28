import React from 'react'

class ScoreboardItem extends React.Component {

	render() {
		const user = this.props.user
		const position = this.props.position
		return (
			<li>
				<img src={ user.avatarUrl } width="100" height="100" />
				<h3>{ user.username }</h3>
				<p>
					{ user.starCount } star{ user.starCount !== 1 ? 's' : '' }
					{ user.ownReposCount } repos
				</p>
			</li>
		)
	}

}

export default ScoreboardItem
