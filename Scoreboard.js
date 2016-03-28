import React from 'react'
import ScoreboardItem from './ScoreboardItem'

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

export default Scoreboard
